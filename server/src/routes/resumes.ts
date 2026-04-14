import { Router } from "express";
import { resumeController } from "../controllers/resumeController.js";
import { validateBody } from "../middleware/validate.js";
import { requireOwnerUuid } from "../middleware/ownerUuid.js";
import { photoUpload } from "../middleware/upload.js";
import { resumeCreateSchema, resumeUpdateSchema } from "../schemas/resume.js";

const router = Router();

router.use(requireOwnerUuid);

router.get("/", resumeController.list);
router.post("/", validateBody(resumeCreateSchema), resumeController.create);
router.get("/:id", resumeController.get);
router.put("/:id", validateBody(resumeUpdateSchema), resumeController.update);
router.delete("/:id", resumeController.remove);

router.post("/:id/photo", photoUpload, resumeController.uploadPhoto);

export default router;
