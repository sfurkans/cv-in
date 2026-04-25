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
  type CefrSkillKey,
  type Language,
  type Resume,
  type SectionId,
} from '@/types/resume'

import './fonts'

interface PDFEuropassTemplateProps {
  resume: Resume
}

function cefrValue(lang: Language, skill: CefrSkillKey): string {
  const v = lang.cefr?.[skill] || lang.proficiency
  if (!v || v === 'native') return ''
  return v.toUpperCase()
}

function createStyles(
  fontFamily: string,
  primary: string,
  text: string,
  sectionGap: number,
) {
  // 2+ sayfalarda içeriğin üstten boşluğu. 1. sayfada header `-topBleed`
  // margin ile bu padding'i iptal ederek kenardan kenara bleed görünür.
  const pagePadding = 28
  const topBleed = pagePadding + 20
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9,
      color: '#333333',
      padding: 0,
      paddingTop: topBleed,
      lineHeight: 1.4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: pagePadding,
      paddingVertical: 18,
      backgroundColor: primary,
      color: '#ffffff',
      marginTop: -topBleed,
    },
    photo: {
      width: 72,
      height: 72,
      marginRight: 14,
      objectFit: 'cover',
    },
    headerContent: {
      flex: 1,
      minWidth: 0,
    },
    kicker: {
      fontSize: 7.5,
      letterSpacing: 2,
      opacity: 0.8,
      marginBottom: 2,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 1.15,
    },
    label: {
      fontSize: 9.5,
      marginTop: 2,
      opacity: 0.95,
    },
    contactRow: {
      flexDirection: 'row',
      marginTop: 1,
      fontSize: 8.5,
    },
    contactLabel: {
      width: 46,
      opacity: 0.8,
    },
    contactValue: {
      flex: 1,
    },
    main: {
      paddingHorizontal: 28,
      paddingVertical: 18,
    },
    section: {
      marginBottom: sectionGap,
    },
    heading: {
      fontSize: 10,
      fontWeight: 'bold',
      color: primary,
      letterSpacing: 1.2,
      paddingBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: primary,
      borderBottomStyle: 'solid',
      marginBottom: 5,
    },
    summary: {
      fontSize: 9,
      color: '#444444',
    },
    itemRow: {
      flexDirection: 'row',
      marginBottom: 7,
    },
    itemDate: {
      width: 68,
      fontSize: 8,
      color: '#777777',
      paddingTop: 1,
    },
    itemBody: {
      flex: 1,
      minWidth: 0,
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
    },
    itemOrg: {
      fontSize: 9,
      color: '#555555',
    },
    itemDesc: {
      fontSize: 9,
      color: '#444444',
      marginTop: 1,
    },
    itemUrl: {
      fontSize: 8,
      color: '#777777',
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
    // Skills table: name | keywords
    skillRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    skillName: {
      width: 100,
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
    },
    skillLevel: {
      fontSize: 8,
      color: '#777777',
    },
    skillKeywords: {
      flex: 1,
      fontSize: 9,
      color: '#444444',
    },
    // Mother tongue inline
    motherRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    motherLabel: {
      width: 100,
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
    },
    motherValue: {
      flex: 1,
      fontSize: 9,
      color: '#444444',
    },
    // CEFR table
    langHeader: {
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
      marginBottom: 2,
      marginTop: 4,
    },
    cefrTable: {
      borderWidth: 0.5,
      borderColor: '#cccccc',
      borderStyle: 'solid',
    },
    cefrHeaderRow: {
      flexDirection: 'row',
      backgroundColor: primary,
    },
    cefrHeaderCell: {
      color: '#ffffff',
      fontSize: 8,
      fontWeight: 'bold',
      padding: 3,
      borderRightWidth: 0.5,
      borderRightColor: '#ffffff',
      borderRightStyle: 'solid',
      textAlign: 'center',
    },
    cefrHeaderNameCell: {
      color: '#ffffff',
      fontSize: 8,
      fontWeight: 'bold',
      padding: 3,
      borderRightWidth: 0.5,
      borderRightColor: '#ffffff',
      borderRightStyle: 'solid',
      width: '20%',
    },
    cefrRow: {
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: '#cccccc',
      borderTopStyle: 'solid',
    },
    cefrNameCell: {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: text,
      padding: 3,
      width: '20%',
      borderRightWidth: 0.5,
      borderRightColor: '#cccccc',
      borderRightStyle: 'solid',
    },
    cefrValueCell: {
      fontSize: 8.5,
      color: '#444444',
      padding: 3,
      textAlign: 'center',
      borderRightWidth: 0.5,
      borderRightColor: '#cccccc',
      borderRightStyle: 'solid',
    },
    cefrNote: {
      fontSize: 7,
      color: '#888888',
      marginTop: 3,
    },
    customRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    customLabel: {
      width: 100,
      fontSize: 9,
      fontWeight: 'bold',
      color: text,
    },
    customValue: {
      flex: 1,
      fontSize: 9,
      color: '#444444',
    },
  })
}

export default function PDFEuropassTemplate({ resume }: PDFEuropassTemplateProps) {
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

  const motherTongues = languages.filter((l) => l.proficiency === 'native')
  const otherLanguages = languages.filter((l) => l.proficiency !== 'native')

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

  const cefrWidth = '16%' // 5 skill column × 16% = 80%, 20% first column = 100%

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          {basics.photo && (
            <Image src={resolvePhotoUrl(basics.photo)} style={styles.photo} />
          )}
          <View style={styles.headerContent}>
            <Text style={styles.kicker}>EUROPASS · ÖZGEÇMİŞ</Text>
            <Text style={styles.name}>
              {basics.name || 'Adınız Soyadınız'}
            </Text>
            {basics.label && <Text style={styles.label}>{basics.label}</Text>}
            <View style={{ marginTop: 4 }}>
              {basics.email && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>E-posta</Text>
                  <Text style={styles.contactValue}>{basics.email}</Text>
                </View>
              )}
              {basics.phone && (
                <View style={styles.contactRow}>
                  <Text style={styles.contactLabel}>Telefon</Text>
                  <Text style={styles.contactValue}>{basics.phone}</Text>
                </View>
              )}
              {basics.profiles.map((p, i) => (
                <View key={`${p.network}-${i}`} style={styles.contactRow}>
                  <Text style={styles.contactLabel}>{p.network}</Text>
                  <Text style={styles.contactValue}>
                    {p.url || p.username}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.main}>
          {basics.summary && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.heading}>KİŞİSEL ÖZET</Text>
              <Text style={styles.summary}>{basics.summary}</Text>
            </View>
          )}

          {order.map((id) => (
            <Fragment key={id}>{sectionRenderers[id]?.()}</Fragment>
          ))}
        </View>
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    if (work.length === 0) return null
    const renderItem = (item: (typeof work)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>
          {formatDateRange(item.startDate, item.endDate)}
        </Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.position || 'Pozisyon'}</Text>
          {item.company && <Text style={styles.itemOrg}>{item.company}</Text>}
          {item.summary && <Text style={styles.itemDesc}>{item.summary}</Text>}
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
    )
    const [first, ...rest] = work
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>İŞ DENEYİMİ</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderEducation(): ReactNode {
    if (education.length === 0) return null
    const renderItem = (item: (typeof education)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>
          {formatDateRange(item.startDate, item.endDate)}
        </Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.institution || 'Okul'}</Text>
          {(item.degree || item.field) && (
            <Text style={styles.itemOrg}>
              {[item.degree, item.field].filter(Boolean).join(' — ')}
            </Text>
          )}
        </View>
      </View>
    )
    const [first, ...rest] = education
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>EĞİTİM VE ÖĞRETİM</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderSkills(): ReactNode {
    const visible = skills.filter((s) => s.name || s.keywords.length > 0)
    if (visible.length === 0) return null
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.heading}>PROFESYONEL BECERİLER</Text>
        {visible.map((skill) => (
          <View key={skill.id} style={styles.skillRow} wrap={false}>
            <View style={{ width: 100 }}>
              <Text style={styles.skillName}>{skill.name}</Text>
              {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                <Text style={styles.skillLevel}>
                  {SKILL_LEVEL_LABELS[skill.level]}
                </Text>
              )}
            </View>
            <Text style={styles.skillKeywords}>
              {skill.keywords.join(' · ')}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.heading}>DİLLER</Text>

        {motherTongues.length > 0 && (
          <View style={styles.motherRow}>
            <Text style={styles.motherLabel}>Ana dil</Text>
            <Text style={styles.motherValue}>
              {motherTongues
                .map((l) => l.name)
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        )}

        {otherLanguages.length > 0 && (
          <View wrap={false}>
            <Text style={styles.langHeader}>Diğer diller</Text>
            <View style={styles.cefrTable}>
              <View style={styles.cefrHeaderRow}>
                <Text style={styles.cefrHeaderNameCell}>Dil</Text>
                <Text style={[styles.cefrHeaderCell, { width: cefrWidth }]}>
                  Dinleme
                </Text>
                <Text style={[styles.cefrHeaderCell, { width: cefrWidth }]}>
                  Okuma
                </Text>
                <Text style={[styles.cefrHeaderCell, { width: cefrWidth }]}>
                  Karşılıklı
                </Text>
                <Text style={[styles.cefrHeaderCell, { width: cefrWidth }]}>
                  Sözlü Ür.
                </Text>
                <Text style={[styles.cefrHeaderCell, { width: cefrWidth }]}>
                  Yazma
                </Text>
              </View>
              {otherLanguages.map((l) => (
                <View key={l.id} style={styles.cefrRow}>
                  <Text style={styles.cefrNameCell}>{l.name}</Text>
                  <Text style={[styles.cefrValueCell, { width: cefrWidth }]}>
                    {cefrValue(l, 'listening')}
                  </Text>
                  <Text style={[styles.cefrValueCell, { width: cefrWidth }]}>
                    {cefrValue(l, 'reading')}
                  </Text>
                  <Text style={[styles.cefrValueCell, { width: cefrWidth }]}>
                    {cefrValue(l, 'spokenInteraction')}
                  </Text>
                  <Text style={[styles.cefrValueCell, { width: cefrWidth }]}>
                    {cefrValue(l, 'spokenProduction')}
                  </Text>
                  <Text style={[styles.cefrValueCell, { width: cefrWidth }]}>
                    {cefrValue(l, 'writing')}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.cefrNote}>
              ANLAMA (Dinleme + Okuma) · KONUŞMA (Karşılıklı + Sözlü Üretim) ·
              YAZMA — A1/A2 Temel, B1/B2 Bağımsız, C1/C2 Yetkin (CEFR)
            </Text>
          </View>
        )}
      </View>
    )
  }

  function renderProjects(): ReactNode {
    if (projects.length === 0) return null
    const renderItem = (item: (typeof projects)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>
          {formatDateRange(item.startDate, item.endDate)}
        </Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.name || 'Proje'}</Text>
          {item.description && (
            <Text style={styles.itemDesc}>{item.description}</Text>
          )}
          {item.url && <Text style={styles.itemUrl}>{item.url}</Text>}
        </View>
      </View>
    )
    const [first, ...rest] = projects
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>PROJELER</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderCertificates(): ReactNode {
    if (certificates.length === 0) return null
    const renderItem = (item: (typeof certificates)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          {item.issuer && <Text style={styles.itemOrg}>{item.issuer}</Text>}
          {item.url && <Text style={styles.itemUrl}>{item.url}</Text>}
        </View>
      </View>
    )
    const [first, ...rest] = certificates
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>SERTİFİKALAR</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderVolunteer(): ReactNode {
    if (volunteer.length === 0) return null
    const renderItem = (item: (typeof volunteer)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>
          {formatDateRange(item.startDate, item.endDate)}
        </Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.role || 'Rol'}</Text>
          {item.organization && (
            <Text style={styles.itemOrg}>{item.organization}</Text>
          )}
          {item.summary && <Text style={styles.itemDesc}>{item.summary}</Text>}
        </View>
      </View>
    )
    const [first, ...rest] = volunteer
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>GÖNÜLLÜLÜK</Text>
          {renderItem(first)}
        </View>
        {rest.map(renderItem)}
      </View>
    )
  }

  function renderPublications(): ReactNode {
    if (publications.length === 0) return null
    const renderItem = (item: (typeof publications)[0]) => (
      <View key={item.id} style={styles.itemRow} wrap={false}>
        <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
        <View style={styles.itemBody}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          {item.publisher && (
            <Text style={styles.itemOrg}>{item.publisher}</Text>
          )}
          {item.url && <Text style={styles.itemUrl}>{item.url}</Text>}
        </View>
      </View>
    )
    const [first, ...rest] = publications
    return (
      <View style={styles.section} wrap={false}>
        <View wrap={false}>
          <Text style={styles.heading}>YAYINLAR</Text>
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
              <View key={section.id} style={styles.section} wrap={false}>
                <Text style={styles.heading}>
                  {section.title.toUpperCase()}
                </Text>
                {section.fields.map((f) => (
                  <View key={f.id} style={styles.customRow}>
                    {f.label && (
                      <Text style={styles.customLabel}>{f.label}</Text>
                    )}
                    {f.value && (
                      <Text style={styles.customValue}>{f.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            ),
        )}
      </>
    )
  }
}
