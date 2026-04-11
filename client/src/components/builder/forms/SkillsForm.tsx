import { Plus, Sparkles, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

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
import { useResumeStore } from '@/store/resumeStore'

const sampleProficiencies: Array<{ name: string; level: number }> = [
  { name: 'Frontend Development', level: 5 },
  { name: 'Backend Development', level: 4 },
  { name: 'Database Design', level: 3 },
]

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

export default function SkillsForm() {
  const keywords = useResumeStore(
    (state) => state.resume.skills[0]?.keywords ?? []
  )
  const addSkillKeyword = useResumeStore((state) => state.addSkillKeyword)
  const removeSkillKeywordAt = useResumeStore(
    (state) => state.removeSkillKeywordAt
  )

  const [draft, setDraft] = useState('')

  const handleAdd = () => {
    if (!draft.trim()) return
    addSkillKeyword(draft)
    setDraft('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Yetenekler
        </CardTitle>
        <CardDescription>
          Teknolojiler, araçlar ve uzmanlık alanların.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tag-style chip alanı */}
        <div className="space-y-3">
          <Label>Etiketler</Label>
          <div className="flex min-h-16 flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
            {keywords.length === 0 ? (
              <p className="self-center text-xs text-muted-foreground">
                Henüz yetenek eklenmedi. Aşağıdaki kutuya yazıp Enter'a bas.
              </p>
            ) : (
              keywords.map((keyword, index) => (
                <Badge
                  key={`${keyword}-${index}`}
                  variant="secondary"
                  className="h-7 gap-1.5 px-3 text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    className="rounded-full hover:bg-foreground/10"
                    aria-label={`${keyword} kaldır`}
                    onClick={() => removeSkillKeywordAt(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Yeni yetenek ekle (ör: Docker)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4" />
              Ekle
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter'a basarak hızlıca ekleyebilirsin. Aynı yetenek iki kez
            eklenmez.
          </p>
        </div>

        {/* Proficiency listesi — Phase 5'te dinamik olacak */}
        <div className="space-y-3">
          <Label>Uzmanlık Seviyeleri</Label>
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            {sampleProficiencies.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2"
              >
                <span className="text-sm font-medium">{skill.name}</span>
                <ProficiencyDots level={skill.level} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Seviye girişleri Phase 5'te dinamik olarak düzenlenebilecek.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
