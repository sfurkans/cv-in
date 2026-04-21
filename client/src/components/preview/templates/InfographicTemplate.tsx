import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
import {
  LANGUAGE_PROFICIENCY_PERCENT,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_PERCENT,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import { FONT_CLASS, WEB_SPACING } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
} from '@/types/resume'

interface InfographicTemplateProps {
  resume: Resume
}

// Infografik — skill bar'lari, dil bar'lari, zaman cizgili deneyim.
// Renk sistemi: primary + secondary (accent) gradient, illustration feel.

export default function InfographicTemplate({
  resume,
}: InfographicTemplateProps) {
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
  const fontClass = FONT_CLASS[theme.fontFamily]
  const { sectionGap } = WEB_SPACING[theme.spacing]
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)

  const renderers: Record<SectionId, () => ReactNode> = {
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
      className={`h-[297mm] w-[210mm] overflow-hidden bg-white ${fontClass} text-[11px] leading-snug text-gray-800 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Header — gradient band */}
      <header
        className="flex items-center gap-5 px-8 py-6 text-white"
        style={{
          background: `linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 65%, #000 35%))`,
        }}
      >
        {basics.photo && (
          <img
            src={resolvePhotoUrl(basics.photo)}
            alt={basics.name}
            className="h-[28mm] w-[28mm] shrink-0 rounded-full border-4 border-white/40 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-[26px] font-bold leading-tight break-words">
            {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p className="mt-0.5 text-[13px] opacity-95 break-words">
              {basics.label}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] opacity-90">
            {basics.email && <span className="break-all">◆ {basics.email}</span>}
            {basics.phone && <span>◆ {basics.phone}</span>}
            {basics.profiles.map((p, i) => (
              <span key={`${p.network}-${i}`} className="break-all">
                ◆ {p.network}: {p.url || p.username}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="px-8 py-5">
        {basics.summary && (
          <section className={sectionGap}>
            <InfoHeading>Özet</InfoHeading>
            <p className="mt-1.5 text-gray-700 break-words">{basics.summary}</p>
          </section>
        )}

        {order.map((id) => (
          <Fragment key={id}>{renderers[id]?.()}</Fragment>
        ))}
      </div>
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sectionGap}>
        <InfoHeading>Deneyim</InfoHeading>
        <div
          className="mt-2 relative pl-6 before:absolute before:bottom-2 before:left-[7px] before:top-1 before:w-[2px]"
          style={{
            // Timeline line via style (Tailwind before:bg-primary is dynamic)
          }}
        >
          <div
            className="absolute left-[7px] top-1 bottom-2 w-[2px]"
            style={{ backgroundColor: 'var(--primary-color)', opacity: 0.25 }}
          />
          <div className="space-y-3">
            {work.map((item) => (
              <div key={item.id} className="relative min-w-0">
                <span
                  className="absolute -left-[22px] top-1 inline-block h-3 w-3 rounded-full border-[2px] border-white ring-2"
                  style={
                    {
                      backgroundColor: 'var(--primary-color)',
                      '--tw-ring-color': 'var(--primary-color)',
                    } as CSSProperties
                  }
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                    {item.position || 'Pozisyon'}
                    {item.company && (
                      <span
                        className="ml-1 font-normal"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        @ {item.company}
                      </span>
                    )}
                  </h3>
                  <span className="shrink-0 text-[9.5px] text-gray-500">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                {item.summary && (
                  <p className="mt-0.5 text-gray-700 break-words">
                    {item.summary}
                  </p>
                )}
                {item.highlights.some((h) => h.trim()) && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-700 marker:text-[color:var(--primary-color)]">
                    {item.highlights
                      .filter((h) => h.trim())
                      .map((h, i) => (
                        <li key={i} className="break-words">
                          {h}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <section className={sectionGap}>
        <InfoHeading>Eğitim</InfoHeading>
        <div className="mt-2 space-y-2">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.institution || 'Okul'}
                </h3>
                <span className="shrink-0 text-[9.5px] text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {(item.degree || item.field) && (
                <p className="text-gray-700 break-words">
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
        <InfoHeading>Yetenekler</InfoHeading>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2.5">
          {visibleSkills.map((skill) => {
            const pct = skill.level
              ? SKILL_LEVEL_PERCENT[skill.level] ?? 50
              : null
            return (
              <div key={skill.id} className="min-w-0">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-[10px]">
                  <span
                    className="min-w-0 font-semibold break-words"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {skill.name || 'Yetenek'}
                  </span>
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <span
                      className="shrink-0 text-[9px]"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {SKILL_LEVEL_LABELS[skill.level]}
                    </span>
                  )}
                </div>
                {pct !== null && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 55%, #fff 45%))`,
                      }}
                    />
                  </div>
                )}
                {skill.keywords.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {skill.keywords.map((k, i) => (
                      <span
                        key={`${skill.id}-${k}-${i}`}
                        className="rounded-full px-1.5 py-0.5 text-[8.5px] break-words"
                        style={{
                          backgroundColor:
                            'color-mix(in srgb, var(--primary-color) 12%, #fff 88%)',
                          color: 'var(--primary-color)',
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <section className={sectionGap}>
        <InfoHeading>Projeler</InfoHeading>
        <div className="mt-2 space-y-2">
          {projects.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.name || 'Proje'}
                </h3>
                <span className="shrink-0 text-[9.5px] text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.description && (
                <p className="mt-0.5 text-gray-700 break-words">
                  {item.description}
                </p>
              )}
              {item.url && (
                <p
                  className="mt-0.5 text-[9.5px] break-all"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.url}
                </p>
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
        <InfoHeading>Diller</InfoHeading>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
          {languages.map((l) => {
            const prof = l.proficiency?.toLowerCase() ?? ''
            const pct = LANGUAGE_PROFICIENCY_PERCENT[prof] ?? null
            return (
              <div key={l.id} className="min-w-0">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-[10px]">
                  <span
                    className="min-w-0 font-semibold break-words"
                    style={{ color: 'var(--text-color)' }}
                  >
                    {l.name}
                  </span>
                  {l.proficiency && (
                    <span
                      className="shrink-0 text-[9px]"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {l.proficiency.toUpperCase()}
                    </span>
                  )}
                </div>
                {pct !== null && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: 'var(--primary-color)',
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <section className={sectionGap}>
        <InfoHeading>Sertifikalar</InfoHeading>
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
          {certificates.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-gray-200 p-2 min-w-0"
            >
              <p className="font-semibold text-gray-900 break-words">
                {item.name}
              </p>
              {item.issuer && (
                <p className="text-[9.5px] text-gray-600 break-words">
                  {item.issuer}
                </p>
              )}
              {item.date && (
                <p
                  className="text-[9px]"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {formatMonth(item.date)}
                </p>
              )}
              {item.url && (
                <p className="text-[9px] text-gray-500 break-all">{item.url}</p>
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
        <InfoHeading>Gönüllülük</InfoHeading>
        <div className="mt-2 space-y-2">
          {volunteer.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.role || 'Rol'}
                  {item.organization && (
                    <span
                      className="ml-1 font-normal"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      @ {item.organization}
                    </span>
                  )}
                </h3>
                <span className="shrink-0 text-[9.5px] text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.summary && (
                <p className="mt-0.5 text-gray-700 break-words">
                  {item.summary}
                </p>
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
        <InfoHeading>Yayınlar</InfoHeading>
        <div className="mt-2 space-y-1.5">
          {publications.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.name}
                  {item.publisher && (
                    <span className="font-normal text-gray-600">
                      {' — '}
                      {item.publisher}
                    </span>
                  )}
                </h3>
                <span className="shrink-0 text-[9.5px] text-gray-500">
                  {formatMonth(item.date)}
                </span>
              </div>
              {item.url && (
                <p
                  className="text-[9.5px] break-all"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.url}
                </p>
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
                <InfoHeading>{section.title}</InfoHeading>
                <div className="mt-2 space-y-1">
                  {section.fields.map((f) => (
                    <div
                      key={f.id}
                      className="grid min-w-0 grid-cols-[auto_1fr] gap-2"
                    >
                      {f.label && (
                        <span
                          className="font-semibold break-words"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          {f.label}:
                        </span>
                      )}
                      {f.value && (
                        <span className="min-w-0 text-gray-700 break-words">
                          {f.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ),
        )}
      </>
    )
  }
}

function InfoHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2">
      <span
        className="inline-block h-5 w-5 shrink-0 rounded-md"
        style={{
          background: `linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 55%, #fff 45%))`,
        }}
      />
      <span
        className="text-[13px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--text-color)' }}
      >
        {children}
      </span>
    </h2>
  )
}
