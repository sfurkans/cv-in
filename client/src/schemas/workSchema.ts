import { z } from 'zod'

import { monthDateSchema } from './common'

// NOT: highlights bu schema'nın dışında tutuluyor — textarea store'a
// doğrudan bağlı (split/join ile). Phase 5'te dinamik listeye geçince
// her highlight ayrı bir item olacak.
export const workSchema = z.object({
  company: z
    .string()
    .min(1, 'Şirket adı zorunlu')
    .max(100, 'Şirket adı 100 karakteri geçemez'),
  position: z
    .string()
    .min(1, 'Pozisyon zorunlu')
    .max(100, 'Pozisyon 100 karakteri geçemez'),
  startDate: monthDateSchema,
  endDate: monthDateSchema,
  summary: z
    .string()
    .max(500, 'Özet 500 karakterden uzun olamaz'),
})

export type WorkFormValues = z.infer<typeof workSchema>
