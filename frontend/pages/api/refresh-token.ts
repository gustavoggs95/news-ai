import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  publicKey: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Issue a new token with an extended expiration
    const newToken = jwt.sign({ publicKey: decoded.publicKey }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({ success: true, token: newToken });
  } catch (err) {
    return res.status(401).json({ error: `Invalid or expired token: ${err}` });
  }
}
