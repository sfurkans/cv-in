import { ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_LIST.map((template) => (
          <article
            key={template.id}
            className="group flex flex-col rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <TemplateThumbnail
              templateId={template.id}
              className="shadow-md transition-transform group-hover:scale-[1.02]"
            />
            <div className="mt-5 flex-1 px-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {template.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {template.description}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => handleStart(template.id, false)}
                size="sm"
                className="flex-1"
              >
                Bu şablonla başla
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => handleStart(template.id, true)}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Örnekle dene
              </Button>
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
