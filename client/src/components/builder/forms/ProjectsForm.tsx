import { zodResolver } from '@hookform/resolvers/zod'
import { FolderOpen, Link as LinkIcon, Plus, Trash2 } from 'lucide-react'
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
  projectSchema,
  type ProjectFormValues,
} from '@/schemas/projectSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Project } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function ProjectItemCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const updateProjectAt = useResumeStore((s) => s.updateProjectAt)
  const removeProject = useResumeStore((s) => s.removeProject)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      name: project.name,
      description: project.description,
      url: project.url,
      startDate: project.startDate,
      endDate: project.endDate,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateProjectAt(project.id, {
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
    updateProjectAt,
    project.id,
  ])

  const headerTitle = project.name || `Proje #${index + 1}`

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
            onClick={() => removeProject(project.id)}
            aria-label="Projeyi kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`proj-name-${project.id}`}>
            Proje Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`proj-name-${project.id}`}
            placeholder="CV Builder"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`proj-description-${project.id}`}>Açıklama</Label>
          <Textarea
            id={`proj-description-${project.id}`}
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
          <Label htmlFor={`proj-url-${project.id}`}>Proje Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`proj-url-${project.id}`}
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
            <Label htmlFor={`proj-start-${project.id}`}>Başlangıç</Label>
            <Input
              id={`proj-start-${project.id}`}
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
            <Label htmlFor={`proj-end-${project.id}`}>Bitiş</Label>
            <Input
              id={`proj-end-${project.id}`}
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

export default function ProjectsForm() {
  const projects = useResumeStore((s) => s.resume.projects)
  const addProject = useResumeStore((s) => s.addProject)
  const reorderProjects = useResumeStore((s) => s.reorderProjects)

  return (
    <div className="space-y-4">
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
      </Card>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz proje eklenmedi.
            </p>
            <Button type="button" onClick={() => addProject()}>
              <Plus className="h-4 w-4" />
              İlk Projeni Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={projects.map((p) => p.id)}
            onReorder={reorderProjects}
          >
            <div className="space-y-4">
              {projects.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <ProjectItemCard project={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addProject()}
          >
            <Plus className="h-4 w-4" />
            Yeni Proje Ekle
          </Button>
        </>
      )}
    </div>
  )
}
