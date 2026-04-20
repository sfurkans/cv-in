import { Eye, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BuilderSidebar from '@/components/builder/BuilderSidebar'
import FormPanel from '@/components/builder/FormPanel'
import PreviewPanel from '@/components/builder/PreviewPanel'
import { Button } from '@/components/ui/button'
import { useAutosave } from '@/hooks/useAutosave'
import { useBuilderRouteSync } from '@/hooks/useBuilderRouteSync'

export default function Builder() {
  const { id: urlId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useBuilderRouteSync(urlId, navigate)
  useAutosave()
  const [activeSection, setActiveSection] = useState('personal')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="relative flex h-[calc(100dvh-4rem-5rem)] min-h-[520px] bg-muted/20">
      <div className="absolute left-3 top-3 z-10 flex gap-2 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowSidebar((v) => !v)
            setShowPreview(false)
          }}
          className="bg-background/90 backdrop-blur"
        >
          {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menü
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowPreview((v) => !v)
            setShowSidebar(false)
          }}
          className="bg-background/90 backdrop-blur"
        >
          {showPreview ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Önizleme
        </Button>
      </div>

      <div
        className={`absolute inset-y-0 left-0 z-20 bg-background lg:relative lg:block ${
          showSidebar ? 'block' : 'hidden'
        }`}
      >
        <BuilderSidebar
          activeSection={activeSection}
          onSectionChange={(id) => {
            setActiveSection(id)
            setShowSidebar(false)
          }}
        />
      </div>

      <div className="flex-1 overflow-hidden pt-14 lg:pt-0">
        <FormPanel activeSection={activeSection} />
      </div>

      <div
        className={`absolute inset-y-0 right-0 z-20 bg-background lg:relative lg:block ${
          showPreview ? 'block' : 'hidden'
        }`}
      >
        <PreviewPanel />
      </div>
    </div>
  )
}
