import { zodResolver } from '@hookform/resolvers/zod'
import { Award, Link as LinkIcon, Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
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
import type { Certificate } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function CertificateItemCard({
  certificate,
  index,
}: {
  certificate: Certificate
  index: number
}) {
  const updateCertificateAt = useResumeStore(
    (s) => s.updateCertificateAt
  )
  const removeCertificate = useResumeStore((s) => s.removeCertificate)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    mode: 'onChange',
    defaultValues: {
      name: certificate.name,
      issuer: certificate.issuer,
      date: certificate.date,
      url: certificate.url,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateCertificateAt(certificate.id, {
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
    updateCertificateAt,
    certificate.id,
  ])

  const headerTitle = certificate.name || `Sertifika #${index + 1}`

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {headerTitle}
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeCertificate(certificate.id)}
            aria-label="Sertifikayı kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`cert-name-${certificate.id}`}>
            Sertifika Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`cert-name-${certificate.id}`}
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
            <Label htmlFor={`cert-issuer-${certificate.id}`}>
              Veren Kurum <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`cert-issuer-${certificate.id}`}
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
            <Label htmlFor={`cert-date-${certificate.id}`}>Tarih</Label>
            <Input
              id={`cert-date-${certificate.id}`}
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
          <Label htmlFor={`cert-url-${certificate.id}`}>Doğrulama Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`cert-url-${certificate.id}`}
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

export default function CertificatesForm() {
  const certificates = useResumeStore((s) => s.resume.certificates)
  const addCertificate = useResumeStore((s) => s.addCertificate)
  const reorderCertificates = useResumeStore((s) => s.reorderCertificates)

  return (
    <div className="space-y-4">
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
      </Card>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Award className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz sertifika eklenmedi.
            </p>
            <Button type="button" onClick={() => addCertificate()}>
              <Plus className="h-4 w-4" />
              İlk Sertifikanı Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={certificates.map((c) => c.id)}
            onReorder={reorderCertificates}
          >
            <div className="space-y-4">
              {certificates.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <CertificateItemCard certificate={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addCertificate()}
          >
            <Plus className="h-4 w-4" />
            Yeni Sertifika Ekle
          </Button>
        </>
      )}
    </div>
  )
}
