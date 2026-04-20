import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useToastStore, type ToastType } from '@/lib/toast'

const ICONS: Record<ToastType, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
}

const STYLES: Record<ToastType, { ring: string; icon: string }> = {
  info: {
    ring: 'border-l-primary',
    icon: 'text-primary',
  },
  success: {
    ring: 'border-l-accent',
    icon: 'text-accent',
  },
  error: {
    ring: 'border-l-destructive',
    icon: 'text-destructive',
  },
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
        const style = STYLES[t.type]
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex min-w-[280px] max-w-sm items-start gap-2.5 rounded-lg border border-l-4 border-border/60 bg-background p-3 shadow-lg animate-in slide-in-from-right-5 fade-in duration-200',
              style.ring,
            )}
          >
            <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', style.icon)} />
            <p className="flex-1 text-sm leading-relaxed">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Kapat"
              className="shrink-0 rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
