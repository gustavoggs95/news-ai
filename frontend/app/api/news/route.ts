import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { getLinkPreview } from "link-preview-js";
import { NextResponse } from "next/server";
import { DecodedAuthJwt } from "types/api";
import { NewsType } from "types/supabase";
import { authVerifier } from "utils/validators";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    console.log("JWT_SECRET", JWT_SECRET);
    console.log("authHeader", authHeader);
    console.log("token", token);

    let currentUserId: number;
    if (token) {
      const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedAuthJwt;
      currentUserId = decodedToken.user_id;
    } else {
      currentUserId = 0;
    }
    console.log("currentUserId", currentUserId);

    const { data, error } = await supabase.rpc("get_news_with_is_purchased", {
      p_buyer_id: currentUserId,
    });

    if (error) {
      return NextResponse.json({ error: error.message, success: false }, { status: 500 });
    }
    console.log("data", data);

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
    console.log("preview", preview);
    const imagePreview = "images" in preview ? preview.images?.[0] : undefined;
    const newsTitle = "title" in preview ? preview.title : undefined;
    const source = "siteName" in preview ? preview.siteName : undefined;
    const content = "description" in preview ? preview.description : undefined;
    const icon_url = "favicons" in preview ? preview.favicons?.[0] : undefined;

    const insertParameters: NewsType = {
      ...body,
      thumbnail_url: imagePreview,
      rank: "Basic",
      title: title || newsTitle,
      source,
      content,
      icon_url,
      author_id: decodedToken.user_id,
    };

    const { data, error } = await supabase.from("news").insert([insertParameters]).select();

    if (error) {
      NextResponse.json({ error: (error as Error)?.message }, { status: 500 });
    }

    return NextResponse.json({ message: "News added successfully", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 });
  }
}
