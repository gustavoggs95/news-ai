import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { UpdateUserInput } from "types/api";
import { UsersType } from "types/supabase";
import { createClient } from "utils/supabase/server";

export async function PUT(req: Request) {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  // Create the Supabase client (make sure your createClient function is updated accordingly)
  const supabase = await createClient();

  // Get the authorization header using the Fetch API's Headers interface.
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, error: "Authorization header missing" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ success: false, error: "Token missing" }, { status: 401 });
  }

  // Validate the JWT token.
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
  } catch (err) {
    console.log("JWT validation error:", err);
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
  }

  // Parse the JSON body.
  let body: UpdateUserInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { id, username } = body;
  if (!username) {
    return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
  }
  if (username.length <= 3) {
    return NextResponse.json({ success: false, error: "Minimum user name length is 3" }, { status: 400 });
  }
  if (username.length > 50) {
    return NextResponse.json({ success: false, error: "Max user name length is 50" }, { status: 400 });
  }

  const updateData: Partial<UsersType> = { username };

  try {
    const { error: updateError } = await supabase.from("users").update(updateData).eq("id", id).select().single();

    if (updateError) {
      console.log("Update error:", updateError);
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
    }

    // Return the updated user data.
    return NextResponse.json({ success: true, username }, { status: 200 });
  } catch (error) {
    console.log("Internal server error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
