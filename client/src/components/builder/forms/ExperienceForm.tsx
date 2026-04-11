import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Plus, Trash2 } from 'lucide-react'
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
import { workSchema, type WorkFormValues } from '@/schemas/workSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Work } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

interface WorkItemCardProps {
  work: Work
  index: number
}

function WorkItemCard({ work, index }: WorkItemCardProps) {
  const updateWorkAt = useResumeStore((state) => state.updateWorkAt)
  const removeWork = useResumeStore((state) => state.removeWork)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    mode: 'onChange',
    defaultValues: {
      company: work.company,
      position: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
      summary: work.summary,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateWorkAt(work.id, {
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
    updateWorkAt,
    work.id,
  ])

  const headerTitle =
    work.company || work.position
      ? [work.position, work.company].filter(Boolean).join(' — ')
      : `Deneyim #${index + 1}`

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
            onClick={() => removeWork(work.id)}
            aria-label="Deneyimi kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`exp-company-${work.id}`}>
              Şirket <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`exp-company-${work.id}`}
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
            <Label htmlFor={`exp-position-${work.id}`}>
              Pozisyon <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`exp-position-${work.id}`}
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
            <Label htmlFor={`exp-start-${work.id}`}>Başlangıç</Label>
            <Input
              id={`exp-start-${work.id}`}
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
            <Label htmlFor={`exp-end-${work.id}`}>Bitiş</Label>
            <Input
              id={`exp-end-${work.id}`}
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
          <Label htmlFor={`exp-summary-${work.id}`}>Özet</Label>
          <Textarea
            id={`exp-summary-${work.id}`}
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
          <Label htmlFor={`exp-highlights-${work.id}`}>Öne Çıkanlar</Label>
          <Textarea
            id={`exp-highlights-${work.id}`}
            placeholder="Her satıra bir başarı yaz&#10;Örn: Mobil sayfa hızını %40 artırdım"
            className="min-h-24"
            value={work.highlights.join('\n')}
            onChange={(e) =>
              updateWorkAt(work.id, {
                highlights: e.target.value.split('\n'),
              })
            }
          />
          <p className="text-xs text-muted-foreground">
            Her satıra bir başarı yaz.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ExperienceForm() {
  const work = useResumeStore((state) => state.resume.work)
  const addWork = useResumeStore((state) => state.addWork)
  const reorderWork = useResumeStore((state) => state.reorderWork)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Deneyim
          </CardTitle>
          <CardDescription>
            İş deneyimlerini ekle. En güncel deneyim en üstte olacak şekilde
            sıralayabilirsin.
          </CardDescription>
        </CardHeader>
      </Card>

      {work.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz deneyim eklenmedi.
            </p>
            <Button type="button" onClick={() => addWork()}>
              <Plus className="h-4 w-4" />
              İlk Deneyimini Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={work.map((w) => w.id)}
            onReorder={reorderWork}
          >
            <div className="space-y-4">
              {work.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <WorkItemCard work={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addWork()}
          >
            <Plus className="h-4 w-4" />
            Yeni Deneyim Ekle
          </Button>
        </>
      )}
    </div>
  )
}
