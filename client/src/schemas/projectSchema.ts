import { z } from 'zod'

import { monthDateSchema, optionalUrlSchema } from './common'

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Proje adı zorunlu')
    .max(100, 'Proje adı 100 karakteri geçemez'),
  description: z
    .string()
    .max(500, 'Açıklama 500 karakterden uzun olamaz'),
  url: optionalUrlSchema,
  startDate: monthDateSchema,
  endDate: monthDateSchema,
})

export type ProjectFormValues = z.infer<typeof projectSchema>
