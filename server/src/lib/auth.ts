import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES_IN = "1d";

export interface JwtPayload {
  userId: string;
}

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, BCRYPT_ROUNDS);

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);

export const signJwt = (payload: JwtPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyJwt = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null || typeof decoded.userId !== "string") {
    throw new Error("Geçersiz JWT payload");
  }
  return { userId: decoded.userId };
};
