import jwt from "jsonwebtoken";
import { DecodedAuthJwt } from "types/api";

export interface AuthVerifierType {
  req: Request;
}

export function authVerifier({ req }: AuthVerifierType): DecodedAuthJwt {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token missing");
  }

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedAuthJwt;
  } catch (err) {
    console.log("JWT validation error:", err);
    throw new Error("Invalid token");
  }
}
