import { useEffect } from 'react'
import type { NavigateFunction } from 'react-router-dom'

import { getResume } from '@/lib/api/resumes'
import { normalizeError } from '@/lib/apiClient'
import { toast } from '@/lib/toast'
import { initialResume, useResumeStore } from '@/store/resumeStore'

/**
 * URL ↔ store sync:
 * - URL'de id varsa ve store'daki remoteId farklıysa backend'den fetch edip yükler.
 * - URL'de id yoksa ve store'da remoteId varsa (eski CV), store'u yeni CV için reset eder.
 * - Store'da autosave sonucu yeni remoteId oluştuğunda URL'i replace eder.
 */
export function useBuilderRouteSync(
  urlId: string | undefined,
  navigate: NavigateFunction
): void {
  const remoteId = useResumeStore((s) => s.remoteId)

  // URL → store
  useEffect(() => {
    let cancelled = false

    if (urlId) {
      if (urlId !== remoteId) {
        const store = useResumeStore.getState()
        store.setSyncStatus('syncing')
        ;(async () => {
          try {
            const result = await getResume(urlId)
            if (cancelled) return
            const freshStore = useResumeStore.getState()
            freshStore.loadResume(result.resume)
            freshStore.markSynced(result.remoteId, result.updatedAt)
          } catch (err) {
            if (cancelled) return
            const apiErr = normalizeError(err)
            useResumeStore
              .getState()
              .setSyncStatus('error', `CV yüklenemedi: ${apiErr.message}`)
            toast.error('CV yüklenemedi: ' + apiErr.message)
          }
        })()
      }
    } else {
      // URL'de id yok — "yeni CV" modu. Store'da eski CV varsa temizle.
      if (remoteId) {
        const store = useResumeStore.getState()
        store.loadResume(initialResume)
        store.setRemoteId(null)
        store.setSyncStatus('idle')
      }
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlId])

  // store remoteId → URL
  // Yalnızca "yeni CV" case'inde (urlId yoksa) URL'i store'un remoteId'sine
  // yaz. urlId varsa URL kaynak doğrudur; effect1 store'u URL'e uydurur.
  useEffect(() => {
    if (!urlId && remoteId) {
      navigate(`/builder/${remoteId}`, { replace: true })
    }
  }, [remoteId, urlId, navigate])
}
