import { NextResponse } from "next/server";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export interface VoteInput {
  news_id: number;
  vote_type: "upvote" | "downvote";
}

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();
    const { news_id, vote_type } = body as VoteInput;

    if (!news_id || !vote_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify authentication
    const token = authVerifier({ req });
    const supabase = await createClient();

    // Check if user has already voted on this news item
    const { data: existingVote, error: fetchError } = await supabase
      .from("votes")
      .select()
      .eq("user_id", token.user_id)
      .eq("news_id", news_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means no rows returned
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    let result;

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // If same vote type, remove the vote (toggle off)
        const { error: deleteError } = await supabase.from("votes").delete().eq("id", existingVote.id);

        if (deleteError) {
          return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
        }

        result = { message: "Vote removed successfully" };
      } else {
        // If different vote type, update the vote
        const { data, error: updateError } = await supabase
          .from("votes")
          .update({ vote_type })
          .eq("id", existingVote.id)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
        }

        result = { message: "Vote updated successfully", vote: data };
      }
    } else {
      // Create new vote
      const { data, error: insertError } = await supabase
        .from("votes")
        .insert([
          {
            user_id: token.user_id,
            news_id,
            vote_type,
          },
        ])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
      }

      result = { message: "Vote added successfully", vote: data };
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
