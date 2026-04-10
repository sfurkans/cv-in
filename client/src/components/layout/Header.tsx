import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const navItems = [
  { path: '/', label: 'Ana Sayfa' },
  { path: '/builder', label: 'CV Oluştur' },
  { path: '/templates', label: 'Şablonlar' },
  { path: '/dashboard', label: "CV'lerim" },
]

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary">
          CV Builder
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </Button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t px-4 pb-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
