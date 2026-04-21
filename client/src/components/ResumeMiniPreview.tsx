import { useEffect, useRef, useState } from 'react'

import { TEMPLATES } from '@/components/preview/templates'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
  type TemplateId,
  type Theme,
} from '@/types/resume'

import type { ResumeSummary } from '@/lib/api/resumes'

interface ResumeMiniPreviewProps {
  summary: ResumeSummary
}

// A4 boyutunu (210mm × 297mm, 96dpi'da ~794px × 1123px) kartın genişliğine
// orantılı olarak ölçekle. ResizeObserver ile genişlik değişikliklerinde
// scale yeniden hesaplanır (2-col/3-col grid geçişlerinde).
const A4_WIDTH_PX = 794

export default function ResumeMiniPreview({ summary }: ResumeMiniPreviewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.28)

  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      setScale(entry.contentRect.width / A4_WIDTH_PX)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const templateId = (summary.templateId as TemplateId) ?? 'classic'
  const meta = TEMPLATES[templateId] ?? TEMPLATES.classic
  const Component = meta.Component

  const theme: Theme = (summary.theme as Theme) ?? {
    primaryColor: '#7C3AED',
    textColor: '#111827',
    fontFamily: 'sans',
    spacing: 'normal',
  }

  const sectionOrder: SectionId[] =
    (summary.content.sectionOrder as SectionId[] | undefined) ??
    [...DEFAULT_SECTION_ORDER]

  const resume: Resume = {
    ...summary.content,
    basics: {
      ...summary.content.basics,
      photo: summary.photoUrl || summary.content.basics.photo,
    },
    sectionOrder,
    templateId,
    theme,
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[210/297] w-full overflow-hidden rounded-t-xl bg-white"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute left-0 top-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Component resume={resume} />
      </div>
    </div>
  )
}
