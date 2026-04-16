import type { Resume } from '@/types/resume'

import { useResumeStore } from '@/store/resumeStore'

import { normalizeError } from './apiClient'
import { createResume, updateResume } from './api/resumes'
import { toast } from './toast'

export function hasMeaningfulContent(resume: Resume): boolean {
  const { basics } = resume
  if (
    basics.name.trim() ||
    basics.email.trim() ||
    basics.summary.trim() ||
    basics.label.trim() ||
    basics.phone.trim() ||
    basics.profiles.length > 0
  ) {
    return true
  }
  const lists = [
    resume.work,
    resume.education,
    resume.skills,
    resume.projects,
    resume.languages,
    resume.certificates,
    resume.volunteer,
    resume.publications,
    resume.customSections,
  ]
  return lists.some((list) => list.length > 0)
}

let inFlight: Promise<void> | null = null
let hasPendingSave = false
let hasPendingOfflineSync = false
let onlineListenerAttached = false

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

function attachOnlineListener(): void {
  if (onlineListenerAttached) return
  onlineListenerAttached = true
  window.addEventListener(
    'online',
    () => {
      onlineListenerAttached = false
      if (hasPendingOfflineSync) {
        hasPendingOfflineSync = false
        toast.info('Bağlantı geldi, senkronlanıyor...')
        void saveResume()
      }
    },
    { once: true }
  )
}

export async function saveResume(): Promise<void> {
  // Offline ise API call yapma — localStorage zaten güncel (Zustand persist).
  // Online olunca otomatik flush edilecek.
  if (isOffline()) {
    hasPendingOfflineSync = true
    useResumeStore.getState().setSyncStatus('idle')
    attachOnlineListener()
    return
  }

  if (inFlight) {
    hasPendingSave = true
    return inFlight
  }

  inFlight = (async () => {
    try {
      const store = useResumeStore.getState()
      store.setSyncStatus('syncing')
      const { resume, remoteId } = store
      const result = remoteId
        ? await updateResume(remoteId, resume)
        : await createResume(resume)
      useResumeStore.getState().markSynced(result.remoteId, result.updatedAt)
      hasPendingOfflineSync = false
    } catch (err) {
      // Ağ hatası ise (status === 0) ve offline'a düştüysek, hata gösterme
      const apiErr = normalizeError(err)
      if (apiErr.status === 0 && isOffline()) {
        hasPendingOfflineSync = true
        useResumeStore.getState().setSyncStatus('idle')
        attachOnlineListener()
      } else {
        useResumeStore.getState().setSyncStatus('error', apiErr.message)
        toast.error('Kaydedilemedi: ' + apiErr.message)
      }
    } finally {
      inFlight = null
      if (hasPendingSave) {
        hasPendingSave = false
        void saveResume()
      }
    }
  })()

  return inFlight
}

export function resetSyncStateForTests(): void {
  inFlight = null
  hasPendingSave = false
  hasPendingOfflineSync = false
  onlineListenerAttached = false
}
