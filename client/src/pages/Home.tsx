import {
  Check,
  Cloud,
  Download,
  Eye,
  FilePlus,
  Layers,
  Palette,
  Save,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { sampleResume } from '@/lib/sampleResume'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'
import { useResumeStore } from '@/store/resumeStore'

const features = [
  {
    icon: Eye,
    title: 'Canlı A4 önizleme',
    description:
      'Yazdığın her kelime gerçek A4 formatında sağda anında belirir. Tasarımı yazarken şekillendir, sürpriz yaşama.',
  },
  {
    icon: Layers,
    title: 'ATS uyumlu şablonlar',
    description:
      'Klasik, modern, yaratıcı ve terminal stilleri — hepsi iş başvuru sistemlerinden (ATS) geçecek şekilde kurgulandı.',
  },
  {
    icon: Download,
    title: 'Profesyonel PDF çıktı',
    description:
      'Türkçe karakter destekli, çok sayfalı, baskı kalitesinde PDF. Tek tıkla indir, başvurunu gönder.',
  },
  {
    icon: Save,
    title: 'Otomatik kayıt & offline',
    description:
      'Her değişiklik arka planda saniyeler içinde kaydedilir. İnternet kesilse bile yazmaya devam edebilirsin.',
  },
  {
    icon: Cloud,
    title: 'Bulut & çoklu cihaz',
    description:
      'İsteğe bağlı hesap aç, CV’lerini buluta al. Farklı cihazlardan aynı hesapla kesintisiz devam et.',
  },
  {
    icon: Palette,
    title: 'Tam özelleştirme',
    description:
      'Bölüm sırasını sürükle-bırak ile düzenle, tema rengini seç, fotoğrafını ekle — CV’ni senin yap.',
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
          Cv-İn
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
            Profesyonel bir CV için ihtiyacın olan her şey tek yerde.
          </p>

          <ul className="mx-auto mt-8 grid max-w-2xl gap-x-8 gap-y-3 text-left sm:grid-cols-2">
            {[
              'ATS uyumlu modern şablonlar',
              'Canlı A4 önizleme',
              'Fotoğraf ve zengin alanlar',
              'Tek tıkla PDF export',
              'Kayıtsız başla ya da hesap aç',
              'Buluta kaydet, her cihazdan eriş',
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-muted-foreground sm:text-base"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-[300px] grid max-w-6xl gap-6 sm:grid-cols-3">
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
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              Özellikler
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Neden{' '}
              <span className="text-brand-gradient">Cv-İn</span>?
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Profesyonel bir CV için gereken her özellik, sade ve hızlı bir arayüzde.
            </p>
          </div>

          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-4 bottom-[calc(50%_+_0.6rem)] left-[calc(33.333%_-_0.417rem)] hidden w-px bg-gradient-to-b from-transparent to-primary/30 lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-[calc(50%_+_0.6rem)] -bottom-4 left-[calc(33.333%_-_0.417rem)] hidden w-px bg-gradient-to-b from-primary/30 to-transparent lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-4 bottom-[calc(50%_+_0.6rem)] left-[calc(66.667%_+_0.417rem)] hidden w-px bg-gradient-to-b from-transparent to-primary/30 lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-[calc(50%_+_0.6rem)] -bottom-4 left-[calc(66.667%_+_0.417rem)] hidden w-px bg-gradient-to-b from-primary/30 to-transparent lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 -left-4 right-[calc(66.667%_+_1.017rem)] hidden h-px bg-gradient-to-r from-transparent to-primary/30 lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-[calc(33.333%_+_0.183rem)] right-[calc(33.333%_+_0.183rem)] hidden h-px bg-primary/30 lg:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-[calc(66.667%_+_1.017rem)] -right-4 hidden h-px bg-gradient-to-r from-primary/30 to-transparent lg:block"
            />
            {features.map(({ icon: Icon, title, description }, i) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 ${
                    i % 2 === 0 ? 'bg-primary/10' : 'bg-accent/10'
                  } opacity-0 group-hover:opacity-100`}
                />
                <div
                  className={`relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    i % 2 === 0
                      ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                      : 'bg-accent/10 text-accent ring-1 ring-accent/20'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
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
      className="group relative flex flex-col items-start gap-5 rounded-2xl border border-border/60 bg-card/70 p-8 text-left backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div
        className={`inline-flex h-16 w-16 items-center justify-center rounded-xl ${
          accent === 'primary'
            ? 'bg-primary/10 text-primary'
            : 'bg-accent/10 text-accent'
        }`}
      >
        <Icon className="h-8 w-8" />
      </div>
      <div className="min-w-0">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="mt-auto text-base font-medium text-primary underline-offset-4 group-hover:underline">
        {cta} →
      </span>
    </button>
  )
}
