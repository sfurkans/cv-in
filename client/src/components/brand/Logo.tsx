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
      <path
        d="M 10 8 L 19 8 L 24 13 L 24 24 L 10 24 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 19 8 L 19 13 L 24 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="13"
        y1="17"
        x2="21"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="13"
        y1="20"
        x2="18.5"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
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
          Cv-İn
        </span>
      )}
    </span>
  )
}
