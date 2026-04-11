import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import type { FontFamily, Spacing } from '@/types/resume'

const PRIMARY_PRESETS: { label: string; value: string }[] = [
  { label: 'Antrasit', value: '#1f2937' },
  { label: 'Mavi', value: '#2563eb' },
  { label: 'Yeşil', value: '#059669' },
  { label: 'Mor', value: '#7c3aed' },
  { label: 'Bordo', value: '#be123c' },
]

const TEXT_PRESETS: { label: string; value: string }[] = [
  { label: 'Siyah', value: '#111827' },
  { label: 'Koyu Gri', value: '#374151' },
  { label: 'Lacivert', value: '#1e3a8a' },
]

const FONT_OPTIONS: { value: FontFamily; label: string; sample: string }[] = [
  { value: 'sans', label: 'Sans', sample: 'font-sans' },
  { value: 'serif', label: 'Serif', sample: 'font-serif' },
  { value: 'mono', label: 'Mono', sample: 'font-mono' },
]

const SPACING_OPTIONS: { value: Spacing; label: string }[] = [
  { value: 'compact', label: 'Sıkı' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Geniş' },
]

function ColorRow({
  label,
  value,
  presets,
  onChange,
  inputId,
}: {
  label: string
  value: string
  presets: { label: string; value: string }[]
  onChange: (hex: string) => void
  inputId: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-14 cursor-pointer rounded-md border bg-background"
          aria-label={`${label} renk seçici`}
        />
        <code className="rounded-md border bg-muted px-2 py-1 text-xs uppercase">
          {value}
        </code>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const isActive = preset.value.toLowerCase() === value.toLowerCase()
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] transition-colors ${
                isActive
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              }`}
              aria-pressed={isActive}
            >
              <span
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: preset.value }}
              />
              {preset.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ThemePicker() {
  const theme = useResumeStore((state) => state.resume.theme)
  const updateTheme = useResumeStore((state) => state.updateTheme)
  const resetTheme = useResumeStore((state) => state.resetTheme)

  return (
    <Card>
      <CardContent className="space-y-5 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium">Tema</h3>
            <p className="text-xs text-muted-foreground">
              Renk, font ve boşluk yoğunluğunu ayarla.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Sıfırla
          </Button>
        </div>

        <ColorRow
          label="Vurgu Rengi"
          value={theme.primaryColor}
          presets={PRIMARY_PRESETS}
          onChange={(hex) => updateTheme({ primaryColor: hex })}
          inputId="theme-primary-color"
        />

        <ColorRow
          label="Metin Rengi"
          value={theme.textColor}
          presets={TEXT_PRESETS}
          onChange={(hex) => updateTheme({ textColor: hex })}
          inputId="theme-text-color"
        />

        <div className="space-y-2">
          <Label>Font</Label>
          <div className="grid grid-cols-3 gap-2">
            {FONT_OPTIONS.map((option) => {
              const isActive = theme.fontFamily === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateTheme({ fontFamily: option.value })}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    option.sample
                  } ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Boşluk</Label>
          <div className="grid grid-cols-3 gap-2">
            {SPACING_OPTIONS.map((option) => {
              const isActive = theme.spacing === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateTheme({ spacing: option.value })}
                  className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:bg-muted'
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
