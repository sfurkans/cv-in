import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'

import type { FontFamily, Resume, Spacing } from '@/types/resume'

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
  return StyleSheet.create({
    page: {
      fontFamily,
      fontSize: 9,
      flexDirection: 'row',
      lineHeight: 1.4,
    },
    sidebar: {
      width: '35%',
      backgroundColor: primary,
      padding: sidePadding,
      color: '#ffffff',
    },
    main: {
      flex: 1,
      padding: mainPadding,
      color: '#444444',
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignSelf: 'center',
      marginBottom: 10,
      objectFit: 'cover',
    },
    sidebarName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 2,
    },
    sidebarLabel: {
      fontSize: 9,
      color: '#ffffffcc',
      marginBottom: 10,
    },
    sideSection: {
      marginBottom: sectionGap,
    },
    sideHeading: {
      fontSize: 8,
      fontWeight: 'bold',
      color: '#ffffff',
      textTransform: 'uppercase',
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
      fontSize: 9,
      fontWeight: 'bold',
      color: primary,
      textTransform: 'uppercase',
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
    theme,
  } = resume

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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {basics.photo && <Image src={basics.photo} style={styles.photo} />}

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
              <Text style={styles.sideHeading}>İletişim</Text>
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
              <Text style={styles.sideHeading}>Yetenekler</Text>
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
              <Text style={styles.sideHeading}>Diller</Text>
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
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Hakkımda</Text>
              <Text style={styles.itemBody}>{basics.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {work.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Deneyim</Text>
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
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Eğitim</Text>
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
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Projeler</Text>
              {projects.map((item) => (
                <View key={item.id} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {item.name || 'Proje'}
                    </Text>
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
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Sertifikalar</Text>
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
                    <Text style={styles.itemDate}>
                      {formatMonth(item.date)}
                    </Text>
                  </View>
                  {item.url && <Text style={styles.urlText}>{item.url}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Volunteer */}
          {volunteer.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Gönüllülük</Text>
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
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainHeading}>Yayınlar</Text>
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
                    <Text style={styles.itemDate}>
                      {formatMonth(item.date)}
                    </Text>
                  </View>
                  {item.url && <Text style={styles.urlText}>{item.url}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Custom sections */}
          {customSections.map(
            (section) =>
              section.title && (
                <View key={section.id} style={styles.mainSection}>
                  <Text style={styles.mainHeading}>{section.title}</Text>
                  {section.fields.map((field) => (
                    <View key={field.id} style={styles.customFieldRow}>
                      {field.label && (
                        <Text style={styles.customFieldLabel}>
                          {field.label}:
                        </Text>
                      )}
                      {field.value && (
                        <Text style={styles.customFieldValue}>
                          {field.value}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )
          )}
        </View>
      </Page>
    </Document>
  )
}
