import { WifiOff } from 'lucide-react'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-900"
    >
      <WifiOff className="h-3.5 w-3.5" />
      <span>
        İnternet bağlantısı yok — değişiklikler yerel olarak saklanıyor,
        bağlantı gelince otomatik senkronlanacak.
      </span>
    </div>
  )
}
