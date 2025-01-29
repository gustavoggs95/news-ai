import { Router, Request, Response } from "express";
import News from "../models/News";

const router = Router();

// POST /news
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("body", req.body);
    const newsItem = await News.create(req.body);
    return res.status(201).json(newsItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
