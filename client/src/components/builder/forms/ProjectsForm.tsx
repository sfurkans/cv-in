import { FolderOpen, Link as LinkIcon } from 'lucide-react'

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
import { useResumeStore } from '@/store/resumeStore'

export default function ProjectsForm() {
  const project = useResumeStore((state) => state.resume.projects[0])
  const updateProjectItem = useResumeStore(
    (state) => state.updateProjectItem
  )

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
          <Label htmlFor="proj-name">Proje Adı</Label>
          <Input
            id="proj-name"
            placeholder="CV Builder"
            value={project?.name ?? ''}
            onChange={(e) => updateProjectItem({ name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proj-description">Açıklama</Label>
          <Textarea
            id="proj-description"
            placeholder="Projenin amacını, kullanılan teknolojileri ve katkılarını anlat..."
            className="min-h-24"
            value={project?.description ?? ''}
            onChange={(e) =>
              updateProjectItem({ description: e.target.value })
            }
          />
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
              value={project?.url ?? ''}
              onChange={(e) => updateProjectItem({ url: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="proj-start">Başlangıç</Label>
            <Input
              id="proj-start"
              type="month"
              value={project?.startDate ?? ''}
              onChange={(e) =>
                updateProjectItem({ startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj-end">Bitiş</Label>
            <Input
              id="proj-end"
              type="month"
              value={project?.endDate ?? ''}
              onChange={(e) => updateProjectItem({ endDate: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
