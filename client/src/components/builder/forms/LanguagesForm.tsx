import { zodResolver } from '@hookform/resolvers/zod'
import { Languages as LanguagesIcon, Plus, Trash2 } from 'lucide-react'
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
  languageSchema,
  type LanguageFormValues,
} from '@/schemas/languageSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Language } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

const proficiencyLevels = [
  { value: 'a1', label: 'A1 — Başlangıç' },
  { value: 'a2', label: 'A2 — Temel' },
  { value: 'b1', label: 'B1 — Orta' },
  { value: 'b2', label: 'B2 — İyi Orta' },
  { value: 'c1', label: 'C1 — İleri' },
  { value: 'c2', label: 'C2 — Üst Düzey' },
  { value: 'native', label: 'Anadil' },
]

function LanguageItemCard({
  language,
  index,
}: {
  language: Language
  index: number
}) {
  const updateLanguageAt = useResumeStore((s) => s.updateLanguageAt)
  const removeLanguage = useResumeStore((s) => s.removeLanguage)

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    mode: 'onChange',
    defaultValues: {
      name: language.name,
      proficiency: language.proficiency,
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateLanguageAt(language.id, {
        name: watched.name,
        proficiency: watched.proficiency,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [watched.name, watched.proficiency, updateLanguageAt, language.id])

  const headerTitle = language.name || `Dil #${index + 1}`

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
            onClick={() => removeLanguage(language.id)}
            aria-label="Dili kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`lang-name-${language.id}`}>
              Dil <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`lang-name-${language.id}`}
              placeholder="İngilizce"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`lang-proficiency-${language.id}`}>Seviye</Label>
            <select
              id={`lang-proficiency-${language.id}`}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              aria-invalid={!!errors.proficiency}
              {...register('proficiency')}
            >
              <option value="">Seviye seç</option>
              {proficiencyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.proficiency && (
              <p className="text-xs text-destructive">
                {errors.proficiency.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LanguagesForm() {
  const languages = useResumeStore((s) => s.resume.languages)
  const addLanguage = useResumeStore((s) => s.addLanguage)
  const reorderLanguages = useResumeStore((s) => s.reorderLanguages)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5 text-primary" />
            Diller
          </CardTitle>
          <CardDescription>
            Konuştuğun dilleri ve yeterlilik seviyelerini ekle.
          </CardDescription>
        </CardHeader>
      </Card>

      {languages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <LanguagesIcon className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz dil eklenmedi.
            </p>
            <Button type="button" onClick={() => addLanguage()}>
              <Plus className="h-4 w-4" />
              İlk Dilini Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={languages.map((l) => l.id)}
            onReorder={reorderLanguages}
          >
            <div className="space-y-4">
              {languages.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <LanguageItemCard language={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addLanguage()}
          >
            <Plus className="h-4 w-4" />
            Yeni Dil Ekle
          </Button>
        </>
      )}
    </div>
  )
}
