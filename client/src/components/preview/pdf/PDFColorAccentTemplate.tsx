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
import { PDF_FONT_MAP, PDF_SPACING } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
} from '@/types/resume'

import './fonts'

interface PDFColorAccentTemplateProps {
  resume: Resume
}

function createStyles(
  fontFamily: string,
  primary: string,
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
    topBar: {
      height: 22,
      backgroundColor: primary,
    },
    body: {
      padding: pagePadding,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: sectionGap,
    },
    photo: {
      width: 82,
      height: 82,
      borderRadius: 41,
      marginRight: 14,
      objectFit: 'cover',
      borderWidth: 2,
      borderColor: primary,
      borderStyle: 'solid',
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: text,
      marginBottom: 2,
    },
    label: {
      fontSize: 11,
      color: primary,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 8.5,
      color: '#666666',
    },
    contactItem: {
      marginRight: 10,
      marginBottom: 2,
    },
    contactNetwork: {
      color: primary,
      fontWeight: 'bold',
    },
    section: {
      marginBottom: sectionGap,
    },
    headingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    headingBar: {
      width: 3,
      height: 11,
      backgroundColor: primary,
      marginRight: 5,
    },
    sectionHeading: {
      fontSize: 10.5,
      fontWeight: 'bold',
      color: primary,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    itemBlock: {
      marginBottom: 7,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 1,
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
      flex: 1,
    },
    itemTitleMuted: {
      fontWeight: 'normal',
      color: '#555555',
    },
    datePill: {
      fontSize: 8,
      color: '#ffffff',
      backgroundColor: primary,
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      marginLeft: 6,
    },
    itemDateMuted: {
      fontSize: 8,
      color: '#777777',
      marginLeft: 6,
    },
    itemBody: {
      fontSize: 9.5,
      color: '#444444',
      marginTop: 1,
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
    skillGroup: {
      marginBottom: 5,
    },
    skillName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: primary,
      marginBottom: 2,
    },
    skillLevel: {
      fontWeight: 'normal',
      color: '#777777',
      fontSize: 8.5,
    },
    skillChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillChip: {
      fontSize: 8.5,
      color: primary,
      borderWidth: 0.8,
      borderColor: primary,
      borderStyle: 'solid',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      marginRight: 3,
      marginBottom: 3,
    },
    languagePill: {
      fontSize: 8,
      color: '#ffffff',
      backgroundColor: primary,
      paddingHorizontal: 3,
      paddingVertical: 1,
      marginLeft: 3,
    },
    languageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
      marginBottom: 2,
      fontSize: 9.5,
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

export default function PDFColorAccentTemplate({
  resume,
}: PDFColorAccentTemplateProps) {
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
  const styles = createStyles(
    fontFamily,
    theme.primaryColor,
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
      <View style={styles.headingBar} />
      <Text style={styles.sectionHeading}>{children}</Text>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.body}>
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
                  <Text style={styles.contactItem}>{basics.email}</Text>
                )}
                {basics.phone && (
                  <Text style={styles.contactItem}>{basics.phone}</Text>
                )}
                {basics.profiles.map((p, i) => (
                  <Text
                    key={`${p.network}-${i}`}
                    style={styles.contactItem}
                  >
                    <Text style={styles.contactNetwork}>{p.network}: </Text>
                    {p.url || p.username}
                  </Text>
                ))}
              </View>
            </View>
          </View>

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
        {work.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.position || 'Pozisyon'}
                {item.company && (
                  <Text style={styles.itemTitleMuted}>
                    {' — '}
                    {item.company}
                  </Text>
                )}
              </Text>
              <Text style={styles.datePill}>
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
        ))}
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
              <Text style={styles.datePill}>
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
        {visibleSkills.map((skill) => (
          <View key={skill.id} style={styles.skillGroup}>
            {(skill.name || skill.level) && (
              <Text style={styles.skillName}>
                {skill.name}
                {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                  <Text style={styles.skillLevel}>
                    {' '}
                    · {SKILL_LEVEL_LABELS[skill.level]}
                  </Text>
                )}
              </Text>
            )}
            <View style={styles.skillChipRow}>
              {skill.keywords.map((k, i) => (
                <Text key={`${skill.id}-${k}-${i}`} style={styles.skillChip}>
                  {k}
                </Text>
              ))}
            </View>
          </View>
        ))}
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
              <Text style={styles.itemDateMuted}>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {languages.map((l) => (
            <View key={l.id} style={styles.languageRow}>
              <Text style={{ fontWeight: 'bold' }}>{l.name}</Text>
              {l.proficiency && (
                <Text style={styles.languagePill}>
                  {l.proficiency.toUpperCase()}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <View style={styles.section}>
        <SectionHeading>SERTİFİKALAR</SectionHeading>
        {certificates.map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.name}
                {item.issuer && (
                  <Text style={styles.itemTitleMuted}>
                    {' — '}
                    {item.issuer}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDateMuted}>{formatMonth(item.date)}</Text>
            </View>
            {item.url && <Text style={styles.url}>{item.url}</Text>}
          </View>
        ))}
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
                  <Text style={styles.itemTitleMuted}>
                    {' — '}
                    {item.organization}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDateMuted}>
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
                  <Text style={styles.itemTitleMuted}>
                    {' — '}
                    {item.publisher}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDateMuted}>{formatMonth(item.date)}</Text>
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
                <SectionHeading>{section.title.toUpperCase()}</SectionHeading>
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
