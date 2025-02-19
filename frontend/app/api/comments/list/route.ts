import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { getDecodedToken } from "utils/validators";

export async function GET(req: Request) {
  try {
    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const news_id = Number(searchParams.get("news_id"));

    if (!news_id) {
      return NextResponse.json({ success: false, error: "news_id is required" }, { status: 400 });
    }

    // Verify authentication; update authVerifier to accept just { req } if needed.
    const token = getDecodedToken({ req });

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_news_comments", {
      p_news_id: news_id,
      p_user_id: token?.user_id,
    });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    // Increment view count via an RPC call
    const { error: viewError } = await supabase.rpc("increment_views", { _id: news_id });

    if (viewError) {
      return NextResponse.json({ success: false, error: viewError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, comments: data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
