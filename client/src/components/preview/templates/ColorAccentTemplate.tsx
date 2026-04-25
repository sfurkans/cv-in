import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
import {
  SKILL_LEVEL_LABELS,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import { FONT_CLASS, WEB_SPACING } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
} from '@/types/resume'

interface ColorAccentTemplateProps {
  resume: Resume
}

// Tek kolonlu, marka rengi dominant template:
// - Üstte kalın renkli bar (8mm)
// - Her section başlığında sol tarafında renkli dikey şerit
// - Skill chip'leri primary color outline
// - Header sol foto + sağ bilgi

export default function ColorAccentTemplate({
  resume,
}: ColorAccentTemplateProps) {
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
      className={`flex min-h-[297mm] w-[210mm] flex-col bg-white ${fontClass} text-[11px] leading-snug text-gray-800 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Üst renk barı */}
      <div
        className="h-[8mm] shrink-0"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />

      <div className="flex-1 p-8">
        {/* Header */}
        <header className={`${sectionGap} flex items-center gap-5`}>
          {basics.photo && (
            <img
              src={resolvePhotoUrl(basics.photo)}
              alt={basics.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover ring-[3px]"
              style={{ boxShadow: '0 0 0 3px var(--primary-color)' }}
            />
          )}
          <div className="min-w-0 flex-1">
            <h1
              className="text-[24px] font-bold tracking-tight break-words"
              style={{ color: 'var(--text-color)' }}
            >
              {basics.name || 'Adınız Soyadınız'}
            </h1>
            {basics.label && (
              <p
                className="mt-0.5 text-[13px] font-medium break-words"
                style={{ color: 'var(--primary-color)' }}
              >
                {basics.label}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
              {basics.email && <span className="break-all">{basics.email}</span>}
              {basics.phone && <span>{basics.phone}</span>}
              {basics.profiles.map((p, i) => (
                <span
                  key={`${p.network}-${i}`}
                  className="break-all"
                >
                  <span className="font-semibold" style={{ color: 'var(--primary-color)' }}>
                    {p.network}:
                  </span>{' '}
                  {p.url || p.username}
                </span>
              ))}
            </div>
          </div>
        </header>

        {basics.summary && (
          <section className={sectionGap}>
            <AccentHeading>Özet</AccentHeading>
            <p className="mt-1.5 text-gray-700 break-words">{basics.summary}</p>
          </section>
        )}

        {order.map((id) => (
          <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
        ))}
      </div>
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sectionGap}>
        <AccentHeading>Deneyim</AccentHeading>
        <div className="mt-2 space-y-2.5">
          {work.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.position || 'Pozisyon'}
                  {item.company && (
                    <span className="font-normal text-gray-600">
                      {' — '}
                      {item.company}
                    </span>
                  )}
                </h3>
                <span
                  className="shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-medium text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
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
      </section>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <section className={sectionGap}>
        <AccentHeading>Eğitim</AccentHeading>
        <div className="mt-2 space-y-2">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.institution || 'Okul'}
                </h3>
                <span
                  className="shrink-0 rounded-sm px-1.5 py-0.5 text-[9px] font-medium text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
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
        <AccentHeading>Yetenekler</AccentHeading>
        <div className="mt-2 space-y-2">
          {visibleSkills.map((skill) => (
            <div key={skill.id} className="min-w-0">
              {(skill.name || skill.level) && (
                <div className="mb-1 flex items-baseline gap-1.5">
                  {skill.name && (
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      {skill.name}
                    </span>
                  )}
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <span className="text-[9.5px] text-gray-500">
                      · {SKILL_LEVEL_LABELS[skill.level]}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {skill.keywords.map((keyword, i) => (
                  <span
                    key={`${skill.id}-${keyword}-${i}`}
                    className="rounded-md border px-1.5 py-0.5 text-[9.5px] break-words"
                    style={{
                      borderColor: 'var(--primary-color)',
                      color: 'var(--primary-color)',
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
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
        <AccentHeading>Projeler</AccentHeading>
        <div className="mt-2 space-y-2">
          {projects.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.name || 'Proje'}
                </h3>
                <span className="shrink-0 text-[9px] text-gray-500">
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
        <AccentHeading>Diller</AccentHeading>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {languages.map((item) => (
            <div key={item.id} className="text-gray-700">
              <span className="font-semibold text-gray-900">{item.name}</span>
              {item.proficiency && (
                <span
                  className="ml-1 rounded-sm px-1 py-0.5 text-[9px] text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
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
      <section className={sectionGap}>
        <AccentHeading>Sertifikalar</AccentHeading>
        <div className="mt-2 space-y-1.5">
          {certificates.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
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

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className={sectionGap}>
        <AccentHeading>Gönüllülük</AccentHeading>
        <div className="mt-2 space-y-2">
          {volunteer.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
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
        <AccentHeading>Yayınlar</AccentHeading>
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
                <span className="shrink-0 text-[9px] text-gray-500">
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
                <AccentHeading>{section.title}</AccentHeading>
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

function AccentHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2">
      <span
        className="inline-block h-4 w-1 rounded-sm"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />
      <span
        className="text-[12px] font-bold uppercase tracking-widest"
        style={{ color: 'var(--primary-color)' }}
      >
        {children}
      </span>
    </h2>
  )
}
