import { z } from 'zod'

export const skillSchema = z.object({
  name: z.string().max(100, 'Yetenek adı 100 karakteri geçemez'),
  level: z.string().max(50, 'Seviye 50 karakteri geçemez'),
  keywords: z.array(
    z.string().min(1, 'Boş yetenek eklenemez').max(50, 'Yetenek çok uzun')
  ),
})

export type SkillFormValues = z.infer<typeof skillSchema>
