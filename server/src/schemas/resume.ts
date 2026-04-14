import { z } from "zod";

export const resumeContentSchema = z
  .object({
    basics: z.record(z.string(), z.unknown()).optional(),
    work: z.array(z.record(z.string(), z.unknown())).optional(),
    education: z.array(z.record(z.string(), z.unknown())).optional(),
    skills: z.array(z.record(z.string(), z.unknown())).optional(),
    projects: z.array(z.record(z.string(), z.unknown())).optional(),
    languages: z.array(z.record(z.string(), z.unknown())).optional(),
    certificates: z.array(z.record(z.string(), z.unknown())).optional(),
    volunteer: z.array(z.record(z.string(), z.unknown())).optional(),
    publications: z.array(z.record(z.string(), z.unknown())).optional(),
    customSections: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export const themeSchema = z
  .object({
    primaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    spacing: z.enum(["compact", "normal", "relaxed"]).optional(),
  })
  .passthrough()
  .nullable();

export const resumeCreateSchema = z.object({
  templateId: z.string().min(1).default("classic"),
  theme: themeSchema.optional(),
  content: resumeContentSchema,
});

export const resumeUpdateSchema = z.object({
  templateId: z.string().min(1).optional(),
  theme: themeSchema.optional(),
  content: resumeContentSchema.optional(),
});

export type ResumeCreateInput = z.infer<typeof resumeCreateSchema>;
export type ResumeUpdateInput = z.infer<typeof resumeUpdateSchema>;
