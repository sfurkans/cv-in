import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { LogoMark } from '@/components/brand/Logo'

const productLinks = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/templates', label: 'Şablonlar' },
  { to: '/dashboard', label: "CV'lerim" },
  { to: '/builder', label: 'Yeni CV' },
]

const aboutLinks = [
  { href: '#', label: 'Gizlilik' },
  { href: '#', label: 'Kullanım Şartları' },
  { href: '#', label: 'Geri Bildirim' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const location = useLocation()
  if (location.pathname.startsWith('/builder')) return null

  return (
    <footer className="relative mt-16 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[80%] -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse at top, color-mix(in oklch, var(--color-primary) 12%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        <Link
          to="/"
          aria-label="Cv-İn ana sayfa"
          className="inline-flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
        >
          <LogoMark className="h-7 w-7" />
          <span className="text-brand-gradient text-base font-bold tracking-tight">
            Cv-İn
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground sm:gap-x-6 sm:text-xs">
          {productLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group relative py-0.5 transition-colors hover:text-foreground"
            >
              {link.label}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground/70 sm:text-[11px]">
          {aboutLinks.map((link, i) => (
            <Fragment key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
              {i < aboutLinks.length - 1 && (
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-muted-foreground/30"
                />
              )}
            </Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground/80 sm:text-[11px]">
          <span>© {year} Cv-İn</span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-brand-gradient" />
          <span>Gizliliğine saygılı CV oluşturucu</span>
        </div>
      </div>
    </footer>
  )
}
