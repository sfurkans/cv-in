import { z } from 'zod'

// Europass-uyumlu JSON veri formatı (v1.0).
// Europass CV v3.4 XML şemasının yapısına yakın, round-trip için bu
// uygulamanın tüm alanlarını kayıpsız saklar. Alan adları Europass
// nomenklatürü (learner, identification, foreignLanguages, CEFR vs.).

const cefrSchema = z.object({
  listening: z.string().default(''),
  reading: z.string().default(''),
  spokenInteraction: z.string().default(''),
  spokenProduction: z.string().default(''),
  writing: z.string().default(''),
})

const identificationSchema = z.object({
  fullName: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().default(''),
  telephone: z.string().default(''),
  photo: z.string().default(''),
  summary: z.string().default(''),
  profiles: z
    .array(
      z.object({
        network: z.string().default(''),
        url: z.string().default(''),
        username: z.string().default(''),
      }),
    )
    .default([]),
})

const workSchema = z.object({
  position: z.string().default(''),
  employer: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  summary: z.string().default(''),
  highlights: z.array(z.string()).default([]),
})

const educationSchema = z.object({
  institution: z.string().default(''),
  qualification: z.string().default(''),
  field: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

const jobRelatedSchema = z.object({
  name: z.string().default(''),
  level: z.string().default(''),
  keywords: z.array(z.string()).default([]),
})

const foreignLanguageSchema = z.object({
  name: z.string().default(''),
  overall: z.string().default(''),
  cefr: cefrSchema.optional(),
})

const certificateSchema = z.object({
  name: z.string().default(''),
  issuer: z.string().default(''),
  date: z.string().default(''),
  url: z.string().default(''),
})

const projectSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  url: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

const publicationSchema = z.object({
  name: z.string().default(''),
  publisher: z.string().default(''),
  date: z.string().default(''),
  url: z.string().default(''),
})

const volunteerSchema = z.object({
  role: z.string().default(''),
  organization: z.string().default(''),
  summary: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
})

const customFieldSchema = z.object({
  label: z.string().default(''),
  value: z.string().default(''),
})

const customSectionSchema = z.object({
  title: z.string().default(''),
  fields: z.array(customFieldSchema).default([]),
})

const learnerSchema = z.object({
  identification: identificationSchema,
  workExperience: z.array(workSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z
    .object({
      jobRelated: z.array(jobRelatedSchema).default([]),
      motherTongues: z.array(z.string()).default([]),
      foreignLanguages: z.array(foreignLanguageSchema).default([]),
    })
    .default({
      jobRelated: [],
      motherTongues: [],
      foreignLanguages: [],
    }),
  achievements: z
    .object({
      certificates: z.array(certificateSchema).default([]),
      projects: z.array(projectSchema).default([]),
      publications: z.array(publicationSchema).default([]),
      volunteer: z.array(volunteerSchema).default([]),
      custom: z.array(customSectionSchema).default([]),
    })
    .default({
      certificates: [],
      projects: [],
      publications: [],
      volunteer: [],
      custom: [],
    }),
  preferences: z
    .object({
      sectionOrder: z.array(z.string()).default([]),
      templateId: z.string().default(''),
      theme: z
        .object({
          primaryColor: z.string().default(''),
          textColor: z.string().default(''),
          fontFamily: z.string().default(''),
          spacing: z.string().default(''),
        })
        .optional(),
    })
    .optional(),
})

export const europassDocSchema = z.object({
  version: z.string(),
  kind: z.literal('europass-cv'),
  generatedAt: z.string(),
  learner: learnerSchema,
})

export type EuropassDoc = z.infer<typeof europassDocSchema>
export type EuropassLearner = z.infer<typeof learnerSchema>
