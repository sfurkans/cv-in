import { useResumeValidation } from '@/hooks/useResumeValidation'
import type { SectionKey } from '@/lib/validateResume'

type ContentSection = { id: SectionKey; label: string; kind: 'content' }
type DesignSection = { id: 'design'; label: string; kind: 'design' }
type SidebarSection = ContentSection | DesignSection

const sections: SidebarSection[] = [
  { id: 'personal', label: 'Kişisel Bilgiler', kind: 'content' },
  { id: 'experience', label: 'Deneyim', kind: 'content' },
  { id: 'education', label: 'Eğitim', kind: 'content' },
  { id: 'skills', label: 'Yetenekler', kind: 'content' },
  { id: 'projects', label: 'Projeler', kind: 'content' },
  { id: 'languages', label: 'Diller', kind: 'content' },
  { id: 'certificates', label: 'Sertifikalar', kind: 'content' },
  { id: 'volunteer', label: 'Gönüllülük', kind: 'content' },
  { id: 'publications', label: 'Yayınlar', kind: 'content' },
  { id: 'custom', label: 'Özel Bölümler', kind: 'content' },
  { id: 'design', label: 'Tasarım', kind: 'design' },
]

interface BuilderSidebarProps {
  activeSection: string
  onSectionChange: (id: string) => void
}

export default function BuilderSidebar({
  activeSection,
  onSectionChange,
}: BuilderSidebarProps) {
  const validation = useResumeValidation()

  return (
    <aside className="w-56 shrink-0 border-r bg-muted/30 p-4">
      <nav className="flex flex-col gap-1">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          const hasErrors =
            section.kind === 'content' &&
            validation[section.id].errorCount > 0
          const errorCount =
            section.kind === 'content'
              ? validation[section.id].errorCount
              : 0

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="truncate">{section.label}</span>
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
          )
        })}
      </nav>
    </aside>
  )
}
