import { zodResolver } from '@hookform/resolvers/zod'
import { BookOpen, Link as LinkIcon } from 'lucide-react'
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
  publicationSchema,
  type PublicationFormValues,
} from '@/schemas/publicationSchema'
import { useResumeStore } from '@/store/resumeStore'

const SYNC_DEBOUNCE_MS = 300

export default function PublicationsForm() {
  const publication = useResumeStore(
    (state) => state.resume.publications[0]
  )
  const updatePublicationItem = useResumeStore(
    (state) => state.updatePublicationItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    mode: 'onChange',
    defaultValues: {
      name: publication?.name ?? '',
      publisher: publication?.publisher ?? '',
      date: publication?.date ?? '',
      url: publication?.url ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePublicationItem({
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
    updatePublicationItem,
  ])

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
          <Label htmlFor="pub-name">
            Yayın Adı <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pub-name"
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
            <Label htmlFor="pub-publisher">
              Yayıncı <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pub-publisher"
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
            <Label htmlFor="pub-date">Tarih</Label>
            <Input
              id="pub-date"
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
          <Label htmlFor="pub-url">Erişim Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pub-url"
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
