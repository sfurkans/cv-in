import { GraduationCap } from 'lucide-react'

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

export default function EducationForm() {
  const education = useResumeStore((state) => state.resume.education[0])
  const updateEducationItem = useResumeStore(
    (state) => state.updateEducationItem
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Eğitim
        </CardTitle>
        <CardDescription>
          Mezun olduğun veya devam ettiğin okulları ekle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edu-institution">Okul</Label>
          <Input
            id="edu-institution"
            placeholder="İstanbul Teknik Üniversitesi"
            value={education?.institution ?? ''}
            onChange={(e) =>
              updateEducationItem({ institution: e.target.value })
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edu-degree">Derece</Label>
            <Input
              id="edu-degree"
              placeholder="Lisans"
              value={education?.degree ?? ''}
              onChange={(e) => updateEducationItem({ degree: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-field">Alan</Label>
            <Input
              id="edu-field"
              placeholder="Bilgisayar Mühendisliği"
              value={education?.field ?? ''}
              onChange={(e) => updateEducationItem({ field: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edu-start">Başlangıç</Label>
            <Input
              id="edu-start"
              type="month"
              value={education?.startDate ?? ''}
              onChange={(e) =>
                updateEducationItem({ startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-end">Bitiş</Label>
            <Input
              id="edu-end"
              type="month"
              value={education?.endDate ?? ''}
              onChange={(e) =>
                updateEducationItem({ endDate: e.target.value })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
