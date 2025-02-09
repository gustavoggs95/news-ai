import { NextResponse } from "next/server";
import { AddCommentInput } from "types/api";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { news_id, content, parent_id = null } = body as AddCommentInput;

    if (!news_id || !content) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify authentication; adjust authVerifier to accept just { req } if needed.
    const token = authVerifier({ req });

    // Create the Supabase client (ensure your createClient function is updated accordingly)
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .insert([{ user_id: token.user_id, news_id, content, parent_id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Comment added successfully", comment: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
