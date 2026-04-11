import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CertificatesForm from './forms/CertificatesForm'
import EducationForm from './forms/EducationForm'
import ExperienceForm from './forms/ExperienceForm'
import LanguagesForm from './forms/LanguagesForm'
import PersonalInfoForm from './forms/PersonalInfoForm'
import ProjectsForm from './forms/ProjectsForm'
import PublicationsForm from './forms/PublicationsForm'
import SkillsForm from './forms/SkillsForm'
import VolunteerForm from './forms/VolunteerForm'

interface FormPanelProps {
  activeSection: string
}

const sectionTitles: Record<string, string> = {
  personal: 'Kişisel Bilgiler',
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

function Placeholder({ section }: { section: string }) {
  const title = sectionTitles[section] ?? section
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {title} formu yakında eklenecek.
        </p>
      </CardContent>
    </Card>
  )
}

function renderSection(activeSection: string) {
  switch (activeSection) {
    case 'personal':
      return <PersonalInfoForm />
    case 'experience':
      return <ExperienceForm />
    case 'education':
      return <EducationForm />
    case 'skills':
      return <SkillsForm />
    case 'projects':
      return <ProjectsForm />
    case 'languages':
      return <LanguagesForm />
    case 'certificates':
      return <CertificatesForm />
    case 'volunteer':
      return <VolunteerForm />
    case 'publications':
      return <PublicationsForm />
    case 'custom':
      return <Placeholder section={activeSection} />
    default:
      return <Placeholder section={activeSection} />
  }
}

export default function FormPanel({ activeSection }: FormPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">{renderSection(activeSection)}</div>
    </div>
  )
}
