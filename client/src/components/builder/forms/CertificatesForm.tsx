import { zodResolver } from '@hookform/resolvers/zod'
import { Award, Link as LinkIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  certificateSchema,
  type CertificateFormValues,
} from '@/schemas/certificateSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function CertificatesForm() {
  const certificate = useResumeStore(
    (state) => state.resume.certificates[0]
  )
  const updateCertificateItem = useResumeStore(
    (state) => state.updateCertificateItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    mode: 'onChange',
    defaultValues: {
      name: certificate?.name ?? '',
      issuer: certificate?.issuer ?? '',
      date: certificate?.date ?? '',
      url: certificate?.url ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCertificateItem({
        name: watched.name,
        issuer: watched.issuer,
        date: watched.date,
        url: watched.url,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.name,
    watched.issuer,
    watched.date,
    watched.url,
    updateCertificateItem,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Sertifikalar
        </CardTitle>
        <CardDescription>
          Aldığın sertifika ve kursları doğrulama linkleriyle ekle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cert-name">
            Sertifika Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cert-name"
            placeholder="AWS Certified Solutions Architect"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cert-issuer">
              Veren Kurum <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cert-issuer"
              placeholder="Amazon Web Services"
              aria-invalid={!!errors.issuer}
              {...register('issuer')}
            />
            {errors.issuer && (
              <p className="text-xs text-destructive">
                {errors.issuer.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-date">Tarih</Label>
            <Input
              id="cert-date"
              type="month"
              aria-invalid={!!errors.date}
              {...register('date')}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cert-url">Doğrulama Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cert-url"
              type="url"
              placeholder="https://credly.com/badges/..."
              className="pl-9"
              aria-invalid={!!errors.url}
              {...register('url')}
            />
          </div>
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
