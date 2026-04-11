import { Mail, Phone, User } from 'lucide-react'

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

import PhotoUpload from './PhotoUpload'
import SocialLinksInput from './SocialLinksInput'

export default function PersonalInfoForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Kişisel Bilgiler
        </CardTitle>
        <CardDescription>
          CV'nin en üst kısmında görünecek temel bilgiler.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PhotoUpload />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" placeholder="Furkan Yılmaz" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Ünvan</Label>
            <Input id="label" placeholder="Frontend Developer" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="furkan@example.com"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+90 555 123 45 67"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Kısa Özet</Label>
          <Textarea
            id="summary"
            placeholder="Kendinden, deneyimlerinden ve hedeflerinden kısaca bahset..."
            className="min-h-28"
          />
        </div>

        <SocialLinksInput />
      </CardContent>
    </Card>
  )
}
