import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ error: `Invalid or expired token: ${(error as Error)?.message}` });
  }
}
