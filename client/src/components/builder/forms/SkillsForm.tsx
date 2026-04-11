import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Sparkles, Trash2, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
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
import { skillSchema, type SkillFormValues } from '@/schemas/skillSchema'
import { useResumeStore } from '@/store/resumeStore'
import type { Skill } from '@/types/resume'

import SortableItem from '../dnd/SortableItem'
import SortableList from '../dnd/SortableList'

const SYNC_DEBOUNCE_MS = 300

const LEVEL_OPTIONS = [
  { value: '', label: 'Seviye seç', dots: 0 },
  { value: 'beginner', label: 'Başlangıç', dots: 1 },
  { value: 'basic', label: 'Temel', dots: 2 },
  { value: 'intermediate', label: 'Orta', dots: 3 },
  { value: 'advanced', label: 'İleri', dots: 4 },
  { value: 'expert', label: 'Uzman', dots: 5 },
] as const

function getLevelDots(level: string): number {
  return LEVEL_OPTIONS.find((opt) => opt.value === level)?.dots ?? 0
}

function ProficiencyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < level ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  )
}

function SkillCategoryCard({
  skill,
  index,
}: {
  skill: Skill
  index: number
}) {
  const updateSkillAt = useResumeStore((s) => s.updateSkillAt)
  const removeSkill = useResumeStore((s) => s.removeSkill)
  const addKeywordToSkillAt = useResumeStore(
    (s) => s.addKeywordToSkillAt
  )
  const removeKeywordFromSkillAt = useResumeStore(
    (s) => s.removeKeywordFromSkillAt
  )

  const [draft, setDraft] = useState('')

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    mode: 'onChange',
    defaultValues: {
      name: skill.name,
      level: skill.level,
      keywords: skill.keywords,
    },
  })

  const watchedName = watch('name')
  const watchedLevel = watch('level')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSkillAt(skill.id, {
        name: watchedName,
        level: watchedLevel,
      })
    }, SYNC_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [watchedName, watchedLevel, updateSkillAt, skill.id])

  const handleAddKeyword = () => {
    if (!draft.trim()) return
    addKeywordToSkillAt(skill.id, draft)
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  const headerTitle = skill.name || `Kategori #${index + 1}`
  const levelDots = getLevelDots(skill.level)

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <CardTitle className="truncate text-sm font-medium text-muted-foreground">
              {headerTitle}
            </CardTitle>
            {levelDots > 0 && <ProficiencyDots level={levelDots} />}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeSkill(skill.id)}
            aria-label="Kategoriyi kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`skill-name-${skill.id}`}>Kategori Adı</Label>
            <Input
              id={`skill-name-${skill.id}`}
              placeholder="Frontend Development"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`skill-level-${skill.id}`}>Seviye</Label>
            <select
              id={`skill-level-${skill.id}`}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              aria-invalid={!!errors.level}
              {...register('level')}
            >
              {LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="text-xs text-destructive">
                {errors.level.message}
              </p>
            )}
          </div>
        </div>

        {/* Chip alanı — RHF dışında, doğrudan store */}
        <div className="space-y-2">
          <Label>Etiketler</Label>
          <div className="flex min-h-16 flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
            {skill.keywords.length === 0 ? (
              <p className="self-center text-xs text-muted-foreground">
                Henüz etiket eklenmedi. Aşağıdaki kutuya yazıp Enter'a bas.
              </p>
            ) : (
              skill.keywords.map((keyword, keywordIndex) => (
                <Badge
                  key={`${keyword}-${keywordIndex}`}
                  variant="secondary"
                  className="h-7 gap-1.5 px-3 text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    className="rounded-full hover:bg-foreground/10"
                    aria-label={`${keyword} kaldır`}
                    onClick={() =>
                      removeKeywordFromSkillAt(skill.id, keywordIndex)
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Yeni etiket ekle (ör: React)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={handleAddKeyword}
            >
              <Plus className="h-4 w-4" />
              Ekle
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter'a basarak hızlıca ekleyebilirsin. Aynı etiket iki kez
            eklenmez.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SkillsForm() {
  const skills = useResumeStore((s) => s.resume.skills)
  const addSkill = useResumeStore((s) => s.addSkill)
  const reorderSkills = useResumeStore((s) => s.reorderSkills)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Yetenekler
          </CardTitle>
          <CardDescription>
            Teknolojiler ve uzmanlık alanlarını kategori bazında grupla.
            Örn: Frontend, Backend, Araçlar.
          </CardDescription>
        </CardHeader>
      </Card>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Henüz yetenek kategorisi yok.
            </p>
            <Button type="button" onClick={() => addSkill()}>
              <Plus className="h-4 w-4" />
              İlk Kategoriyi Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <SortableList
            ids={skills.map((s) => s.id)}
            onReorder={reorderSkills}
          >
            <div className="space-y-4">
              {skills.map((item, index) => (
                <SortableItem key={item.id} id={item.id}>
                  <SkillCategoryCard skill={item} index={index} />
                </SortableItem>
              ))}
            </div>
          </SortableList>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => addSkill()}
          >
            <Plus className="h-4 w-4" />
            Yeni Kategori Ekle
          </Button>
        </>
      )}
    </div>
  )
}
