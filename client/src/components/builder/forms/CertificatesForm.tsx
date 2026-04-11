import { Award, Link as LinkIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CertificatesForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Sertifikalar
        </CardTitle>
        <CardDescription>
          Aldığın sertifika ve kursları doğrulama linkleriyle ekle.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cert-name">Sertifika Adı</Label>
          <Input
            id="cert-name"
            placeholder="AWS Certified Solutions Architect"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cert-issuer">Veren Kurum</Label>
            <Input id="cert-issuer" placeholder="Amazon Web Services" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-date">Tarih</Label>
            <Input id="cert-date" type="month" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cert-url">Doğrulama Linki</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cert-url"
              type="url"
              placeholder="https://credly.com/badges/..."
              className="pl-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
