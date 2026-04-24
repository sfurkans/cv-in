import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import {
  SKILL_LEVEL_LABELS,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import { FONT_CLASS } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
  type Spacing,
} from '@/types/resume'

interface ModernCleanTemplateProps {
  resume: Resume
}

// Modern Clean — cömert whitespace, büyük sans-serif başlıklar, dinlendirici
// tek kolon. Renk sadece isim altı mini çizgi + başlık noktası + minör vurgu.
// Gereksiz chrome yok, tipografi hiyerarşisi üzerinden okunurluk.

const SPACING_PADDING: Record<Spacing, string> = {
  compact: 'px-10 py-9',
  normal: 'px-12 py-12',
  relaxed: 'px-14 py-14',
}

const SPACING_SECTION: Record<Spacing, string> = {
  compact: 'mt-5',
  normal: 'mt-7',
  relaxed: 'mt-9',
}

export default function ModernCleanTemplate({
  resume,
}: ModernCleanTemplateProps) {
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
  const pad = SPACING_PADDING[theme.spacing]
  const sec = SPACING_SECTION[theme.spacing]
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
      className={`h-[297mm] w-[210mm] overflow-hidden bg-white ${pad} ${fontClass} text-[11px] leading-relaxed text-gray-700 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      <header>
        <h1
          className="text-[30px] font-bold leading-[1.05] tracking-tight break-words"
          style={{ color: 'var(--text-color)' }}
        >
          {basics.name || 'Adınız Soyadınız'}
        </h1>
        {basics.label && (
          <p className="mt-1 text-[14px] font-medium text-gray-500 break-words">
            {basics.label}
          </p>
        )}
      </header>

      {(basics.email ||
        basics.phone ||
        basics.profiles.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
          {basics.email && <span className="break-all">{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.profiles.map((p, i) => (
            <span key={`${p.network}-${i}`} className="break-all">
              {p.network}: {p.url || p.username}
            </span>
          ))}
        </div>
      )}

      {basics.summary && (
        <section className={sec}>
          <CleanHeading>Özet</CleanHeading>
          <p className="mt-3 text-gray-700 break-words">{basics.summary}</p>
        </section>
      )}

      {order.map((id) => (
        <Fragment key={id}>{renderers[id]?.()}</Fragment>
      ))}
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sec}>
        <CleanHeading>Deneyim</CleanHeading>
        <div className="mt-3 space-y-4">
          {work.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[13px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.position || 'Pozisyon'}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.company && (
                <p
                  className="text-[11.5px] font-medium break-words"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.company}
                </p>
              )}
              {item.summary && (
                <p className="mt-1 text-gray-700 break-words">{item.summary}</p>
              )}
              {item.highlights.some((h) => h.trim()) && (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-gray-700 marker:text-gray-400">
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
      </section>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <section className={sec}>
        <CleanHeading>Eğitim</CleanHeading>
        <div className="mt-3 space-y-3">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[13px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.institution || 'Okul'}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
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
      <section className={sec}>
        <CleanHeading>Yetenekler</CleanHeading>
        <div className="mt-3 space-y-2.5">
          {visibleSkills.map((skill) => (
            <div key={skill.id} className="min-w-0">
              {(skill.name || skill.level) && (
                <div className="mb-1 flex items-baseline gap-2">
                  {skill.name && (
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      {skill.name}
                    </span>
                  )}
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <span className="text-[10px] text-gray-500">
                      {SKILL_LEVEL_LABELS[skill.level]}
                    </span>
                  )}
                </div>
              )}
              <p className="text-gray-700 break-words">
                {skill.keywords.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <section className={sec}>
        <CleanHeading>Projeler</CleanHeading>
        <div className="mt-3 space-y-3">
          {projects.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[13px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.name || 'Proje'}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
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
                  className="mt-0.5 text-[10px] break-all"
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
      <section className={sec}>
        <CleanHeading>Diller</CleanHeading>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
          {languages.map((item) => (
            <div key={item.id} className="text-gray-700">
              <span
                className="font-semibold"
                style={{ color: 'var(--text-color)' }}
              >
                {item.name}
              </span>
              {item.proficiency && (
                <span className="ml-2 text-[10px] text-gray-500">
                  {item.proficiency.toUpperCase()}
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
      <section className={sec}>
        <CleanHeading>Sertifikalar</CleanHeading>
        <div className="mt-3 space-y-2">
          {certificates.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[12px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.name}
                  {item.issuer && (
                    <span className="font-normal text-gray-500">
                      {' — '}
                      {item.issuer}
                    </span>
                  )}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
                  {formatMonth(item.date)}
                </span>
              </div>
              {item.url && (
                <p
                  className="text-[10px] break-all"
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

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className={sec}>
        <CleanHeading>Gönüllülük</CleanHeading>
        <div className="mt-3 space-y-3">
          {volunteer.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[13px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.role || 'Rol'}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.organization && (
                <p
                  className="text-[11.5px] font-medium break-words"
                  style={{ color: 'var(--primary-color)' }}
                >
                  {item.organization}
                </p>
              )}
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
      <section className={sec}>
        <CleanHeading>Yayınlar</CleanHeading>
        <div className="mt-3 space-y-2">
          {publications.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3
                  className="min-w-0 text-[12px] font-semibold break-words"
                  style={{ color: 'var(--text-color)' }}
                >
                  {item.name}
                  {item.publisher && (
                    <span className="font-normal text-gray-500">
                      {' — '}
                      {item.publisher}
                    </span>
                  )}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-gray-500">
                  {formatMonth(item.date)}
                </span>
              </div>
              {item.url && (
                <p
                  className="text-[10px] break-all"
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
              <section key={section.id} className={sec}>
                <CleanHeading>{section.title}</CleanHeading>
                <div className="mt-3 space-y-1">
                  {section.fields.map((f) => (
                    <div
                      key={f.id}
                      className="grid min-w-0 grid-cols-[auto_1fr] gap-3"
                    >
                      {f.label && (
                        <span
                          className="font-semibold break-words"
                          style={{ color: 'var(--text-color)' }}
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

function CleanHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-[15px] font-bold tracking-tight"
      style={{ color: 'var(--text-color)' }}
    >
      {children}
    </h2>
  )
}
