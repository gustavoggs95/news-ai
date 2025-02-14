import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { getLinkPreview } from "link-preview-js";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { DecodedAuthJwt } from "types/api";
import { NewsType } from "types/supabase";
import { authVerifier } from "utils/validators";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    let currentUserId: number;
    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedAuthJwt;
      currentUserId = decodedToken.user_id;
    } else {
      currentUserId = 0;
    }

    const { data, error } = await supabase.rpc("get_news_with_is_purchased", {
      p_buyer_id: currentUserId,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, news: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, title } = body as NewsType;

    if (!url) {
      return NextResponse.json({ error: "Missing required fields: URL" }, { status: 400 });
    }

    const decodedToken = authVerifier({ req });

    const preview = await getLinkPreview(url);

    // Use let so we can update the variable after processing the image
    let imagePreview = "images" in preview ? preview.images?.[0] : undefined;
    const newsTitle = "title" in preview ? preview.title : undefined;
    const source = "siteName" in preview ? preview.siteName : undefined;
    const content = "description" in preview ? preview.description : undefined;
    const icon_url = "favicons" in preview ? preview.favicons?.[0] : undefined;

    const currentTitle = title || newsTitle;
    let fileName;
    // Process image: resize to 800 width, optimize, and upload to Supabase storage
    if (imagePreview) {
      try {
        // Fetch the original image from the URL
        const imageResponse = await fetch(imagePreview);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);

        // Resize the image with sharp
        const resizedBuffer = await sharp(imageBuffer).resize({ width: 800 }).jpeg({ quality: 80 }).toBuffer();

        const sanitizedTitle = currentTitle?.replace(/\s+/g, "_")?.replace(/[^a-zA-Z0-9_-]/g, "") || "flux-news";
        fileName = `thumbnails/${sanitizedTitle.slice(0, 15)}_${Date.now()}.webp`;

        // Upload the resized image to Supabase storage (update the bucket name accordingly)
        const { error: uploadError } = await supabase.storage.from("flux-news").upload(fileName, resizedBuffer, {
          contentType: "image/webp",
          upsert: false,
        });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("flux-news").getPublicUrl(fileName);
        imagePreview = publicUrl;
      } catch (imgError) {
        console.error("Error processing image:", imgError);
        // Optionally you can decide whether to fail the request or fallback to the original URL.
        // For now, we leave imagePreview as is.
      }
    }

    const insertParameters: NewsType = {
      ...body,
      thumbnail_url: imagePreview,
      thumbnail_path: fileName,
      rank: "Basic",
      title: currentTitle,
      source,
      content,
      icon_url,
      author_id: decodedToken.user_id,
      author_wallet_address: decodedToken.publicKey,
    };

    const { data, error } = await supabase.from("news").insert([insertParameters]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "News added successfully", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
