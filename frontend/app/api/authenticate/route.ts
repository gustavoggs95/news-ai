import bs58 from "bs58";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import nacl from "tweetnacl";
import { UsersType } from "types/supabase";
import { createClient } from "utils/supabase/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  // Create the Supabase client (make sure your createClient function is updated accordingly)
  const supabase = await createClient();

  // Although this route should only be reached on a POST request,
  // we can add a check for extra safety.
  if (req.method !== "POST") {
    return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { publicKey, signature, message } = body;

    if (!publicKey || !signature || !message) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // Convert values from Base58
    const pubKeyBuffer = bs58.decode(publicKey);
    const signatureBuffer = bs58.decode(signature);
    const messageBuffer = new TextEncoder().encode(message);

    // Verify signature
    const isValid = nacl.sign.detached.verify(messageBuffer, signatureBuffer, pubKeyBuffer);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    }

    // Call your Supabase RPC to insert or update the user
    const { data, error } = await supabase.rpc("insert_or_update_user", {
      _public_address: publicKey,
    });
    console.log("RPC response:", { data, error });

    if (error) {
      return NextResponse.json({ success: false }, { status: 500 });
    } else {
      // Cast data to an array of UsersType and grab the first element
      const user = (data as UsersType[])[0];
      const token = jwt.sign({ publicKey, user_id: user.id }, JWT_SECRET, {
        expiresIn: "30d",
      });
      return NextResponse.json({ success: true, token, user }, { status: 200 });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
