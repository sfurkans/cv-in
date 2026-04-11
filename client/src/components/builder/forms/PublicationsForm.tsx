import { BookOpen, Link as LinkIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'

export default function PublicationsForm() {
  const publication = useResumeStore(
    (state) => state.resume.publications[0]
  )
  const updatePublicationItem = useResumeStore(
    (state) => state.updatePublicationItem
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Yayınlar
        </CardTitle>
        <CardDescription>
          Yazdığın makale, blog yazısı veya akademik yayınları ekle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pub-name">Yayın Adı</Label>
          <Input
            id="pub-name"
            placeholder="React 19'da Yenilikler"
            value={publication?.name ?? ''}
            onChange={(e) => updatePublicationItem({ name: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pub-publisher">Yayıncı</Label>
            <Input
              id="pub-publisher"
              placeholder="Medium / Dev.to"
              value={publication?.publisher ?? ''}
              onChange={(e) =>
                updatePublicationItem({ publisher: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pub-date">Tarih</Label>
            <Input
              id="pub-date"
              type="month"
              value={publication?.date ?? ''}
              onChange={(e) =>
                updatePublicationItem({ date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pub-url">Erişim Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pub-url"
              type="url"
              placeholder="https://medium.com/@kullanici/yazi"
              className="pl-9"
              value={publication?.url ?? ''}
              onChange={(e) => updatePublicationItem({ url: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
