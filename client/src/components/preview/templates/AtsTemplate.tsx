import type { ReactNode } from 'react'
import { Fragment } from 'react'

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

interface AtsTemplateProps {
  resume: Resume
}

// ATS (Applicant Tracking System) dostu: renksiz, grafiksiz, tek kolon.
// Bilinçli olarak theme.primaryColor KULLANILMAZ — çünkü ATS parserları
// renkli/grafiksel varyantlarda sorun yaşıyor. Sadece siyah/koyu gri.
// Photo render edilmez.

export default function AtsTemplate({ resume }: AtsTemplateProps) {
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
  const { wrapper: wrapperPadding, sectionGap } = WEB_SPACING[theme.spacing]
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
      className={`min-h-[297mm] w-[210mm] bg-white ${wrapperPadding} ${fontClass} text-[11px] leading-relaxed text-black shadow-sm`}
    >
      {/* Header — metin only */}
      <header className={sectionGap}>
        <h1 className="text-[20px] font-bold leading-tight text-black break-words">
          {basics.name || 'Adınız Soyadınız'}
        </h1>
        {basics.label && (
          <p className="mt-0.5 text-[12px] text-black break-words">
            {basics.label}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap gap-x-3 text-[10px] text-black">
          {basics.email && <span className="break-all">{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.profiles.map((p, i) => (
            <span key={`${p.network}-${i}`} className="break-all">
              {p.network}: {p.url || p.username}
            </span>
          ))}
        </div>
        <hr className="mt-2 border-t border-black" />
      </header>

      {basics.summary && (
        <section className={sectionGap}>
          <AtsHeading>Özet</AtsHeading>
          <p className="mt-1 break-words">{basics.summary}</p>
        </section>
      )}

      {order.map((id) => (
        <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
      ))}
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sectionGap}>
        <AtsHeading>Deneyim</AtsHeading>
        <div className="mt-1 space-y-2.5">
          {work.map((item) => (
            <div key={item.id} className="min-w-0">
              <p className="font-bold break-words">
                {item.position || 'Pozisyon'}
                {item.company && <span>{` | ${item.company}`}</span>}
              </p>
              <p className="text-[10px]">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
              {item.summary && (
                <p className="mt-0.5 break-words">{item.summary}</p>
              )}
              {item.highlights.some((h) => h.trim()) && (
                <ul className="mt-1 ml-4 list-['-_'] space-y-0.5">
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
        <AtsHeading>Eğitim</AtsHeading>
        <div className="mt-1 space-y-1.5">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <p className="font-bold break-words">
                {item.institution || 'Okul'}
              </p>
              {(item.degree || item.field) && (
                <p className="break-words">
                  {[item.degree, item.field].filter(Boolean).join(', ')}
                </p>
              )}
              <p className="text-[10px]">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
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
        <AtsHeading>Yetenekler</AtsHeading>
        <div className="mt-1 space-y-1">
          {visibleSkills.map((skill) => {
            // ATS için chip/pill kullanma — sadece virgüllü düz liste
            const keywords = skill.keywords.join(', ')
            const levelTxt =
              skill.level && SKILL_LEVEL_LABELS[skill.level]
                ? ` (${SKILL_LEVEL_LABELS[skill.level]})`
                : ''
            return (
              <p key={skill.id} className="break-words">
                {skill.name ? (
                  <>
                    <span className="font-bold">{skill.name}</span>
                    {levelTxt}: {keywords}
                  </>
                ) : (
                  keywords
                )}
              </p>
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
        <AtsHeading>Projeler</AtsHeading>
        <div className="mt-1 space-y-1.5">
          {projects.map((item) => (
            <div key={item.id} className="min-w-0">
              <p className="font-bold break-words">{item.name || 'Proje'}</p>
              <p className="text-[10px]">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
              {item.description && (
                <p className="mt-0.5 break-words">{item.description}</p>
              )}
              {item.url && (
                <p className="mt-0.5 text-[10px] break-all">{item.url}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    const items = languages
      .map((l) =>
        l.proficiency
          ? `${l.name} (${l.proficiency.toUpperCase()})`
          : l.name,
      )
      .filter(Boolean)
    return (
      <section className={sectionGap}>
        <AtsHeading>Diller</AtsHeading>
        <p className="mt-1 break-words">{items.join(', ')}</p>
      </section>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <section className={sectionGap}>
        <AtsHeading>Sertifikalar</AtsHeading>
        <ul className="mt-1 ml-4 list-['-_'] space-y-0.5">
          {certificates.map((item) => (
            <li key={item.id} className="break-words">
              <span className="font-semibold">{item.name}</span>
              {item.issuer && <span>{` — ${item.issuer}`}</span>}
              {item.date && <span>{` (${formatMonth(item.date)})`}</span>}
              {item.url && (
                <span className="ml-1 text-[10px] break-all">{item.url}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className={sectionGap}>
        <AtsHeading>Gönüllülük</AtsHeading>
        <div className="mt-1 space-y-2">
          {volunteer.map((item) => (
            <div key={item.id} className="min-w-0">
              <p className="font-bold break-words">
                {item.role || 'Rol'}
                {item.organization && <span>{` | ${item.organization}`}</span>}
              </p>
              <p className="text-[10px]">
                {formatDateRange(item.startDate, item.endDate)}
              </p>
              {item.summary && (
                <p className="mt-0.5 break-words">{item.summary}</p>
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
        <AtsHeading>Yayınlar</AtsHeading>
        <ul className="mt-1 ml-4 list-['-_'] space-y-0.5">
          {publications.map((item) => (
            <li key={item.id} className="break-words">
              <span className="font-semibold">{item.name}</span>
              {item.publisher && <span>{` — ${item.publisher}`}</span>}
              {item.date && <span>{` (${formatMonth(item.date)})`}</span>}
              {item.url && (
                <span className="ml-1 text-[10px] break-all">{item.url}</span>
              )}
            </li>
          ))}
        </ul>
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
                <AtsHeading>{section.title}</AtsHeading>
                <div className="mt-1 space-y-0.5">
                  {section.fields.map((f) => (
                    <p key={f.id} className="break-words">
                      {f.label && <span className="font-semibold">{f.label}: </span>}
                      {f.value}
                    </p>
                  ))}
                </div>
              </section>
            ),
        )}
      </>
    )
  }
}

function AtsHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-2 border-b border-black pb-0.5 text-[12px] font-bold uppercase tracking-wider text-black">
      {children}
    </h2>
  )
}
