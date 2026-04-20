import {
  Download,
  FileText,
  Layers,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { sampleResume } from '@/lib/sampleResume'
import { useResumeStore } from '@/store/resumeStore'

const features = [
  {
    icon: Zap,
    title: 'Canlı önizleme',
    description:
      'Yazdığın her kelime sağ tarafta anında A4 formatında görünür. Tasarımı yazarken mükemmelleştir.',
  },
  {
    icon: Shield,
    title: 'Gizlilik öncelikli',
    description:
      'Hesap açmak yok, kayıt yok. Verilerin tarayıcında kalır, istediğin zaman yedekleyebilirsin.',
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

  const handleStartFresh = () => {
    resetResume()
    navigate('/builder')
  }

  const handleStartWithSample = () => {
    loadResume(sampleResume)
    navigate('/builder')
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklch,_var(--color-primary)_10%,_transparent)_0%,_transparent_60%)]"
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gradient" />
            Ücretsiz · Kayıt yok · Açık kaynak
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Profesyonel CV’ni <br className="hidden sm:block" />
            <span className="text-brand-gradient">dakikalar içinde</span>{' '}
            oluştur
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Modern, ATS-dostu CV oluşturucu. Yazdıkların canlı önizlemede anında
            görünür, sonra tek tıkla PDF olarak indir.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={handleStartFresh}
              className="w-full sm:w-auto"
            >
              Boş sayfayla başla
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleStartWithSample}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Örnek CV ile başla
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Verilerin tarayıcında kalır. Hiçbir şey sunucuya gönderilmez.
          </p>
        </section>

        <section className="mt-24 sm:mt-32">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Neden cv-in?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Güzel görünen, hızlı ve gizliliğine saygılı.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, i) => (
              <article
                key={title}
                className="group relative rounded-xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
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

        <section className="mt-24 sm:mt-32">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 text-center sm:p-14">
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
                Boş sayfayla başla
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
