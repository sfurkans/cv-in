import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Link as LinkIcon, Plus, Trash2 } from 'lucide-react'
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
  publicationSchema,
  type PublicationFormValues,
} from '@/schemas/publicationSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Publication } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

function PublicationItemCard({
  publication,
  index,
}: {
  publication: Publication
  index: number
}) {
  const updatePublicationAt = useResumeStore(
    (s) => s.updatePublicationAt
  )
  const removePublication = useResumeStore((s) => s.removePublication)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    mode: 'onChange',
    defaultValues: {
      name: publication.name,
      publisher: publication.publisher,
      date: publication.date,
      url: publication.url,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePublicationAt(publication.id, {
        name: watched.name,
        publisher: watched.publisher,
        date: watched.date,
        url: watched.url,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [
    watched.name,
    watched.publisher,
    watched.date,
    watched.url,
    updatePublicationAt,
    publication.id,
  ])

  const headerTitle = publication.name || `Yayın #${index + 1}`

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
            onClick={() => removePublication(publication.id)}
            aria-label="Yayını kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`pub-name-${publication.id}`}>
            Yayın Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`pub-name-${publication.id}`}
            placeholder="React 19'da Yenilikler"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`pub-publisher-${publication.id}`}>
              Yayıncı <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`pub-publisher-${publication.id}`}
              placeholder="Medium / Dev.to"
              aria-invalid={!!errors.publisher}
              {...register('publisher')}
            />
            {errors.publisher && (
              <p className="text-xs text-destructive">
                {errors.publisher.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`pub-date-${publication.id}`}>Tarih</Label>
            <Input
              id={`pub-date-${publication.id}`}
              type="month"
              aria-invalid={!!errors.date}
              {...register('date')}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`pub-url-${publication.id}`}>Erişim Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`pub-url-${publication.id}`}
              type="url"
              placeholder="https://medium.com/@kullanici/yazi"
              className="pl-9"
              aria-invalid={!!errors.url}
              {...register('url')}
            />
          </div>
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PublicationsForm() {
  const publications = useResumeStore((s) => s.resume.publications)
  const addPublication = useResumeStore((s) => s.addPublication)
  const reorderPublications = useResumeStore((s) => s.reorderPublications)

  return (
    <div className="space-y-4">
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
      </Card>

      {publications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz yayın eklenmedi.
            </p>
            <Button type="button" onClick={() => addPublication()}>
              <Plus className="h-4 w-4" />
              İlk Yayınını Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={publications.map((p) => p.id)}
            onReorder={reorderPublications}
          >
            <div className="space-y-4">
              {publications.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <PublicationItemCard publication={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addPublication()}
          >
            <Plus className="h-4 w-4" />
            Yeni Yayın Ekle
          </Button>
        </>
      )}
    </div>
  )
}
