import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { registerSchema, loginSchema } from "../schemas/auth.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);

export default router;
