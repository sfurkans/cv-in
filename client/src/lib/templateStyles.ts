import type { FontFamily, Spacing } from '@/types/resume'

// Yeni template'ler için web (Tailwind class) + PDF (React-PDF font adı)
// style map'leri. Mevcut 3 template kendi inline versiyonlarını korur.

export const FONT_CLASS: Record<FontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

export const PDF_FONT_MAP: Record<FontFamily, string> = {
  sans: 'Noto Sans',
  serif: 'Noto Serif',
  mono: 'Noto Sans Mono',
}

export interface WebSpacingStyle {
  wrapper: string
  sectionGap: string
}

export const WEB_SPACING: Record<Spacing, WebSpacingStyle> = {
  compact: { wrapper: 'p-6', sectionGap: 'mb-3' },
  normal: { wrapper: 'p-8', sectionGap: 'mb-4' },
  relaxed: { wrapper: 'p-10', sectionGap: 'mb-6' },
}

export interface PdfSpacingStyle {
  pagePadding: number
  sectionGap: number
}

export const PDF_SPACING: Record<Spacing, PdfSpacingStyle> = {
  compact: { pagePadding: 28, sectionGap: 10 },
  normal: { pagePadding: 36, sectionGap: 14 },
  relaxed: { pagePadding: 44, sectionGap: 18 },
}
