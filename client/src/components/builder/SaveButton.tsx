import { Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { saveResume } from '@/lib/sync'
import { toast } from '@/lib/toast'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'
import { useResumeStore } from '@/store/resumeStore'

export default function SaveButton() {
  const syncStatus = useResumeStore((s) => s.syncStatus)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openAuthModal = useAuthModalStore((s) => s.openModal)

  const handleClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login', () => {
        // Başarılı giriş/kayıt sonrası otomatik kaydet
        toast.success('Giriş yapıldı, CV kaydediliyor...')
        void saveResume()
      })
      return
    }
    void saveResume()
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={syncStatus === 'syncing'}
      className="gap-1"
      title={isAuthenticated ? 'Hemen kaydet' : "Kaydetmek için giriş yapın"}
    >
      <Save className="h-3.5 w-3.5" />
      Kaydet
    </Button>
  )
}
