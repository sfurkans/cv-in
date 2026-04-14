import express from "express";
import cors from "cors";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import healthRouter from "./routes/health.js";
import resumesRouter from "./routes/resumes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "5mb" }));

  app.use("/uploads", express.static(path.resolve("uploads")));

  app.use("/health", healthRouter);
  app.use("/api/resumes", resumesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
