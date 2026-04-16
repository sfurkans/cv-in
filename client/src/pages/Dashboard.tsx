import { Edit, FileText, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  deleteResume,
  listResumes,
  type ResumeSummary,
} from '@/lib/api/resumes'
import { normalizeError } from '@/lib/apiClient'
import { resolvePhotoUrl } from '@/lib/photoUrl'
import { toast } from '@/lib/toast'

export default function Dashboard() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<ResumeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listResumes()
      .then((data) => {
        if (cancelled) return
        setResumes(data)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(normalizeError(err).message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu CV'yi silmek istediğine emin misin?")) return
    setDeletingId(id)
    try {
      await deleteResume(id)
      setResumes((prev) => prev.filter((r) => r.id !== id))
      toast.success('CV silindi')
    } catch (err) {
      toast.error('CV silinemedi: ' + normalizeError(err).message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CV'lerim</h1>
          <p className="text-sm text-muted-foreground">
            {resumes.length > 0
              ? `${resumes.length} CV kayıtlı`
              : 'Henüz CV yaratmadın'}
          </p>
        </div>
        <Button onClick={() => navigate('/builder')}>
          <Plus className="h-4 w-4" />
          Yeni CV
        </Button>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Yükleniyor...
        </div>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">
            CV listesi yüklenemedi: {error}
            <p className="mt-2 text-xs text-muted-foreground">
              Backend çalışmıyor olabilir. `cd server && npm run dev` komutuyla
              başlatıldığından emin ol.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && resumes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-lg font-medium">Henüz CV yok</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              İlk CV'ni oluşturmak için yukarıdaki "Yeni CV" butonuna bas.
              Değişikliklerin otomatik kaydedilecek.
            </p>
            <Button onClick={() => navigate('/builder')} className="mt-2">
              <Plus className="h-4 w-4" />
              İlk CV'ni Yarat
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onDelete={handleDelete}
              isDeleting={deletingId === r.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ResumeCardProps {
  resume: ResumeSummary
  onDelete: (id: string) => void
  isDeleting: boolean
}

function ResumeCard({ resume, onDelete, isDeleting }: ResumeCardProps) {
  const name = resume.content?.basics?.name?.trim() || 'İsimsiz CV'
  const label = resume.content?.basics?.label?.trim() || ''
  const date = new Date(resume.updatedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const photo = resume.photoUrl
    ? resolvePhotoUrl(resume.photoUrl)
    : resume.content?.basics?.photo
      ? resolvePhotoUrl(resume.content.basics.photo)
      : ''

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <FileText className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{name}</CardTitle>
            {label && (
              <p className="truncate text-xs text-muted-foreground">
                {label}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Son: {date}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2 pt-0">
        <Link
          to={`/builder/${resume.id}`}
          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Edit className="h-3.5 w-3.5" />
          Düzenle
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(resume.id)}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Sil"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
