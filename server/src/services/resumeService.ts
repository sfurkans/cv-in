import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error.js";
import { Prisma } from "../generated/prisma/client.js";
import type { ResumeCreateInput, ResumeUpdateInput } from "../schemas/resume.js";

const asJson = (value: unknown): Prisma.InputJsonValue =>
  value as Prisma.InputJsonValue;

export const resumeService = {
  list(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        templateId: true,
        theme: true,
        content: true,
        photoUrl: true,
        shareSlug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async getById(id: string, userId: string) {
    const resume = await prisma.resume.findUnique({ where: { id } });
    if (!resume) throw new HttpError(404, "CV bulunamadı");
    if (resume.userId !== userId) throw new HttpError(403, "Yetkisiz erişim");
    return resume;
  },

  create(userId: string, input: ResumeCreateInput) {
    return prisma.resume.create({
      data: {
        userId,
        templateId: input.templateId,
        ...(input.theme != null && { theme: asJson(input.theme) }),
        content: asJson(input.content),
      },
    });
  },

  async update(id: string, userId: string, input: ResumeUpdateInput) {
    await this.getById(id, userId);
    return prisma.resume.update({
      where: { id },
      data: {
        ...(input.templateId !== undefined && { templateId: input.templateId }),
        ...(input.theme !== undefined && {
          theme: input.theme === null ? Prisma.DbNull : asJson(input.theme),
        }),
        ...(input.content !== undefined && { content: asJson(input.content) }),
      },
    });
  },

  async remove(id: string, userId: string) {
    await this.getById(id, userId);
    await prisma.resume.delete({ where: { id } });
  },

  async setPhoto(id: string, userId: string, photoUrl: string) {
    await this.getById(id, userId);
    return prisma.resume.update({
      where: { id },
      data: { photoUrl },
    });
  },
};
