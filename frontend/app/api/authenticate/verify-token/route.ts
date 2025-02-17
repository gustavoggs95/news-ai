import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

export async function GET(req: Request) {
  // Retrieve the authorization header.
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const response = NextResponse.json({ valid: true, user: decoded }, { status: 200 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: `Invalid or expired token: ${(error as Error)?.message}` }, { status: 401 });
  }
}
