import { Upload, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function PhotoUpload() {
  return (
    <div className="space-y-2">
      <Label>Profil Fotoğrafı</Label>
      <div className="flex items-center gap-4 rounded-lg border border-dashed border-input bg-muted/30 p-4">
        {/* Önizleme alanı */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background">
          <UserCircle2 className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* Drop zone + buton */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4" />
              Dosya Seç
            </Button>
            <span className="text-xs text-muted-foreground">
              veya buraya sürükle bırak
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG veya WebP — maksimum 2MB
          </p>
        </div>
      </div>
    </div>
  )
}
