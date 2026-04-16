import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { useToastStore, type ToastType } from '@/lib/toast'

const ICONS: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
}

const COLORS: Record<ToastType, string> = {
  info: 'text-blue-600',
  success: 'text-green-600',
  error: 'text-destructive',
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Bildirimler"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type]
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex min-w-[280px] max-w-sm items-start gap-2 rounded-md border bg-background p-3 shadow-lg"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${COLORS[t.type]}`} />
            <p className="flex-1 text-sm">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Kapat"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
