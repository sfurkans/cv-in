import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { trUpper } from '@/lib/trUpper'
import {
  DEFAULT_SECTION_ORDER,
  type FontFamily,
  type Resume,
  type SectionId,
  type Spacing,
} from '@/types/resume'

import './fonts'

interface PDFClassicTemplateProps {
  resume: Resume
}

const FONT_MAP: Record<FontFamily, string> = {
  sans: 'Noto Sans',
  serif: 'Noto Serif',
  mono: 'Noto Sans Mono',
}

const SPACING_MAP: Record<
  Spacing,
  { pagePadding: number; sectionGap: number }
> = {
  compact: { pagePadding: 28, sectionGap: 10 },
  normal: { pagePadding: 36, sectionGap: 14 },
  relaxed: { pagePadding: 44, sectionGap: 18 },
}

const SKILL_LEVEL_LABELS: Record<string, string> = {
  beginner: 'Başlangıç',
  basic: 'Temel',
  intermediate: 'Orta',
  advanced: 'İleri',
  expert: 'Uzman',
}

function formatMonth(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  if (!month) return year
  return `${month}/${year}`
}

function formatDateRange(start: string, end: string): string {
  const s = formatMonth(start)
  const e = formatMonth(end)
  if (!s && !e) return ''
  if (s && !e) return `${s} - Devam ediyor`
  if (!s && e) return e
  return `${s} - ${e}`
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
      fontSize: 9,
      color: '#333333',
      padding: pagePadding,
      lineHeight: 1.4,
    },
    header: {
      marginBottom: sectionGap,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: primary,
      borderBottomStyle: 'solid',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: text,
      lineHeight: 1.25,
      marginBottom: 6,
    },
    label: {
      fontSize: 14,
      color: '#555555',
      lineHeight: 1.3,
      marginBottom: 4,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      fontSize: 8,
      color: '#666666',
    },
    contactItem: {
      marginRight: 8,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionHeading: {
      fontSize: 10,
      fontWeight: 'bold',
      color: primary,
      letterSpacing: 1.2,
      marginBottom: 5,
      paddingBottom: 2,
      borderBottomWidth: 0.8,
      borderBottomColor: primary,
      borderBottomStyle: 'solid',
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
      color: '#222222',
      flex: 1,
    },
    itemTitleMuted: {
      fontWeight: 'normal',
      color: '#555555',
    },
    itemDate: {
      fontSize: 8,
      color: '#777777',
      marginLeft: 6,
    },
    itemBody: {
      fontSize: 9,
      color: '#444444',
      marginTop: 1,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bullet: {
      fontSize: 9,
      color: '#444444',
      marginBottom: 1,
    },
    skillsGroup: {
      marginBottom: 5,
    },
    skillName: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#222222',
      marginBottom: 2,
    },
    skillLevel: {
      fontWeight: 'normal',
      color: '#777777',
    },
    languageRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    languageItem: {
      marginRight: 12,
      marginBottom: 2,
      fontSize: 9,
    },
    languageName: {
      fontWeight: 'bold',
      color: '#222222',
    },
    languageLevel: {
      color: '#777777',
    },
    customFieldRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    customFieldLabel: {
      fontWeight: 'bold',
      color: '#222222',
      marginRight: 4,
    },
    customFieldValue: {
      color: '#444444',
      flex: 1,
    },
    urlText: {
      fontSize: 8,
      color: '#777777',
      marginTop: 1,
    },
  })
}

export default function PDFClassicTemplate({
  resume,
}: PDFClassicTemplateProps) {
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

  const fontFamily = FONT_MAP[theme.fontFamily]
  const { pagePadding, sectionGap } = SPACING_MAP[theme.spacing]
  const styles = createStyles(
    fontFamily,
    theme.primaryColor,
    theme.textColor,
    pagePadding,
    sectionGap
  )

  const visibleSkills = skills.filter((s) => s.keywords.length > 0)

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
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
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
            {basics.profiles.map((profile, i) => (
              <Text
                key={`${profile.network}-${i}`}
                style={styles.contactItem}
              >
                {profile.network}: {profile.url}
              </Text>
            ))}
          </View>
        </View>

        {/* Summary */}
        {basics.summary && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionHeading}>{trUpper('Özet')}</Text>
            <Text style={styles.itemBody}>{basics.summary}</Text>
          </View>
        )}

        {/* Sections — kullanıcı sırasına göre */}
        {order.map((id) => (
          <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
        ))}
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    const renderItem = (item: (typeof work)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
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
              .map((highlight, i) => (
                <Text key={i} style={styles.bullet}>
                  • {highlight}
                </Text>
              ))}
          </View>
        )}
      </View>
    )
    const [first, ...rest] = work
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Deneyim')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    const renderItem = (item: (typeof education)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.institution || 'Okul'}</Text>
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
    )
    const [first, ...rest] = education
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Eğitim')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderSkills(): ReactNode {
    if (visibleSkills.length === 0) return null
    const renderItem = (skill: (typeof visibleSkills)[0]) => (
      <View key={skill.id} style={styles.skillsGroup} wrap={false}>
        {(skill.name || skill.level) && (
          <Text style={styles.skillName}>
            {skill.name}
            {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
              <Text style={styles.skillLevel}>
                {' · '}
                {SKILL_LEVEL_LABELS[skill.level]}
              </Text>
            )}
          </Text>
        )}
        {skill.keywords.length > 0 && (
          <Text style={styles.itemBody}>{skill.keywords.join(', ')}</Text>
        )}
      </View>
    )
    const [first, ...rest] = visibleSkills
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Yetenekler')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    const renderItem = (item: (typeof projects)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.name || 'Proje'}</Text>
          <Text style={styles.itemDate}>
            {formatDateRange(item.startDate, item.endDate)}
          </Text>
        </View>
        {item.description && (
          <Text style={styles.itemBody}>{item.description}</Text>
        )}
        {item.url && <Text style={styles.urlText}>{item.url}</Text>}
      </View>
    )
    const [first, ...rest] = projects
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Projeler')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionHeading}>{trUpper('Diller')}</Text>
        <View style={styles.languageRow}>
          {languages.map((item) => (
            <Text key={item.id} style={styles.languageItem}>
              <Text style={styles.languageName}>{item.name}</Text>
              {item.proficiency && (
                <Text style={styles.languageLevel}>
                  {' — '}
                  {item.proficiency.toUpperCase()}
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
    const renderItem = (item: (typeof certificates)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
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
          <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
        </View>
        {item.url && <Text style={styles.urlText}>{item.url}</Text>}
      </View>
    )
    const [first, ...rest] = certificates
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Sertifikalar')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    const renderItem = (item: (typeof volunteer)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
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
          <Text style={styles.itemDate}>
            {formatDateRange(item.startDate, item.endDate)}
          </Text>
        </View>
        {item.summary && (
          <Text style={styles.itemBody}>{item.summary}</Text>
        )}
      </View>
    )
    const [first, ...rest] = volunteer
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Gönüllülük')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    const renderItem = (item: (typeof publications)[0]) => (
      <View key={item.id} style={styles.itemBlock} wrap={false}>
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
          <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
        </View>
        {item.url && <Text style={styles.urlText}>{item.url}</Text>}
      </View>
    )
    const [first, ...rest] = publications
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.sectionHeading}>{trUpper('Yayınlar')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderCustom(): ReactNode {
    if (customSections.length === 0) return null
    return (
      <Fragment>
        {customSections.map(
          (section) =>
            section.title && (
              <View key={section.id} style={styles.section} wrap={false}>
                <Text style={styles.sectionHeading}>{trUpper(section.title)}</Text>
                {section.fields.map((field) => (
                  <View key={field.id} style={styles.customFieldRow}>
                    {field.label && (
                      <Text style={styles.customFieldLabel}>
                        {field.label}:
                      </Text>
                    )}
                    {field.value && (
                      <Text style={styles.customFieldValue}>{field.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            )
        )}
      </Fragment>
    )
  }
}
