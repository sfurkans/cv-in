import { useResumeStore } from '@/store/resumeStore'

import { ClassicTemplate } from './templates'

export default function ResumePreview() {
  const resume = useResumeStore((state) => state.resume)

  return <ClassicTemplate resume={resume} />
}
