import type { z } from 'zod'

import {
  basicsTextSchema,
  certificateSchema,
  educationSchema,
  languageSchema,
  projectSchema,
  publicationSchema,
  skillSchema,
  volunteerSchema,
  workSchema,
} from '@/schemas'
import type { Resume } from '@/types/resume'

export const SECTION_KEYS = [
  'personal',
  'experience',
  'education',
  'skills',
  'projects',
  'languages',
  'certificates',
  'volunteer',
  'publications',
  'custom',
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

export interface SectionValidationResult {
  isValid: boolean
  errorCount: number
  errors: string[]
}

export type ResumeValidationResult = Record<
  SectionKey,
  SectionValidationResult
>

function validResult(): SectionValidationResult {
  return { isValid: true, errorCount: 0, errors: [] }
}

function runSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): SectionValidationResult {
  const result = schema.safeParse(data)
  if (result.success) return validResult()
  return {
    isValid: false,
    errorCount: result.error.issues.length,
    errors: result.error.issues.map((issue) => issue.message),
  }
}

// Phase 4: section boşsa (store'da item yoksa) "dokunulmamış" kabul edilir
// ve geçerli sayılır. Sadece basics/personal her zaman validate edilir çünkü
// initialResume'da default olarak boş basics objesi var ve name zorunlu.
export function validateResume(resume: Resume): ResumeValidationResult {
  return {
    personal: runSchema(basicsTextSchema, resume.basics),
    experience:
      resume.work.length === 0
        ? validResult()
        : runSchema(workSchema, resume.work[0]),
    education:
      resume.education.length === 0
        ? validResult()
        : runSchema(educationSchema, resume.education[0]),
    skills:
      resume.skills.length === 0
        ? validResult()
        : runSchema(skillSchema, resume.skills[0]),
    projects:
      resume.projects.length === 0
        ? validResult()
        : runSchema(projectSchema, resume.projects[0]),
    languages:
      resume.languages.length === 0
        ? validResult()
        : runSchema(languageSchema, resume.languages[0]),
    certificates:
      resume.certificates.length === 0
        ? validResult()
        : runSchema(certificateSchema, resume.certificates[0]),
    volunteer:
      resume.volunteer.length === 0
        ? validResult()
        : runSchema(volunteerSchema, resume.volunteer[0]),
    publications:
      resume.publications.length === 0
        ? validResult()
        : runSchema(publicationSchema, resume.publications[0]),
    custom: validResult(),
  }
}

export function getTotalErrorCount(
  validation: ResumeValidationResult
): number {
  return Object.values(validation).reduce(
    (sum, section) => sum + section.errorCount,
    0
  )
}

export function getInvalidSectionCount(
  validation: ResumeValidationResult
): number {
  return Object.values(validation).filter((section) => !section.isValid).length
}
