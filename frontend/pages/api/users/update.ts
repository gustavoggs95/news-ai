import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateUserInput, UpdateUserResponse } from "types/api";
import { UsersType } from "types/supabase";
import { createClient } from "utils/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateUserResponse>) {
  const supabase = createClient(req, res);
  const JWT_SECRET = process.env.JWT_SECRET as string;

  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, error: "Token missing" });
  }

  // Validate the JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
  } catch (err) {
    console.log("JWT validation error:", err);
    return res.status(401).json({ success: false, error: "Invalid token" });
  }

  try {
    const { id, username }: UpdateUserInput = req.body;

    if (!username) {
      return res.status(400).json({ success: false, error: "No fields to update" });
    }

    if (username.length <= 3) {
      return res.status(400).json({ success: false, error: "Minimum user name length is 3" });
    }

    if (username.length > 50) {
      return res.status(400).json({ success: false, error: "Max user name length is 50" });
    }

    const updateData: Partial<UsersType> = { username };

    const { error: updateError } = await supabase.from("users").update(updateData).eq("id", id).select().single();

    if (updateError) {
      console.log("Update error:", updateError);
      return res.status(500).json({ success: false, error: "Failed to update user" });
    }

    // Return the updated user data
    return res.status(200).json({ success: true, username });
  } catch (error) {
    console.log("Internal server error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
