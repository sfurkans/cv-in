import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  basicsTextSchema,
  type BasicsTextFormValues,
} from '@/schemas/basicsSchema'
import { useResumeStore } from '@/store/resumeStore'

import PhotoUpload from './PhotoUpload'
import SocialLinksInput from './SocialLinksInput'

const SYNC_DEBOUNCE_MS = 300

export default function PersonalInfoForm() {
  const basics = useResumeStore((state) => state.resume.basics)
  const updateBasics = useResumeStore((state) => state.updateBasics)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<BasicsTextFormValues>({
    resolver: zodResolver(basicsTextSchema),
    mode: 'onChange',
    defaultValues: {
      name: basics.name,
      label: basics.label,
      email: basics.email,
      phone: basics.phone,
      summary: basics.summary,
    },
  })

  // Debounced sync — kullanıcı yazmayı bıraktıktan SYNC_DEBOUNCE_MS sonra
  // store güncellenir. Canlı preview için yine hızlı (300ms algılanmıyor).
  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateBasics({
        name: watched.name,
        label: watched.label,
        email: watched.email,
        phone: watched.phone,
        summary: watched.summary,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.name,
    watched.label,
    watched.email,
    watched.phone,
    watched.summary,
    updateBasics,
  ])

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          CV’nin en üst kısmında görünecek temel bilgiler.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PhotoUpload />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Ad Soyad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Furkan Yılmaz"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Ünvan</Label>
            <Input
              id="label"
              placeholder="Frontend Developer"
              aria-invalid={!!errors.label}
              {...register('label')}
            />
            {errors.label && (
              <p className="text-xs text-destructive">
                {errors.label.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="furkan@example.com"
                className="pl-9"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+90 555 123 45 67"
                className="pl-9"
                aria-invalid={!!errors.phone}
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Kısa Özet</Label>
          <Textarea
            id="summary"
            placeholder="Kendinden, deneyimlerinden ve hedeflerinden kısaca bahset..."
            className="min-h-28"
            aria-invalid={!!errors.summary}
            {...register('summary')}
          />
          {errors.summary && (
            <p className="text-xs text-destructive">{errors.summary.message}</p>
          )}
        </div>

        <SocialLinksInput />
      </CardContent>
    </Card>
  )
}
