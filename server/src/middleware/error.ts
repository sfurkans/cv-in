import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { Prisma } from "../generated/prisma/client.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: `${req.method} ${req.originalUrl} bulunamadı`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Geçersiz veri",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.name,
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    res.status(400).json({
      error: "UploadError",
      message: err.message,
      details: { code: err.code, field: err.field },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "NotFound", message: "Kayıt bulunamadı" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({
        error: "Conflict",
        message: "Benzersizlik ihlali",
        details: err.meta,
      });
      return;
    }
  }

  console.error("[unhandled error]", err);
  res.status(500).json({
    error: "InternalServerError",
    message: "Beklenmeyen bir hata oluştu",
  });
};
