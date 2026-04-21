import { useEffect, useRef, useState } from 'react'

import ResumePreview from '@/components/preview/ResumePreview'

import PDFExportButton from './PDFExportButton'
import SaveButton from './SaveButton'
import SyncStatusIndicator from './SyncStatusIndicator'

// A4 sayfa 96dpi'da ~794×1123 px. Bu, ResumePreview içindeki
// template'lerin fix genişliği (210mm).
const A4_WIDTH = 794
const A4_HEIGHT = 1123
const SIDE_PADDING = 24 // px — iki yan p-6 toplam = 48 (24×2)

export default function PreviewPanel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Container genişliğini gözlemleyip scale hesapla.
  // Eğer container A4 genişliğini (+padding) sığdıramıyorsa küçült;
  // sığdırabiliyorsa %100 göster (desktop).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const available = entry.contentRect.width - SIDE_PADDING * 2
      const next = Math.min(1, available / A4_WIDTH)
      setScale(Math.max(0.25, next))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-full w-full min-w-0 shrink-0 flex-col border-t border-border/60 bg-muted/20 lg:w-[calc(210mm+48px)] lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur">
        <SyncStatusIndicator />
        <div className="flex items-center gap-2">
          <SaveButton />
          <PDFExportButton />
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div
          className="mx-auto"
          style={{
            width: A4_WIDTH * scale,
            paddingTop: SIDE_PADDING,
            paddingBottom: SIDE_PADDING,
          }}
        >
          {/* Visual placeholder takes scaled box; inner element does real work */}
          <div
            style={{
              width: A4_WIDTH * scale,
              height: A4_HEIGHT * scale,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: A4_WIDTH,
                height: A4_HEIGHT,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
