import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin").toLowerCase().trim(),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı").max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin").toLowerCase().trim(),
  password: z.string().min(1, "Şifre boş olamaz"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
