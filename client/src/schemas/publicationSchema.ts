import { z } from 'zod'

import { monthDateSchema, optionalUrlSchema } from './common'

export const publicationSchema = z.object({
  name: z
    .string()
    .min(1, 'Yayın adı zorunlu')
    .max(200, 'Yayın adı 200 karakteri geçemez'),
  publisher: z
    .string()
    .min(1, 'Yayıncı zorunlu')
    .max(100, 'Yayıncı 100 karakteri geçemez'),
  date: monthDateSchema,
  url: optionalUrlSchema,
})

export type PublicationFormValues = z.infer<typeof publicationSchema>
