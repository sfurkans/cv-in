import { z } from 'zod'

// ── Loose shape schemas for API response validation ──────────────
// These validate structure only — no min/max business rules.
// Form-level validation lives in src/schemas/*.ts.

const profileSchema = z.object({
  network: z.string(),
  url: z.string(),
  username: z.string(),
})

const basicsSchema = z.object({
  name: z.string(),
  label: z.string(),
  email: z.string(),
  phone: z.string(),
  summary: z.string(),
  photo: z.string(),
  profiles: z.array(profileSchema),
})

const workSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()),
})

const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
  keywords: z.array(z.string()),
})

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string(),
  startDate: z.string(),
  endDate: z.string(),
})

const languageSchema = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.string(),
})

const certificateSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string(),
})

const volunteerSchema = z.object({
  id: z.string(),
  organization: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  summary: z.string(),
})

const publicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  publisher: z.string(),
  date: z.string(),
  url: z.string(),
})

const customFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
})

const customSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  fields: z.array(customFieldSchema),
})

const resumeContentSchema = z.object({
  basics: basicsSchema,
  work: z.array(workSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  languages: z.array(languageSchema),
  certificates: z.array(certificateSchema),
  volunteer: z.array(volunteerSchema),
  publications: z.array(publicationSchema),
  customSections: z.array(customSectionSchema),
})

const themeSchema = z.object({
  primaryColor: z.string(),
  textColor: z.string(),
  fontFamily: z.enum(['sans', 'serif', 'mono']),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
})

const apiResumeFullSchema = z.object({
  id: z.string(),
  ownerUuid: z.string().optional(),
  templateId: z.string(),
  theme: themeSchema.nullable(),
  content: resumeContentSchema,
  photoUrl: z.string().nullable(),
  shareSlug: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const resumeSummarySchema = apiResumeFullSchema

// ── Envelope helpers ─────────────────────────────────────────────

export const resumeFullResponseSchema = z.object({
  data: apiResumeFullSchema,
})

export const resumeListResponseSchema = z.object({
  data: z.array(resumeSummarySchema),
})

export type ValidatedResumeFull = z.infer<typeof apiResumeFullSchema>
export type ValidatedResumeSummary = z.infer<typeof resumeSummarySchema>
