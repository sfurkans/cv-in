import { Font } from '@react-pdf/renderer'

// react-pdf WOFF/WOFF2 fontları düzgün yükleyemiyor — Helvetica fallback'e
// düşüyor ve Türkçe karakterler kaybolıyor. TTF fontlar gerekli.
// Noto ailesi Latin-Extended ile Türkçe karakterleri (ç ğ ı ö ş ü İ Ş Ğ Ç)
// tam kapsıyor.

const FONT_BASE = '/fonts'

let registered = false

export function registerPdfFonts(): void {
  if (registered) return
  registered = true

  Font.register({
    family: 'Noto Sans',
    fonts: [
      { src: `${FONT_BASE}/NotoSans-Regular.ttf`, fontWeight: 'normal' },
      { src: `${FONT_BASE}/NotoSans-Bold.ttf`, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Noto Serif',
    fonts: [
      { src: `${FONT_BASE}/NotoSerif-Regular.ttf`, fontWeight: 'normal' },
      { src: `${FONT_BASE}/NotoSerif-Bold.ttf`, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Noto Sans Mono',
    fonts: [
      { src: `${FONT_BASE}/NotoSansMono-Regular.ttf`, fontWeight: 'normal' },
      { src: `${FONT_BASE}/NotoSansMono-Bold.ttf`, fontWeight: 'bold' },
    ],
  })
}

// Modül yüklenir yüklenmez register et — PDF template'leri import ettiğinde
// side effect olarak çalışır ve render sırasında fontlar hazır olur.
registerPdfFonts()
