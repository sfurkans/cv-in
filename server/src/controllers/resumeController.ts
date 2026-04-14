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

export const resumeController = {
  list: asyncHandler(async (req, res) => {
    const resumes = await resumeService.list(req.ownerUuid);
    res.json({ data: resumes });
  }),

  get: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const resume = await resumeService.getById(id, req.ownerUuid);
    res.json({ data: resume });
  }),

  create: asyncHandler(async (req, res) => {
    const resume = await resumeService.create(req.ownerUuid, req.body);
    res.status(201).json({ data: resume });
  }),

  update: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    const resume = await resumeService.update(id, req.ownerUuid, req.body);
    res.json({ data: resume });
  }),

  remove: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    await resumeService.remove(id, req.ownerUuid);
    res.status(204).send();
  }),

  uploadPhoto: asyncHandler(async (req, res) => {
    const id = requireId(req.params["id"]);
    if (!req.file) throw new HttpError(400, "Dosya yüklenmedi (field: photo)");
    const photoUrl = `/uploads/${req.file.filename}`;
    const resume = await resumeService.setPhoto(id, req.ownerUuid, photoUrl);
    res.json({ data: resume });
  }),
};
