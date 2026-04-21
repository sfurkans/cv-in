import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export type AuthTab = 'login' | 'register'

interface AuthModalProps {
  open: boolean
  defaultTab?: AuthTab
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({
  open,
  defaultTab = 'login',
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab)

  useEffect(() => {
    if (open) setTab(defaultTab)
  }, [open, defaultTab])

  useEffect(() => {
    if (!open) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 shadow-2xl ring-1 ring-foreground/10 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-3 top-3"
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 id="auth-modal-title" className="font-heading text-xl font-semibold">
          {tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {tab === 'login'
            ? "CV'lerini görmek için e-posta ve şifrenle giriş yap."
            : "Hesap oluşturarak CV'lerini kaydet ve istediğin zaman düzenle."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Kayıt Ol
          </button>
        </div>

        <div className="mt-5">
          {tab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setTab('register')} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setTab('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
