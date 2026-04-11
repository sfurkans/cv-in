import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
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
  educationSchema,
  type EducationFormValues,
} from '@/schemas/educationSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function EducationForm() {
  const education = useResumeStore((state) => state.resume.education[0])
  const updateEducationItem = useResumeStore(
    (state) => state.updateEducationItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      institution: education?.institution ?? '',
      degree: education?.degree ?? '',
      field: education?.field ?? '',
      startDate: education?.startDate ?? '',
      endDate: education?.endDate ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateEducationItem({
        institution: watched.institution,
        degree: watched.degree,
        field: watched.field,
        startDate: watched.startDate,
        endDate: watched.endDate,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.institution,
    watched.degree,
    watched.field,
    watched.startDate,
    watched.endDate,
    updateEducationItem,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Eğitim
        </CardTitle>
        <CardDescription>
          Mezun olduğun veya devam ettiğin okulları ekle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edu-institution">
            Okul <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edu-institution"
            placeholder="İstanbul Teknik Üniversitesi"
            aria-invalid={!!errors.institution}
            {...register('institution')}
          />
          {errors.institution && (
            <p className="text-xs text-destructive">
              {errors.institution.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edu-degree">Derece</Label>
            <Input
              id="edu-degree"
              placeholder="Lisans"
              aria-invalid={!!errors.degree}
              {...register('degree')}
            />
            {errors.degree && (
              <p className="text-xs text-destructive">
                {errors.degree.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-field">Alan</Label>
            <Input
              id="edu-field"
              placeholder="Bilgisayar Mühendisliği"
              aria-invalid={!!errors.field}
              {...register('field')}
            />
            {errors.field && (
              <p className="text-xs text-destructive">
                {errors.field.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edu-start">Başlangıç</Label>
            <Input
              id="edu-start"
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
            <Label htmlFor="edu-end">Bitiş</Label>
            <Input
              id="edu-end"
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
      </CardContent>
    </Card>
  )
}
