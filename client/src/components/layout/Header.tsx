import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { LogoMark } from '@/components/brand/Logo'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { useAuthModalStore } from '@/store/authModalStore'
import { useAuthStore } from '@/store/authStore'

type NavItem = {
  path: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/templates', label: 'Şablonlar' },
  { path: '/dashboard', label: "CV'lerim" },
]

const linkBase =
  'inline-flex items-center px-4 pb-3 pt-2 text-xl tracking-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm'
const linkActive = 'text-primary font-medium border-b-2 border-current'
const linkInactive = 'text-primary/65 font-medium border-b border-current'

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
        'sticky top-0 z-40 overflow-x-clip transition-transform duration-300 ease-out',
        (hidden || manualHidden) && !menuOpen ? '-translate-y-full' : 'translate-y-0',
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-24 items-center">
          <div className="relative ml-2 flex-none sm:ml-6 md:ml-10 lg:ml-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-y-2 left-1/2 w-60 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklch,var(--color-primary)_22%,transparent)_20%,color-mix(in_oklch,var(--color-primary)_65%,transparent)_50%,color-mix(in_oklch,var(--color-primary)_22%,transparent)_80%,transparent_100%)] blur-2xl md:w-[20rem]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-44 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--color-primary)_70%,transparent),transparent)] opacity-75 blur-md md:w-56"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-2 left-1/2 w-32 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--color-primary)_55%,transparent),transparent)] blur-sm md:w-40"
            />
            <Link
              to="/"
              aria-label="Cv-İn ana sayfa"
              className="relative inline-flex items-center gap-2.5 rounded-sm text-white drop-shadow-[0_1px_8px_color-mix(in_oklch,var(--color-primary)_50%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <LogoMark className="h-10 w-10" />
              <span className="text-2xl font-bold tracking-tight">
                Cv-İn
              </span>
            </Link>
          </div>

          <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-12 md:flex lg:gap-20">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(linkBase, isActive ? linkActive : linkInactive)
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex flex-none items-center gap-5 lg:gap-7">
            {isBuilder && (
              <button
                type="button"
                onClick={() => setManualHidden((v) => !v)}
                aria-label="Menüyü gizle"
                title="Menüyü gizle"
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-primary/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <ChevronUp className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            )}

            <span
              aria-hidden
              className="hidden h-7 w-px bg-primary/20 md:inline-block"
            />

            <button
              type="button"
              onClick={handleNewResume}
              className={cn(linkBase, linkInactive, 'hidden sm:inline-flex')}
            >
              Yeni CV
            </button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-5 md:flex lg:gap-7">
                <span className="text-base font-medium text-primary/70">
                  {user?.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(linkBase, linkInactive)}
                  title="Çıkış yap"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className={cn(linkBase, linkInactive, 'hidden md:inline-flex')}
              >
                Giriş Yap
              </button>
            )}

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            >
              {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden">
          <div className="flex w-full flex-col items-start gap-5 px-4 py-5 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(linkBase, isActive ? linkActive : linkInactive)
                }
              >
                {item.label}
              </NavLink>
            ))}

            <span aria-hidden className="h-px w-12 bg-primary/20" />

            {isAuthenticated ? (
              <>
                <div className="px-1 text-base font-medium text-primary/70">
                  {user?.email}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(linkBase, linkInactive)}
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className={cn(linkBase, linkInactive)}
              >
                Giriş Yap
              </button>
            )}

            <button
              type="button"
              onClick={handleNewResume}
              className={cn(linkBase, linkInactive, 'sm:hidden')}
            >
              Yeni CV
            </button>
          </div>
        </nav>
      )}
    </header>
    {isBuilder && manualHidden && (
      <button
        type="button"
        onClick={() => setManualHidden(false)}
        aria-label="Menüyü göster"
        title="Menüyü göster"
        className="fixed right-4 top-3 z-50 inline-flex h-10 w-10 items-center justify-center rounded-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:right-6"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    )}
    </>
  )
}
