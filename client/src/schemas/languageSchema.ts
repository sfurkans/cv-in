import { z } from 'zod'

export const languageSchema = z.object({
  name: z
    .string()
    .min(1, 'Dil adı zorunlu')
    .max(50, 'Dil adı 50 karakteri geçemez'),
  proficiency: z.string(),
})

export type LanguageFormValues = z.infer<typeof languageSchema>
