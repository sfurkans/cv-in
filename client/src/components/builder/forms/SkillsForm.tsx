import { Plus, Sparkles, X } from 'lucide-react'

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

const sampleSkills = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'Tailwind CSS',
  'Git',
]

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
          <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3 min-h-16">
            {sampleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="h-7 gap-1.5 px-3 text-sm"
              >
                {skill}
                <button
                  type="button"
                  className="rounded-full hover:bg-foreground/10"
                  aria-label={`${skill} kaldır`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input placeholder="Yeni yetenek ekle (ör: Docker)" />
            <Button type="button" variant="outline" className="shrink-0">
              <Plus className="h-4 w-4" />
              Ekle
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter'a basarak hızlıca ekleyebilirsin (yakında aktif olacak).
          </p>
        </div>

        {/* Proficiency listesi */}
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
        </div>
      </CardContent>
    </Card>
  )
}
