import { zodResolver } from '@hookform/resolvers/zod'
import { Languages as LanguagesIcon } from 'lucide-react'
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
  languageSchema,
  type LanguageFormValues,
} from '@/schemas/languageSchema'
import { useResumeStore } from '@/store/resumeStore'

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

export default function LanguagesForm() {
  const language = useResumeStore((state) => state.resume.languages[0])
  const updateLanguageItem = useResumeStore(
    (state) => state.updateLanguageItem
  )

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    mode: 'onChange',
    defaultValues: {
      name: language?.name ?? '',
      proficiency: language?.proficiency ?? '',
    },
  })

  const watched = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      updateLanguageItem({
        name: watched.name,
        proficiency: watched.proficiency,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [watched.name, watched.proficiency, updateLanguageItem])

  return (
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
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lang-name">
              Dil <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lang-name"
              placeholder="İngilizce"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lang-proficiency">Seviye</Label>
            <select
              id="lang-proficiency"
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
