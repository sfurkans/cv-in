import type { CSSProperties, ReactNode } from 'react'
import { Fragment } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
import {
  SKILL_LEVEL_LABELS,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
  type Spacing,
} from '@/types/resume'

interface TerminalTemplateProps {
  resume: Resume
}

// Terminal / hacker estetiği — dark tema, monospace font (theme.fontFamily
// override edilir), GitHub dark paleti, shell-prompt başlıklar ve yorum
// benzeri metadata. theme.primaryColor accent olarak kullanılır ama
// bg/text dark sabit.

const SPACING_PADDING: Record<Spacing, string> = {
  compact: 'px-6 py-6',
  normal: 'px-8 py-8',
  relaxed: 'px-10 py-10',
}

const SPACING_SECTION: Record<Spacing, string> = {
  compact: 'mt-3',
  normal: 'mt-4',
  relaxed: 'mt-5',
}

// Fixed palette — koyu tema zorunlu
const BG = '#0d1117'
const FG = '#c9d1d9'
const DIM = '#8b949e'
const COMMENT = '#6a737d'
const KEYWORD = '#ff7b72' // kırmızı — keywords
const STRING = '#a5d6ff' // açık mavi — string/url
const FUNC = '#d2a8ff' // mor — functions

export default function TerminalTemplate({ resume }: TerminalTemplateProps) {
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
  const pad = SPACING_PADDING[theme.spacing]
  const sec = SPACING_SECTION[theme.spacing]
  const accent = theme.primaryColor
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)

  const userName = sanitizeUserName(basics.name)

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
      className={`min-h-[297mm] w-[210mm] font-mono text-[10.5px] leading-[1.55] shadow-sm ${pad}`}
      style={
        {
          backgroundColor: BG,
          color: FG,
          '--accent': accent,
        } as CSSProperties
      }
    >
      {/* Prompt line */}
      <div className="flex items-start gap-1 text-[10px] break-all">
        <span style={{ color: '#7ee787' }}>{userName}@Cv-İn</span>
        <span style={{ color: DIM }}>:</span>
        <span style={{ color: STRING }}>~</span>
        <span style={{ color: DIM }}>$ </span>
        <span style={{ color: FG }}>cat resume.md</span>
      </div>

      <div
        className="mt-2 border-t pt-2"
        style={{ borderColor: 'rgba(139,148,158,0.3)' }}
      >
        {/* Header block as comment-style metadata */}
        <div className="min-w-0">
          {basics.photo && (
            <img
              src={resolvePhotoUrl(basics.photo)}
              alt={basics.name}
              className="mb-2 h-16 w-16 rounded-sm object-cover"
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'rgba(139,148,158,0.4)',
              }}
            />
          )}
          <h1
            className="text-[22px] font-bold leading-tight break-words"
            style={{ color: FG }}
          >
            # {basics.name || 'Adınız Soyadınız'}
          </h1>
          {basics.label && (
            <p
              className="mt-0.5 text-[11px] break-words"
              style={{ color: COMMENT }}
            >
              {'// '}
              {basics.label}
            </p>
          )}

          <div
            className="mt-2 space-y-0.5 text-[10px]"
            style={{ color: DIM }}
          >
            {basics.email && (
              <div className="break-all">
                <Key>email</Key>
                <span style={{ color: STRING }}>{`"${basics.email}"`}</span>
              </div>
            )}
            {basics.phone && (
              <div>
                <Key>phone</Key>
                <span style={{ color: STRING }}>{`"${basics.phone}"`}</span>
              </div>
            )}
            {basics.profiles.map((p, i) => (
              <div key={`${p.network}-${i}`} className="break-all">
                <Key>{p.network.toLowerCase()}</Key>
                <span style={{ color: STRING }}>
                  {`"${p.url || p.username}"`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {basics.summary && (
          <section className={sec}>
            <SectionHeading accent={accent}>özet</SectionHeading>
            <p className="mt-1 break-words" style={{ color: FG }}>
              {basics.summary}
            </p>
          </section>
        )}

        {order.map((id) => (
          <Fragment key={id}>{renderers[id]?.()}</Fragment>
        ))}

        <div
          className="mt-4 text-[9.5px]"
          style={{ color: COMMENT }}
        >
          {'// EOF — '}
          {basics.name || 'resume'}
          {'.md'}
        </div>
      </div>
    </div>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <section className={sec}>
        <SectionHeading accent={accent}>experience</SectionHeading>
        <div className="mt-1 space-y-2.5">
          {work.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span style={{ color: COMMENT }} className="shrink-0 text-[9.5px]">
                  [{formatDateRange(item.startDate, item.endDate) || '—'}]
                </span>
                <span
                  className="min-w-0 font-semibold break-words"
                  style={{ color: FUNC }}
                >
                  {item.position || 'Pozisyon'}
                </span>
                {item.company && (
                  <>
                    <span style={{ color: DIM }}>@</span>
                    <span
                      className="break-words"
                      style={{ color: KEYWORD }}
                    >
                      {item.company}
                    </span>
                  </>
                )}
              </div>
              {item.summary && (
                <p className="mt-0.5 break-words" style={{ color: FG }}>
                  {item.summary}
                </p>
              )}
              {item.highlights.some((h) => h.trim()) && (
                <ul className="mt-1 space-y-0.5 text-[10px]">
                  {item.highlights
                    .filter((h) => h.trim())
                    .map((h, i) => (
                      <li
                        key={i}
                        className="flex gap-2 break-words"
                        style={{ color: FG }}
                      >
                        <span
                          className="shrink-0"
                          style={{ color: accent }}
                        >
                          &gt;
                        </span>
                        <span className="min-w-0">{h}</span>
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
        <SectionHeading accent={accent}>education</SectionHeading>
        <div className="mt-1 space-y-1.5">
          {education.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  style={{ color: COMMENT }}
                  className="shrink-0 text-[9.5px]"
                >
                  [{formatDateRange(item.startDate, item.endDate) || '—'}]
                </span>
                <span
                  className="min-w-0 font-semibold break-words"
                  style={{ color: FUNC }}
                >
                  {item.institution || 'Okul'}
                </span>
              </div>
              {(item.degree || item.field) && (
                <p
                  className="ml-1 break-words"
                  style={{ color: FG }}
                >
                  {[item.degree, item.field].filter(Boolean).join(' / ')}
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
        <SectionHeading accent={accent}>skills</SectionHeading>
        <div className="mt-1 space-y-1.5">
          {visibleSkills.map((skill) => (
            <div key={skill.id} className="min-w-0">
              {(skill.name || skill.level) && (
                <div className="text-[10px]">
                  <span style={{ color: KEYWORD }}>const </span>
                  <span style={{ color: FUNC }}>
                    {asIdent(skill.name) || 'skills'}
                  </span>
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <span style={{ color: COMMENT }}>
                      {`  // ${SKILL_LEVEL_LABELS[skill.level]}`}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-baseline gap-x-1 break-words text-[10px]">
                <span style={{ color: DIM }}>= [</span>
                {skill.keywords.map((k, i) => (
                  <Fragment key={`${skill.id}-${k}-${i}`}>
                    <span style={{ color: STRING }}>{`"${k}"`}</span>
                    {i < skill.keywords.length - 1 && (
                      <span style={{ color: DIM }}>,</span>
                    )}
                  </Fragment>
                ))}
                <span style={{ color: DIM }}>]</span>
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
      <section className={sec}>
        <SectionHeading accent={accent}>projects</SectionHeading>
        <div className="mt-1 space-y-1.5">
          {projects.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  style={{ color: COMMENT }}
                  className="shrink-0 text-[9.5px]"
                >
                  [{formatDateRange(item.startDate, item.endDate) || '—'}]
                </span>
                <span
                  className="min-w-0 font-semibold break-words"
                  style={{ color: FUNC }}
                >
                  {item.name || 'Proje'}
                </span>
              </div>
              {item.description && (
                <p className="ml-1 break-words" style={{ color: FG }}>
                  {item.description}
                </p>
              )}
              {item.url && (
                <p
                  className="ml-1 text-[9.5px] break-all"
                  style={{ color: STRING }}
                >
                  → {item.url}
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
        <SectionHeading accent={accent}>languages</SectionHeading>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
          {languages.map((l) => (
            <div key={l.id} className="min-w-0 break-words">
              <span style={{ color: FUNC }}>{l.name}</span>
              {l.proficiency && (
                <span style={{ color: COMMENT }}>
                  {` // ${l.proficiency.toUpperCase()}`}
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
        <SectionHeading accent={accent}>certifications</SectionHeading>
        <ul className="mt-1 space-y-0.5 text-[10px]">
          {certificates.map((item) => (
            <li
              key={item.id}
              className="flex gap-2 break-words"
              style={{ color: FG }}
            >
              <span className="shrink-0" style={{ color: accent }}>
                →
              </span>
              <span className="min-w-0">
                <span style={{ color: FUNC }}>{item.name}</span>
                {item.issuer && (
                  <span style={{ color: DIM }}>{` / ${item.issuer}`}</span>
                )}
                {item.date && (
                  <span style={{ color: COMMENT }}>
                    {` // ${formatMonth(item.date)}`}
                  </span>
                )}
                {item.url && (
                  <span
                    className="block text-[9.5px] break-all"
                    style={{ color: STRING }}
                  >
                    {item.url}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <section className={sec}>
        <SectionHeading accent={accent}>volunteering</SectionHeading>
        <div className="mt-1 space-y-1.5">
          {volunteer.map((item) => (
            <div key={item.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  style={{ color: COMMENT }}
                  className="shrink-0 text-[9.5px]"
                >
                  [{formatDateRange(item.startDate, item.endDate) || '—'}]
                </span>
                <span
                  className="min-w-0 font-semibold break-words"
                  style={{ color: FUNC }}
                >
                  {item.role || 'Rol'}
                </span>
                {item.organization && (
                  <>
                    <span style={{ color: DIM }}>@</span>
                    <span
                      className="break-words"
                      style={{ color: KEYWORD }}
                    >
                      {item.organization}
                    </span>
                  </>
                )}
              </div>
              {item.summary && (
                <p className="ml-1 break-words" style={{ color: FG }}>
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
        <SectionHeading accent={accent}>publications</SectionHeading>
        <ul className="mt-1 space-y-0.5 text-[10px]">
          {publications.map((item) => (
            <li
              key={item.id}
              className="flex gap-2 break-words"
              style={{ color: FG }}
            >
              <span className="shrink-0" style={{ color: accent }}>
                →
              </span>
              <span className="min-w-0">
                <span style={{ color: FUNC }}>{item.name}</span>
                {item.publisher && (
                  <span style={{ color: DIM }}>{` / ${item.publisher}`}</span>
                )}
                {item.date && (
                  <span style={{ color: COMMENT }}>
                    {` // ${formatMonth(item.date)}`}
                  </span>
                )}
                {item.url && (
                  <span
                    className="block text-[9.5px] break-all"
                    style={{ color: STRING }}
                  >
                    {item.url}
                  </span>
                )}
              </span>
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
              <section key={section.id} className={sec}>
                <SectionHeading accent={accent}>
                  {asIdent(section.title) || 'custom'}
                </SectionHeading>
                <div className="mt-1 space-y-0.5 text-[10px]">
                  {section.fields.map((f) => (
                    <div key={f.id} className="min-w-0 break-words">
                      {f.label && (
                        <span style={{ color: FUNC }}>{f.label}</span>
                      )}
                      {f.label && <span style={{ color: DIM }}>: </span>}
                      {f.value && (
                        <span style={{ color: STRING }}>{`"${f.value}"`}</span>
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

function SectionHeading({
  children,
  accent,
}: {
  children: ReactNode
  accent: string
}) {
  return (
    <h2
      className="text-[12px] font-bold"
      style={{ color: accent }}
    >
      ## <span style={{ color: FUNC }}>{children}</span>
      <span style={{ color: '#6a737d' }}>()</span>
    </h2>
  )
}

function Key({ children }: { children: ReactNode }) {
  return (
    <>
      <span style={{ color: DIM }}>{children}</span>
      <span style={{ color: DIM }}>: </span>
    </>
  )
}

function sanitizeUserName(name: string): string {
  const n = name.trim().toLowerCase()
  if (!n) return 'user'
  // Boşluk → nokta, Türkçe karakterleri Latin'e çevir, sadece a-z0-9.-
  const map: Record<string, string> = {
    ç: 'c',
    ğ: 'g',
    ı: 'i',
    ö: 'o',
    ş: 's',
    ü: 'u',
    â: 'a',
    î: 'i',
    û: 'u',
  }
  return n
    .split('')
    .map((c) => map[c] ?? c)
    .join('')
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.-]/g, '')
    .slice(0, 20) || 'user'
}

function asIdent(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}
