import type { z } from 'zod'

import {
  basicsTextSchema,
  certificateSchema,
  customSectionSchema,
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

// Phase 5: her section artık çoklu item tutabiliyor. Bu helper array'deki
// her item'ı validate eder, toplam hata sayısı ve birleşik error listesi
// döndürür. Array boşsa "dokunulmamış" kabul edilir (valid).
function runSchemaOnArray<T>(
  schema: z.ZodType<T>,
  items: unknown[]
): SectionValidationResult {
  if (items.length === 0) return validResult()

  let totalErrors = 0
  const allErrors: string[] = []

  for (const item of items) {
    const result = schema.safeParse(item)
    if (!result.success) {
      totalErrors += result.error.issues.length
      allErrors.push(...result.error.issues.map((issue) => issue.message))
    }
  }

  return {
    isValid: totalErrors === 0,
    errorCount: totalErrors,
    errors: allErrors,
  }
}

export function validateResume(resume: Resume): ResumeValidationResult {
  return {
    personal: runSchema(basicsTextSchema, resume.basics),
    experience: runSchemaOnArray(workSchema, resume.work),
    education: runSchemaOnArray(educationSchema, resume.education),
    skills: runSchemaOnArray(skillSchema, resume.skills),
    projects: runSchemaOnArray(projectSchema, resume.projects),
    languages: runSchemaOnArray(languageSchema, resume.languages),
    certificates: runSchemaOnArray(certificateSchema, resume.certificates),
    volunteer: runSchemaOnArray(volunteerSchema, resume.volunteer),
    publications: runSchemaOnArray(publicationSchema, resume.publications),
    custom: runSchemaOnArray(customSectionSchema, resume.customSections),
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
