import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Languages,
  Layers,
  Palette,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

import { useResumeValidation } from '@/hooks/useResumeValidation'
import { getAllCompletions } from '@/lib/sectionCompletion'
import { cn } from '@/lib/utils'
import type { SectionKey } from '@/lib/validateResume'
import { useResumeStore } from '@/store/resumeStore'
import type { SectionId } from '@/types/resume'

const SECTION_LABELS: Record<SectionId, string> = {
  experience: 'Deneyim',
  education: 'Eğitim',
  skills: 'Yetenekler',
  projects: 'Projeler',
  languages: 'Diller',
  certificates: 'Sertifikalar',
  volunteer: 'Gönüllülük',
  publications: 'Yayınlar',
  custom: 'Özel Bölümler',
}

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: Sparkles,
  languages: Languages,
  certificates: Award,
  volunteer: Heart,
  publications: BookOpen,
  custom: Layers,
}

const SECTION_ID_TO_KEY: Record<SectionId, SectionKey> = {
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  languages: 'languages',
  certificates: 'certificates',
  volunteer: 'volunteer',
  publications: 'publications',
  custom: 'custom',
}

interface BuilderMobileNavProps {
  activeSection: string
  onSectionChange: (id: string) => void
}

// Mobile için yatay-scrollable section chip'leri. Desktop'ta BuilderSidebar
// kullanılır; bu component lg altı breakpoint'te FormPanel'in üstünde sabit
// durur. Drag-drop yok (touch target öncelik), sadece aktif section seçimi.
export default function BuilderMobileNav({
  activeSection,
  onSectionChange,
}: BuilderMobileNavProps) {
  const validation = useResumeValidation()
  const resume = useResumeStore((state) => state.resume)
  const sectionOrder = resume.sectionOrder
  const completions = getAllCompletions(resume)
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Aktif chip değişince scroll ile görünür alana getir
  useEffect(() => {
    if (!activeRef.current || !scrollRef.current) return
    const el = activeRef.current
    const parent = scrollRef.current
    const elLeft = el.offsetLeft
    const elRight = elLeft + el.offsetWidth
    const viewLeft = parent.scrollLeft
    const viewRight = viewLeft + parent.clientWidth
    if (elLeft < viewLeft) {
      parent.scrollTo({ left: elLeft - 16, behavior: 'smooth' })
    } else if (elRight > viewRight) {
      parent.scrollTo({ left: elRight - parent.clientWidth + 16, behavior: 'smooth' })
    }
  }, [activeSection])

  return (
    <div className="relative border-b border-border/60 bg-background">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-3 py-2.5 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        <Chip
          icon={User}
          label="Kişisel"
          isActive={activeSection === 'personal'}
          errorCount={validation.personal.errorCount}
          completion={completions.personal}
          onClick={() => onSectionChange('personal')}
          activeRef={activeSection === 'personal' ? activeRef : undefined}
        />
        {sectionOrder.map((id) => {
          const key = SECTION_ID_TO_KEY[id]
          return (
            <Chip
              key={id}
              icon={SECTION_ICONS[id]}
              label={SECTION_LABELS[id]}
              isActive={activeSection === key}
              errorCount={validation[key].errorCount}
              completion={completions[id]}
              onClick={() => onSectionChange(key)}
              activeRef={activeSection === key ? activeRef : undefined}
            />
          )
        })}
        <Chip
          icon={Palette}
          label="Tasarım"
          isActive={activeSection === 'design'}
          errorCount={0}
          onClick={() => onSectionChange('design')}
          activeRef={activeSection === 'design' ? activeRef : undefined}
        />
      </div>
      {/* Sağ/sol fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}

interface ChipProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  errorCount: number
  completion?: number
  onClick: () => void
  activeRef?: React.RefObject<HTMLButtonElement | null>
}

function Chip({
  icon: Icon,
  label,
  isActive,
  errorCount,
  completion,
  onClick,
  activeRef,
}: ChipProps) {
  return (
    <button
      ref={activeRef}
      type="button"
      onClick={onClick}
      className={cn(
        'group/chip relative inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all',
        isActive
          ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
          : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
      {errorCount > 0 && (
        <span
          className={cn(
            'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
            isActive
              ? 'bg-white text-primary'
              : 'bg-destructive text-destructive-foreground',
          )}
          aria-label={`${errorCount} hata`}
        >
          {errorCount}
        </span>
      )}
      {typeof completion === 'number' && completion > 0 && completion < 100 && !isActive && (
        <span
          aria-hidden
          className="absolute bottom-1 left-3 right-3 h-0.5 overflow-hidden rounded-full bg-muted/60"
        >
          <span
            className="block h-full rounded-full bg-brand-gradient"
            style={{ width: `${completion}%` }}
          />
        </span>
      )}
    </button>
  )
}
