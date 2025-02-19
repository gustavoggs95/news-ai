import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export interface LikeCommentInput {
  comments_id: number;
}

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { comments_id } = body as LikeCommentInput;

    if (!comments_id) {
      return NextResponse.json({ success: false, error: "Missing comments_id" }, { status: 400 });
    }

    // Verify authentication
    const token = authVerifier({ req });
    const supabase = await createClient();

    // Check if user has already liked this comment
    const { data: existingLike, error: fetchError } = await supabase
      .from("comments_likes")
      .select()
      .eq("user_id", token.user_id)
      .eq("comments_id", comments_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    let result;

    if (existingLike) {
      // If like exists, remove it (toggle off)
      const { error: deleteError } = await supabase.from("comments_likes").delete().eq("id", existingLike.id);

      if (deleteError) {
        return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
      }

      result = { message: "Like removed successfully" };
    } else {
      // Create new like
      const { data, error: insertError } = await supabase
        .from("comments_likes")
        .insert([
          {
            user_id: token.user_id,
            comments_id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      result = { message: "Comment liked successfully", like: data };
    }

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
