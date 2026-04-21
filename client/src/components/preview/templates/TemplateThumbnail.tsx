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
      {templateId === 'sidebar-left' && <SidebarLeftThumb />}
      {templateId === 'ats' && <AtsThumb />}
      {templateId === 'color-accent' && <ColorAccentThumb />}
      {templateId === 'modern-clean' && <ModernCleanThumb />}
      {templateId === 'terminal' && <TerminalThumb />}
      {/* Faz 8'de eklenecek — geçici Classic fallback */}
      {templateId === 'infographic' && <ClassicThumb />}
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

function TerminalThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#0d1117" />
      {/* Prompt line */}
      <rect x="14" y="18" width="40" height="4" rx="0" fill="#7ee787" />
      <rect x="56" y="18" width="60" height="4" rx="0" fill="#c9d1d9" />
      {/* Divider */}
      <rect x="14" y="30" width="170" height="0.5" fill="#8b949e" opacity="0.4" />
      {/* Photo */}
      <rect x="14" y="38" width="28" height="28" fill="#21262d" stroke="#8b949e" strokeWidth="0.5" />
      {/* Name # Header */}
      <rect x="14" y="74" width="140" height="10" rx="1" fill="#c9d1d9" />
      <rect x="14" y="88" width="90" height="3" rx="0" fill="#6a737d" />
      {/* Meta */}
      <rect x="14" y="100" width="30" height="3" rx="0" fill="#8b949e" />
      <rect x="46" y="100" width="90" height="3" rx="0" fill="#a5d6ff" />
      <rect x="14" y="108" width="30" height="3" rx="0" fill="#8b949e" />
      <rect x="46" y="108" width="70" height="3" rx="0" fill="#a5d6ff" />
      {/* Section heading 1 */}
      <rect x="14" y="126" width="60" height="5" rx="1" fill="#7C3AED" />
      {/* Experience entries */}
      <rect x="14" y="140" width="30" height="3" rx="0" fill="#6a737d" />
      <rect x="46" y="140" width="50" height="3" rx="0" fill="#d2a8ff" />
      <rect x="100" y="140" width="44" height="3" rx="0" fill="#ff7b72" />
      <rect x="14" y="148" width="160" height="3" rx="0" fill="#c9d1d9" />
      {/* bullets */}
      <rect x="18" y="156" width="3" height="3" rx="0" fill="#7C3AED" />
      <rect x="24" y="156" width="140" height="3" rx="0" fill="#c9d1d9" />
      <rect x="18" y="164" width="3" height="3" rx="0" fill="#7C3AED" />
      <rect x="24" y="164" width="130" height="3" rx="0" fill="#c9d1d9" />
      {/* Section heading 2 */}
      <rect x="14" y="180" width="48" height="5" rx="1" fill="#7C3AED" />
      {/* Skills — const array */}
      <rect x="14" y="194" width="30" height="3" rx="0" fill="#ff7b72" />
      <rect x="46" y="194" width="48" height="3" rx="0" fill="#d2a8ff" />
      <rect x="14" y="202" width="10" height="3" rx="0" fill="#8b949e" />
      <rect x="26" y="202" width="20" height="3" rx="0" fill="#a5d6ff" />
      <rect x="48" y="202" width="30" height="3" rx="0" fill="#a5d6ff" />
      <rect x="80" y="202" width="24" height="3" rx="0" fill="#a5d6ff" />
      {/* Section heading 3 */}
      <rect x="14" y="222" width="52" height="5" rx="1" fill="#7C3AED" />
      <rect x="14" y="236" width="3" height="3" rx="0" fill="#7C3AED" />
      <rect x="20" y="236" width="40" height="3" rx="0" fill="#d2a8ff" />
      <rect x="62" y="236" width="80" height="3" rx="0" fill="#8b949e" />
      {/* EOF */}
      <rect x="14" y="258" width="70" height="3" rx="0" fill="#6a737d" opacity="0.7" />
    </svg>
  )
}

function ModernCleanThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      <circle cx="30" cy="36" r="12" fill="#e5e7eb" />
      <rect x="48" y="22" width="120" height="14" rx="2" fill="#111827" />
      <rect x="48" y="40" width="60" height="4" rx="1" fill="#9ca3af" />
      <rect x="48" y="48" width="20" height="2" rx="1" fill="#7C3AED" />
      <rect x="24" y="62" width="60" height="3" rx="1" fill="#9ca3af" />
      <rect x="88" y="62" width="36" height="3" rx="1" fill="#9ca3af" />
      <circle cx="26" cy="90" r="2.5" fill="#7C3AED" />
      <rect x="34" y="86" width="45" height="6" rx="1" fill="#111827" />
      <rect x="24" y="102" width="85" height="4" rx="1" fill="#111827" />
      <rect x="155" y="102" width="25" height="3" rx="1" fill="#9ca3af" />
      <rect x="24" y="112" width="48" height="3.5" rx="1" fill="#7C3AED" />
      <rect x="24" y="122" width="156" height="3" rx="1" fill="#d1d5db" />
      <rect x="24" y="130" width="140" height="3" rx="1" fill="#d1d5db" />
      <circle cx="26" cy="156" r="2.5" fill="#7C3AED" />
      <rect x="34" y="152" width="45" height="6" rx="1" fill="#111827" />
      <rect x="24" y="168" width="90" height="4" rx="1" fill="#111827" />
      <rect x="155" y="168" width="25" height="3" rx="1" fill="#9ca3af" />
      <rect x="24" y="178" width="140" height="3" rx="1" fill="#d1d5db" />
      <circle cx="26" cy="200" r="2.5" fill="#7C3AED" />
      <rect x="34" y="196" width="50" height="6" rx="1" fill="#111827" />
      <rect x="24" y="212" width="60" height="4" rx="1" fill="#111827" />
      <rect x="24" y="222" width="156" height="3" rx="1" fill="#d1d5db" />
      <rect x="24" y="230" width="130" height="3" rx="1" fill="#d1d5db" />
      <circle cx="26" cy="252" r="2.5" fill="#7C3AED" />
      <rect x="34" y="248" width="45" height="6" rx="1" fill="#111827" />
      <rect x="24" y="264" width="100" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function ColorAccentThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      {/* Üst renk barı */}
      <rect x="0" y="0" width="200" height="12" fill="#7C3AED" />
      {/* Foto daire */}
      <circle cx="38" cy="38" r="14" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
      <rect x="62" y="24" width="100" height="10" rx="1" fill="#111827" />
      <rect x="62" y="40" width="70" height="5" rx="1" fill="#7C3AED" />
      <rect x="62" y="50" width="40" height="3" rx="0" fill="#9ca3af" />
      <rect x="106" y="50" width="36" height="3" rx="0" fill="#9ca3af" />
      {/* Section 1 — bar + başlık */}
      <rect x="20" y="84" width="2" height="6" fill="#7C3AED" />
      <rect x="26" y="85" width="40" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="96" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="104" width="150" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="112" width="140" height="3" rx="1" fill="#d1d5db" />
      {/* Section 2 */}
      <rect x="20" y="130" width="2" height="6" fill="#7C3AED" />
      <rect x="26" y="131" width="50" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="142" width="90" height="4" rx="1" fill="#111827" />
      <rect x="150" y="142" width="28" height="7" rx="1" fill="#7C3AED" />
      <rect x="20" y="152" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="160" width="140" height="3" rx="1" fill="#d1d5db" />
      {/* Section 3 chips */}
      <rect x="20" y="180" width="2" height="6" fill="#7C3AED" />
      <rect x="26" y="181" width="55" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="194" width="28" height="10" rx="2" fill="#fff" stroke="#7C3AED" strokeWidth="0.8" />
      <rect x="52" y="194" width="34" height="10" rx="2" fill="#fff" stroke="#7C3AED" strokeWidth="0.8" />
      <rect x="90" y="194" width="30" height="10" rx="2" fill="#fff" stroke="#7C3AED" strokeWidth="0.8" />
      <rect x="124" y="194" width="26" height="10" rx="2" fill="#fff" stroke="#7C3AED" strokeWidth="0.8" />
      {/* Section 4 */}
      <rect x="20" y="222" width="2" height="6" fill="#7C3AED" />
      <rect x="26" y="223" width="48" height="5" rx="1" fill="#7C3AED" />
      <rect x="20" y="234" width="160" height="3" rx="1" fill="#d1d5db" />
      <rect x="20" y="242" width="130" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function AtsThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      <rect x="20" y="22" width="140" height="11" rx="1" fill="#000" />
      <rect x="20" y="40" width="80" height="4" rx="0" fill="#000" />
      <rect x="20" y="50" width="50" height="3" rx="0" fill="#000" />
      <rect x="76" y="50" width="40" height="3" rx="0" fill="#000" />
      <rect x="20" y="62" width="160" height="1" fill="#000" />
      <rect x="20" y="74" width="40" height="4" rx="0" fill="#000" />
      <rect x="20" y="82" width="160" height="0.8" fill="#000" />
      <rect x="20" y="92" width="160" height="3" rx="0" fill="#374151" />
      <rect x="20" y="100" width="150" height="3" rx="0" fill="#374151" />
      <rect x="20" y="108" width="140" height="3" rx="0" fill="#374151" />
      <rect x="20" y="124" width="50" height="4" rx="0" fill="#000" />
      <rect x="20" y="132" width="160" height="0.8" fill="#000" />
      <rect x="20" y="142" width="90" height="3.5" rx="0" fill="#000" />
      <rect x="20" y="150" width="60" height="3" rx="0" fill="#374151" />
      <rect x="20" y="158" width="160" height="3" rx="0" fill="#374151" />
      <rect x="20" y="166" width="150" height="3" rx="0" fill="#374151" />
      <rect x="20" y="182" width="55" height="4" rx="0" fill="#000" />
      <rect x="20" y="190" width="160" height="0.8" fill="#000" />
      <rect x="20" y="200" width="140" height="3" rx="0" fill="#374151" />
      <rect x="20" y="208" width="130" height="3" rx="0" fill="#374151" />
      <rect x="20" y="224" width="50" height="4" rx="0" fill="#000" />
      <rect x="20" y="232" width="160" height="0.8" fill="#000" />
      <rect x="20" y="242" width="140" height="3" rx="0" fill="#374151" />
      <rect x="20" y="250" width="120" height="3" rx="0" fill="#374151" />
    </svg>
  )
}

function SidebarLeftThumb() {
  return (
    <svg viewBox="0 0 200 280" className="h-full w-full">
      <rect width="200" height="280" fill="#fff" />
      <rect x="0" y="0" width="70" height="280" fill="#7C3AED" />
      <circle cx="35" cy="32" r="14" fill="#fff" opacity="0.35" />
      <rect x="10" y="54" width="50" height="6" rx="1" fill="#fff" />
      <rect x="14" y="64" width="42" height="3" rx="1" fill="#fff" opacity="0.75" />
      <rect x="10" y="86" width="30" height="4" rx="1" fill="#fff" opacity="0.55" />
      <rect x="10" y="96" width="50" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="104" width="45" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="112" width="48" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="134" width="34" height="4" rx="1" fill="#fff" opacity="0.55" />
      <rect x="10" y="144" width="50" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="152" width="40" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="160" width="45" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="184" width="34" height="4" rx="1" fill="#fff" opacity="0.55" />
      <rect x="10" y="194" width="48" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="10" y="202" width="48" height="3" rx="1" fill="#fff" opacity="0.9" />
      <rect x="82" y="22" width="75" height="5" rx="1" fill="#7C3AED" />
      <rect x="82" y="32" width="108" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="40" width="100" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="48" width="104" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="72" width="55" height="5" rx="1" fill="#7C3AED" />
      <rect x="82" y="84" width="75" height="4" rx="1" fill="#111827" />
      <rect x="82" y="94" width="108" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="102" width="95" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="110" width="108" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="118" width="80" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="142" width="48" height="5" rx="1" fill="#7C3AED" />
      <rect x="82" y="154" width="70" height="4" rx="1" fill="#111827" />
      <rect x="82" y="164" width="100" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="172" width="95" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="196" width="52" height="5" rx="1" fill="#7C3AED" />
      <rect x="82" y="208" width="60" height="4" rx="1" fill="#111827" />
      <rect x="82" y="218" width="108" height="3" rx="1" fill="#d1d5db" />
      <rect x="82" y="226" width="90" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}
