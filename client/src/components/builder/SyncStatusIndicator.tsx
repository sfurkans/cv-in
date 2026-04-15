import { AlertCircle, Check, CloudOff, Loader2 } from 'lucide-react'

import { useResumeStore } from '@/store/resumeStore'

export default function SyncStatusIndicator() {
  const syncStatus = useResumeStore((s) => s.syncStatus)
  const lastSyncedAt = useResumeStore((s) => s.lastSyncedAt)
  const lastSyncError = useResumeStore((s) => s.lastSyncError)
  const remoteId = useResumeStore((s) => s.remoteId)

  if (syncStatus === 'syncing') {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Kaydediliyor...
      </span>
    )
  }

  if (syncStatus === 'error') {
    return (
      <span
        className="flex items-center gap-1 text-xs text-destructive"
        title={lastSyncError ?? undefined}
      >
        <AlertCircle className="h-3 w-3" />
        Kaydedilemedi
      </span>
    )
  }

  if (syncStatus === 'saved' || (syncStatus === 'idle' && lastSyncedAt)) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Check className="h-3 w-3" />
        Kaydedildi
      </span>
    )
  }

  if (!remoteId) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <CloudOff className="h-3 w-3" />
        Yerel
      </span>
    )
  }

  return null
}
