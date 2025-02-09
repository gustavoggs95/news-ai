import { NextApiRequest, NextApiResponse } from "next";
import { AddCommentInput } from "types/api";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { news_id, content, parent_id = null } = req.body as AddCommentInput;

  if (!news_id || !content) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }
  try {
    const token = authVerifier({ req, res });
    const supabase = createClient(req, res);
    const { data, error } = await supabase
      .from("comments")
      .insert([{ user_id: token.user_id, news_id, content, parent_id }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(201).json({ success: true, message: "Comment added successfully", comment: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error)?.message });
  }
}
