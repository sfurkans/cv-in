import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { workSchema, type WorkFormValues } from '@/schemas/workSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function ExperienceForm() {
  const work = useResumeStore((state) => state.resume.work[0])
  const updateWorkItem = useResumeStore((state) => state.updateWorkItem)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    mode: 'onChange',
    defaultValues: {
      company: work?.company ?? '',
      position: work?.position ?? '',
      startDate: work?.startDate ?? '',
      endDate: work?.endDate ?? '',
      summary: work?.summary ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateWorkItem({
        company: watched.company,
        position: watched.position,
        startDate: watched.startDate,
        endDate: watched.endDate,
        summary: watched.summary,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.company,
    watched.position,
    watched.startDate,
    watched.endDate,
    watched.summary,
    updateWorkItem,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Deneyim
        </CardTitle>
        <CardDescription>
          İş deneyimlerini ekle. CV'nin en önemli bölümlerinden biri.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="exp-company">
              Şirket <span className="text-destructive">*</span>
            </Label>
            <Input
              id="exp-company"
              placeholder="Acme Corp."
              aria-invalid={!!errors.company}
              {...register('company')}
            />
            {errors.company && (
              <p className="text-xs text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-position">
              Pozisyon <span className="text-destructive">*</span>
            </Label>
            <Input
              id="exp-position"
              placeholder="Frontend Developer"
              aria-invalid={!!errors.position}
              {...register('position')}
            />
            {errors.position && (
              <p className="text-xs text-destructive">
                {errors.position.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="exp-start">Başlangıç</Label>
            <Input
              id="exp-start"
              type="month"
              aria-invalid={!!errors.startDate}
              {...register('startDate')}
            />
            {errors.startDate && (
              <p className="text-xs text-destructive">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-end">Bitiş</Label>
            <Input
              id="exp-end"
              type="month"
              aria-invalid={!!errors.endDate}
              {...register('endDate')}
            />
            {errors.endDate && (
              <p className="text-xs text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exp-summary">Özet</Label>
          <Textarea
            id="exp-summary"
            placeholder="Bu pozisyonda neler yaptığını kısaca anlat..."
            className="min-h-20"
            aria-invalid={!!errors.summary}
            {...register('summary')}
          />
          {errors.summary && (
            <p className="text-xs text-destructive">
              {errors.summary.message}
            </p>
          )}
        </div>

        {/* Highlights — RHF dışında, doğrudan store binding */}
        <div className="space-y-2">
          <Label htmlFor="exp-highlights">Öne Çıkanlar</Label>
          <Textarea
            id="exp-highlights"
            placeholder="Her satıra bir başarı yaz&#10;Örn: Mobil sayfa hızını %40 artırdım"
            className="min-h-24"
            value={work?.highlights.join('\n') ?? ''}
            onChange={(e) =>
              updateWorkItem({ highlights: e.target.value.split('\n') })
            }
          />
          <p className="text-xs text-muted-foreground">
            Şimdilik her satıra bir başarı yaz. İleride çoklu öğe desteği
            gelecek.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
