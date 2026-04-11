import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
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
  educationSchema,
  type EducationFormValues,
} from '@/schemas/educationSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Education } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function EducationItemCard({
  education,
  index,
}: {
  education: Education
  index: number
}) {
  const updateEducationAt = useResumeStore((s) => s.updateEducationAt)
  const removeEducation = useResumeStore((s) => s.removeEducation)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startDate: education.startDate,
      endDate: education.endDate,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateEducationAt(education.id, {
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
    updateEducationAt,
    education.id,
  ])

  const headerTitle =
    education.institution ||
    education.degree ||
    `Eğitim #${index + 1}`

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
            onClick={() => removeEducation(education.id)}
            aria-label="Eğitimi kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`edu-institution-${education.id}`}>
            Okul <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`edu-institution-${education.id}`}
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
            <Label htmlFor={`edu-degree-${education.id}`}>Derece</Label>
            <Input
              id={`edu-degree-${education.id}`}
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
            <Label htmlFor={`edu-field-${education.id}`}>Alan</Label>
            <Input
              id={`edu-field-${education.id}`}
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
            <Label htmlFor={`edu-start-${education.id}`}>Başlangıç</Label>
            <Input
              id={`edu-start-${education.id}`}
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
            <Label htmlFor={`edu-end-${education.id}`}>Bitiş</Label>
            <Input
              id={`edu-end-${education.id}`}
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

export default function EducationForm() {
  const education = useResumeStore((s) => s.resume.education)
  const addEducation = useResumeStore((s) => s.addEducation)
  const reorderEducation = useResumeStore((s) => s.reorderEducation)

  return (
    <div className="space-y-4">
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
      </Card>

      {education.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz eğitim eklenmedi.
            </p>
            <Button type="button" onClick={() => addEducation()}>
              <Plus className="h-4 w-4" />
              İlk Eğitimini Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={education.map((e) => e.id)}
            onReorder={reorderEducation}
          >
            <div className="space-y-4">
              {education.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <EducationItemCard education={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addEducation()}
          >
            <Plus className="h-4 w-4" />
            Yeni Eğitim Ekle
          </Button>
        </>
      )}
    </div>
  )
}
