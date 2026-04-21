import { prisma } from "../lib/prisma.js";
import { hashPassword, verifyPassword, signJwt } from "../lib/auth.js";
import { HttpError } from "../middleware/error.js";
import type { RegisterInput, LoginInput } from "../schemas/auth.js";

const publicUser = (user: { id: string; email: string; createdAt: Date }) => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
});

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new HttpError(409, "Bu e-posta ile zaten bir hesap var");
    }
    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: { email: input.email, passwordHash },
    });
    const token = signJwt({ userId: user.id });
    return { user: publicUser(user), token };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new HttpError(401, "E-posta veya şifre hatalı");
    }
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "E-posta veya şifre hatalı");
    }
    const token = signJwt({ userId: user.id });
    return { user: publicUser(user), token };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpError(401, "Kullanıcı bulunamadı");
    }
    return publicUser(user);
  },
};
