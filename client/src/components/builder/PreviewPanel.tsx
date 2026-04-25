import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import ResumePreview from '@/components/preview/ResumePreview'

import PDFExportButton from './PDFExportButton'
import SaveButton from './SaveButton'
import SyncStatusIndicator from './SyncStatusIndicator'

// A4 @ 96dpi — ResumePreview template'lerinin sabit genişliği 210mm'ye denk.
const A4_WIDTH = 794
const A4_HEIGHT = 1123
const SIDE_PADDING = 24

export default function PreviewPanel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT)

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

  // Content natural yüksekliğini izle; transform'un layout'a etkisi yok, bu
  // yüzden scaled wrapper'ın height'ını içeriğe göre elle hesaplıyoruz.
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      setContentHeight(entry.contentRect.height)
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
          <div
            style={{
              width: A4_WIDTH * scale,
              height: contentHeight * scale,
              position: 'relative',
            }}
          >
            <div
              ref={contentRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: A4_WIDTH,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
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
