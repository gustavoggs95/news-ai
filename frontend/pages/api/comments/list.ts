import { NextApiRequest, NextApiResponse } from "next";
import { ListCommentsResponse } from "types/api";
import { createClient } from "utils/supabase/server";
import { authVerifier } from "utils/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ListCommentsResponse>) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
  const { news_id } = req.query;

  if (!news_id) {
    return res.status(400).json({ success: false, error: "news_id is required" });
  }

  authVerifier({ req, res });
  const supabase = createClient(req, res);

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("news_id", news_id)
    .order("created_at", { ascending: false });

  console.log("COMMENTS  news_id", news_id);
  console.log("COMMENTS  DATA", data);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  // Increment view count
  const { error: viewError } = await supabase.rpc("increment_views", { x: 1, id: news_id });

  if (viewError) {
    return res.status(500).json({ success: false, error: viewError.message });
  }

  return res.status(200).json({ success: true, comments: data });
}
