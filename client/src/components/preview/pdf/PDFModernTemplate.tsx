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

interface PDFModernTemplateProps {
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
  compact: { pagePadding: 28, sectionGap: 12 },
  normal: { pagePadding: 36, sectionGap: 16 },
  relaxed: { pagePadding: 44, sectionGap: 22 },
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
      color: '#444444',
      padding: pagePadding,
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: sectionGap,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    photo: {
      width: 64,
      height: 64,
      borderRadius: 4,
      marginRight: 12,
      objectFit: 'cover',
    },
    headerInfo: {
      flex: 1,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: text,
      letterSpacing: -0.5,
      lineHeight: 1.25,
      marginBottom: 8,
    },
    label: {
      fontSize: 12,
      color: primary,
      letterSpacing: 1.5,
      lineHeight: 1.3,
    },
    contactColumn: {
      alignItems: 'flex-end',
      fontSize: 8,
      color: '#666666',
    },
    contactLine: {
      marginBottom: 1,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionHeadingWrap: {
      marginBottom: 6,
    },
    sectionHeading: {
      fontSize: 11,
      fontWeight: 'bold',
      color: primary,
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    sectionAccent: {
      width: 24,
      height: 1.5,
      backgroundColor: primary,
    },
    timelineItem: {
      paddingLeft: 10,
      marginBottom: 7,
      position: 'relative',
    },
    timelineDot: {
      position: 'absolute',
      left: 0,
      top: 3,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: primary,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
      flex: 1,
    },
    itemCompany: {
      fontSize: 9,
      color: '#666666',
    },
    itemDate: {
      fontSize: 8,
      color: '#777777',
      marginLeft: 6,
    },
    itemBody: {
      fontSize: 9,
      color: '#444444',
      marginTop: 2,
    },
    bulletList: {
      marginTop: 2,
    },
    bullet: {
      fontSize: 9,
      color: '#444444',
      marginBottom: 1,
    },
    skillRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    skillName: {
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
      marginRight: 4,
    },
    skillLevel: {
      fontWeight: 'normal',
      color: '#777777',
    },
    skillKeywords: {
      fontSize: 9,
      color: '#444444',
      flex: 1,
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
      color: text,
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
      color: text,
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

function SectionHeading({
  children,
  styles,
}: {
  children: string
  styles: ReturnType<typeof createStyles>
}) {
  return (
    <View style={styles.sectionHeadingWrap}>
      <Text style={styles.sectionHeading}>{children}</Text>
      <View style={styles.sectionAccent} />
    </View>
  )
}

export default function PDFModernTemplate({ resume }: PDFModernTemplateProps) {
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
          <View style={styles.headerLeft}>
            {basics.photo && (
              <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.name}>
                {basics.name || 'Adınız Soyadınız'}
              </Text>
              {basics.label && <Text style={styles.label}>{trUpper(basics.label)}</Text>}
            </View>
          </View>
          <View style={styles.contactColumn}>
            {basics.email && (
              <Text style={styles.contactLine}>{basics.email}</Text>
            )}
            {basics.phone && (
              <Text style={styles.contactLine}>{basics.phone}</Text>
            )}
            {basics.profiles.map((profile, i) => (
              <Text
                key={`${profile.network}-${i}`}
                style={styles.contactLine}
              >
                {profile.url}
              </Text>
            ))}
          </View>
        </View>

        {/* Summary */}
        {basics.summary && (
          <View style={styles.section}>
            <SectionHeading styles={styles}>Hakkımda</SectionHeading>
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
        <SectionHeading styles={styles}>Deneyim</SectionHeading>
        {work.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.position || 'Pozisyon'}
              </Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.company && (
              <Text style={styles.itemCompany}>{item.company}</Text>
            )}
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
        <SectionHeading styles={styles}>Eğitim</SectionHeading>
        {education.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.institution || 'Okul'}
              </Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {(item.degree || item.field) && (
              <Text style={styles.itemCompany}>
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
        <SectionHeading styles={styles}>Yetenekler</SectionHeading>
        {visibleSkills.map((skill) => (
          <View key={skill.id} style={styles.skillRow}>
            {skill.name && (
              <Text style={styles.skillName}>
                {skill.name}
                {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                  <Text style={styles.skillLevel}>
                    {' ('}
                    {SKILL_LEVEL_LABELS[skill.level]}
                    {')'}
                  </Text>
                )}
                {': '}
              </Text>
            )}
            <Text style={styles.skillKeywords}>
              {skill.keywords.join(', ')}
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
        <SectionHeading styles={styles}>Projeler</SectionHeading>
        {projects.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
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
        <SectionHeading styles={styles}>Diller</SectionHeading>
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
        <SectionHeading styles={styles}>Sertifikalar</SectionHeading>
        {certificates.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
            </View>
            {item.issuer && (
              <Text style={styles.itemCompany}>{item.issuer}</Text>
            )}
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
        <SectionHeading styles={styles}>Gönüllülük</SectionHeading>
        {volunteer.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.role || 'Rol'}</Text>
              <Text style={styles.itemDate}>
                {formatDateRange(item.startDate, item.endDate)}
              </Text>
            </View>
            {item.organization && (
              <Text style={styles.itemCompany}>{item.organization}</Text>
            )}
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
        <SectionHeading styles={styles}>Yayınlar</SectionHeading>
        {publications.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
            </View>
            {item.publisher && (
              <Text style={styles.itemCompany}>{item.publisher}</Text>
            )}
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
              <View key={section.id} style={styles.section}>
                <SectionHeading styles={styles}>{section.title}</SectionHeading>
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
