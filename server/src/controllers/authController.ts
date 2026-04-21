import type { RequestHandler } from "express";
import { authService } from "../services/authService.js";
import { HttpError } from "../middleware/error.js";

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({ data: result });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json({ data: result });
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.userId) throw new HttpError(401, "Giriş yapmanız gerekiyor");
    const user = await authService.me(req.userId);
    res.json({ data: user });
  }),
};
