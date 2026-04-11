import { z } from 'zod'

import { monthDateSchema, optionalUrlSchema } from './common'

export const certificateSchema = z.object({
  name: z
    .string()
    .min(1, 'Sertifika adı zorunlu')
    .max(150, 'Sertifika adı 150 karakteri geçemez'),
  issuer: z
    .string()
    .min(1, 'Veren kurum zorunlu')
    .max(100, 'Kurum adı 100 karakteri geçemez'),
  date: monthDateSchema,
  url: optionalUrlSchema,
})

export type CertificateFormValues = z.infer<typeof certificateSchema>
