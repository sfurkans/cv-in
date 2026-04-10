import { useState } from 'react'
import BuilderSidebar from '@/components/builder/BuilderSidebar'
import FormPanel from '@/components/builder/FormPanel'
import PreviewPanel from '@/components/builder/PreviewPanel'
import { Button } from '@/components/ui/button'

export default function Builder() {
  const [activeSection, setActiveSection] = useState('personal')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] relative">
      {/* Mobile toolbar */}
      <div className="absolute top-2 left-2 z-10 flex gap-2 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowSidebar(!showSidebar)
            setShowPreview(false)
          }}
        >
          {showSidebar ? '✕ Menü' : '☰ Menü'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowPreview(!showPreview)
            setShowSidebar(false)
          }}
        >
          {showPreview ? '✕ Önizleme' : 'Önizleme'}
        </Button>
      </div>

      {/* Sidebar — desktop: always visible, mobile: toggle */}
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

      {/* Form panel — always visible */}
      <div className="flex-1 pt-12 lg:pt-0">
        <FormPanel activeSection={activeSection} />
      </div>

      {/* Preview — desktop: always visible, mobile: toggle */}
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
