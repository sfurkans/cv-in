import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import * as Sentry from "@sentry/node";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import healthRouter from "./routes/health.js";
import resumesRouter from "./routes/resumes.js";
import authRouter from "./routes/auth.js";

// DSN yoksa no-op; kullanıcı Sentry hesabı açıp DSN koyunca otomatik aktif olur.
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 0,
  });
}

export function createApp() {
  const app = express();

  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        // Dev'de herhangi bir localhost portundan izin ver (Vite port değişkenliği için)
        if (
          env.NODE_ENV === "development" &&
          /^https?:\/\/localhost:\d+$/.test(origin)
        ) {
          return cb(null, true);
        }
        if (allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS engellendi: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "5mb" }));
  if (env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.use("/uploads", express.static(path.resolve("uploads")));

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/resumes", resumesRouter);

  app.use(notFoundHandler);

  // Sentry error handler kendi errorHandler'ımızdan ÖNCE olmalı (unhandled hataları yakalar).
  if (env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }
  app.use(errorHandler);

  return app;
}
