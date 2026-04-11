import { zodResolver } from '@hookform/resolvers/zod'
import { Heart } from 'lucide-react'
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
import {
  volunteerSchema,
  type VolunteerFormValues,
} from '@/schemas/volunteerSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function VolunteerForm() {
  const volunteer = useResumeStore((state) => state.resume.volunteer[0])
  const updateVolunteerItem = useResumeStore(
    (state) => state.updateVolunteerItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    mode: 'onChange',
    defaultValues: {
      organization: volunteer?.organization ?? '',
      role: volunteer?.role ?? '',
      startDate: volunteer?.startDate ?? '',
      endDate: volunteer?.endDate ?? '',
      summary: volunteer?.summary ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateVolunteerItem({
        organization: watched.organization,
        role: watched.role,
        startDate: watched.startDate,
        endDate: watched.endDate,
        summary: watched.summary,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.organization,
    watched.role,
    watched.startDate,
    watched.endDate,
    watched.summary,
    updateVolunteerItem,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Gönüllülük
        </CardTitle>
        <CardDescription>
          Katkıda bulunduğun gönüllü çalışmalar ve sosyal sorumluluk
          projelerin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vol-organization">
              Kuruluş <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vol-organization"
              placeholder="LÖSEV"
              aria-invalid={!!errors.organization}
              {...register('organization')}
            />
            {errors.organization && (
              <p className="text-xs text-destructive">
                {errors.organization.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="vol-role">
              Rol <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vol-role"
              placeholder="Proje Koordinatörü"
              aria-invalid={!!errors.role}
              {...register('role')}
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vol-start">Başlangıç</Label>
            <Input
              id="vol-start"
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
            <Label htmlFor="vol-end">Bitiş</Label>
            <Input
              id="vol-end"
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
          <Label htmlFor="vol-summary">Özet</Label>
          <Textarea
            id="vol-summary"
            placeholder="Bu gönüllülükte neler yaptığını, etkisini ve katkını anlat..."
            className="min-h-24"
            aria-invalid={!!errors.summary}
            {...register('summary')}
          />
          {errors.summary && (
            <p className="text-xs text-destructive">
              {errors.summary.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
