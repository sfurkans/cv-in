import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import TemplateThumbnail from '@/components/preview/templates/TemplateThumbnail'
import { TEMPLATE_LIST } from '@/components/preview/templates'
import { Button } from '@/components/ui/button'
import { sampleResume } from '@/lib/sampleResume'
import { useResumeStore } from '@/store/resumeStore'
import type { TemplateId } from '@/types/resume'

export default function Templates() {
  const navigate = useNavigate()
  const loadResume = useResumeStore((state) => state.loadResume)
  const resetResume = useResumeStore((state) => state.resetResume)

  const handleStart = (templateId: TemplateId, withSample: boolean) => {
    if (withSample) {
      loadResume({ ...sampleResume, templateId })
    } else {
      resetResume()
      useResumeStore.getState().setTemplateId(templateId)
    }
    navigate('/builder')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gradient" />
          3 şablon · ATS-dostu · PDF hazır
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Kendi tarzına uyan{' '}
          <span className="text-brand-gradient">şablonu</span> seç
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Üç farklı tasarım dili, tek bir içerik. İstediğin zaman geçiş
          yapabilirsin — CV’n aynı kalır, görünümü değişir.
        </p>
      </header>

      <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">
        {TEMPLATE_LIST.map((template, index) => (
          <article
            key={template.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
          >
            {/* Üst gradient aksan çizgisi — sadece hover'da */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Thumbnail alanı — dekoratif arkaplan */}
            <div className="relative overflow-hidden bg-gradient-to-br from-muted/40 via-muted/15 to-background px-7 pb-11 pt-9">
              {/* Nokta deseni */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Numara rozeti */}
              <div className="absolute right-5 top-5 z-10 rounded-full border border-border/60 bg-background/90 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.15em] text-muted-foreground shadow-sm backdrop-blur">
                {String(index + 1).padStart(2, '0')} / {String(TEMPLATE_LIST.length).padStart(2, '0')}
              </div>

              {/* ATS rozeti */}
              {template.ats && (
                <div className="absolute left-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm backdrop-blur dark:text-emerald-400">
                  <ShieldCheck className="h-3 w-3" />
                  ATS Uyumlu
                </div>
              )}

              {/* Glow — hover'da beliren yumuşak ışık */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Thumbnail */}
              <div className="relative mx-auto max-w-[260px] transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.03]">
                <TemplateThumbnail
                  templateId={template.id}
                  className="shadow-lg shadow-foreground/10 ring-1 ring-foreground/5 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/15"
                />
              </div>
            </div>

            {/* İçerik */}
            <div className="flex flex-1 flex-col gap-6 p-7">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {template.name}
                  </h2>
                  <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                    Şablon
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
              </div>

              {/* İnce ayırıcı — mt-auto ile butonları kartın tabanına sabitler */}
              <div className="mt-auto h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Aksiyonlar */}
              <div className="flex gap-2.5">
                <Button
                  onClick={() => handleStart(template.id, false)}
                  className="h-11 flex-1 text-[15px] shadow-sm shadow-primary/20 [&_svg:not([class*='size-'])]:size-4"
                >
                  Bu şablonla başla
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button
                  onClick={() => handleStart(template.id, true)}
                  variant="outline"
                  className="h-11 flex-1 text-[15px] [&_svg:not([class*='size-'])]:size-4"
                >
                  <Sparkles className="h-4 w-4" />
                  Örnekle dene
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Beğendiğin bir şablonu seçtikten sonra CV oluşturucuda istediğin zaman
          değiştirebilirsin. İçeriğin korunur, sadece görünüm değişir.
        </p>
      </div>
    </div>
  )
}
