import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  publicKey: string;
}

export async function POST(req: Request) {
  // Retrieve the authorization header using the Fetch API's Headers interface.
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Issue a new token with an extended expiration.
    const newToken = jwt.sign({ publicKey: decoded.publicKey }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return NextResponse.json({ success: true, token: newToken }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: `Invalid or expired token: ${err}` }, { status: 401 });
  }
}
