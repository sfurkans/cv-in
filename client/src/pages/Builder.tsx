import { Eye, FileText, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import BuilderMobileNav from '@/components/builder/BuilderMobileNav'
import BuilderSidebar from '@/components/builder/BuilderSidebar'
import FormPanel from '@/components/builder/FormPanel'
import PDFExportButton from '@/components/builder/PDFExportButton'
import PreviewPanel from '@/components/builder/PreviewPanel'
import SaveButton from '@/components/builder/SaveButton'
import SyncStatusIndicator from '@/components/builder/SyncStatusIndicator'
import { useAutosave } from '@/hooks/useAutosave'
import { useBuilderRouteSync } from '@/hooks/useBuilderRouteSync'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'

// Header mobil menü tasarımıyla aynı stil
const linkBase =
  'inline-flex items-center px-4 pb-3 pt-2 text-xl tracking-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm'
const linkActive = 'text-primary font-medium border-b-2 border-current'
const linkInactive = 'text-primary/65 font-medium border-b border-current'

type MobileTab = 'content' | 'preview'

export default function Builder() {
  const { id: urlId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useBuilderRouteSync(urlId, navigate)
  useAutosave()
  const [activeSection, setActiveSection] = useState('personal')
  const [mobileTab, setMobileTab] = useState<MobileTab>('content')

  return (
    <div className="flex h-[100dvh] min-h-[520px] flex-col bg-muted/20 py-10 lg:flex-row">
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
        <BuilderMobileMenu />
      </div>
    </div>
  )
}

function BuilderMobileMenu() {
  const [open, setOpen] = useState(false)
  const [menuTop, setMenuTop] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const openAuthModal = useAuthModalStore((s) => s.openModal)

  useEffect(() => {
    if (open && buttonRef.current) {
      setMenuTop(buttonRef.current.getBoundingClientRect().bottom)
    }
  }, [open])

  const close = () => setOpen(false)
  const handleNewResume = () => {
    close()
    navigate('/builder')
  }
  const handleLogin = () => {
    close()
    openAuthModal('login')
  }
  const handleLogout = () => {
    close()
    logout()
    toast.info('Çıkış yapıldı')
    navigate('/')
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      {open &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={close}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
            />
            <nav
              className="fixed inset-x-0 z-[70] overflow-hidden rounded-b-2xl border-b border-border/60 bg-background/95 shadow-2xl shadow-black/20 ring-1 ring-black/5 backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-200"
              style={{ top: menuTop }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/5 to-transparent"
              />
              <div className="relative flex w-full flex-col items-start gap-5 px-5 py-6 sm:px-7">
                <button
                  type="button"
                  onClick={handleNewResume}
                  className={cn(linkBase, linkInactive, 'text-green-600')}
                >
                  Yeni CV
                </button>

                <NavLink
                  to="/dashboard"
                  onClick={close}
                  className={({ isActive }) =>
                    cn(linkBase, isActive ? linkActive : linkInactive)
                  }
                >
                  CV'lerim
                </NavLink>

                <span aria-hidden className="h-px w-12 bg-primary/20" />

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={cn(linkBase, linkInactive, 'text-red-600')}
                  >
                    Çıkış Yap
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className={cn(linkBase, linkInactive)}
                  >
                    Giriş Yap
                  </button>
                )}
              </div>
            </nav>
          </>,
          document.body,
        )}
    </>
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
        'relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors',
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
          className="pointer-events-none absolute -top-px left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-b-full bg-primary"
        />
      )}
    </button>
  )
}
