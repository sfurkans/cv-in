import { z } from 'zod'

// HTML <input type="month"> boş değerde '' döner, dolu olunca 'YYYY-MM'.
// Aşağıdaki regex ikisini de kabul eder.
export const monthDateSchema = z
  .string()
  .regex(/^(\d{4}-\d{2})?$/, 'Tarih YYYY-AA formatında olmalı')

export const optionalUrlSchema = z
  .string()
  .url('Geçerli bir URL gir')
  .or(z.literal(''))
