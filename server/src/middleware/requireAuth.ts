import type { RequestHandler } from "express";
import { HttpError } from "./error.js";
import { verifyJwt } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Giriş yapmanız gerekiyor");
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    throw new HttpError(401, "Giriş yapmanız gerekiyor");
  }
  try {
    const payload = verifyJwt(token);
    req.userId = payload.userId;
    next();
  } catch {
    throw new HttpError(401, "Oturum süresi doldu veya token geçersiz");
  }
};
