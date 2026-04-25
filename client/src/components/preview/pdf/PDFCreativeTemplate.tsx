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

interface PDFCreativeTemplateProps {
  resume: Resume
}

const FONT_MAP: Record<FontFamily, string> = {
  sans: 'Noto Sans',
  serif: 'Noto Serif',
  mono: 'Noto Sans Mono',
}

const SPACING_MAP: Record<
  Spacing,
  { sidePadding: number; mainPadding: number; sectionGap: number }
> = {
  compact: { sidePadding: 14, mainPadding: 16, sectionGap: 10 },
  normal: { sidePadding: 18, mainPadding: 22, sectionGap: 14 },
  relaxed: { sidePadding: 22, mainPadding: 28, sectionGap: 18 },
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
  sidePadding: number,
  mainPadding: number,
  sectionGap: number
) {
  // 2+ sayfalarda main'in üst boşluğu — 1. sayfada sidebar ve main bu değer
  // kadar negative marginTop ile bleed görünümünü koruyarak compensate ediyor.
  const topBleed = sidePadding + 20
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9,
      flexDirection: 'row',
      lineHeight: 1.4,
      paddingTop: topBleed,
    },
    sidebar: {
      width: '35%',
      backgroundColor: primary,
      padding: sidePadding,
      marginTop: -topBleed,
      color: '#ffffff',
    },
    main: {
      flex: 1,
      padding: mainPadding,
      marginTop: -topBleed,
      color: '#444444',
    },
    photo: {
      width: 96,
      height: 96,
      borderRadius: 48,
      alignSelf: 'center',
      marginBottom: 10,
      objectFit: 'cover',
    },
    sidebarName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ffffff',
      lineHeight: 1.25,
      marginBottom: 6,
    },
    sidebarLabel: {
      fontSize: 10,
      color: '#ffffffcc',
      lineHeight: 1.3,
      marginBottom: 10,
    },
    sideSection: {
      marginBottom: sectionGap,
    },
    sideHeading: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#ffffff',
      letterSpacing: 1.2,
      marginBottom: 4,
      paddingBottom: 2,
      borderBottomWidth: 0.5,
      borderBottomColor: '#ffffff66',
      borderBottomStyle: 'solid',
    },
    sideText: {
      fontSize: 8,
      color: '#ffffffe0',
      marginBottom: 2,
    },
    sideContactLabel: {
      fontWeight: 'bold',
      color: '#ffffff',
    },
    skillsGroup: {
      marginBottom: 4,
    },
    skillName: {
      fontSize: 9,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 2,
    },
    skillLevel: {
      fontWeight: 'normal',
      color: '#ffffffaa',
    },
    skillChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillChip: {
      fontSize: 8,
      color: '#ffffff',
      backgroundColor: '#ffffff26',
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginRight: 3,
      marginBottom: 3,
    },
    languageItem: {
      fontSize: 8,
      color: '#ffffffe0',
      marginBottom: 1,
    },
    languageName: {
      fontWeight: 'bold',
      color: '#ffffff',
    },
    mainSection: {
      marginBottom: sectionGap,
    },
    mainHeading: {
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
      marginBottom: 6,
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
    itemTitleMuted: {
      fontWeight: 'normal',
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

export default function PDFCreativeTemplate({
  resume,
}: PDFCreativeTemplateProps) {
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
  // Creative'de skills/languages sidebar'da sabit, main alanda bunlar hariç
  const mainOrder = order.filter(
    (id) => id !== 'skills' && id !== 'languages'
  )

  const fontFamily = FONT_MAP[theme.fontFamily]
  const { sidePadding, mainPadding, sectionGap } = SPACING_MAP[theme.spacing]
  const styles = createStyles(
    fontFamily,
    theme.primaryColor,
    theme.textColor,
    sidePadding,
    mainPadding,
    sectionGap
  )

  const visibleSkills = skills.filter((s) => s.keywords.length > 0)

  const mainRenderers: Partial<Record<SectionId, () => ReactNode>> = {
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    certificates: renderCertificates,
    volunteer: renderVolunteer,
    publications: renderPublications,
    custom: renderCustom,
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar arka plan rengi — fixed ile her sayfada kenardan kenara bleed.
            2. sayfada page paddingTop uygulanırken bu layer absolute olduğu için
            padding'den etkilenmez; sidebar kolonu her sayfada tam yükseklik. */}
        <View
          fixed
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '35%',
            backgroundColor: theme.primaryColor,
          }}
        />
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {basics.photo && (
            <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
          )}

          <Text style={styles.sidebarName}>
            {basics.name || 'Adınız Soyadınız'}
          </Text>
          {basics.label && (
            <Text style={styles.sidebarLabel}>{basics.label}</Text>
          )}

          {/* Contact */}
          {(basics.email ||
            basics.phone ||
            basics.profiles.length > 0) && (
            <View style={styles.sideSection}>
              <Text style={styles.sideHeading}>{trUpper('İletişim')}</Text>
              {basics.email && (
                <Text style={styles.sideText}>{basics.email}</Text>
              )}
              {basics.phone && (
                <Text style={styles.sideText}>{basics.phone}</Text>
              )}
              {basics.profiles.map((profile, i) => (
                <Text
                  key={`${profile.network}-${i}`}
                  style={styles.sideText}
                >
                  <Text style={styles.sideContactLabel}>
                    {profile.network}:{' '}
                  </Text>
                  {profile.url}
                </Text>
              ))}
            </View>
          )}

          {/* Skills */}
          {visibleSkills.length > 0 && (
            <View style={styles.sideSection}>
              <Text style={styles.sideHeading}>{trUpper('Yetenekler')}</Text>
              {visibleSkills.map((skill) => (
                <View key={skill.id} style={styles.skillsGroup}>
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
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.sideSection}>
              <Text style={styles.sideHeading}>{trUpper('Diller')}</Text>
              {languages.map((item) => (
                <Text key={item.id} style={styles.languageItem}>
                  <Text style={styles.languageName}>{item.name}</Text>
                  {item.proficiency && (
                    <Text>
                      {' — '}
                      {item.proficiency.toUpperCase()}
                    </Text>
                  )}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={styles.main}>
          {/* Summary */}
          {basics.summary && (
            <View style={styles.mainSection} wrap={false}>
              <Text style={styles.mainHeading}>{trUpper('Hakkımda')}</Text>
              <Text style={styles.itemBody}>{basics.summary}</Text>
            </View>
          )}

          {/* Sections — kullanıcı sırasına göre (skills/languages sidebar'da) */}
          {mainOrder.map((id) => (
            <Fragment key={id}>{mainRenderers[id]?.()}</Fragment>
          ))}
        </View>
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Deneyim')}</Text>
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Eğitim')}</Text>
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Projeler')}</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Sertifikalar')}</Text>
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Gönüllülük')}</Text>
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
      <View style={styles.mainSection} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>{trUpper('Yayınlar')}</Text>
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
              <View key={section.id} style={styles.mainSection} wrap={false}>
                <Text style={styles.mainHeading}>{trUpper(section.title)}</Text>
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
