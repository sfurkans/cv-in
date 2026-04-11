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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { sampleResume } from '@/lib/sampleResume'
import { useResumeStore } from '@/store/resumeStore'

const features = [
  {
    icon: Zap,
    title: 'Canlı Önizleme',
    description:
      'Yazdığın her şey sağ tarafta anında A4 formatında görünür. Ne yazdığını görerek tasarımını mükemmelleştir.',
  },
  {
    icon: Shield,
    title: 'Gizlilik Öncelikli',
    description:
      'Hesap açmak yok, kayıt yok. Veriler tarayıcında kalır, istediğin zaman yedekleyebilirsin.',
  },
  {
    icon: Layers,
    title: 'Çoklu Template',
    description:
      'Klasik, modern ve yaratıcı tasarımlar arasında geçiş yap. Her biri ATS dostu ve PDF çıktıya hazır.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description:
      'CV\'ni profesyonel kalitede PDF olarak indir. İş başvurularında kullanıma hazır.',
  },
  {
    icon: FileText,
    title: 'JSON Yedek',
    description:
      'CV verini JSON olarak kaydet ve başka bir cihazda tek tıkla geri yükle.',
  },
  {
    icon: Sparkles,
    title: 'Sıfırdan veya Örnekle',
    description:
      'Boş bir sayfadan başla ya da hazır bir örnek CV ile tanışma süreni hızlandır.',
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Ücretsiz · Kayıt gerektirmez · Açık kaynak
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Profesyonel CV'ni{' '}
          <span className="text-primary">dakikalar içinde</span> oluştur
        </h1>

        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          Modern, ATS dostu CV builder. Canlı önizleme ile yazdığın her şeyi
          anında gör, istediğin zaman PDF olarak indir.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={handleStartFresh} className="w-full sm:w-auto">
            Boş Sayfayla Başla
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleStartWithSample}
            className="w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Örnek CV ile Başla
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Hiçbir bilgini sunucuya göndermiyoruz. Veriler tarayıcında kalır.
        </p>
      </section>

      {/* Features */}
      <section className="mt-20 sm:mt-28">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Neden bu CV Builder?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Güzel görünen, hızlı ve gizliliğine saygılı.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="mt-20 sm:mt-28">
        <div className="rounded-2xl border bg-muted/30 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Hazırsan başlayalım
          </h2>
          <p className="mt-3 text-muted-foreground">
            İlk CV'ni birkaç dakikada oluştur. Beğenmezsen istediğin zaman
            değiştirebilirsin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={handleStartFresh}>
              Boş Sayfayla Başla
            </Button>
            <Button size="lg" variant="outline" onClick={handleStartWithSample}>
              <Sparkles className="h-4 w-4" />
              Örnek CV ile Başla
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
