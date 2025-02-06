import bs58 from "bs58";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import nacl from "tweetnacl";
import { AuthenticateResponse } from "types/api";
import { UsersType } from "types/supabase";
import { createClient } from "utils/supabase/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthenticateResponse>) {
  const supabase = createClient(req, res);

  if (req.method !== "POST") return res.status(405).end();

  try {
    const { publicKey, signature, message } = req.body;

    if (!publicKey || !signature || !message) {
      return res.status(400).json({ success: false, error: "Missing parameters" });
    }

    // Convert values from Base58
    const pubKeyBuffer = bs58.decode(publicKey);
    const signatureBuffer = bs58.decode(signature);
    const messageBuffer = new TextEncoder().encode(message);

    // Verify signature
    const isValid = nacl.sign.detached.verify(messageBuffer, signatureBuffer, pubKeyBuffer);

    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid signature" });
    }

    const { data, error } = await supabase.rpc("insert_or_update_user", { _public_address: publicKey });
    console.log("RPC response:", { data, error });

    if (error) {
      return res.status(500).json({ success: false });
    } else {
      const user = data[0] as UsersType;
      const token = jwt.sign({ publicKey, user_id: user.id }, JWT_SECRET, { expiresIn: "30d" });
      return res.status(200).json({ success: true, token, user });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
