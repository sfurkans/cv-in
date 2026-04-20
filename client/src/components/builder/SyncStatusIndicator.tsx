import { AlertCircle, Check, CloudOff, Loader2 } from 'lucide-react'

import { useResumeStore } from '@/store/resumeStore'

export default function SyncStatusIndicator() {
  const syncStatus = useResumeStore((s) => s.syncStatus)
  const lastSyncedAt = useResumeStore((s) => s.lastSyncedAt)
  const lastSyncError = useResumeStore((s) => s.lastSyncError)
  const remoteId = useResumeStore((s) => s.remoteId)

  if (syncStatus === 'syncing') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Kaydediliyor…
      </span>
    )
  }

  if (syncStatus === 'error') {
    return (
      <span
        className="flex items-center gap-1.5 text-xs font-medium text-destructive"
        title={lastSyncError ?? undefined}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        Kaydedilemedi
      </span>
    )
  }

  if (syncStatus === 'saved' || (syncStatus === 'idle' && lastSyncedAt)) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-accent">
        <Check className="h-3.5 w-3.5" />
        Kaydedildi
      </span>
    )
  }

  if (!remoteId) {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <CloudOff className="h-3.5 w-3.5" />
        Yerel
      </span>
    )
  }

  return null
}
