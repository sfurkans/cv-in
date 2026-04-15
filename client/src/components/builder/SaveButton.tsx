import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { saveResume } from '@/lib/sync'
import { useResumeStore } from '@/store/resumeStore'

export default function SaveButton() {
  const syncStatus = useResumeStore((s) => s.syncStatus)

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => void saveResume()}
      disabled={syncStatus === 'syncing'}
      className="gap-1"
      title="Hemen kaydet"
    >
      <Save className="h-3.5 w-3.5" />
      Kaydet
    </Button>
  )
}
