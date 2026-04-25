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
import type { CefrLevels, CefrSkillKey, Language } from '@/types/resume'

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

const CEFR_SHORT_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

const CEFR_FIELDS: { key: CefrSkillKey; label: string }[] = [
  { key: 'listening', label: 'Dinleme' },
  { key: 'reading', label: 'Okuma' },
  { key: 'spokenInteraction', label: 'Karşılıklı' },
  { key: 'spokenProduction', label: 'Sözlü Üretim' },
  { key: 'writing', label: 'Yazma' },
]

const EMPTY_CEFR: CefrLevels = {
  listening: '',
  reading: '',
  spokenInteraction: '',
  spokenProduction: '',
  writing: '',
}

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
      cefr: language.cefr ?? EMPTY_CEFR,
    },
  })

  const watched = watch()
  const cefrKey = JSON.stringify(watched.cefr ?? null)
  useEffect(() => {
    const timer = setTimeout(() => {
      const cefr = watched.cefr
      const hasAnyCefr =
        cefr && Object.values(cefr).some((v) => typeof v === 'string' && v !== '')
      updateLanguageAt(language.id, {
        name: watched.name,
        proficiency: watched.proficiency,
        cefr: hasAnyCefr ? (cefr as CefrLevels) : undefined,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [watched.name, watched.proficiency, cefrKey, updateLanguageAt, language.id])

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

        <details className="rounded-md border border-border/60">
          <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            Europass için detaylı CEFR seviyeleri (opsiyonel)
          </summary>
          <div className="grid gap-3 border-t border-border/60 p-3 sm:grid-cols-5">
            {CEFR_FIELDS.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label
                  htmlFor={`lang-${language.id}-${key}`}
                  className="text-xs"
                >
                  {label}
                </Label>
                <select
                  id={`lang-${language.id}-${key}`}
                  className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                  {...register(`cefr.${key}` as const)}
                >
                  <option value="">—</option>
                  {CEFR_SHORT_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </details>
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
