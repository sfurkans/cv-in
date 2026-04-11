import { Check } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { TEMPLATE_LIST } from '@/components/preview/templates'
import { useResumeStore } from '@/store/resumeStore'

export default function TemplateSelector() {
  const templateId = useResumeStore((state) => state.resume.templateId)
  const setTemplateId = useResumeStore((state) => state.setTemplateId)

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div>
          <h3 className="text-sm font-medium">Şablon</h3>
          <p className="text-xs text-muted-foreground">
            CV'nin görsel düzenini seç. İçeriğin korunur.
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
                className={`relative flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors ${
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <span className="text-sm font-semibold">{template.name}</span>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  {template.description}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
