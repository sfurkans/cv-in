import { Globe, Plus, Trash2 } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import type { Profile } from '@/types/resume'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const NETWORK_OPTIONS = ['LinkedIn', 'GitHub', 'Website'] as const
type NetworkName = (typeof NETWORK_OPTIONS)[number]

const networkIcons: Record<NetworkName, IconComponent> = {
  LinkedIn: LinkedinIcon,
  GitHub: GithubIcon,
  Website: Globe,
}

const networkPlaceholders: Record<NetworkName, string> = {
  LinkedIn: 'https://linkedin.com/in/kullaniciadi',
  GitHub: 'https://github.com/kullaniciadi',
  Website: 'https://kullaniciadi.dev',
}

function getIcon(network: string): IconComponent {
  return networkIcons[network as NetworkName] ?? Globe
}

function getPlaceholder(network: string): string {
  return networkPlaceholders[network as NetworkName] ?? 'https://...'
}

export default function SocialLinksInput() {
  const profiles = useResumeStore((state) => state.resume.basics.profiles)
  const setProfiles = useResumeStore((state) => state.setProfiles)

  const updateProfile = (index: number, partial: Partial<Profile>) => {
    const next = profiles.map((profile, i) =>
      i === index ? { ...profile, ...partial } : profile
    )
    setProfiles(next)
  }

  const addProfile = () => {
    setProfiles([
      ...profiles,
      { network: 'Website', url: '', username: '' },
    ])
  }

  const removeProfile = (index: number) => {
    setProfiles(profiles.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label>Sosyal Linkler</Label>

      {profiles.length > 0 && (
        <div className="space-y-3 sm:space-y-2">
          {profiles.map((profile, index) => {
            const Icon = getIcon(profile.network)
            return (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/10 p-2 sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:p-0"
              >
                {/* Mobile: icon + select + delete bir arada (üst satır) */}
                <div className="flex items-center gap-2 sm:contents">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background sm:bg-muted/30">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <select
                    value={profile.network}
                    onChange={(e) =>
                      updateProfile(index, { network: e.target.value })
                    }
                    className="flex h-9 flex-1 rounded-lg border border-input bg-transparent px-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-32 sm:flex-initial"
                    aria-label="Platform"
                  >
                    {NETWORK_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {/* Mobile'de delete butonu üst satırda sağda */}
                  <button
                    type="button"
                    onClick={() => removeProfile(index)}
                    aria-label={`${profile.network} kaldır`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive sm:hidden"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {/* URL input — mobilde alt satır, desktop'ta inline */}
                <Input
                  type="url"
                  placeholder={getPlaceholder(profile.network)}
                  value={profile.url}
                  onChange={(e) =>
                    updateProfile(index, { url: e.target.value })
                  }
                  aria-label={`${profile.network} URL`}
                  className="h-10 sm:h-9"
                />
                {/* Desktop'ta delete inline sağda */}
                <button
                  type="button"
                  onClick={() => removeProfile(index)}
                  aria-label={`${profile.network} kaldır`}
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:inline-flex"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addProfile}
      >
        <Plus className="h-4 w-4" />
        Yeni Link Ekle
      </Button>
    </div>
  )
}
