import { z } from 'zod'

export const customFieldSchema = z.object({
  label: z
    .string()
    .min(1, 'Alan başlığı zorunlu')
    .max(80, 'Alan başlığı 80 karakterden uzun olamaz'),
  value: z
    .string()
    .max(500, 'Değer 500 karakterden uzun olamaz'),
})

export const customSectionSchema = z.object({
  title: z
    .string()
    .min(1, 'Bölüm başlığı zorunlu')
    .max(100, 'Bölüm başlığı 100 karakterden uzun olamaz'),
  fields: z.array(customFieldSchema),
})

export type CustomSectionFormValues = z.infer<typeof customSectionSchema>
export type CustomFieldFormValues = z.infer<typeof customFieldSchema>
