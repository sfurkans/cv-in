import { LogoMark } from '@/components/brand/Logo'

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <LogoMark className="h-5 w-5" />
          <span className="font-medium text-foreground">cv-in</span>
          <span>· {new Date().getFullYear()}</span>
        </div>
        <p>Veriler tarayıcında kalır. Bulut yok, kayıt yok.</p>
      </div>
    </footer>
  )
}
