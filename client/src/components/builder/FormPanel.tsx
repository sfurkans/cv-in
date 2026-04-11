import { AlertCircle, CheckCircle2 } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useResumeValidation } from '@/hooks/useResumeValidation'
import {
  getInvalidSectionCount,
  getTotalErrorCount,
} from '@/lib/validateResume'

import DesignPanel from './design/DesignPanel'
import CertificatesForm from './forms/CertificatesForm'
import CustomSectionsForm from './forms/CustomSectionsForm'
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
  design: 'Tasarım',
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
      return <CustomSectionsForm />
    case 'design':
      return <DesignPanel />
    default:
      return <Placeholder section={activeSection} />
  }
}

function ValidationSummary() {
  const validation = useResumeValidation()
  const totalErrors = getTotalErrorCount(validation)
  const invalidSections = getInvalidSectionCount(validation)

  if (totalErrors === 0) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Tüm bilgiler geçerli — CV'n yayına hazır.</span>
      </div>
    )
  }

  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>
        <strong>{invalidSections}</strong> bölümde toplam{' '}
        <strong>{totalErrors}</strong> eksik ya da hatalı alan var. Kenar
        menüdeki kırmızı rozetleri kontrol et.
      </span>
    </div>
  )
}

export default function FormPanel({ activeSection }: FormPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">
        <ValidationSummary />
        {renderSection(activeSection)}
      </div>
    </div>
  )
}
