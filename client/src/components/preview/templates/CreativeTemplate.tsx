import type { CSSProperties } from 'react'

import type { FontFamily, Resume, Spacing } from '@/types/resume'

interface CreativeTemplateProps {
  resume: Resume
}

const FONT_CLASS: Record<FontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const SPACING_CONFIG: Record<
  Spacing,
  { sidePad: string; mainPad: string; sectionGap: string }
> = {
  compact: { sidePad: 'p-4', mainPad: 'p-5', sectionGap: 'mb-3' },
  normal: { sidePad: 'p-5', mainPad: 'p-7', sectionGap: 'mb-4' },
  relaxed: { sidePad: 'p-6', mainPad: 'p-9', sectionGap: 'mb-6' },
}

function formatMonth(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  if (!month) return year
  return `${month}/${year}`
}

function formatDateRange(start: string, end: string): string {
  const s = formatMonth(start)
  const e = formatMonth(end)
  if (!s && !e) return ''
  if (s && !e) return `${s} - Devam ediyor`
  if (!s && e) return e
  return `${s} - ${e}`
}

function SideHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 border-b border-white/30 pb-1 text-[10px] font-bold uppercase tracking-widest text-white">
      {children}
    </h2>
  )
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-2 border-b pb-1 text-[10px] font-bold uppercase tracking-widest"
      style={{
        color: 'var(--primary-color)',
        borderColor: 'var(--primary-color)',
      }}
    >
      {children}
    </h2>
  )
}

export default function CreativeTemplate({ resume }: CreativeTemplateProps) {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    languages,
    certificates,
    volunteer,
    publications,
    customSections,
    theme,
  } = resume

  const SKILL_LEVEL_LABELS: Record<string, string> = {
    beginner: 'Başlangıç',
    basic: 'Temel',
    intermediate: 'Orta',
    advanced: 'İleri',
    expert: 'Uzman',
  }

  const visibleSkills = skills.filter((s) => s.keywords.length > 0)

  const fontClass = FONT_CLASS[theme.fontFamily]
  const spacing = SPACING_CONFIG[theme.spacing]

  return (
    <div
      className={`flex aspect-[210/297] w-full overflow-hidden bg-white ${fontClass} text-[10px] leading-snug shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Sol Sidebar — primary background */}
      <aside
        className={`flex w-[35%] shrink-0 flex-col text-white ${spacing.sidePad}`}
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        {basics.photo && (
          <img
            src={basics.photo}
            alt={basics.name}
            className="mb-3 h-24 w-24 self-center rounded-full border-2 border-white/30 object-cover"
          />
        )}

        <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
          {basics.name || 'Adınız Soyadınız'}
        </h1>
        {basics.label && (
          <p className="mb-3 mt-0.5 text-[10px] text-white/80">
            {basics.label}
          </p>
        )}

        {/* İletişim */}
        {(basics.email || basics.phone || basics.profiles.length > 0) && (
          <section className={spacing.sectionGap}>
            <SideHeading>İletişim</SideHeading>
            <div className="space-y-1 text-[9px] text-white/90">
              {basics.email && <div className="break-all">{basics.email}</div>}
              {basics.phone && <div>{basics.phone}</div>}
              {basics.profiles.map((profile, i) => (
                <div key={`${profile.network}-${i}`} className="break-all">
                  <span className="font-semibold text-white">
                    {profile.network}:
                  </span>{' '}
                  {profile.url}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <section className={spacing.sectionGap}>
            <SideHeading>Yetenekler</SideHeading>
            <div className="space-y-2">
              {visibleSkills.map((skill) => (
                <div key={skill.id}>
                  {(skill.name || skill.level) && (
                    <div className="mb-0.5 text-[10px] font-semibold text-white">
                      {skill.name}
                      {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                        <span className="ml-1 font-normal text-white/70">
                          · {SKILL_LEVEL_LABELS[skill.level]}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {skill.keywords.map((keyword, i) => (
                      <span
                        key={`${skill.id}-${keyword}-${i}`}
                        className="rounded-sm bg-white/15 px-1.5 py-0.5 text-[9px] text-white"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className={spacing.sectionGap}>
            <SideHeading>Diller</SideHeading>
            <div className="space-y-0.5">
              {languages.map((item) => (
                <div key={item.id} className="text-[10px] text-white/90">
                  <span className="font-medium text-white">{item.name}</span>
                  {item.proficiency && (
                    <span className="ml-1 text-white/70">
                      — {item.proficiency.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Sağ ana içerik */}
      <main
        className={`flex-1 overflow-hidden ${spacing.mainPad}`}
        style={{ color: 'var(--text-color)' }}
      >
        {/* Summary */}
        {basics.summary && (
          <section className={spacing.sectionGap}>
            <MainHeading>Hakkımda</MainHeading>
            <p className="text-gray-700">{basics.summary}</p>
          </section>
        )}

        {/* Experience */}
        {work.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Deneyim</MainHeading>
            <div className="space-y-3">
              {work.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.position || 'Pozisyon'}
                      {item.company && (
                        <span className="font-normal text-gray-600">
                          {' — '}
                          {item.company}
                        </span>
                      )}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="mt-0.5 text-gray-700">{item.summary}</p>
                  )}
                  {item.highlights.some((h) => h.trim()) && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-700">
                      {item.highlights
                        .filter((h) => h.trim())
                        .map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Eğitim</MainHeading>
            <div className="space-y-2">
              {education.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.institution || 'Okul'}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {(item.degree || item.field) && (
                    <p className="text-gray-700">
                      {[item.degree, item.field].filter(Boolean).join(' — ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Projeler</MainHeading>
            <div className="space-y-2">
              {projects.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.name || 'Proje'}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-0.5 text-gray-700">{item.description}</p>
                  )}
                  {item.url && (
                    <p className="mt-0.5 text-[9px] text-gray-500">
                      {item.url}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Sertifikalar</MainHeading>
            <div className="space-y-1.5">
              {certificates.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.name}
                      {item.issuer && (
                        <span className="font-normal text-gray-600">
                          {' — '}
                          {item.issuer}
                        </span>
                      )}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatMonth(item.date)}
                    </span>
                  </div>
                  {item.url && (
                    <p className="text-[9px] text-gray-500">{item.url}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteer */}
        {volunteer.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Gönüllülük</MainHeading>
            <div className="space-y-2">
              {volunteer.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.role || 'Rol'}
                      {item.organization && (
                        <span className="font-normal text-gray-600">
                          {' — '}
                          {item.organization}
                        </span>
                      )}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>
                  {item.summary && (
                    <p className="mt-0.5 text-gray-700">{item.summary}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications */}
        {publications.length > 0 && (
          <section className={spacing.sectionGap}>
            <MainHeading>Yayınlar</MainHeading>
            <div className="space-y-1.5">
              {publications.map((item) => (
                <div key={item.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className="font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {item.name}
                      {item.publisher && (
                        <span className="font-normal text-gray-600">
                          {' — '}
                          {item.publisher}
                        </span>
                      )}
                    </h3>
                    <span className="shrink-0 text-[9px] text-gray-500">
                      {formatMonth(item.date)}
                    </span>
                  </div>
                  {item.url && (
                    <p className="text-[9px] text-gray-500">{item.url}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom sections */}
        {customSections.length > 0 &&
          customSections.map(
            (section) =>
              section.title && (
                <section key={section.id} className={spacing.sectionGap}>
                  <MainHeading>{section.title}</MainHeading>
                  {section.fields.length > 0 && (
                    <div className="space-y-1">
                      {section.fields.map((field) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-[auto_1fr] gap-2"
                        >
                          {field.label && (
                            <span
                              className="font-semibold"
                              style={{ color: 'var(--text-color)' }}
                            >
                              {field.label}:
                            </span>
                          )}
                          {field.value && (
                            <span className="text-gray-700">{field.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )
          )}
      </main>
    </div>
  )
}
