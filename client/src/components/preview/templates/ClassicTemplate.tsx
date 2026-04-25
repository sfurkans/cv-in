import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import {
  DEFAULT_SECTION_ORDER,
  type FontFamily,
  type Resume,
  type SectionId,
  type Spacing,
} from '@/types/resume'

interface ClassicTemplateProps {
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
  normal: { wrapper: 'p-8', sectionGap: 'mb-4' },
  relaxed: { wrapper: 'p-10', sectionGap: 'mb-6' },
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
    <h2
      className="mb-2 border-b pb-1 text-[10px] font-bold uppercase tracking-widest"
      style={{
        borderColor: 'var(--primary-color)',
        color: 'var(--primary-color)',
      }}
    >
      {children}
    </h2>
  )
}

export default function ClassicTemplate({ resume }: ClassicTemplateProps) {
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
    sectionOrder,
    theme,
  } = resume
  const order: SectionId[] =
    sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER

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

  // Hoisted function declarations (aşağıda); fonksiyonlar closure'dan değişkenlere erişir.
  const sectionRenderers: Record<SectionId, () => ReactNode> = {
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    languages: renderLanguages,
    certificates: renderCertificates,
    volunteer: renderVolunteer,
    publications: renderPublications,
    custom: renderCustom,
  }

  return (
    <div
      className={`min-h-[297mm] w-[210mm] bg-white ${wrapperPadding} ${fontClass} text-[17px] leading-snug text-gray-900 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Header */}
      <header
        className={`${sectionGap} border-b pb-4`}
        style={{ borderColor: 'var(--primary-color)' }}
      >
        <div className="min-w-0">
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text-color)' }}
          >
            {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p className="mt-0.5 text-sm text-gray-600">{basics.label}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-gray-600">
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.profiles.map((profile, i) => (
              <span key={`${profile.network}-${i}`}>
                {profile.network}:{' '}
                <span className="text-gray-700">{profile.url}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <section className={sectionGap}>
          <SectionHeading>Özet</SectionHeading>
          <p className="text-gray-700">{basics.summary}</p>
        </section>
      )}

      {/* Sections — kullanıcı sırasına göre */}
      {order.map((id) => (
        <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
      ))}
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Deneyim</SectionHeading>
        <div className="space-y-3">
          {work.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Eğitim</SectionHeading>
        <div className="space-y-2">
          {education.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
    )
  }

  function renderSkills(): ReactNode {
    if (visibleSkills.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Yetenekler</SectionHeading>
        <div className="space-y-2">
          {visibleSkills.map((skill) => (
            <div key={skill.id}>
              {(skill.name || skill.level) && (
                <div className="mb-1 flex items-baseline gap-2">
                  {skill.name && (
                    <span className="text-[10px] font-semibold text-gray-900">
                      {skill.name}
                    </span>
                  )}
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <span className="text-[9px] text-gray-500">
                      · {SKILL_LEVEL_LABELS[skill.level]}
                    </span>
                  )}
                </div>
              )}
              {skill.keywords.length > 0 && (
                <p className="text-gray-700">
                  {skill.keywords.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Projeler</SectionHeading>
        <div className="space-y-2">
          {projects.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Diller</SectionHeading>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {languages.map((item) => (
            <div key={item.id} className="text-gray-700">
              <span className="font-medium text-gray-900">{item.name}</span>
              {item.proficiency && (
                <span className="ml-1 text-gray-500">
                  — {item.proficiency.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Sertifikalar</SectionHeading>
        <div className="space-y-1.5">
          {certificates.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Gönüllülük</SectionHeading>
        <div className="space-y-2">
          {volunteer.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    return (
      <section className={sectionGap}>
        <SectionHeading>Yayınlar</SectionHeading>
        <div className="space-y-1.5">
          {publications.map((item) => (
            <div key={item.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold text-gray-900">
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
    )
  }

  function renderCustom(): ReactNode {
    if (customSections.length === 0) return null
    return (
      <>
        {customSections.map(
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
                          <span className="font-semibold text-gray-900">
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
      </>
    )
  }

}
