import type { RequestHandler } from "express";
import { resumeService } from "../services/resumeService.js";
import { HttpError } from "../middleware/error.js";

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const requireId = (id: string | undefined): string => {
  if (!id) throw new HttpError(400, "id parametresi eksik");
  return id;
};

const requireUserId = (userId: string | undefined): string => {
  if (!userId) throw new HttpError(401, "Giriş yapmanız gerekiyor");
  return userId;
};

export const resumeController = {
  list: asyncHandler(async (req, res) => {
    const userId = requireUserId(req.userId);
    const resumes = await resumeService.list(userId);
    res.json({ data: resumes });
  }),

  get: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const userId = requireUserId(req.userId);
    const resume = await resumeService.getById(id, userId);
    res.json({ data: resume });
  }),

  create: asyncHandler(async (req, res) => {
    const userId = requireUserId(req.userId);
    const resume = await resumeService.create(userId, req.body);
    res.status(201).json({ data: resume });
  }),

  update: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const userId = requireUserId(req.userId);
    const resume = await resumeService.update(id, userId, req.body);
    res.json({ data: resume });
  }),

  remove: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const userId = requireUserId(req.userId);
    await resumeService.remove(id, userId);
    res.status(204).send();
  }),

  uploadPhoto: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const userId = requireUserId(req.userId);
    if (!req.file) throw new HttpError(400, "Dosya yüklenmedi (field: photo)");
    const photoUrl = `/uploads/${req.file.filename}`;
    const resume = await resumeService.setPhoto(id, userId, photoUrl);
    res.json({ data: resume });
  }),
};
