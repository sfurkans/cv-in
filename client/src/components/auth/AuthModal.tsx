import { LogIn, UserPlus, X } from 'lucide-react'
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

  const isLogin = tab === 'login'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-foreground/10 animate-in zoom-in-95 slide-in-from-bottom-4 fade-in-0 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-brand-gradient" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:p-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-3 top-3 transition-transform hover:rotate-90"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-3 pr-8">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-primary/25 transition-transform duration-300',
                isLogin ? 'rotate-0' : 'rotate-6',
              )}
            >
              {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="auth-modal-title"
                className="font-heading text-xl font-semibold leading-tight"
              >
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLogin
                  ? "CV'lerini görmek için e-posta ve şifrenle giriş yap."
                  : "Hesap oluşturarak CV'lerini kaydet ve istediğin zaman düzenle."}
              </p>
            </div>
          </div>

          <div
            className="relative mt-5 grid grid-cols-2 rounded-lg bg-muted p-1"
            role="tablist"
          >
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-md bg-background shadow-sm ring-1 ring-foreground/5 transition-transform duration-300 ease-out',
                isLogin ? 'translate-x-0' : 'translate-x-[calc(100%+0.25rem)]',
              )}
            />
            <button
              type="button"
              onClick={() => setTab('login')}
              className={cn(
                'relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isLogin ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={cn(
                'relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                !isLogin ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Kayıt Ol
            </button>
          </div>

          <div
            key={tab}
            className="mt-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
          >
            {isLogin ? (
              <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setTab('register')} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
