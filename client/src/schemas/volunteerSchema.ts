import { z } from 'zod'

import { monthDateSchema } from './common'

export const volunteerSchema = z.object({
  organization: z
    .string()
    .min(1, 'Kuruluş adı zorunlu')
    .max(100, 'Kuruluş adı 100 karakteri geçemez'),
  role: z
    .string()
    .min(1, 'Rol zorunlu')
    .max(100, 'Rol 100 karakteri geçemez'),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
  summary: z
    .string()
    .max(500, 'Özet 500 karakterden uzun olamaz'),
})

export type VolunteerFormValues = z.infer<typeof volunteerSchema>
