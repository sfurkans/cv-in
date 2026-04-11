import { Heart } from 'lucide-react'

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

export default function VolunteerForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Gönüllülük
        </CardTitle>
        <CardDescription>
          Katkıda bulunduğun gönüllü çalışmalar ve sosyal sorumluluk
          projelerin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vol-organization">Kuruluş</Label>
            <Input id="vol-organization" placeholder="LÖSEV" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vol-role">Rol</Label>
            <Input id="vol-role" placeholder="Proje Koordinatörü" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vol-start">Başlangıç</Label>
            <Input id="vol-start" type="month" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vol-end">Bitiş</Label>
            <Input id="vol-end" type="month" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vol-summary">Özet</Label>
          <Textarea
            id="vol-summary"
            placeholder="Bu gönüllülükte neler yaptığını, etkisini ve katkını anlat..."
            className="min-h-24"
          />
        </div>
      </CardContent>
    </Card>
  )
}
