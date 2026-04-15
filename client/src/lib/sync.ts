import type { Resume } from '@/types/resume'

import { useResumeStore } from '@/store/resumeStore'

import { normalizeError } from './apiClient'
import { createResume, updateResume } from './api/resumes'

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

export async function saveResume(): Promise<void> {
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
    } catch (err) {
      const apiErr = normalizeError(err)
      useResumeStore.getState().setSyncStatus('error', apiErr.message)
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
}
