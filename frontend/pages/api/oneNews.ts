import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { OneNewsResponse } from "types/api";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse<OneNewsResponse>) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
  if (!req.query.id) {
    return res.status(401).json({ success: false, error: "ID is required" });
  }
  try {
    const id = parseInt(req.query.id as string, 10);

    const { data, error } = await supabase.from("news").select("*").eq("id", id).single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, news: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error)?.message || "Something went wrong" });
  }
}
