import { z } from 'zod'

import type { Resume } from '@/types/resume'

import { slugify } from './slugify'

// ============================================================================
// Schemas — full Resume şemasını buraya ayrı tanımlıyoruz çünkü form-level
// schema'lar (schemas/) `id` alanı içermiyor. Import edilen JSON tam Resume
// tipini karşılamalı, dolayısıyla her item schema'sı id'yi zorunlu tutuyor.
// ============================================================================

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

const themeSchema = z.object({
  primaryColor: z.string(),
  textColor: z.string(),
  fontFamily: z.enum(['sans', 'serif', 'mono']),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
})

const templateIdSchema = z.enum(['classic', 'modern', 'creative'])

export const fullResumeSchema = z.object({
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
  templateId: templateIdSchema,
  theme: themeSchema,
})

// ============================================================================
// Serialize / deserialize
// ============================================================================

export function serializeResume(resume: Resume): string {
  return JSON.stringify(resume, null, 2)
}

export function generateJsonFileName(name: string): string {
  const slug = slugify(name) || 'CV'
  return `${slug}_CV.json`
}

export type ImportResult =
  | { ok: true; resume: Resume }
  | { ok: false; error: string }

export function importResumeFromJson(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Geçersiz JSON formatı — dosya okunamadı.' }
  }

  const result = fullResumeSchema.safeParse(parsed)
  if (!result.success) {
    const firstIssue = result.error.issues[0]
    const path = firstIssue?.path.join('.') ?? ''
    const message = firstIssue?.message ?? 'bilinmeyen hata'
    return {
      ok: false,
      error: path
        ? `CV şeması doğrulanamadı: ${path} — ${message}`
        : `CV şeması doğrulanamadı: ${message}`,
    }
  }

  return { ok: true, resume: result.data as Resume }
}

// ============================================================================
// Browser download (side-effectful)
// ============================================================================

export function triggerDownload(
  content: string,
  fileName: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function exportResumeAsJson(resume: Resume): void {
  const content = serializeResume(resume)
  const fileName = generateJsonFileName(resume.basics.name)
  triggerDownload(content, fileName, 'application/json')
}
