import { z } from 'zod'

import { monthDateSchema } from './common'

export const educationSchema = z.object({
  institution: z
    .string()
    .min(1, 'Okul adı zorunlu')
    .max(150, 'Okul adı 150 karakteri geçemez'),
  degree: z.string().max(100, 'Derece 100 karakteri geçemez'),
  field: z.string().max(100, 'Alan 100 karakteri geçemez'),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
})

export type EducationFormValues = z.infer<typeof educationSchema>
