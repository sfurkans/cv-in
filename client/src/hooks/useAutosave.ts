import { useEffect, useRef } from 'react'

import { hasMeaningfulContent, saveResume } from '@/lib/sync'
import { useResumeStore } from '@/store/resumeStore'

const DEFAULT_DEBOUNCE_MS = 2000

export function useAutosave(debounceMs: number = DEFAULT_DEBOUNCE_MS): void {
  const resume = useResumeStore((s) => s.resume)
  const isFirstRunRef = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      // İlk mount: localStorage'dan gelen resume backend'e hiç push edilmemişse
      // (remoteId boş) ve anlamlı içerik varsa, one-shot migration yap.
      const { remoteId } = useResumeStore.getState()
      if (!remoteId && hasMeaningfulContent(resume)) {
        void saveResume()
      }
      return
    }

    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      void saveResume()
    }, debounceMs)

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [resume, debounceMs])
}
