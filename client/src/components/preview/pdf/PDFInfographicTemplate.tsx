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
  LANGUAGE_PROFICIENCY_PERCENT,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_PERCENT,
  formatDateRange,
  formatMonth,
} from '@/lib/resumeFormat'
import { PDF_FONT_MAP, PDF_SPACING } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
} from '@/types/resume'

import './fonts'

interface PDFInfographicTemplateProps {
  resume: Resume
}

function createStyles(
  fontFamily: string,
  primary: string,
  primaryLight: string,
  text: string,
  pagePadding: number,
  sectionGap: number
) {
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9.5,
      color: '#333333',
      padding: 0,
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: primary,
      paddingHorizontal: pagePadding,
      paddingVertical: 20,
      color: '#ffffff',
    },
    photo: {
      width: 78,
      height: 78,
      borderRadius: 39,
      marginRight: 14,
      borderWidth: 3,
      borderStyle: 'solid',
      borderColor: 'rgba(255,255,255,0.4)',
      objectFit: 'cover',
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 2,
    },
    label: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.92)',
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 8.5,
      color: 'rgba(255,255,255,0.9)',
    },
    contactItem: {
      marginRight: 10,
      marginBottom: 2,
    },
    body: {
      padding: pagePadding,
      paddingTop: 16,
    },
    section: {
      marginBottom: sectionGap,
    },
    headingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    headingBox: {
      width: 12,
      height: 12,
      backgroundColor: primary,
      marginRight: 6,
    },
    sectionHeading: {
      fontSize: 12,
      fontWeight: 'bold',
      color: text,
      letterSpacing: 0.9,
      textTransform: 'uppercase',
    },
    itemBlock: {
      marginBottom: 7,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#222222',
      flex: 1,
    },
    itemCompany: {
      fontWeight: 'normal',
      color: primary,
    },
    itemDate: {
      fontSize: 8.5,
      color: '#777777',
      marginLeft: 6,
    },
    itemBody: {
      fontSize: 9.5,
      color: '#444444',
      marginTop: 1,
    },
    timelineWrap: {
      paddingLeft: 12,
      position: 'relative',
    },
    timelineLine: {
      position: 'absolute',
      left: 3,
      top: 3,
      bottom: 3,
      width: 1.5,
      backgroundColor: primary,
      opacity: 0.3,
    },
    timelineDot: {
      position: 'absolute',
      left: 0,
      top: 4,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: primary,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bullet: {
      fontSize: 9.5,
      color: '#444444',
      marginBottom: 1,
    },
    skillsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillCell: {
      width: '48%',
      marginRight: '2%',
      marginBottom: 6,
    },
    skillHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    skillName: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: text,
      flex: 1,
    },
    skillLevel: {
      fontSize: 8.5,
      color: primary,
    },
    skillBarTrack: {
      height: 3,
      backgroundColor: '#e5e7eb',
      borderRadius: 1.5,
      overflow: 'hidden',
    },
    skillBarFill: {
      height: '100%',
      backgroundColor: primary,
      borderRadius: 1.5,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 2,
    },
    chip: {
      fontSize: 8,
      color: primary,
      backgroundColor: primaryLight,
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 7,
      marginRight: 3,
      marginBottom: 2,
    },
    langGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    langCell: {
      width: '48%',
      marginRight: '2%',
      marginBottom: 4,
    },
    langHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    langName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
    },
    langProf: {
      fontSize: 8.5,
      color: primary,
    },
    certCard: {
      width: '48%',
      marginRight: '2%',
      marginBottom: 6,
      padding: 5,
      borderWidth: 0.6,
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      borderRadius: 3,
    },
    certName: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#222222',
    },
    certIssuer: {
      fontSize: 8.5,
      color: '#666666',
    },
    certDate: {
      fontSize: 8,
      color: primary,
      marginTop: 1,
    },
    url: {
      fontSize: 8.5,
      color: primary,
      marginTop: 1,
    },
    summaryText: {
      fontSize: 9.5,
      color: '#444444',
      marginTop: 3,
    },
    customRow: {
      flexDirection: 'row',
      marginBottom: 1,
    },
    customLabel: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: primary,
      marginRight: 4,
    },
    customValue: {
      fontSize: 9.5,
      color: '#444444',
      flex: 1,
    },
  })
}

function lightenHex(hex: string, amount = 0.85): string {
  // Hex'i HSL'ye veya basit mix'e çevirmek için: naif bir approach ile
  // RGB'yi beyazla karıştır (amount ne kadar fazla → beyaza yakın)
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return '#f3f4f6'
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  const hx = (n: number) => n.toString(16).padStart(2, '0')
  return `#${hx(mix(r))}${hx(mix(g))}${hx(mix(b))}`
}

export default function PDFInfographicTemplate({
  resume,
}: PDFInfographicTemplateProps) {
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

  const fontFamily = PDF_FONT_MAP[theme.fontFamily]
  const { pagePadding, sectionGap } = PDF_SPACING[theme.spacing]
  const primaryLight = lightenHex(theme.primaryColor, 0.85)
  const styles = createStyles(
    fontFamily,
    theme.primaryColor,
    primaryLight,
    theme.textColor,
    pagePadding,
    sectionGap
  )
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)

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

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <View style={styles.headingRow}>
      <View style={styles.headingBox} />
      <Text style={styles.sectionHeading}>{children}</Text>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {basics.photo && (
            <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {basics.name || 'Adınız Soyadınız'}
            </Text>
            {basics.label && <Text style={styles.label}>{basics.label}</Text>}
            <View style={styles.contactRow}>
              {basics.email && (
                <Text style={styles.contactItem}>◆ {basics.email}</Text>
              )}
              {basics.phone && (
                <Text style={styles.contactItem}>◆ {basics.phone}</Text>
              )}
              {basics.profiles.map((p, i) => (
                <Text
                  key={`${p.network}-${i}`}
                  style={styles.contactItem}
                >
                  ◆ {p.network}: {p.url || p.username}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {basics.summary && (
            <View style={styles.section}>
              <SectionHeading>ÖZET</SectionHeading>
              <Text style={styles.summaryText}>{basics.summary}</Text>
            </View>
          )}

          {order.map((id) => (
            <Fragment key={id}>{renderers[id]?.()}</Fragment>
          ))}
        </View>
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>DENEYİM</SectionHeading>
        <View style={styles.timelineWrap}>
          <View style={styles.timelineLine} />
          {work.map((item) => (
            <View key={item.id} style={{ ...styles.itemBlock, position: 'relative' }}>
              <View style={styles.timelineDot} />
              <View style={{ paddingLeft: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {item.position || 'Pozisyon'}
                    {item.company && (
                      <Text style={styles.itemCompany}> @ {item.company}</Text>
                    )}
                  </Text>
                  <Text style={styles.itemDate}>
                    {formatDateRange(item.startDate, item.endDate)}
                  </Text>
                </View>
                {item.summary && (
                  <Text style={styles.itemBody}>{item.summary}</Text>
                )}
                {item.highlights.some((h) => h.trim()) && (
                  <View style={styles.bulletList}>
                    {item.highlights
                      .filter((h) => h.trim())
                      .map((h, i) => (
                        <Text key={i} style={styles.bullet}>
                          • {h}
                        </Text>
                      ))}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>EĞİTİM</SectionHeading>
        {education.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.institution || 'Okul'}
              </Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {(item.degree || item.field) && (
              <Text style={styles.itemBody}>
                {[item.degree, item.field].filter(Boolean).join(' — ')}
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
        <SectionHeading>YETENEKLER</SectionHeading>
        <View style={styles.skillsGrid}>
          {visibleSkills.map((skill) => {
            const pct = skill.level
              ? SKILL_LEVEL_PERCENT[skill.level] ?? 50
              : null
            return (
              <View key={skill.id} style={styles.skillCell}>
                <View style={styles.skillHeader}>
                  <Text style={styles.skillName}>
                    {skill.name || 'Yetenek'}
                  </Text>
                  {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                    <Text style={styles.skillLevel}>
                      {SKILL_LEVEL_LABELS[skill.level]}
                    </Text>
                  )}
                </View>
                {pct !== null && (
                  <View style={styles.skillBarTrack}>
                    <View
                      style={{
                        ...styles.skillBarFill,
                        width: `${pct}%`,
                      }}
                    />
                  </View>
                )}
                {skill.keywords.length > 0 && (
                  <View style={styles.chipRow}>
                    {skill.keywords.map((k, i) => (
                      <Text
                        key={`${skill.id}-${k}-${i}`}
                        style={styles.chip}
                      >
                        {k}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>PROJELER</SectionHeading>
        {projects.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.name || 'Proje'}</Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.description && (
              <Text style={styles.itemBody}>{item.description}</Text>
            )}
            {item.url && <Text style={styles.url}>{item.url}</Text>}
          </View>
        ))}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>DİLLER</SectionHeading>
        <View style={styles.langGrid}>
          {languages.map((l) => {
            const prof = l.proficiency?.toLowerCase() ?? ''
            const pct = LANGUAGE_PROFICIENCY_PERCENT[prof] ?? null
            return (
              <View key={l.id} style={styles.langCell}>
                <View style={styles.langHeader}>
                  <Text style={styles.langName}>{l.name}</Text>
                  {l.proficiency && (
                    <Text style={styles.langProf}>
                      {l.proficiency.toUpperCase()}
                    </Text>
                  )}
                </View>
                {pct !== null && (
                  <View style={styles.skillBarTrack}>
                    <View
                      style={{
                        ...styles.skillBarFill,
                        width: `${pct}%`,
                      }}
                    />
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>SERTİFİKALAR</SectionHeading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {certificates.map((item) => (
            <View key={item.id} style={styles.certCard}>
              <Text style={styles.certName}>{item.name}</Text>
              {item.issuer && (
                <Text style={styles.certIssuer}>{item.issuer}</Text>
              )}
              {item.date && (
                <Text style={styles.certDate}>{formatMonth(item.date)}</Text>
              )}
              {item.url && <Text style={styles.url}>{item.url}</Text>}
            </View>
          ))}
        </View>
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>GÖNÜLLÜLÜK</SectionHeading>
        {volunteer.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.role || 'Rol'}
                {item.organization && (
                  <Text style={styles.itemCompany}>
                    {' @ '}
                    {item.organization}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.summary && (
              <Text style={styles.itemBody}>{item.summary}</Text>
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
        <SectionHeading>YAYINLAR</SectionHeading>
        {publications.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.name}
                {item.publisher && (
                  <Text
                    style={{ fontWeight: 'normal', color: '#666666' }}
                  >
                    {' — '}
                    {item.publisher}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
            </View>
            {item.url && <Text style={styles.url}>{item.url}</Text>}
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
                  {section.title.toUpperCase()}
                </SectionHeading>
                {section.fields.map((f) => (
                  <View key={f.id} style={styles.customRow}>
                    {f.label && (
                      <Text style={styles.customLabel}>{f.label}:</Text>
                    )}
                    {f.value && (
                      <Text style={styles.customValue}>{f.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            )
        )}
      </>
    )
  }
}
