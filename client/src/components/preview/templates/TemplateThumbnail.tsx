import { cn } from '@/lib/utils'
import type { TemplateId } from '@/types/resume'

interface TemplateThumbnailProps {
  templateId: TemplateId
  className?: string
}

export default function TemplateThumbnail({
  templateId,
  className,
}: TemplateThumbnailProps) {
  return (
    <div
      className={cn(
        'aspect-[210/297] w-full overflow-hidden rounded-md border border-border/60 bg-white shadow-sm',
        className,
      )}
    >
      {templateId === 'classic' && <ClassicThumb />}
      {templateId === 'modern' && <ModernThumb />}
      {templateId === 'creative' && <CreativeThumb />}
    </div>
  )
}

function ClassicThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      <rect x="20" y="22" width="110" height="12" rx="2" fill="#111827" />
      <rect x="20" y="40" width="72" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="56" width="160" height="1" fill="#e5e7eb" />
      <rect x="20" y="70" width="48" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="82" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="90" width="150" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="98" width="140" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="118" width="50" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="132" width="90" height="4" rx="1" fill="#111827" />
      <rect x="20" y="142" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="150" width="130" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="170" width="52" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="184" width="70" height="4" rx="1" fill="#111827" />
      <rect x="20" y="194" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="214" width="46" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="228" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="236" width="120" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function ModernThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      <rect x="20" y="22" width="110" height="18" rx="2" fill="#111827" />
      <rect x="20" y="46" width="60" height="4" rx="1" fill="#7C3AED" />
      <rect x="142" y="24" width="40" height="3" rx="1" fill="#9ca3af" />
      <rect x="142" y="32" width="40" height="3" rx="1" fill="#9ca3af" />
      <rect x="142" y="40" width="40" height="3" rx="1" fill="#9ca3af" />
      <rect x="20" y="70" width="160" height="1" fill="#e5e7eb" />
      <circle cx="24" cy="88" r="2" fill="#7C3AED" />
      <rect x="32" y="84" width="80" height="5" rx="1" fill="#111827" />
      <rect x="32" y="94" width="50" height="3" rx="1" fill="#9ca3af" />
      <rect x="32" y="102" width="150" height="3" rx="1" fill="#d1d5db" />
      <rect x="32" y="110" width="130" height="3" rx="1" fill="#d1d5db" />
      <circle cx="24" cy="132" r="2" fill="#7C3AED" />
      <rect x="32" y="128" width="70" height="5" rx="1" fill="#111827" />
      <rect x="32" y="138" width="45" height="3" rx="1" fill="#9ca3af" />
      <rect x="32" y="146" width="150" height="3" rx="1" fill="#d1d5db" />
      <circle cx="24" cy="168" r="2" fill="#7C3AED" />
      <rect x="32" y="164" width="60" height="5" rx="1" fill="#111827" />
      <rect x="32" y="174" width="140" height="3" rx="1" fill="#d1d5db" />
      <rect x="32" y="182" width="120" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="210" width="52" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="222" width="36" height="12" rx="6" fill="#ede9fe" />
      <rect x="62" y="222" width="40" height="12" rx="6" fill="#ede9fe" />
      <rect x="108" y="222" width="32" height="12" rx="6" fill="#ede9fe" />
    </svg>
  )
}

function CreativeThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <defs>
        <linearGradient id="thumb-sidebar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill="#fff" />
      <rect x="0" y="0" width="70" height="280" fill="url(#thumb-sidebar)" />
      <circle cx="35" cy="32" r="14" fill="#fff" opacity="0.25" />
      <rect x="10" y="54" width="50" height="6" rx="1" fill="#fff" />
      <rect x="12" y="66" width="40" height="3" rx="1" fill="#fff" opacity="0.7" />
      <rect x="10" y="92" width="30" height="4" rx="1" fill="#fff" opacity="0.5" />
      <rect x="10" y="102" width="50" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="110" width="45" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="118" width="48" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="140" width="30" height="4" rx="1" fill="#fff" opacity="0.5" />
      <rect x="10" y="150" width="50" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="158" width="45" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="186" width="30" height="4" rx="1" fill="#fff" opacity="0.5" />
      <rect x="10" y="196" width="50" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="82" y="22" width="55" height="6" rx="1" fill="#14B8A6" />
      <rect x="82" y="34" width="110" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="42" width="100" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="50" width="105" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="74" width="52" height="6" rx="1" fill="#14B8A6" />
      <rect x="82" y="86" width="75" height="4" rx="1" fill="#111827" />
      <rect x="82" y="96" width="110" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="104" width="95" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="126" width="48" height="6" rx="1" fill="#14B8A6" />
      <rect x="82" y="138" width="70" height="4" rx="1" fill="#111827" />
      <rect x="82" y="148" width="100" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}
