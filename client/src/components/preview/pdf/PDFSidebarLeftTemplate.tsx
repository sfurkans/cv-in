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

interface PDFSidebarLeftTemplateProps {
  resume: Resume
}

const SIDEBAR_SECTIONS = new Set<SectionId>(['skills', 'languages'])

function createStyles(
  fontFamily: string,
  primary: string,
  text: string,
  sectionGap: number
) {
  // 2+ sayfalarda main'in üst boşluğu. Sidebar absolute → 1. sayfada içerik
  // var, 2+ sayfalarda fixed background layer kırmızı kolonu sağlıyor. Page
  // flex-row değil normal akış: main marginLeft ile sidebar genişliği kadar
  // offset alıyor. Aksi halde uzun sidebar main'i 2. sayfaya itiyordu.
  const sidePadding = 18
  const sidebarWidth = 185
  const topBleed = sidePadding + 20
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9,
      color: '#333333',
      lineHeight: 1.4,
      paddingTop: topBleed,
    },
    // Sidebar
    sidebar: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: sidebarWidth,
      padding: sidePadding,
      backgroundColor: primary,
      color: '#ffffff',
    },
    photo: {
      width: 90,
      height: 90,
      borderRadius: 45,
      alignSelf: 'center',
      marginBottom: 10,
      objectFit: 'cover',
    },
    nameCenter: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 1.2,
    },
    labelCenter: {
      fontSize: 9,
      textAlign: 'center',
      marginTop: 3,
      opacity: 0.9,
    },
    sidebarSection: {
      marginTop: 12,
    },
    sidebarHeading: {
      fontSize: 9,
      fontWeight: 'bold',
      letterSpacing: 1.1,
      paddingBottom: 2,
      borderBottomWidth: 0.7,
      borderBottomColor: '#ffffff',
      borderBottomStyle: 'solid',
      marginBottom: 5,
    },
    sidebarText: {
      fontSize: 8.5,
      marginBottom: 2,
    },
    sidebarSkillName: {
      fontSize: 8.5,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    sidebarSkillLevel: {
      fontWeight: 'normal',
      opacity: 0.85,
    },
    sidebarChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 4,
    },
    sidebarChip: {
      fontSize: 7.5,
      backgroundColor: 'rgba(255,255,255,0.18)',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      marginRight: 3,
      marginBottom: 2.5,
    },
    sidebarLangRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
      fontSize: 8.5,
    },
    // Main
    main: {
      marginLeft: sidebarWidth,
      padding: 22,
      marginTop: -topBleed,
    },
    sectionMain: {
      marginBottom: sectionGap,
    },
    mainHeading: {
      fontSize: 10,
      fontWeight: 'bold',
      color: primary,
      letterSpacing: 1.1,
      paddingBottom: 2,
      borderBottomWidth: 0.7,
      borderBottomColor: primary,
      borderBottomStyle: 'solid',
      marginBottom: 5,
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
    summary: {
      fontSize: 9,
      color: '#444444',
      marginBottom: sectionGap,
      marginTop: 2,
    },
    customRow: {
      flexDirection: 'row',
      marginBottom: 1,
    },
    customLabel: {
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
      marginRight: 4,
    },
    customValue: {
      fontSize: 9,
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

export default function PDFSidebarLeftTemplate({
  resume,
}: PDFSidebarLeftTemplateProps) {
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
  const { sectionGap } = PDF_SPACING[theme.spacing]
  const primary = theme.primaryColor
  const text = theme.textColor

  const styles = createStyles(fontFamily, primary, text, sectionGap)

  const order: SectionId[] =
    sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER
  const mainOrder = order.filter((id) => !SIDEBAR_SECTIONS.has(id))
  const visibleSkills = skills.filter((s) => s.keywords.length > 0 || s.name)

  const mainRenderers: Record<SectionId, () => ReactNode> = {
    experience: renderExperience,
    education: renderEducation,
    skills: () => null,
    projects: renderProjects,
    languages: () => null,
    certificates: renderCertificates,
    volunteer: renderVolunteer,
    publications: renderPublications,
    custom: renderCustom,
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar background — fixed ile her sayfada kenardan kenara kırmızı
            kolon. Sidebar içeriği absolute ve sadece 1. sayfada; 2+ sayfalarda
            bu layer kolonu görünür tutuyor. */}
        <View
          fixed
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 185,
            backgroundColor: primary,
          }}
        />
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {basics.photo && (
            <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
          )}
          <Text style={styles.nameCenter}>
            {basics.name || 'Adınız Soyadınız'}
          </Text>
          {basics.label && (
            <Text style={styles.labelCenter}>{basics.label}</Text>
          )}

          {(basics.email || basics.phone || basics.profiles.length > 0) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>İLETİŞİM</Text>
              {basics.email && (
                <Text style={styles.sidebarText}>{basics.email}</Text>
              )}
              {basics.phone && (
                <Text style={styles.sidebarText}>{basics.phone}</Text>
              )}
              {basics.profiles.map((p, i) => (
                <Text
                  key={`${p.network}-${i}`}
                  style={styles.sidebarText}
                >
                  {p.network}: {p.url || p.username}
                </Text>
              ))}
            </View>
          )}

          {visibleSkills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>YETENEKLER</Text>
              {visibleSkills.map((skill) => (
                <View key={skill.id} style={{ marginBottom: 4 }}>
                  {(skill.name || skill.level) && (
                    <Text style={styles.sidebarSkillName}>
                      {skill.name}
                      {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                        <Text style={styles.sidebarSkillLevel}>
                          {' '}
                          · {SKILL_LEVEL_LABELS[skill.level]}
                        </Text>
                      )}
                    </Text>
                  )}
                  <View style={styles.sidebarChipRow}>
                    {skill.keywords.map((k, i) => (
                      <Text
                        key={`${skill.id}-${k}-${i}`}
                        style={styles.sidebarChip}
                      >
                        {k}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>DİLLER</Text>
              {languages.map((l) => (
                <View key={l.id} style={styles.sidebarLangRow}>
                  <Text>{l.name}</Text>
                  {l.proficiency && (
                    <Text style={{ opacity: 0.85 }}>
                      {l.proficiency.toUpperCase()}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={styles.main}>
          {basics.summary && (
            <View wrap={false}>
              <Text style={styles.mainHeading}>ÖZET</Text>
              <Text style={styles.summary}>{basics.summary}</Text>
            </View>
          )}
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
        {item.summary && <Text style={styles.itemBody}>{item.summary}</Text>}
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
    )
    const [first, ...rest] = work
    return (
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>DENEYİM</Text>
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
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>EĞİTİM</Text>
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
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>PROJELER</Text>
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
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>SERTİFİKALAR</Text>
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
        {item.summary && <Text style={styles.itemBody}>{item.summary}</Text>}
      </View>
    )
    const [first, ...rest] = volunteer
    return (
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>GÖNÜLLÜLÜK</Text>
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
      <View style={styles.sectionMain} wrap={false}>
        <View wrap={false}>
          <Text style={styles.mainHeading}>YAYINLAR</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
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
              <View key={section.id} style={styles.sectionMain} wrap={false}>
                <Text style={styles.mainHeading}>
                  {section.title.toUpperCase()}
                </Text>
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
