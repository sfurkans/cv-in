import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { ReactNode } from 'react'
import { Fragment } from 'react'

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

interface PDFAtsTemplateProps {
  resume: Resume
}

// ATS template bilinçli olarak theme.primaryColor kullanmaz. Sadece siyah.
// Tablo, grafik, icon yok. Photo da render edilmez.

function createStyles(
  fontFamily: string,
  pagePadding: number,
  sectionGap: number
) {
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 10,
      color: '#000000',
      padding: pagePadding,
      lineHeight: 1.5,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 2,
    },
    label: {
      fontSize: 12,
      color: '#000000',
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      fontSize: 9,
      color: '#000000',
    },
    contactItem: {
      marginRight: 10,
    },
    headerDivider: {
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      borderBottomStyle: 'solid',
      marginTop: 6,
      marginBottom: sectionGap,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionHeading: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 4,
      paddingBottom: 2,
      borderBottomWidth: 0.75,
      borderBottomColor: '#000000',
      borderBottomStyle: 'solid',
    },
    itemBlock: {
      marginBottom: 7,
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000000',
    },
    itemDate: {
      fontSize: 9,
      color: '#000000',
      marginTop: 1,
    },
    itemBody: {
      fontSize: 9.5,
      color: '#000000',
      marginTop: 2,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 10,
    },
    bullet: {
      fontSize: 9.5,
      color: '#000000',
      marginBottom: 1,
    },
    skillLine: {
      fontSize: 9.5,
      color: '#000000',
      marginBottom: 1,
    },
    boldText: {
      fontWeight: 'bold',
    },
    urlText: {
      fontSize: 8.5,
      color: '#000000',
      marginTop: 1,
    },
  })
}

export default function PDFAtsTemplate({ resume }: PDFAtsTemplateProps) {
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
  const styles = createStyles(fontFamily, pagePadding, sectionGap)
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{basics.name || 'Adınız Soyadınız'}</Text>
          {basics.label && <Text style={styles.label}>{basics.label}</Text>}
          <View style={styles.contactRow}>
            {basics.email && (
              <Text style={styles.contactItem}>{basics.email}</Text>
            )}
            {basics.phone && (
              <Text style={styles.contactItem}>{basics.phone}</Text>
            )}
            {basics.profiles.map((p, i) => (
              <Text key={`${p.network}-${i}`} style={styles.contactItem}>
                {p.network}: {p.url || p.username}
              </Text>
            ))}
          </View>
          <View style={styles.headerDivider} />
        </View>

        {basics.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={40}>ÖZET</Text>
            <Text style={styles.itemBody}>{basics.summary}</Text>
          </View>
        )}

        {order.map((id) => (
          <Fragment key={id}>{renderers[id]?.()}</Fragment>
        ))}
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>DENEYİM</Text>
        {work.map((item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <Text style={styles.itemTitle}>
              {item.position || 'Pozisyon'}
              {item.company && ` | ${item.company}`}
            </Text>
            <Text style={styles.itemDate}>
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
            {item.summary && (
              <Text style={styles.itemBody}>{item.summary}</Text>
            )}
            {item.highlights.some((h) => h.trim()) && (
              <View style={styles.bulletList}>
                {item.highlights
                  .filter((h) => h.trim())
                  .map((h, i) => (
                    <Text key={i} style={styles.bullet}>
                      - {h}
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
        <Text style={styles.sectionHeading} minPresenceAhead={40}>EĞİTİM</Text>
        {education.map((item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <Text style={styles.itemTitle}>{item.institution || 'Okul'}</Text>
            {(item.degree || item.field) && (
              <Text style={styles.itemBody}>
                {[item.degree, item.field].filter(Boolean).join(', ')}
              </Text>
            )}
            <Text style={styles.itemDate}>
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  function renderSkills(): ReactNode {
    if (visibleSkills.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>YETENEKLER</Text>
        {visibleSkills.map((skill) => {
          const keywords = skill.keywords.join(', ')
          const levelTxt =
            skill.level && SKILL_LEVEL_LABELS[skill.level]
              ? ` (${SKILL_LEVEL_LABELS[skill.level]})`
              : ''
          return (
            <Text key={skill.id} style={styles.skillLine}>
              {skill.name && (
                <>
                  <Text style={styles.boldText}>{skill.name}</Text>
                  {levelTxt}:{' '}
                </>
              )}
              {keywords}
            </Text>
          )
        })}
      </View>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>PROJELER</Text>
        {projects.map((item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <Text style={styles.itemTitle}>{item.name || 'Proje'}</Text>
            <Text style={styles.itemDate}>
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
            {item.description && (
              <Text style={styles.itemBody}>{item.description}</Text>
            )}
            {item.url && <Text style={styles.urlText}>{item.url}</Text>}
          </View>
        ))}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    const items = languages
      .map((l) =>
        l.proficiency ? `${l.name} (${l.proficiency.toUpperCase()})` : l.name,
      )
      .filter(Boolean)
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>DİLLER</Text>
        <Text style={styles.itemBody}>{items.join(', ')}</Text>
      </View>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>SERTİFİKALAR</Text>
        <View style={styles.bulletList}>
          {certificates.map((item) => (
            <Text key={item.id} style={styles.bullet}>
              - <Text style={styles.boldText}>{item.name}</Text>
              {item.issuer && ` — ${item.issuer}`}
              {item.date && ` (${formatMonth(item.date)})`}
              {item.url && ` — ${item.url}`}
            </Text>
          ))}
        </View>
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>GÖNÜLLÜLÜK</Text>
        {volunteer.map((item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <Text style={styles.itemTitle}>
              {item.role || 'Rol'}
              {item.organization && ` | ${item.organization}`}
            </Text>
            <Text style={styles.itemDate}>
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
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
        <Text style={styles.sectionHeading} minPresenceAhead={40}>YAYINLAR</Text>
        <View style={styles.bulletList}>
          {publications.map((item) => (
            <Text key={item.id} style={styles.bullet}>
              - <Text style={styles.boldText}>{item.name}</Text>
              {item.publisher && ` — ${item.publisher}`}
              {item.date && ` (${formatMonth(item.date)})`}
              {item.url && ` — ${item.url}`}
            </Text>
          ))}
        </View>
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
              <View key={section.id} style={styles.section} wrap={false}>
                <Text style={styles.sectionHeading} minPresenceAhead={40}>
                  {section.title.toUpperCase()}
                </Text>
                {section.fields.map((f) => (
                  <Text key={f.id} style={styles.itemBody}>
                    {f.label && <Text style={styles.boldText}>{f.label}: </Text>}
                    {f.value}
                  </Text>
                ))}
              </View>
            )
        )}
      </>
    )
  }
}
