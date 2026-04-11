import { Font } from '@react-pdf/renderer'

import notoSansRegular from '@fontsource/noto-sans/files/noto-sans-latin-ext-400-normal.woff?url'
import notoSansBold from '@fontsource/noto-sans/files/noto-sans-latin-ext-700-normal.woff?url'
import notoSerifRegular from '@fontsource/noto-serif/files/noto-serif-latin-ext-400-normal.woff?url'
import notoSerifBold from '@fontsource/noto-serif/files/noto-serif-latin-ext-700-normal.woff?url'
import notoMonoRegular from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-ext-400-normal.woff?url'
import notoMonoBold from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-ext-700-normal.woff?url'

// react-pdf'in default Helvetica/Times-Roman/Courier fontları Türkçe
// karakterleri (ç ğ ı ö ş ü + büyük harfleri) desteklemiyor. Noto ailesinin
// Latin-Extended subset'i Türkçe karakterleri tam kapsıyor.

let registered = false

export function registerPdfFonts(): void {
  if (registered) return
  registered = true

  Font.register({
    family: 'Noto Sans',
    fonts: [
      { src: notoSansRegular, fontWeight: 'normal' },
      { src: notoSansBold, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Noto Serif',
    fonts: [
      { src: notoSerifRegular, fontWeight: 'normal' },
      { src: notoSerifBold, fontWeight: 'bold' },
    ],
  })

  Font.register({
    family: 'Noto Sans Mono',
    fonts: [
      { src: notoMonoRegular, fontWeight: 'normal' },
      { src: notoMonoBold, fontWeight: 'bold' },
    ],
  })
}

// Modül yüklenir yüklenmez register et — PDF template'leri import ettiğinde
// side effect olarak çalışır ve render sırasında fontlar hazır olur.
registerPdfFonts()
