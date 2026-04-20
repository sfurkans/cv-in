import { useResumeStore } from '@/store/resumeStore'

import { TEMPLATES } from './templates'

export default function ResumePreview() {
  const resume = useResumeStore((state) => state.resume)
  const TemplateComponent = TEMPLATES[resume.templateId].Component
  return <TemplateComponent resume={resume} />
}
