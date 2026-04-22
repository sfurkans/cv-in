import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeError } from '@/lib/apiClient'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const registerFormSchema = z
  .object({
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z.string().min(8, 'Şifre en az 8 karakter olmalı').max(128),
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: 'Şifreler eşleşmiyor',
    path: ['passwordConfirm'],
  })

type RegisterFormValues = z.infer<typeof registerFormSchema>

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-muted' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: 'Zayıf', color: 'bg-destructive' }
  if (score <= 3) return { score: 3, label: 'Orta', color: 'bg-amber-500' }
  return { score: 5, label: 'Güçlü', color: 'bg-emerald-500' }
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const registerAction = useAuthStore((s) => s.register)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  })

  const passwordValue = watch('password')
  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await registerAction(values.email, values.password)
      onSuccess()
    } catch (err) {
      setServerError(normalizeError(err).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="reg-email">E-posta</Label>
        <div className="group relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="ornek@email.com"
            {...register('email')}
            aria-invalid={errors.email ? true : undefined}
            className="h-10 pl-9"
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3 w-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Şifre</Label>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="En az 8 karakter"
            {...register('password')}
            aria-invalid={errors.password ? true : undefined}
            className="h-10 pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordValue && (
          <div className="flex items-center gap-2 pt-0.5 animate-in fade-in-0 duration-200">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i <= strength.score ? strength.color : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <span className="min-w-10 text-xs font-medium text-muted-foreground">
              {strength.label}
            </span>
          </div>
        )}
        {errors.password && (
          <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3 w-3" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password-confirm">Şifre (tekrar)</Label>
        <div className="group relative">
          <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            id="reg-password-confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Şifreyi tekrar gir"
            {...register('passwordConfirm')}
            aria-invalid={errors.passwordConfirm ? true : undefined}
            className="h-10 pl-9 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((v) => !v)}
            aria-label={showPasswordConfirm ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3 w-3" />
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>

      {serverError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full bg-brand-gradient font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 disabled:shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kayıt yapılıyor...
          </>
        ) : (
          'Hesap Oluştur'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
        >
          Giriş yap
        </button>
      </p>
    </form>
  )
}
