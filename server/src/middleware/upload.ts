import multer from "multer";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { HttpError } from "./error.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 2 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

export const photoUpload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new HttpError(400, "Sadece JPG, PNG, WebP kabul edilir"));
      return;
    }
    cb(null, true);
  },
}).single("photo");
