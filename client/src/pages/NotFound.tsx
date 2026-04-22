import { FileQuestion, Home, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg shadow-primary/20">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-5xl font-black tracking-tight text-brand-gradient sm:text-6xl">
        404
      </h1>
      <p className="mt-2 text-xl font-semibold tracking-tight">
        Sayfa Bulunamadı
      </p>
      <p className="mt-3 text-muted-foreground">
        Aradığın sayfayı bulamadık. Link bozuk olabilir ya da sayfa kaldırılmış
        olabilir.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/" className={cn(buttonVariants({}))}>
          <Home className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>
        <Link
          to="/builder"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <Sparkles className="h-4 w-4" />
          Yeni CV Oluştur
        </Link>
      </div>
    </div>
  )
}
