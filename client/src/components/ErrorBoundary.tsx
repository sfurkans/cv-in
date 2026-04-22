import * as Sentry from '@sentry/react'
import { AlertTriangle, Home, RotateCcw } from 'lucide-react'
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack)
    // Sentry init edilmemişse captureException no-op'tur, güvenli.
    Sentry.captureException(error, {
      contexts: { react: { componentStack: info.componentStack } },
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Bir hata oluştu
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Beklenmeyen bir hata yüzünden sayfayı gösteremedik. Sayfayı
            yeniden yüklemeyi deneyebilir ya da ana sayfaya dönebilirsin.
          </p>
          {this.state.error?.message && (
            <pre className="mt-4 max-w-md overflow-x-auto rounded-lg border border-border bg-muted/50 px-3 py-2 text-left text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleReset}
              className={cn(buttonVariants({}))}
            >
              <RotateCcw className="h-4 w-4" />
              Tekrar Dene
            </button>
            <a href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
              <Home className="h-4 w-4" />
              Ana Sayfa
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
