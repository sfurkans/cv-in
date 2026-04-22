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
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: sectionGap,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: primary,
      borderBottomStyle: 'solid',
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 12,
      objectFit: 'cover',
    },
    headerInfo: {
      flex: 1,
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
    skillChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 3,
    },
    skillChip: {
      fontSize: 8,
      color: '#444444',
      backgroundColor: '#f3f4f6',
      borderWidth: 0.5,
      borderColor: '#d1d5db',
      borderStyle: 'solid',
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginRight: 3,
      marginBottom: 3,
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
        </View>

        {/* Summary */}
        {basics.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Özet')}</Text>
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
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Deneyim')}</Text>
        {work.map((item) => (
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
        ))}
      </View>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Eğitim')}</Text>
        {education.map((item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
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
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Yetenekler')}</Text>
        {visibleSkills.map((skill) => (
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
            <View style={styles.skillChipRow}>
              {skill.keywords.map((keyword, i) => (
                <Text
                  key={`${skill.id}-${keyword}-${i}`}
                  style={styles.skillChip}
                >
                  {keyword}
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
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Projeler')}</Text>
        {projects.map((item) => (
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
        ))}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Diller')}</Text>
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
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Sertifikalar')}</Text>
        {certificates.map((item) => (
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
        ))}
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Gönüllülük')}</Text>
        {volunteer.map((item) => (
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
        ))}
      </View>
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper('Yayınlar')}</Text>
        {publications.map((item) => (
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
        ))}
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
                <Text style={styles.sectionHeading} minPresenceAhead={40}>{trUpper(section.title)}</Text>
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
