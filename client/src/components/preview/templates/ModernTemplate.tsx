import type { CSSProperties } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
import type { FontFamily, Resume, Spacing } from '@/types/resume'

interface ModernTemplateProps {
  resume: Resume
}

const FONT_CLASS: Record<FontFamily, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

const SPACING_CONFIG: Record<
  Spacing,
  { wrapper: string; sectionGap: string }
> = {
  compact: { wrapper: 'p-6', sectionGap: 'mb-3' },
  normal: { wrapper: 'p-8', sectionGap: 'mb-5' },
  relaxed: { wrapper: 'p-10', sectionGap: 'mb-7' },
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2
        className="text-[11px] font-semibold tracking-wide"
        style={{ color: 'var(--primary-color)' }}
      >
        {children}
      </h2>
      <div
        className="mt-1 h-[2px] w-8"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />
    </div>
  )
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-4">
      <span
        className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />
      {children}
    </div>
  )
}

export default function ModernTemplate({ resume }: ModernTemplateProps) {
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
  const { wrapper: wrapperPadding, sectionGap } = SPACING_CONFIG[theme.spacing]

  return (
    <div
      className={`aspect-[210/297] w-full overflow-hidden bg-white ${wrapperPadding} ${fontClass} text-[13px] leading-snug text-gray-800 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Header — sol tarafta büyük isim, sağda compact iletişim */}
      <header className={`${sectionGap} flex items-start justify-between gap-6`}>
        <div className="flex items-start gap-4">
          {basics.photo && (
            <img
              src={resolvePhotoUrl(basics.photo)}
              alt={basics.name}
              className="h-16 w-16 shrink-0 rounded-md object-cover"
            />
          )}
          <div className="min-w-0">
            <h1
              className="text-2xl font-extrabold leading-[1.15] tracking-tight"
              style={{ color: 'var(--text-color)' }}
            >
              {basics.name || 'Adınız Soyadınız'}
            </h1>
            {basics.label && (
              <p
                className="mt-2 text-xs font-light uppercase tracking-widest"
                style={{ color: 'var(--primary-color)' }}
              >
                {basics.label}
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0 space-y-0.5 text-right text-[9px] text-gray-600">
          {basics.email && <div>{basics.email}</div>}
          {basics.phone && <div>{basics.phone}</div>}
          {basics.profiles.map((profile, i) => (
            <div key={`${profile.network}-${i}`}>{profile.url}</div>
          ))}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <section className={sectionGap}>
          <SectionHeading>Hakkımda</SectionHeading>
          <p className="text-gray-700">{basics.summary}</p>
        </section>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Deneyim</SectionHeading>
          <div className="space-y-3">
            {work.map((item) => (
              <TimelineItem key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {item.position || 'Pozisyon'}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.company && (
                  <p className="text-[10px] italic text-gray-600">
                    {item.company}
                  </p>
                )}
                {item.summary && (
                  <p className="mt-1 text-gray-700">{item.summary}</p>
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
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Eğitim</SectionHeading>
          <div className="space-y-2">
            {education.map((item) => (
              <TimelineItem key={item.id}>
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
                  <p className="text-[10px] italic text-gray-600">
                    {[item.degree, item.field].filter(Boolean).join(' — ')}
                  </p>
                )}
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Skills — virgülle ayrılmış inline akış */}
      {visibleSkills.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Yetenekler</SectionHeading>
          <div className="space-y-1.5">
            {visibleSkills.map((skill) => (
              <div key={skill.id} className="flex items-baseline gap-2">
                {skill.name && (
                  <span
                    className="shrink-0 text-[10px] font-semibold"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {skill.name}
                    {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                      <span className="ml-1 font-normal text-gray-500">
                        ({SKILL_LEVEL_LABELS[skill.level]})
                      </span>
                    )}
                    :
                  </span>
                )}
                <span className="text-gray-700">
                  {skill.keywords.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Projeler</SectionHeading>
          <div className="space-y-2">
            {projects.map((item) => (
              <TimelineItem key={item.id}>
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
                  <p className="mt-0.5 text-[9px] text-gray-500">{item.url}</p>
                )}
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Diller</SectionHeading>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {languages.map((item) => (
              <div key={item.id} className="text-gray-700">
                <span
                  className="font-medium"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.name}
                </span>
                {item.proficiency && (
                  <span className="ml-1 text-gray-500">
                    — {item.proficiency.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Sertifikalar</SectionHeading>
          <div className="space-y-1.5">
            {certificates.map((item) => (
              <TimelineItem key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {item.name}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatMonth(item.date)}
                  </span>
                </div>
                {item.issuer && (
                  <p className="text-[10px] italic text-gray-600">
                    {item.issuer}
                  </p>
                )}
                {item.url && (
                  <p className="text-[9px] text-gray-500">{item.url}</p>
                )}
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Volunteer */}
      {volunteer.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Gönüllülük</SectionHeading>
          <div className="space-y-2">
            {volunteer.map((item) => (
              <TimelineItem key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {item.role || 'Rol'}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.organization && (
                  <p className="text-[10px] italic text-gray-600">
                    {item.organization}
                  </p>
                )}
                {item.summary && (
                  <p className="mt-0.5 text-gray-700">{item.summary}</p>
                )}
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section className={sectionGap}>
          <SectionHeading>Yayınlar</SectionHeading>
          <div className="space-y-1.5">
            {publications.map((item) => (
              <TimelineItem key={item.id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className="font-semibold"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {item.name}
                  </h3>
                  <span className="shrink-0 text-[9px] text-gray-500">
                    {formatMonth(item.date)}
                  </span>
                </div>
                {item.publisher && (
                  <p className="text-[10px] italic text-gray-600">
                    {item.publisher}
                  </p>
                )}
                {item.url && (
                  <p className="text-[9px] text-gray-500">{item.url}</p>
                )}
              </TimelineItem>
            ))}
          </div>
        </section>
      )}

      {/* Custom sections */}
      {customSections.length > 0 &&
        customSections.map(
          (section) =>
            section.title && (
              <section key={section.id} className={sectionGap}>
                <SectionHeading>{section.title}</SectionHeading>
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
    </div>
  )
}
