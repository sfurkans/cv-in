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

export default function ProjectsForm() {
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
          <Input id="proj-name" placeholder="CV Builder" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proj-description">Açıklama</Label>
          <Textarea
            id="proj-description"
            placeholder="Projenin amacını, kullanılan teknolojileri ve katkılarını anlat..."
            className="min-h-24"
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
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="proj-start">Başlangıç</Label>
            <Input id="proj-start" type="month" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj-end">Bitiş</Label>
            <Input id="proj-end" type="month" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
