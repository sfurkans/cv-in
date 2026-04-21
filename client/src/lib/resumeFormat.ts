// Ortak format + mapping helper'ları — yeni template'ler (sidebar-left, ats,
// color-accent, modern-clean, terminal, infographic) tarafından kullanılır.
// Mevcut 3 template (classic, modern, creative) kendi inline kopyalarını
// kullanmaya devam eder; bu dosya onlara dokunmaz.

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  beginner: 'Başlangıç',
  basic: 'Temel',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
}

// Yetenek seviyesi metni → 0-100 arası yüzde (infographic skill bar için)
export const SKILL_LEVEL_PERCENT: Record<string, number> = {
  beginner: 20,
  basic: 40,
  intermediate: 60,
  advanced: 80,
  expert: 100,
}

// Dil seviyesi (a1..c2 / native) → yüzde (infographic language donut için)
export const LANGUAGE_PROFICIENCY_PERCENT: Record<string, number> = {
  a1: 15,
  a2: 30,
  b1: 50,
  b2: 65,
  c1: 85,
  c2: 95,
  native: 100,
  anadil: 100,
}

export function formatMonth(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  if (!month) return year
  return `${month}/${year}`
}

export function formatDateRange(start: string, end: string): string {
  const s = formatMonth(start)
  const e = formatMonth(end)
  if (!s && !e) return ''
  if (s && !e) return `${s} - Devam ediyor`
  if (!s && e) return e
  return `${s} - ${e}`
}

// Infographic / terminal için "bir pozisyonun kaç ay sürdüğü"
export function monthsBetween(start: string, end: string): number {
  if (!start) return 0
  const parse = (v: string): Date | null => {
    if (!v) return null
    const [y, m] = v.split('-').map((n) => parseInt(n, 10))
    if (!y) return null
    return new Date(y, (m ?? 1) - 1, 1)
  }
  const s = parse(start)
  const e = end ? parse(end) : new Date()
  if (!s || !e) return 0
  return Math.max(
    0,
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1
  )
}
