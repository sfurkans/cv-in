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

export default function PublicationsForm() {
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
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pub-publisher">Yayıncı</Label>
            <Input id="pub-publisher" placeholder="Medium / Dev.to" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pub-date">Tarih</Label>
            <Input id="pub-date" type="month" />
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
