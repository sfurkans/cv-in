import {
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
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

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
  const [menuOpen, setMenuOpen] = useState(false)

  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logout = useAuthStore((s) => s.logout)
  const openAuthModal = useAuthModalStore((s) => s.openModal)

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
    <header className="sticky top-0 z-40 bg-gradient-to-b from-background via-background/85 to-transparent px-3 pt-3 pb-5 sm:px-4">
      <div className="mx-auto max-w-5xl rounded-full border border-white/10 bg-primary shadow-lg shadow-primary/30">
        <div className="flex h-14 items-center justify-between gap-4 pl-5 pr-2 sm:pr-3">
          <Link
            to="/"
            aria-label="cv-in ana sayfa"
            className="inline-flex items-center gap-2 rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <LogoMark className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-primary-foreground">
              cv-in
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
                      'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/15 text-primary-foreground'
                        : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground',
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
              size="sm"
              className="bg-primary-foreground text-primary shadow-md shadow-primary/20 transition-opacity hover:bg-primary-foreground/90 hidden rounded-full sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Yeni CV
            </Button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-foreground">
                  <User className="h-3.5 w-3.5" />
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
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
                size="sm"
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
        <nav className="mx-auto mt-2 max-w-5xl rounded-2xl border border-white/10 bg-primary p-2 shadow-lg shadow-primary/30 md:hidden">
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
                        ? 'bg-white/15 text-primary-foreground'
                        : 'text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground',
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
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-primary-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-primary-foreground"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </button>
            )}

            <Button
              onClick={handleNewResume}
              size="sm"
              className="bg-primary-foreground text-primary shadow-md shadow-primary/20 transition-opacity hover:bg-primary-foreground/90 mt-2 w-full rounded-full sm:hidden"
            >
              <Plus className="h-4 w-4" />
              Yeni CV
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
