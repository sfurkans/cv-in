import { WifiOff } from 'lucide-react'

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 bg-yellow-500 px-4 py-2 text-sm font-medium text-yellow-950"
    >
      <WifiOff className="h-4 w-4" />
      <span>
        Internet bağlantısı yok — değişiklikler yerel olarak saklanıyor,
        bağlantı gelince otomatik senkronlanacak.
      </span>
    </div>
  )
}
