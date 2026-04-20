import { Menu, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import Logo from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/templates', label: 'Şablonlar' },
  { path: '/dashboard', label: "CV'lerim" },
]

export default function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNewResume = () => {
    navigate('/builder')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          aria-label="cv-in ana sayfa"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleNewResume}
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Yeni CV
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button
              onClick={handleNewResume}
              size="sm"
              className="mt-2 w-full sm:hidden"
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
