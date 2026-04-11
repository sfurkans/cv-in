import { z } from 'zod'

export const profileSchema = z.object({
  network: z.string().min(1, 'Platform seçili olmalı'),
  url: z
    .string()
    .url('Geçerli bir URL gir')
    .or(z.literal('')),
  username: z.string(),
})

export const basicsSchema = z.object({
  name: z
    .string()
    .min(1, 'İsim zorunlu')
    .max(80, 'İsim 80 karakterden uzun olamaz'),

  label: z
    .string()
    .max(100, 'Ünvan 100 karakterden uzun olamaz'),

  email: z
    .string()
    .email('Geçerli bir e-posta adresi gir')
    .or(z.literal('')),

  phone: z
    .string()
    .regex(
      /^[\d\s\-+()]*$/,
      'Telefon sadece rakam, boşluk, tire, + ve parantez içerebilir'
    )
    .max(25, 'Telefon numarası çok uzun'),

  summary: z
    .string()
    .max(500, 'Özet 500 karakterden uzun olamaz'),

  photo: z.string(),

  profiles: z.array(profileSchema),
})

export type BasicsFormValues = z.infer<typeof basicsSchema>

// RHF yalnızca text alanlarını yönetiyor; photo ve profiles ayrı alt
// componentlerden (PhotoUpload, SocialLinksInput) doğrudan store'a yazılıyor.
export const basicsTextSchema = basicsSchema.pick({
  name: true,
  label: true,
  email: true,
  phone: true,
  summary: true,
})

export type BasicsTextFormValues = z.infer<typeof basicsTextSchema>
