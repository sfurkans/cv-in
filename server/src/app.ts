import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import healthRouter from "./routes/health.js";
import resumesRouter from "./routes/resumes.js";

export function createApp() {
  const app = express();

  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use(express.json({ limit: "5mb" }));
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/uploads", express.static(path.resolve("uploads")));

  app.use("/health", healthRouter);
  app.use("/api/resumes", resumesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
