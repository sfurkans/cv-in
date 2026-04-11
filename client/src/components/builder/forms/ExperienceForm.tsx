import { Briefcase } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useResumeStore } from '@/store/resumeStore'

export default function ExperienceForm() {
  const work = useResumeStore((state) => state.resume.work[0])
  const updateWorkItem = useResumeStore((state) => state.updateWorkItem)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Deneyim
        </CardTitle>
        <CardDescription>
          İş deneyimlerini ekle. CV'nin en önemli bölümlerinden biri.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="exp-company">Şirket</Label>
            <Input
              id="exp-company"
              placeholder="Acme Corp."
              value={work?.company ?? ''}
              onChange={(e) => updateWorkItem({ company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-position">Pozisyon</Label>
            <Input
              id="exp-position"
              placeholder="Frontend Developer"
              value={work?.position ?? ''}
              onChange={(e) => updateWorkItem({ position: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="exp-start">Başlangıç</Label>
            <Input
              id="exp-start"
              type="month"
              value={work?.startDate ?? ''}
              onChange={(e) => updateWorkItem({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-end">Bitiş</Label>
            <Input
              id="exp-end"
              type="month"
              value={work?.endDate ?? ''}
              onChange={(e) => updateWorkItem({ endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exp-summary">Özet</Label>
          <Textarea
            id="exp-summary"
            placeholder="Bu pozisyonda neler yaptığını kısaca anlat..."
            className="min-h-20"
            value={work?.summary ?? ''}
            onChange={(e) => updateWorkItem({ summary: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exp-highlights">Öne Çıkanlar</Label>
          <Textarea
            id="exp-highlights"
            placeholder="Her satıra bir başarı yaz&#10;Örn: Mobil sayfa hızını %40 artırdım"
            className="min-h-24"
            value={work?.highlights.join('\n') ?? ''}
            onChange={(e) =>
              updateWorkItem({ highlights: e.target.value.split('\n') })
            }
          />
          <p className="text-xs text-muted-foreground">
            Şimdilik her satıra bir başarı yaz. İleride çoklu öğe desteği
            gelecek.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
