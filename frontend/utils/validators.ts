import { AxiosError } from "axios";
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

export function getDecodedToken({ req }: AuthVerifierType): DecodedAuthJwt | null {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as DecodedAuthJwt;
  } catch (err) {
    console.log("JWT getDecodedToken error:", err);
    throw new Error("Invalid token on getDecodedToken");
  }
}

export function getErrorMessage(err: unknown, fallBackMessage?: string): string {
  const axiosError = (err as AxiosError<{ error: string }>).response?.data?.error;
  const defaultError = (err as Error)?.message;

  return axiosError || defaultError || fallBackMessage || "Undentified error.";
}
