import { useResumeValidation } from '@/hooks/useResumeValidation'
import type { SectionKey } from '@/lib/validateResume'

const sections: Array<{ id: SectionKey; label: string }> = [
  { id: 'personal', label: 'Kişisel Bilgiler' },
  { id: 'experience', label: 'Deneyim' },
  { id: 'education', label: 'Eğitim' },
  { id: 'skills', label: 'Yetenekler' },
  { id: 'projects', label: 'Projeler' },
  { id: 'languages', label: 'Diller' },
  { id: 'certificates', label: 'Sertifikalar' },
  { id: 'volunteer', label: 'Gönüllülük' },
  { id: 'publications', label: 'Yayınlar' },
  { id: 'custom', label: 'Özel Bölümler' },
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
          const sectionValidation = validation[section.id]
          const hasErrors = sectionValidation.errorCount > 0
          const isActive = activeSection === section.id

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
                  aria-label={`${sectionValidation.errorCount} hata`}
                >
                  {sectionValidation.errorCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
