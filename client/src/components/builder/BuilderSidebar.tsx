const sections = [
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
  return (
    <aside className="w-56 shrink-0 border-r bg-muted/30 p-4">
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
