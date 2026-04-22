import { Eye, FileText } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BuilderMobileNav from '@/components/builder/BuilderMobileNav'
import BuilderSidebar from '@/components/builder/BuilderSidebar'
import FormPanel from '@/components/builder/FormPanel'
import PDFExportButton from '@/components/builder/PDFExportButton'
import PreviewPanel from '@/components/builder/PreviewPanel'
import SaveButton from '@/components/builder/SaveButton'
import SyncStatusIndicator from '@/components/builder/SyncStatusIndicator'
import { useAutosave } from '@/hooks/useAutosave'
import { useBuilderRouteSync } from '@/hooks/useBuilderRouteSync'
import { cn } from '@/lib/utils'

type MobileTab = 'content' | 'preview'

export default function Builder() {
  const { id: urlId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useBuilderRouteSync(urlId, navigate)
  useAutosave()
  const [activeSection, setActiveSection] = useState('personal')
  const [mobileTab, setMobileTab] = useState<MobileTab>('content')

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-[520px] flex-col bg-muted/20 pt-4 sm:pt-6 lg:h-[calc(100dvh-4rem-5rem)] lg:flex-row lg:pt-8">
      {/* Desktop sidebar (lg+) */}
      <div className="hidden lg:block">
        <BuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Mobile content tab (sidebar-like nav + form) */}
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden lg:flex',
          mobileTab === 'content' ? 'flex' : 'hidden lg:flex',
        )}
      >
        {/* Mobile: section chips + action bar */}
        <div className="lg:hidden">
          <MobileActionBar />
          <BuilderMobileNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Form */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <FormPanel activeSection={activeSection} />
        </div>
      </div>

      {/* Preview — desktop always, mobile in preview tab */}
      <div
        className={cn(
          'min-h-0 flex-1 overflow-hidden lg:block lg:flex-initial',
          mobileTab === 'preview' ? 'flex flex-col' : 'hidden lg:flex',
        )}
      >
        <PreviewPanel />
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="grid grid-cols-2 border-t border-border/60 bg-background lg:hidden"
        aria-label="Builder görünüm sekmeleri"
      >
        <TabButton
          icon={FileText}
          label="İçerik"
          active={mobileTab === 'content'}
          onClick={() => setMobileTab('content')}
        />
        <TabButton
          icon={Eye}
          label="Önizleme"
          active={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
        />
      </nav>
    </div>
  )
}

// Mobile'de form view'ü üzerinde duran küçük action bar.
// Preview tab'ında PreviewPanel kendi action bar'ını gösterir.
function MobileActionBar() {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 py-2 backdrop-blur">
      <SyncStatusIndicator />
      <div className="flex items-center gap-2">
        <SaveButton />
        <PDFExportButton />
      </div>
    </div>
  )
}

interface TabButtonProps {
  icon: typeof FileText
  label: string
  active: boolean
  onClick: () => void
}

function TabButton({ icon: Icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors',
        active
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )}
      aria-pressed={active}
    >
      <Icon className={cn('h-5 w-5', active && 'stroke-[2.5]')} />
      <span>{label}</span>
      {active && (
        <span
          aria-hidden
          className="absolute bottom-0 h-0.5 w-12 rounded-t-full bg-primary"
          style={{ marginTop: 'auto' }}
        />
      )}
    </button>
  )
}
