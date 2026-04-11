import { zodResolver } from '@hookform/resolvers/zod'
import { Heart, Plus, Trash2 } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  volunteerSchema,
  type VolunteerFormValues,
} from '@/schemas/volunteerSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Volunteer } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function VolunteerItemCard({
  volunteer,
  index,
}: {
  volunteer: Volunteer
  index: number
}) {
  const updateVolunteerAt = useResumeStore((s) => s.updateVolunteerAt)
  const removeVolunteer = useResumeStore((s) => s.removeVolunteer)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    mode: 'onChange',
    defaultValues: {
      organization: volunteer.organization,
      role: volunteer.role,
      startDate: volunteer.startDate,
      endDate: volunteer.endDate,
      summary: volunteer.summary,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateVolunteerAt(volunteer.id, {
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
    updateVolunteerAt,
    volunteer.id,
  ])

  const headerTitle =
    volunteer.organization || volunteer.role
      ? [volunteer.role, volunteer.organization].filter(Boolean).join(' — ')
      : `Gönüllülük #${index + 1}`

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
            onClick={() => removeVolunteer(volunteer.id)}
            aria-label="Gönüllülüğü kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`vol-organization-${volunteer.id}`}>
              Kuruluş <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`vol-organization-${volunteer.id}`}
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
            <Label htmlFor={`vol-role-${volunteer.id}`}>
              Rol <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`vol-role-${volunteer.id}`}
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
            <Label htmlFor={`vol-start-${volunteer.id}`}>Başlangıç</Label>
            <Input
              id={`vol-start-${volunteer.id}`}
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
            <Label htmlFor={`vol-end-${volunteer.id}`}>Bitiş</Label>
            <Input
              id={`vol-end-${volunteer.id}`}
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
          <Label htmlFor={`vol-summary-${volunteer.id}`}>Özet</Label>
          <Textarea
            id={`vol-summary-${volunteer.id}`}
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

export default function VolunteerForm() {
  const volunteer = useResumeStore((s) => s.resume.volunteer)
  const addVolunteer = useResumeStore((s) => s.addVolunteer)
  const reorderVolunteer = useResumeStore((s) => s.reorderVolunteer)

  return (
    <div className="space-y-4">
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
      </Card>

      {volunteer.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Heart className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz gönüllülük eklenmedi.
            </p>
            <Button type="button" onClick={() => addVolunteer()}>
              <Plus className="h-4 w-4" />
              İlk Gönüllülüğünü Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={volunteer.map((v) => v.id)}
            onReorder={reorderVolunteer}
          >
            <div className="space-y-4">
              {volunteer.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <VolunteerItemCard volunteer={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addVolunteer()}
          >
            <Plus className="h-4 w-4" />
            Yeni Gönüllülük Ekle
          </Button>
        </>
      )}
    </div>
  )
}
