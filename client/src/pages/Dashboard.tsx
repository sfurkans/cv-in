import { Edit, FileText, Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  deleteResume,
  listResumes,
  type ResumeSummary,
} from '@/lib/api/resumes'
import { normalizeError } from '@/lib/apiClient'
import { resolvePhotoUrl } from '@/lib/photoUrl'
import { toast } from '@/lib/toast'

function formatRelative(date: string): string {
  const d = new Date(date)
  const diffMs = Date.now() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 1) return 'Bugün'
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  return d.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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

  const subtitle = loading
    ? 'Yükleniyor…'
    : error
      ? 'Bir sorun oluştu'
      : resumes.length > 0
        ? `${resumes.length} CV kayıtlı, son düzenlemeye göre sıralı`
        : 'Henüz CV oluşturmadın'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            CV’lerim
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button onClick={() => navigate('/builder')} size="lg">
          <Plus className="h-4 w-4" />
          Yeni CV
        </Button>
      </header>

      {loading && <SkeletonGrid />}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && resumes.length === 0 && (
        <EmptyState onCreate={() => navigate('/builder')} />
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-xl border border-border/60 bg-muted/30"
        />
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-sm">
      <p className="font-medium text-destructive">CV listesi yüklenemedi</p>
      <p className="mt-1 text-muted-foreground">{message}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        Backend çalışmıyor olabilir. Sunucu:{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
          cd server && npm run dev
        </code>
      </p>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 px-6 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-primary/20">
        <FileText className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">
        İlk CV’ni oluşturalım
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        cv-in ile birkaç dakikada modern, ATS-dostu bir CV hazırla.
        Değişiklikler otomatik kaydolur.
      </p>
      <Button onClick={onCreate} size="lg" className="mt-8">
        <Plus className="h-4 w-4" />
        Yeni CV Oluştur
      </Button>
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
  const relative = formatRelative(resume.updatedAt)
  const photo = resume.photoUrl
    ? resolvePhotoUrl(resume.photoUrl)
    : resume.content?.basics?.photo
      ? resolvePhotoUrl(resume.content.basics.photo)
      : ''

  return (
    <article className="group relative rounded-xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <FileText className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold leading-tight">{name}</h3>
          {label && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {label}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Son düzenleme · {relative}
          </p>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <Link
          to={`/builder/${resume.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Edit className="h-3.5 w-3.5" />
          Düzenle
        </Link>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(resume.id)}
          disabled={isDeleting}
          className="text-muted-foreground hover:border-destructive/30 hover:text-destructive"
          aria-label={`${name} — sil`}
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </article>
  )
}
