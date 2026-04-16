import { Loader2, Trash2, Upload, UserCircle2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { uploadResumePhoto } from '@/lib/api/resumes'
import { normalizeError } from '@/lib/apiClient'
import { resolvePhotoUrl } from '@/lib/photoUrl'
import { saveResume } from '@/lib/sync'
import { toast } from '@/lib/toast'
import { useResumeStore } from '@/store/resumeStore'

const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024

export default function PhotoUpload() {
  const photo = useResumeStore((state) => state.resume.basics.photo)
  const updatePhoto = useResumeStore((state) => state.updatePhoto)

  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = async (file: File) => {
    setError(null)

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setError('Sadece JPG, PNG veya WebP yükleyebilirsin.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Fotoğraf 2MB sınırını aşıyor.')
      return
    }

    setIsUploading(true)
    try {
      // CV henüz backend'de yoksa önce kaydet
      let remoteId = useResumeStore.getState().remoteId
      if (!remoteId) {
        await saveResume()
        remoteId = useResumeStore.getState().remoteId
        if (!remoteId) {
          throw new Error('CV kaydedilemedi, fotoğraf yüklenemiyor')
        }
      }

      const result = await uploadResumePhoto(remoteId, file)
      if (result.photoUrl) {
        updatePhoto(result.photoUrl)
        toast.success('Fotoğraf yüklendi')
      }
    } catch (err) {
      const message = normalizeError(err).message
      setError(message)
      toast.error('Fotoğraf yüklenemedi: ' + message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemove = () => {
    updatePhoto('')
    setError(null)
  }

  return (
    <div className="space-y-2">
      <Label>Profil Fotoğrafı</Label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex items-center gap-4 rounded-lg border border-dashed p-4 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-input bg-muted/30'
        }`}
      >
        {/* Önizleme alanı */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background">
          {photo ? (
            <img
              src={resolvePhotoUrl(photo)}
              alt="Profil önizleme"
              className="h-full w-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        {/* Drop zone + buton */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Dosya Seç
                </>
              )}
            </Button>
            {photo && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Kaldır
              </Button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_FORMATS.join(',')}
              className="hidden"
              onChange={handleChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG veya WebP — maksimum 2MB. Sürükleyip bırakabilirsin.
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}
