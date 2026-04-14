import type { RequestHandler } from "express";
import { HttpError } from "./error.js";

declare global {
  namespace Express {
    interface Request {
      ownerUuid: string;
    }
  }
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const requireOwnerUuid: RequestHandler = (req, _res, next) => {
  const headerValue = req.header("x-owner-uuid");
  if (!headerValue || !UUID_REGEX.test(headerValue)) {
    throw new HttpError(400, "X-Owner-Uuid header geçerli bir UUID olmalı");
  }
  req.ownerUuid = headerValue.toLowerCase();
  next();
};
