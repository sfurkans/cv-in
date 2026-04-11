import { useMemo } from 'react'

import { validateResume } from '@/lib/validateResume'
import { useResumeStore } from '@/store/resumeStore'

export function useResumeValidation() {
  const resume = useResumeStore((state) => state.resume)
  return useMemo(() => validateResume(resume), [resume])
}
