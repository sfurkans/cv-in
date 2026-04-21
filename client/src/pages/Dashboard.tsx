import {
  Briefcase,
  Edit3,
  FileText,
  GraduationCap,
  Languages as LanguagesIcon,
  LogIn,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import ResumeMiniPreview from '@/components/ResumeMiniPreview'
import { Button } from '@/components/ui/button'
import {
  deleteResume,
  listResumes,
  type ResumeSummary,
} from '@/lib/api/resumes'
import { normalizeError } from '@/lib/apiClient'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { TEMPLATES } from '@/components/preview/templates'
import type { TemplateId } from '@/types/resume'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'

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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isRestoring = useAuthStore((s) => s.isRestoring)
  const userEmail = useAuthStore((s) => s.user?.email)
  const openAuthModal = useAuthModalStore((s) => s.openModal)

  const [resumes, setResumes] = useState<ResumeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
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
  }, [isAuthenticated])

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

  if (isRestoring) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <SkeletonGrid />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <GuestGate
          onLogin={() => openAuthModal('login')}
          onRegister={() => openAuthModal('register')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <DashboardHeader
        email={userEmail ?? ''}
        count={resumes.length}
        loading={loading}
        onCreate={() => navigate('/builder')}
      />

      {loading && <SkeletonGrid />}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && resumes.length === 0 && (
        <EmptyState onCreate={() => navigate('/builder')} />
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

// ============================================================================
// Header
// ============================================================================

interface DashboardHeaderProps {
  email: string
  count: number
  loading: boolean
  onCreate: () => void
}

function DashboardHeader({
  email,
  count,
  loading,
  onCreate,
}: DashboardHeaderProps) {
  return (
    <header className="mb-10 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-accent/5 p-6 shadow-sm sm:mb-12 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          {email && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {email}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            CV’lerim
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">
            {loading
              ? 'Yükleniyor…'
              : count > 0
                ? `${count} CV kayıtlı · son düzenlemeye göre sıralı`
                : 'Henüz CV oluşturmadın — ilk CV’nle başlayalım'}
          </p>
        </div>
        <Button onClick={onCreate} size="lg" className="shrink-0">
          <Plus className="h-4 w-4" />
          Yeni CV Oluştur
        </Button>
      </div>
    </header>
  )
}

// ============================================================================
// Resume card
// ============================================================================

interface ResumeCardProps {
  resume: ResumeSummary
  onDelete: (id: string) => void
  isDeleting: boolean
}

function ResumeCard({ resume, onDelete, isDeleting }: ResumeCardProps) {
  const name = resume.content?.basics?.name?.trim() || 'İsimsiz CV'
  const label = resume.content?.basics?.label?.trim() || ''
  const relative = formatRelative(resume.updatedAt)
  const templateMeta =
    TEMPLATES[resume.templateId as TemplateId] ?? TEMPLATES.classic

  const stats = useMemo(() => computeStats(resume), [resume])

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10',
      )}
    >
      {/* Mini preview — tıklanabilir (düzenleme linki) */}
      <Link
        to={`/builder/${resume.id}`}
        className="relative block bg-gray-50"
        aria-label={`${name} — düzenle`}
      >
        <ResumeMiniPreview summary={resume} />
        <div className="pointer-events-none absolute inset-0 rounded-t-xl ring-1 ring-inset ring-foreground/5" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent opacity-0 transition-opacity group-hover:from-black/20 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-primary" />
          {templateMeta.name}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold leading-tight">{name}</h3>
          {label ? (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {label}
            </p>
          ) : (
            <p className="mt-0.5 truncate text-sm italic text-muted-foreground/70">
              Pozisyon eklenmemiş
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {stats.map((s) => (
              <StatChip key={s.label} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Son düzenleme · {relative}
        </p>

        <div className="mt-auto flex gap-2 pt-1">
          <Link
            to={`/builder/${resume.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Edit3 className="h-3.5 w-3.5" />
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
      </div>
    </article>
  )
}

// ============================================================================
// Stat chips
// ============================================================================

interface StatItem {
  icon: typeof Briefcase
  value: number
  label: string
}

function computeStats(resume: ResumeSummary): StatItem[] {
  const c = resume.content
  const items: StatItem[] = [
    { icon: Briefcase, value: c.work?.length ?? 0, label: 'deneyim' },
    { icon: GraduationCap, value: c.education?.length ?? 0, label: 'eğitim' },
    {
      icon: Wrench,
      value: (c.skills ?? []).reduce(
        (sum, s) => sum + (s.keywords?.length ?? 0),
        0,
      ),
      label: 'yetenek',
    },
    { icon: LanguagesIcon, value: c.languages?.length ?? 0, label: 'dil' },
  ]
  return items.filter((s) => s.value > 0)
}

function StatChip({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Briefcase
  value: number
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium text-foreground/80">
      <Icon className="h-3 w-3 text-muted-foreground" />
      {value} {label}
    </span>
  )
}

// ============================================================================
// Empty / error / skeleton / guest
// ============================================================================

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <div className="aspect-[210/297] w-full animate-pulse bg-muted/40" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted/50" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted/40" />
            <div className="h-8 w-full animate-pulse rounded-md bg-muted/40" />
          </div>
        </div>
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
        Cv-İn ile birkaç dakikada modern, ATS-dostu bir CV hazırla.
        Değişiklikler otomatik kaydolur.
      </p>
      <Button onClick={onCreate} size="lg" className="mt-8">
        <Plus className="h-4 w-4" />
        Yeni CV Oluştur
      </Button>
    </div>
  )
}

function GuestGate({
  onLogin,
  onRegister,
}: {
  onLogin: () => void
  onRegister: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 px-6 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-primary/20">
        <LogIn className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
        CV'lerini görmek için giriş yap
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Kaydettiğin CV'ler hesabına bağlı. Giriş yaparak tüm CV'lerini düzenleyebilir,
        farklı cihazlardan erişebilirsin.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onLogin}>
          <LogIn className="h-4 w-4" />
          Giriş Yap
        </Button>
        <Button size="lg" variant="outline" onClick={onRegister}>
          Hesap Oluştur
        </Button>
      </div>
    </div>
  )
}
