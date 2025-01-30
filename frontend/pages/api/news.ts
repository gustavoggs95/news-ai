import { createClient } from "@supabase/supabase-js";
import { getLinkPreview } from "link-preview-js";
import { NextApiRequest, NextApiResponse } from "next";
import { NewsType } from "types/supabase";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return fetchNews(req, res);
  } else if (req.method === "POST") {
    return insertNews(req, res);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
// Function to fetch all news (GET)
async function fetchNews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase.from("news").select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: (error as Error)?.message || "Something went wrong" });
  }
}

// Function to insert news (POST)
async function insertNews(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url, title } = req.body as NewsType;

    if (!url) {
      return res.status(400).json({ error: "Missing required fields: URL" });
    }

    const preview = await getLinkPreview(url);
    console.log("preview", preview);
    const imagePreview = "images" in preview ? preview.images?.[0] : undefined;
    const newsTitle = "title" in preview ? preview.title : undefined;

    const insertParameters: NewsType = {
      ...req.body,
      thumbnail_url: imagePreview,
      rank: "Basic",
      title: title || newsTitle,
    };

    const { data, error } = await supabase.from("news").insert([insertParameters]).select();

    if (error) {
      res.status(500).json({ error: (error as Error)?.message });
    }

    return res.status(201).json({ message: "News added successfully", data });
  } catch (error) {
    return res.status(500).json({ error: (error as Error)?.message });
  }
}
