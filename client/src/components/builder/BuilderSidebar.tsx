import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  GripVertical,
  Heart,
  Languages,
  Layers,
  Palette,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react'
import type { ComponentType } from 'react'

import { useResumeValidation } from '@/hooks/useResumeValidation'
import { cn } from '@/lib/utils'
import type { SectionKey } from '@/lib/validateResume'
import { useResumeStore } from '@/store/resumeStore'
import type { SectionId } from '@/types/resume'

import SortableList from './dnd/SortableList'

type IconType = ComponentType<{ className?: string }>

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

const SECTION_ICONS: Record<SectionId, IconType> = {
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

interface BuilderSidebarProps {
  activeSection: string
  onSectionChange: (id: string) => void
}

interface SectionButtonProps {
  icon: IconType
  label: string
  isActive: boolean
  errorCount: number
  onClick: () => void
  dragHandle?: React.ReactNode
}

function SectionButton({
  icon: Icon,
  label,
  isActive,
  errorCount,
  onClick,
  dragHandle,
}: SectionButtonProps) {
  const hasErrors = errorCount > 0
  return (
    <div className="relative">
      {dragHandle}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-md py-2 pr-2.5 text-left text-sm font-medium transition-colors',
          dragHandle ? 'pl-9' : 'pl-3',
          isActive
            ? 'bg-primary/10 text-primary shadow-[inset_2px_0_0_var(--color-primary)]'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{label}</span>
        {hasErrors && (
          <span
            className={cn(
              'inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-destructive text-destructive-foreground',
            )}
            aria-label={`${errorCount} hata`}
          >
            {errorCount}
          </span>
        )}
      </button>
    </div>
  )
}

interface DraggableSectionProps {
  id: SectionId
  isActive: boolean
  errorCount: number
  onClick: () => void
}

function DraggableSection({
  id,
  isActive,
  errorCount,
  onClick,
}: DraggableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style}>
      <SectionButton
        icon={SECTION_ICONS[id]}
        label={SECTION_LABELS[id]}
        isActive={isActive}
        errorCount={errorCount}
        onClick={onClick}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute left-1.5 top-1/2 z-10 flex h-6 w-5 -translate-y-1/2 cursor-grab items-center justify-center rounded text-muted-foreground/50 hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
            aria-label={`${SECTION_LABELS[id]} — sürükleyerek sırala`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        }
      />
    </div>
  )
}

export default function BuilderSidebar({
  activeSection,
  onSectionChange,
}: BuilderSidebarProps) {
  const validation = useResumeValidation()
  const sectionOrder = useResumeStore((state) => state.resume.sectionOrder)
  const reorderSections = useResumeStore((state) => state.reorderSections)

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-border/60 bg-background p-4">
      <nav className="flex flex-col gap-1">
        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          İçerik
        </p>
        <SectionButton
          icon={User}
          label="Kişisel Bilgiler"
          isActive={activeSection === 'personal'}
          errorCount={validation.personal.errorCount}
          onClick={() => onSectionChange('personal')}
        />

        <SortableList
          ids={sectionOrder}
          onReorder={(ids) => reorderSections(ids as SectionId[])}
        >
          {sectionOrder.map((id) => {
            const key = SECTION_ID_TO_KEY[id]
            return (
              <DraggableSection
                key={id}
                id={id}
                isActive={activeSection === key}
                errorCount={validation[key].errorCount}
                onClick={() => onSectionChange(key)}
              />
            )
          })}
        </SortableList>

        <p className="mt-3 px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Görünüm
        </p>
        <SectionButton
          icon={Palette}
          label="Tasarım"
          isActive={activeSection === 'design'}
          errorCount={0}
          onClick={() => onSectionChange('design')}
        />
      </nav>
    </aside>
  )
}
