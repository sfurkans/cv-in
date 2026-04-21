import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeError } from '@/lib/apiClient'
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

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const registerAction = useAuthStore((s) => s.register)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  })

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
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          {...register('email')}
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password">Şifre</Label>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          aria-invalid={errors.password ? true : undefined}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reg-password-confirm">Şifre (tekrar)</Label>
        <Input
          id="reg-password-confirm"
          type="password"
          autoComplete="new-password"
          {...register('passwordConfirm')}
          aria-invalid={errors.passwordConfirm ? true : undefined}
        />
        {errors.passwordConfirm && (
          <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Kayıt yapılıyor...' : 'Hesap Oluştur'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Zaten hesabın var mı?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Giriş yap
        </button>
      </p>
    </form>
  )
}
