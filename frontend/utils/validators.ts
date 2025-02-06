"user server";

import jwt from "jsonwebtoken";
import { AuthVerifierType, DecodedAuthJwt } from "types/api";

export function authVerifier({ req, res }: AuthVerifierType) {
  const JWT_SECRET = process.env.JWT_SECRET as string;
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
    return jwt.verify(token, JWT_SECRET) as DecodedAuthJwt;
  } catch (err) {
    console.log("JWT validation error:", err);
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
}
