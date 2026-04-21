import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { resolvePhotoUrl } from '@/lib/photoUrl'
import {
  SKILL_LEVEL_LABELS,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import { PDF_SPACING } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
} from '@/types/resume'

import './fonts'

interface PDFTerminalTemplateProps {
  resume: Resume
}

// Terminal PDF — font her zaman Noto Sans Mono, dark palette sabit.
// theme.primaryColor accent olarak kullanılır.

const BG = '#0d1117'
const FG = '#c9d1d9'
const DIM = '#8b949e'
const COMMENT = '#6a737d'
const KEYWORD = '#ff7b72'
const STRING = '#a5d6ff'
const FUNC = '#d2a8ff'
const GREEN = '#7ee787'

function createStyles(primary: string, pagePadding: number, sectionGap: number) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Noto Sans Mono',
      fontSize: 9,
      color: FG,
      backgroundColor: BG,
      padding: pagePadding,
      lineHeight: 1.55,
    },
    promptRow: {
      flexDirection: 'row',
      fontSize: 9,
      flexWrap: 'wrap',
    },
    green: { color: GREEN },
    dim: { color: DIM },
    fg: { color: FG },
    string: { color: STRING },
    keyword: { color: KEYWORD },
    func: { color: FUNC },
    comment: { color: COMMENT },
    accent: { color: primary },
    divider: {
      marginTop: 6,
      marginBottom: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: 'rgba(139,148,158,0.4)',
      borderBottomStyle: 'solid',
    },
    photo: {
      width: 54,
      height: 54,
      marginBottom: 5,
      borderWidth: 0.8,
      borderStyle: 'solid',
      borderColor: 'rgba(139,148,158,0.5)',
      objectFit: 'cover',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: FG,
      marginBottom: 2,
      lineHeight: 1.15,
    },
    label: {
      fontSize: 9.5,
      color: COMMENT,
      marginBottom: 4,
    },
    metaLine: {
      fontSize: 9,
      color: DIM,
      marginBottom: 1,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionHeading: {
      fontSize: 11,
      fontWeight: 'bold',
      marginTop: 4,
      marginBottom: 3,
    },
    itemBlock: {
      marginBottom: 6,
    },
    itemRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9.5,
    },
    itemSummary: {
      fontSize: 9.5,
      color: FG,
      marginTop: 1,
      marginLeft: 2,
    },
    bulletList: {
      marginTop: 2,
      marginLeft: 6,
    },
    bulletRow: {
      flexDirection: 'row',
      fontSize: 9.5,
      color: FG,
      marginBottom: 1,
    },
    skillLine: {
      fontSize: 9.5,
      marginBottom: 1,
    },
    skillArrayLine: {
      fontSize: 9.5,
      marginBottom: 3,
    },
    eofLine: {
      fontSize: 8.5,
      color: COMMENT,
      marginTop: 10,
    },
  })
}

export default function PDFTerminalTemplate({
  resume,
}: PDFTerminalTemplateProps) {
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

  const { pagePadding, sectionGap } = PDF_SPACING[theme.spacing]
  const styles = createStyles(theme.primaryColor, pagePadding, sectionGap)
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)
  const userName = sanitizeUserName(basics.name)

  const order: SectionId[] =
    sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER

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

  const SectionHeading = ({ children }: { children: string }) => (
    <Text style={styles.sectionHeading}>
      <Text style={styles.accent}>## </Text>
      <Text style={styles.func}>{children}</Text>
      <Text style={styles.comment}>()</Text>
    </Text>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Prompt line */}
        <View style={styles.promptRow}>
          <Text style={styles.green}>{userName}@cv-in</Text>
          <Text style={styles.dim}>:</Text>
          <Text style={styles.string}>~</Text>
          <Text style={styles.dim}>$ </Text>
          <Text style={styles.fg}>cat resume.md</Text>
        </View>

        <View style={styles.divider} />

        {basics.photo && (
          <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
        )}

        <Text style={styles.name}># {basics.name || 'Adınız Soyadınız'}</Text>
        {basics.label && <Text style={styles.label}>// {basics.label}</Text>}

        {basics.email && (
          <Text style={styles.metaLine}>
            email: <Text style={styles.string}>{`"${basics.email}"`}</Text>
          </Text>
        )}
        {basics.phone && (
          <Text style={styles.metaLine}>
            phone: <Text style={styles.string}>{`"${basics.phone}"`}</Text>
          </Text>
        )}
        {basics.profiles.map((p, i) => (
          <Text key={`${p.network}-${i}`} style={styles.metaLine}>
            {p.network.toLowerCase()}:{' '}
            <Text style={styles.string}>{`"${p.url || p.username}"`}</Text>
          </Text>
        ))}

        {basics.summary && (
          <View style={styles.section}>
            <SectionHeading>özet</SectionHeading>
            <Text style={{ color: FG, fontSize: 9.5 }}>{basics.summary}</Text>
          </View>
        )}

        {order.map((id) => (
          <Fragment key={id}>{renderers[id]?.()}</Fragment>
        ))}

        <Text style={styles.eofLine}>
          // EOF — {basics.name || 'resume'}.md
        </Text>
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>experience</SectionHeading>
        {work.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <Text style={styles.itemRow}>
              <Text style={styles.comment}>
                [{formatDateRange(item.startDate, item.endDate) || '—'}]{' '}
              </Text>
              <Text style={{ ...styles.func, fontWeight: 'bold' }}>
                {item.position || 'Pozisyon'}
              </Text>
              {item.company && (
                <>
                  <Text style={styles.dim}> @ </Text>
                  <Text style={styles.keyword}>{item.company}</Text>
                </>
              )}
            </Text>
            {item.summary && (
              <Text style={styles.itemSummary}>{item.summary}</Text>
            )}
            {item.highlights.some((h) => h.trim()) && (
              <View style={styles.bulletList}>
                {item.highlights
                  .filter((h) => h.trim())
                  .map((h, i) => (
                    <Text key={i} style={styles.bulletRow}>
                      <Text style={styles.accent}>&gt; </Text>
                      {h}
                    </Text>
                  ))}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>education</SectionHeading>
        {education.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <Text style={styles.itemRow}>
              <Text style={styles.comment}>
                [{formatDateRange(item.startDate, item.endDate) || '—'}]{' '}
              </Text>
              <Text style={{ ...styles.func, fontWeight: 'bold' }}>
                {item.institution || 'Okul'}
              </Text>
            </Text>
            {(item.degree || item.field) && (
              <Text style={styles.itemSummary}>
                {[item.degree, item.field].filter(Boolean).join(' / ')}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderSkills(): ReactNode {
    if (visibleSkills.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>skills</SectionHeading>
        {visibleSkills.map((skill) => (
          <View key={skill.id} style={{ marginBottom: 3 }}>
            {(skill.name || skill.level) && (
              <Text style={styles.skillLine}>
                <Text style={styles.keyword}>const </Text>
                <Text style={styles.func}>
                  {asIdent(skill.name) || 'skills'}
                </Text>
                {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                  <Text style={styles.comment}>
                    {'  // '}
                    {SKILL_LEVEL_LABELS[skill.level]}
                  </Text>
                )}
              </Text>
            )}
            <Text style={styles.skillArrayLine}>
              <Text style={styles.dim}>= [</Text>
              {skill.keywords.map((k, i) => (
                <Fragment key={`${skill.id}-${k}-${i}`}>
                  <Text style={styles.string}>{`"${k}"`}</Text>
                  {i < skill.keywords.length - 1 && (
                    <Text style={styles.dim}>, </Text>
                  )}
                </Fragment>
              ))}
              <Text style={styles.dim}>]</Text>
            </Text>
          </View>
        ))}
      </View>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>projects</SectionHeading>
        {projects.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <Text style={styles.itemRow}>
              <Text style={styles.comment}>
                [{formatDateRange(item.startDate, item.endDate) || '—'}]{' '}
              </Text>
              <Text style={{ ...styles.func, fontWeight: 'bold' }}>
                {item.name || 'Proje'}
              </Text>
            </Text>
            {item.description && (
              <Text style={styles.itemSummary}>{item.description}</Text>
            )}
            {item.url && (
              <Text style={{ ...styles.string, fontSize: 9, marginLeft: 2 }}>
                → {item.url}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>languages</SectionHeading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {languages.map((l) => (
            <Text
              key={l.id}
              style={{ fontSize: 9.5, marginRight: 14, marginBottom: 2 }}
            >
              <Text style={styles.func}>{l.name}</Text>
              {l.proficiency && (
                <Text style={styles.comment}>
                  {' // '}
                  {l.proficiency.toUpperCase()}
                </Text>
              )}
            </Text>
          ))}
        </View>
      </View>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>certifications</SectionHeading>
        {certificates.map((item) => (
          <View key={item.id} style={{ marginBottom: 2 }}>
            <Text style={styles.bulletRow}>
              <Text style={styles.accent}>→ </Text>
              <Text style={styles.func}>{item.name}</Text>
              {item.issuer && (
                <Text style={styles.dim}> / {item.issuer}</Text>
              )}
              {item.date && (
                <Text style={styles.comment}>
                  {' // '}
                  {formatMonth(item.date)}
                </Text>
              )}
            </Text>
            {item.url && (
              <Text
                style={{
                  ...styles.string,
                  fontSize: 9,
                  marginLeft: 8,
                }}
              >
                {item.url}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>volunteering</SectionHeading>
        {volunteer.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <Text style={styles.itemRow}>
              <Text style={styles.comment}>
                [{formatDateRange(item.startDate, item.endDate) || '—'}]{' '}
              </Text>
              <Text style={{ ...styles.func, fontWeight: 'bold' }}>
                {item.role || 'Rol'}
              </Text>
              {item.organization && (
                <>
                  <Text style={styles.dim}> @ </Text>
                  <Text style={styles.keyword}>{item.organization}</Text>
                </>
              )}
            </Text>
            {item.summary && (
              <Text style={styles.itemSummary}>{item.summary}</Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>publications</SectionHeading>
        {publications.map((item) => (
          <View key={item.id} style={{ marginBottom: 2 }}>
            <Text style={styles.bulletRow}>
              <Text style={styles.accent}>→ </Text>
              <Text style={styles.func}>{item.name}</Text>
              {item.publisher && (
                <Text style={styles.dim}> / {item.publisher}</Text>
              )}
              {item.date && (
                <Text style={styles.comment}>
                  {' // '}
                  {formatMonth(item.date)}
                </Text>
              )}
            </Text>
            {item.url && (
              <Text
                style={{
                  ...styles.string,
                  fontSize: 9,
                  marginLeft: 8,
                }}
              >
                {item.url}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  function renderCustom(): ReactNode {
    if (customSections.length === 0) return null
    return (
      <>
        {customSections.map(
          (section) =>
            section.title && (
              <View key={section.id} style={styles.section}>
                <SectionHeading>
                  {asIdent(section.title) || 'custom'}
                </SectionHeading>
                {section.fields.map((f) => (
                  <Text key={f.id} style={styles.skillLine}>
                    {f.label && <Text style={styles.func}>{f.label}</Text>}
                    {f.label && <Text style={styles.dim}>: </Text>}
                    {f.value && (
                      <Text style={styles.string}>{`"${f.value}"`}</Text>
                    )}
                  </Text>
                ))}
              </View>
            )
        )}
      </>
    )
  }
}

function sanitizeUserName(name: string): string {
  const n = name.trim().toLowerCase()
  if (!n) return 'user'
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
  return (
    n
      .split('')
      .map((c) => map[c] ?? c)
      .join('')
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.-]/g, '')
      .slice(0, 20) || 'user'
  )
}

function asIdent(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}
