import { zodResolver } from '@hookform/resolvers/zod'
import { FolderOpen, Link as LinkIcon } from 'lucide-react'
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
  projectSchema,
  type ProjectFormValues,
} from '@/schemas/projectSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function ProjectsForm() {
  const project = useResumeStore((state) => state.resume.projects[0])
  const updateProjectItem = useResumeStore(
    (state) => state.updateProjectItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      name: project?.name ?? '',
      description: project?.description ?? '',
      url: project?.url ?? '',
      startDate: project?.startDate ?? '',
      endDate: project?.endDate ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProjectItem({
        name: watched.name,
        description: watched.description,
        url: watched.url,
        startDate: watched.startDate,
        endDate: watched.endDate,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.name,
    watched.description,
    watched.url,
    watched.startDate,
    watched.endDate,
    updateProjectItem,
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          Projeler
        </CardTitle>
        <CardDescription>
          Kişisel ya da profesyonel projelerini sergile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="proj-name">
            Proje Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id="proj-name"
            placeholder="CV Builder"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="proj-description">Açıklama</Label>
          <Textarea
            id="proj-description"
            placeholder="Projenin amacını, kullanılan teknolojileri ve katkılarını anlat..."
            className="min-h-24"
            aria-invalid={!!errors.description}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="proj-url">Proje Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="proj-url"
              type="url"
              placeholder="https://github.com/kullanici/proje"
              className="pl-9"
              aria-invalid={!!errors.url}
              {...register('url')}
            />
          </div>
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="proj-start">Başlangıç</Label>
            <Input
              id="proj-start"
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
            <Label htmlFor="proj-end">Bitiş</Label>
            <Input
              id="proj-end"
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
