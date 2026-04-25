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
  type CefrSkillKey,
  type Language,
  type Resume,
  type SectionId,
} from '@/types/resume'

interface EuropassTemplateProps {
  resume: Resume
}

// Dil satırının belirli bir alt-beceri için seviyesi: cefr detay girildiyse
// onu, yoksa tek proficiency değerini fallback olarak kullan.
function cefrValue(lang: Language, skill: CefrSkillKey): string {
  const v = lang.cefr?.[skill] || lang.proficiency
  if (!v || v === 'native') return ''
  return v.toUpperCase()
}

export default function EuropassTemplate({ resume }: EuropassTemplateProps) {
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

  const motherTongues = languages.filter((l) => l.proficiency === 'native')
  const otherLanguages = languages.filter((l) => l.proficiency !== 'native')

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
      className={`flex min-h-[297mm] w-[210mm] flex-col bg-white ${fontClass} text-[10.5px] leading-snug text-gray-800 shadow-sm`}
      style={
        {
          '--primary-color': theme.primaryColor,
          '--text-color': theme.textColor,
        } as CSSProperties
      }
    >
      {/* Üst şerit — isim, ünvan, iletişim, fotoğraf */}
      <header
        className="flex items-start gap-4 px-7 py-5 text-white"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        {basics.photo && (
          <img
            src={resolvePhotoUrl(basics.photo)}
            alt={basics.name}
            className="h-[88px] w-[88px] shrink-0 rounded-sm border-2 border-white/40 object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] opacity-80">
            Europass · Özgeçmiş
          </p>
          <h1 className="mt-0.5 text-[20px] font-bold leading-tight break-words">
            {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p className="mt-0.5 text-[11px] font-medium opacity-95 break-words">
              {basics.label}
            </p>
          )}
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[9.5px]">
            {basics.email && (
              <>
                <dt className="opacity-80">E-posta</dt>
                <dd className="break-all">{basics.email}</dd>
              </>
            )}
            {basics.phone && (
              <>
                <dt className="opacity-80">Telefon</dt>
                <dd className="break-words">{basics.phone}</dd>
              </>
            )}
            {basics.profiles.map((p, i) => (
              <Fragment key={`${p.network}-${i}`}>
                <dt className="opacity-80 capitalize">{p.network}</dt>
                <dd className="break-all">{p.url || p.username}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </header>

      {/* İçerik */}
      <main className="flex-1 px-7 py-5">
        {basics.summary && (
          <section className="mb-3">
            <EuropassHeading>Kişisel Özet</EuropassHeading>
            <p className="mt-1 text-gray-700 break-words">{basics.summary}</p>
          </section>
        )}

        {order.map((id) => (
          <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
        ))}
      </main>
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>İş Deneyimi</EuropassHeading>
        <div className="mt-2 space-y-2.5">
          {work.map((item) => (
            <article key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatDateRange(item.startDate, item.endDate)}
              </aside>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 break-words">
                  {item.position || 'Pozisyon'}
                </h3>
                {item.company && (
                  <p className="italic text-gray-600 break-words">
                    {item.company}
                  </p>
                )}
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
            </article>
          ))}
        </div>
      </section>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Eğitim ve Öğretim</EuropassHeading>
        <div className="mt-2 space-y-2">
          {education.map((item) => (
            <article key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatDateRange(item.startDate, item.endDate)}
              </aside>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 break-words">
                  {item.institution || 'Okul'}
                </h3>
                {(item.degree || item.field) && (
                  <p className="italic text-gray-700 break-words">
                    {[item.degree, item.field].filter(Boolean).join(' — ')}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  function renderSkills(): ReactNode {
    const visible = skills.filter((s) => s.name || s.keywords.length > 0)
    if (visible.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Profesyonel Beceriler</EuropassHeading>
        <div className="mt-2 space-y-1.5">
          {visible.map((skill) => (
            <div
              key={skill.id}
              className="grid grid-cols-[120px_1fr] gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 break-words">
                  {skill.name}
                </p>
                {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                  <p className="text-[9px] text-gray-500">
                    {SKILL_LEVEL_LABELS[skill.level]}
                  </p>
                )}
              </div>
              <div className="min-w-0 break-words text-gray-700">
                {skill.keywords.join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Diller</EuropassHeading>

        {motherTongues.length > 0 && (
          <div className="mt-2 grid grid-cols-[120px_1fr] gap-3">
            <p className="font-semibold text-gray-900">Ana dil</p>
            <p className="text-gray-700 break-words">
              {motherTongues
                .map((l) => l.name)
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}

        {otherLanguages.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 font-semibold text-gray-900">Diğer diller</p>
            <table className="w-full border-collapse text-[9px]">
              <thead>
                <tr
                  className="text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <th className="border border-white/30 p-1 text-left font-semibold">
                    Dil
                  </th>
                  <th className="border border-white/30 p-1 font-normal">
                    Dinleme
                  </th>
                  <th className="border border-white/30 p-1 font-normal">
                    Okuma
                  </th>
                  <th className="border border-white/30 p-1 font-normal">
                    Karşılıklı
                  </th>
                  <th className="border border-white/30 p-1 font-normal">
                    Sözlü Üretim
                  </th>
                  <th className="border border-white/30 p-1 font-normal">
                    Yazma
                  </th>
                </tr>
              </thead>
              <tbody>
                {otherLanguages.map((l) => (
                  <tr key={l.id}>
                    <td className="border border-gray-300 p-1 font-semibold text-gray-900 break-words">
                      {l.name}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {cefrValue(l, 'listening')}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {cefrValue(l, 'reading')}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {cefrValue(l, 'spokenInteraction')}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {cefrValue(l, 'spokenProduction')}
                    </td>
                    <td className="border border-gray-300 p-1 text-center">
                      {cefrValue(l, 'writing')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-[8px] text-gray-500">
              ANLAMA (Dinleme + Okuma) · KONUŞMA (Karşılıklı + Sözlü Üretim) ·
              YAZMA — Seviyeler: A1/A2 Temel, B1/B2 Bağımsız, C1/C2 Yetkin
              (CEFR)
            </p>
          </div>
        )}
      </section>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Projeler</EuropassHeading>
        <div className="mt-2 space-y-2">
          {projects.map((item) => (
            <article key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatDateRange(item.startDate, item.endDate)}
              </aside>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 break-words">
                  {item.name || 'Proje'}
                </h3>
                {item.description && (
                  <p className="text-gray-700 break-words">
                    {item.description}
                  </p>
                )}
                {item.url && (
                  <p className="text-[9px] text-gray-500 break-all">
                    {item.url}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Sertifikalar</EuropassHeading>
        <div className="mt-2 space-y-1.5">
          {certificates.map((item) => (
            <div key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatMonth(item.date)}
              </aside>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 break-words">
                  {item.name}
                </p>
                {item.issuer && (
                  <p className="italic text-gray-600 break-words">
                    {item.issuer}
                  </p>
                )}
                {item.url && (
                  <p className="text-[9px] text-gray-500 break-all">
                    {item.url}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Gönüllülük</EuropassHeading>
        <div className="mt-2 space-y-2">
          {volunteer.map((item) => (
            <article key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatDateRange(item.startDate, item.endDate)}
              </aside>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 break-words">
                  {item.role || 'Rol'}
                </h3>
                {item.organization && (
                  <p className="italic text-gray-600 break-words">
                    {item.organization}
                  </p>
                )}
                {item.summary && (
                  <p className="text-gray-700 break-words">{item.summary}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    return (
      <section className="mb-3">
        <EuropassHeading>Yayınlar</EuropassHeading>
        <div className="mt-2 space-y-1.5">
          {publications.map((item) => (
            <div key={item.id} className="grid grid-cols-[88px_1fr] gap-3">
              <aside className="pt-0.5 text-[9px] text-gray-500">
                {formatMonth(item.date)}
              </aside>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 break-words">
                  {item.name}
                </p>
                {item.publisher && (
                  <p className="italic text-gray-600 break-words">
                    {item.publisher}
                  </p>
                )}
                {item.url && (
                  <p className="text-[9px] text-gray-500 break-all">
                    {item.url}
                  </p>
                )}
              </div>
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
              <section key={section.id} className="mb-3">
                <EuropassHeading>{section.title}</EuropassHeading>
                {section.fields.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {section.fields.map((f) => (
                      <div
                        key={f.id}
                        className="grid grid-cols-[120px_1fr] gap-3"
                      >
                        {f.label && (
                          <span className="font-semibold text-gray-900 break-words">
                            {f.label}
                          </span>
                        )}
                        {f.value && (
                          <span className="text-gray-700 break-words">
                            {f.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ),
        )}
      </>
    )
  }
}

function EuropassHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="border-b-2 pb-0.5 text-[11px] font-bold uppercase tracking-wider"
      style={{
        borderColor: 'var(--primary-color)',
        color: 'var(--primary-color)',
      }}
    >
      {children}
    </h2>
  )
}
