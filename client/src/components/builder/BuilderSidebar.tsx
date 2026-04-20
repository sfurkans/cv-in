import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { useResumeValidation } from '@/hooks/useResumeValidation'
import type { SectionKey } from '@/lib/validateResume'
import { useResumeStore } from '@/store/resumeStore'
import type { SectionId } from '@/types/resume'

import SortableList from './dnd/SortableList'

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

// Sidebar button id'leri (reorder için SectionId, validasyon için SectionKey).
// `custom` tab id'si validateResume'de SectionKey olarak da 'custom' — doğrudan eşleşiyor.
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
  id: string
  label: string
  isActive: boolean
  errorCount: number
  onClick: () => void
  dragHandle?: React.ReactNode
}

function SectionButton({
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
        className={`flex w-full items-center justify-between gap-2 rounded-md py-2 pr-3 text-left text-sm font-medium transition-colors ${
          dragHandle ? 'pl-8' : 'pl-3'
        } ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <span className="truncate">{label}</span>
        {hasErrors && (
          <span
            className={`inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
              isActive
                ? 'bg-primary-foreground text-primary'
                : 'bg-destructive text-destructive-foreground'
            }`}
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
        id={id}
        label={SECTION_LABELS[id]}
        isActive={isActive}
        errorCount={errorCount}
        onClick={onClick}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="absolute left-1 top-1/2 z-10 flex h-6 w-5 -translate-y-1/2 cursor-grab items-center justify-center rounded text-muted-foreground/60 hover:bg-muted hover:text-muted-foreground active:cursor-grabbing"
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
    <aside className="w-56 shrink-0 border-r bg-muted/30 p-4">
      <nav className="flex flex-col gap-1">
        {/* Personal — sabit, üstte */}
        <SectionButton
          id="personal"
          label="Kişisel Bilgiler"
          isActive={activeSection === 'personal'}
          errorCount={validation.personal.errorCount}
          onClick={() => onSectionChange('personal')}
        />

        {/* Reorderable middle sections */}
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

        {/* Design — sabit, altta */}
        <SectionButton
          id="design"
          label="Tasarım"
          isActive={activeSection === 'design'}
          errorCount={0}
          onClick={() => onSectionChange('design')}
        />
      </nav>
    </aside>
  )
}
