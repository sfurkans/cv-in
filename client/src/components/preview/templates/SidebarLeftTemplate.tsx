import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
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
} from '@/types/resume'

interface SidebarLeftTemplateProps {
  resume: Resume
}

// Sidebar'da sabit görünen bölümler. Main column'da sectionOrder'a göre
// kalan bölümler render edilir.
const SIDEBAR_SECTIONS = new Set<SectionId>(['skills', 'languages'])

export default function SidebarLeftTemplate({ resume }: SidebarLeftTemplateProps) {
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
  const mainOrder = order.filter((id) => !SIDEBAR_SECTIONS.has(id))

  const fontClass = FONT_CLASS[theme.fontFamily]
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)

  const sectionRenderers: Record<SectionId, () => ReactNode> = {
    experience: renderExperience,
    education: renderEducation,
    skills: () => null, // sidebar'da render ediliyor
    projects: renderProjects,
    languages: () => null, // sidebar'da render ediliyor
    certificates: renderCertificates,
    volunteer: renderVolunteer,
    publications: renderPublications,
    custom: renderCustom,
  }

  return (
    <div
      className={`flex min-h-[297mm] w-[210mm] bg-white ${fontClass} text-[10.5px] leading-snug text-gray-800 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Sidebar — sabit genişlik */}
      <aside
        className="flex w-[72mm] shrink-0 flex-col gap-4 p-5 text-white"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        {basics.photo && (
          <div className="flex justify-center">
            <img
              src={resolvePhotoUrl(basics.photo)}
              alt={basics.name}
              className="h-24 w-24 rounded-full border-[3px] border-white/30 object-cover"
            />
          </div>
        )}

        <div className="min-w-0 text-center">
          <h1 className="text-[15px] font-bold leading-tight break-words">
            {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p className="mt-1 text-[10px] leading-tight opacity-90 break-words">
              {basics.label}
            </p>
          )}
        </div>

        {(basics.email ||
          basics.phone ||
          basics.profiles.length > 0) && (
          <section className="min-w-0">
            <SidebarHeading>İletişim</SidebarHeading>
            <ul className="mt-2 space-y-1 text-[9.5px] break-words">
              {basics.email && <li>{basics.email}</li>}
              {basics.phone && <li>{basics.phone}</li>}
              {basics.profiles.map((p, i) => (
                <li key={`${p.network}-${i}`} className="break-all">
                  <span className="font-semibold">{p.network}:</span>{' '}
                  {p.url || p.username}
                </li>
              ))}
            </ul>
          </section>
        )}

        {visibleSkills.length > 0 && (
          <section className="min-w-0">
            <SidebarHeading>Yetenekler</SidebarHeading>
            <div className="mt-2 space-y-2">
              {visibleSkills.map((skill) => (
                <div key={skill.id} className="min-w-0">
                  {(skill.name || skill.level) && (
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5 text-[9.5px]">
                      {skill.name && (
                        <span className="font-semibold break-words">
                          {skill.name}
                        </span>
                      )}
                      {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                        <span className="opacity-80">
                          · {SKILL_LEVEL_LABELS[skill.level]}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {skill.keywords.map((keyword, i) => (
                      <span
                        key={`${skill.id}-${keyword}-${i}`}
                        className="rounded-sm bg-white/15 px-1.5 py-0.5 text-[8.5px] break-words"
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

        {languages.length > 0 && (
          <section className="min-w-0">
            <SidebarHeading>Diller</SidebarHeading>
            <ul className="mt-2 space-y-1 text-[9.5px]">
              {languages.map((l) => (
                <li
                  key={l.id}
                  className="flex items-baseline justify-between gap-2"
                >
                  <span className="min-w-0 break-words font-medium">
                    {l.name}
                  </span>
                  {l.proficiency && (
                    <span className="shrink-0 opacity-80">
                      {l.proficiency.toUpperCase()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* Main content — esnek genişlik */}
      <main className="flex min-w-0 flex-1 flex-col gap-3 p-6">
        {basics.summary && (
          <section>
            <MainHeading>Özet</MainHeading>
            <p className="mt-1.5 text-gray-700 break-words">{basics.summary}</p>
          </section>
        )}

        {mainOrder.map((id) => (
          <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
        ))}
      </main>
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section>
        <MainHeading>Deneyim</MainHeading>
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
                <span className="shrink-0 text-[9px] text-gray-500">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.summary && (
                <p className="mt-0.5 text-gray-700 break-words">
                  {item.summary}
                </p>
              )}
              {item.highlights.some((h) => h.trim()) && (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-gray-700">
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
      <section>
        <MainHeading>Eğitim</MainHeading>
        <div className="mt-2 space-y-2">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <h3 className="min-w-0 font-semibold text-gray-900 break-words">
                  {item.institution || 'Okul'}
                </h3>
                <span className="shrink-0 text-[9px] text-gray-500">
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

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <section>
        <MainHeading>Projeler</MainHeading>
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
                <p className="mt-0.5 text-[9px] text-gray-500 break-all">
                  {item.url}
                </p>
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
      <section>
        <MainHeading>Sertifikalar</MainHeading>
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
      <section>
        <MainHeading>Gönüllülük</MainHeading>
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
      <section>
        <MainHeading>Yayınlar</MainHeading>
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
                <p className="text-[9px] text-gray-500 break-all">{item.url}</p>
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
              <section key={section.id}>
                <MainHeading>{section.title}</MainHeading>
                {section.fields.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {section.fields.map((f) => (
                      <div
                        key={f.id}
                        className="grid min-w-0 grid-cols-[auto_1fr] gap-2"
                      >
                        {f.label && (
                          <span className="font-semibold text-gray-900 break-words">
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
                )}
              </section>
            )
        )}
      </>
    )
  }
}

function SidebarHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-b border-white/25 pb-1 text-[10px] font-bold uppercase tracking-widest">
      {children}
    </h2>
  )
}

function MainHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="border-b pb-0.5 text-[10.5px] font-bold uppercase tracking-widest"
      style={{
        borderColor: 'var(--primary-color)',
        color: 'var(--primary-color)',
      }}
    >
      {children}
    </h2>
  )
}
