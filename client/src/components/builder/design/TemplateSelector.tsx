import { Check } from 'lucide-react'

import TemplateThumbnail from '@/components/preview/templates/TemplateThumbnail'
import { TEMPLATE_LIST } from '@/components/preview/templates'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useResumeStore } from '@/store/resumeStore'

export default function TemplateSelector() {
  const templateId = useResumeStore((state) => state.resume.templateId)
  const setTemplateId = useResumeStore((state) => state.setTemplateId)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="text-sm font-semibold">Şablon</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            CV’nin görsel düzenini seç. İçeriğin korunur.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {TEMPLATE_LIST.map((template) => {
            const isActive = template.id === templateId
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplateId(template.id)}
                aria-pressed={isActive}
                className={cn(
                  'group relative flex flex-col gap-2 rounded-lg border bg-background p-2 text-left transition-all',
                  isActive
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border/60 hover:border-primary/40 hover:shadow-sm',
                )}
              >
                <TemplateThumbnail
                  templateId={template.id}
                  className="transition-transform group-hover:scale-[1.01]"
                />
                {isActive && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="px-1 pb-0.5">
                  <span className="block text-sm font-semibold">
                    {template.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {template.description}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
