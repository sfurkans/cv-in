import {
  ChevronDown,
  ChevronUp,
  Files,
  Home,
  LayoutTemplate,
  LogIn,
  LogOut,
  Menu,
  Plus,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { LogoMark } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'

type NavItem = {
  path: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/', label: 'Ana Sayfa', icon: Home },
  { path: '/templates', label: 'Şablonlar', icon: LayoutTemplate },
  { path: '/dashboard', label: "CV'lerim", icon: Files },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isBuilder = location.pathname.startsWith('/builder')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [manualHidden, setManualHidden] = useState(false)

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const openAuthModal = useAuthModalStore((s) => s.openModal)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const currentY = window.scrollY
      if (currentY < 80) {
        setHidden(false)
      } else if (currentY > lastY + 4) {
        setHidden(true)
      } else if (currentY < lastY - 4) {
        setHidden(false)
      }
      lastY = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isBuilder) setManualHidden(false)
  }, [isBuilder])

  const handleNewResume = () => {
    navigate('/builder')
    setMenuOpen(false)
  }

  const handleLogin = () => {
    openAuthModal('login')
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast.info('Çıkış yapıldı')
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <>
    <header
      className={cn(
        'sticky top-0 z-40 bg-gradient-to-b from-background via-background/85 to-transparent px-3 pt-3 pb-5 transition-transform duration-300 ease-out sm:px-4',
        (hidden || manualHidden) && !menuOpen ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div className="mx-auto max-w-5xl rounded-full border border-white/10 bg-[oklch(0.58_0.22_293_/_0.90)] shadow-2xl shadow-primary/15 ring-1 ring-inset ring-white/10 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-4 pl-6 pr-2 sm:pr-3">
          <Link
            to="/"
            aria-label="Cv-İn ana sayfa"
            className="inline-flex items-center gap-2 rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-primary-foreground">
              Cv-İn
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-primary-foreground'
                        : 'text-primary-foreground/75 hover:bg-white/10 hover:text-primary-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleNewResume}
              size="default"
              className="hidden rounded-full bg-gradient-to-b from-white to-violet-50 text-primary shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/80 transition-all hover:from-white hover:to-white hover:shadow-xl hover:shadow-primary/30 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Yeni CV
            </Button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-primary-foreground">
                  <User className="h-3.5 w-3.5" />
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleLogout}
                  className="rounded-full text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  title="Çıkış yap"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="default"
                onClick={handleLogin}
                className="hidden rounded-full text-primary-foreground hover:bg-white/10 hover:text-primary-foreground md:inline-flex"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground hover:bg-white/10 hover:text-primary-foreground md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/10 bg-[oklch(0.58_0.22_293_/_0.90)] p-2 shadow-2xl shadow-primary/15 ring-1 ring-inset ring-white/10 backdrop-blur-md md:hidden">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-primary-foreground'
                        : 'text-primary-foreground/75 hover:bg-white/10 hover:text-primary-foreground',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-primary-foreground/80">
                  <User className="h-4 w-4" />
                  {user?.email}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-white/10 hover:text-primary-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-white/10 hover:text-primary-foreground"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </button>
            )}

            <Button
              onClick={handleNewResume}
              size="default"
              className="mt-2 w-full rounded-full bg-gradient-to-b from-white to-violet-50 text-primary shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/80 transition-all hover:from-white hover:to-white hover:shadow-xl hover:shadow-primary/30 sm:hidden"
            >
              <Plus className="h-4 w-4" />
              Yeni CV
            </Button>
          </div>
        </nav>
      )}
    </header>
    {isBuilder && (
      <button
        type="button"
        onClick={() => setManualHidden((v) => !v)}
        aria-label={manualHidden ? 'Menüyü göster' : 'Menüyü gizle'}
        title={manualHidden ? 'Menüyü göster' : 'Menüyü gizle'}
        className="fixed right-3 top-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[oklch(0.58_0.22_293_/_0.90)] text-primary-foreground shadow-2xl shadow-primary/15 ring-1 ring-inset ring-white/10 backdrop-blur-md transition-colors hover:bg-[oklch(0.53_0.22_293_/_0.95)] sm:right-4 xl:right-[calc(50%_-_32rem_-_3.25rem)]"
      >
        {manualHidden ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronUp className="h-5 w-5" />
        )}
      </button>
    )}
    </>
  )
}
