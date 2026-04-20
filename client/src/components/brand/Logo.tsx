import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="cvinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#cvinGradient)" />
      <path
        d="M20.5 11.5a6 6 0 1 0 0 9"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

interface LogoProps {
  className?: string
  wordmarkClassName?: string
  compact?: boolean
}

export default function Logo({
  className,
  wordmarkClassName,
  compact = false,
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="h-8 w-8" />
      {!compact && (
        <span
          className={cn(
            'text-brand-gradient text-lg font-semibold tracking-tight',
            wordmarkClassName,
          )}
        >
          cv-in
        </span>
      )}
    </span>
  )
}
