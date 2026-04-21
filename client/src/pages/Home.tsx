import {
  Download,
  FilePlus,
  FileText,
  Layers,
  Sparkles,
  UserPlus,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { sampleResume } from '@/lib/sampleResume'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'
import { useResumeStore } from '@/store/resumeStore'

const features = [
  {
    icon: Zap,
    title: 'Canlı önizleme',
    description:
      'Yazdığın her kelime sağ tarafta anında A4 formatında görünür. Tasarımı yazarken mükemmelleştir.',
  },
  {
    icon: UserPlus,
    title: 'Kaydet, istediğin zaman dön',
    description:
      'İsteğe bağlı hesap aç ve CV’lerini buluta kaydet. Farklı cihazlardan aynı hesabınla eriş.',
  },
  {
    icon: Layers,
    title: 'Çoklu şablon',
    description:
      'Klasik, modern ve yaratıcı tasarımlar arasında geçiş yap. Her biri ATS-dostu ve PDF çıktıya hazır.',
  },
  {
    icon: Download,
    title: 'PDF export',
    description:
      'CV’ni profesyonel kalitede PDF olarak indir. İş başvurularında kullanıma hazır.',
  },
  {
    icon: FileText,
    title: 'JSON yedek',
    description:
      'Verini JSON olarak kaydet, başka bir cihazda tek tıkla geri yükle.',
  },
  {
    icon: Sparkles,
    title: 'Sıfırdan veya örnekle',
    description:
      'Boş bir sayfadan başla ya da hazır bir örnek ile tanışma süreni hızlandır.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const loadResume = useResumeStore((state) => state.loadResume)
  const resetResume = useResumeStore((state) => state.resetResume)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const openAuthModal = useAuthModalStore((state) => state.openModal)

  const handleStartFresh = () => {
    resetResume()
    navigate('/builder')
  }

  const handleStartWithSample = () => {
    loadResume(sampleResume)
    navigate('/builder')
  }

  const handleRegister = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }
    openAuthModal('register')
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-16 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] font-black leading-none tracking-tighter"
          style={{
            backgroundImage:
              'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            opacity: 0.07,
          }}
        >
          cv-in
        </div>

        <svg
          className="absolute inset-x-0 top-[440px] w-full opacity-[0.12]"
          height="240"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="home-wave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 140 C 240 40, 480 200, 720 110 S 1200 40, 1440 150"
            stroke="url(#home-wave)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M0 180 C 240 80, 480 240, 720 150 S 1200 80, 1440 190"
            stroke="url(#home-wave)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        <div
          className="absolute left-1/2 top-[820px] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-primary opacity-[0.05] blur-3xl"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, var(--color-background) 100%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gradient" />
            Ücretsiz · Kayıtsız başla · İstersen hesap aç
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Profesyonel CV’ni <br className="hidden sm:block" />
            <span className="text-brand-gradient">dakikalar içinde</span>{' '}
            oluştur
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Modern, ATS-dostu CV oluşturucu. Yazdıkların canlı önizlemede anında
            görünür, tek tıkla PDF olarak indir. İstersen hesap aç,
            CV’lerini istediğin zaman düzenle.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            <HomeActionCard
              icon={FilePlus}
              title="Boş CV Oluştur"
              description="Sıfırdan başla ve kendi bilgilerini doldur."
              cta="Başla"
              onClick={handleStartFresh}
              accent="primary"
            />
            <HomeActionCard
              icon={Sparkles}
              title="Örnek CV ile Başla"
              description="Hazır bir örnek gör, üzerinden düzenle."
              cta="Örnekle başla"
              onClick={handleStartWithSample}
              accent="accent"
            />
            <HomeActionCard
              icon={UserPlus}
              title={isAuthenticated ? "CV'lerim" : 'Kayıt Ol'}
              description={
                isAuthenticated
                  ? 'Kaydettiğin CV’leri gör ve düzenle.'
                  : 'Hesap aç, CV’lerin kaydedilsin.'
              }
              cta={isAuthenticated ? "CV'lerime git" : 'Kayıt ol'}
              onClick={handleRegister}
              accent="primary"
            />
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Giriş yapmadan çalışabilir, PDF olarak indirebilirsin.
            CV’yi kaydetmek istediğinde hesap oluşturman gerekir.
          </p>
        </section>

        <div
          aria-hidden
          className="mx-auto mt-24 h-px max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent sm:mt-32"
        />

        <section className="mt-12 sm:mt-16">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Neden cv-in?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Güzel görünen, hızlı, kaydedebileceğin bir CV oluşturucu.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <article
                key={title}
                className="group relative rounded-xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ${
                    i % 2 === 0
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/10 text-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div
          aria-hidden
          className="mx-auto mt-24 h-px max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent sm:mt-32"
        />

        <section className="mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-8 text-center shadow-sm backdrop-blur-sm sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient opacity-10 blur-3xl"
            />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Hazırsan başlayalım
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              İlk CV’ni birkaç dakikada oluştur. Beğenmezsen istediğin zaman
              değiştirebilirsin.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={handleStartFresh}>
                <FilePlus className="h-4 w-4" />
                Boş CV Oluştur
              </Button>
              <Button size="lg" variant="outline" onClick={handleStartWithSample}>
                <Sparkles className="h-4 w-4" />
                Örnek CV ile başla
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

interface HomeActionCardProps {
  icon: typeof FilePlus
  title: string
  description: string
  cta: string
  onClick: () => void
  accent: 'primary' | 'accent'
}

function HomeActionCard({
  icon: Icon,
  title,
  description,
  cta,
  onClick,
  accent,
}: HomeActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-5 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${
          accent === 'primary'
            ? 'bg-primary/10 text-primary'
            : 'bg-accent/10 text-accent'
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="mt-auto text-sm font-medium text-primary underline-offset-4 group-hover:underline">
        {cta} →
      </span>
    </button>
  )
}
