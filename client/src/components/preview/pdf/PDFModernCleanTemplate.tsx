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
import { PDF_FONT_MAP } from '@/lib/templateStyles'
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionId,
  type Spacing,
} from '@/types/resume'

import PDFSection from './PDFSection'
import './fonts'

interface PDFModernCleanTemplateProps {
  resume: Resume
}

const PDF_SPACING_CLEAN: Record<
  Spacing,
  { pagePadding: number; sectionGap: number }
> = {
  compact: { pagePadding: 40, sectionGap: 16 },
  normal: { pagePadding: 48, sectionGap: 20 },
  relaxed: { pagePadding: 56, sectionGap: 26 },
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
      fontSize: 10,
      color: '#555555',
      padding: pagePadding,
      lineHeight: 1.5,
    },
    header: {
      marginBottom: 12,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: text,
      lineHeight: 1.1,
      marginBottom: 3,
    },
    label: {
      fontSize: 11,
      color: '#777777',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 10,
      marginBottom: sectionGap,
      fontSize: 8.5,
      color: '#777777',
    },
    contactItem: {
      marginRight: 12,
      marginBottom: 2,
    },
    section: {
      marginBottom: sectionGap,
    },
    sectionHeading: {
      fontSize: 12.5,
      fontWeight: 'bold',
      color: text,
      marginBottom: 6,
    },
    itemBlock: {
      marginBottom: 10,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      color: text,
      flex: 1,
    },
    itemCompany: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: primary,
      marginTop: 1,
    },
    itemDate: {
      fontSize: 9,
      color: '#888888',
      marginLeft: 6,
    },
    itemBody: {
      fontSize: 9.5,
      color: '#555555',
      marginTop: 3,
    },
    bulletList: {
      marginTop: 3,
      paddingLeft: 10,
    },
    bullet: {
      fontSize: 9.5,
      color: '#555555',
      marginBottom: 2,
    },
    skillsGroup: {
      marginBottom: 6,
    },
    skillName: {
      fontSize: 10.5,
      fontWeight: 'bold',
      color: text,
      marginBottom: 1,
    },
    skillLevel: {
      fontWeight: 'normal',
      color: '#888888',
      fontSize: 9,
    },
    skillKeywords: {
      fontSize: 9.5,
      color: '#555555',
    },
    languageItem: {
      flexDirection: 'row',
      marginRight: 16,
      marginBottom: 3,
    },
    langName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
    },
    langProf: {
      fontSize: 9,
      color: '#888888',
      marginLeft: 6,
    },
    url: {
      fontSize: 9,
      color: primary,
      marginTop: 2,
    },
    summary: {
      fontSize: 10,
      color: '#555555',
      marginTop: 4,
    },
    customRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    customLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: text,
      marginRight: 5,
    },
    customValue: {
      fontSize: 10,
      color: '#555555',
      flex: 1,
    },
  })
}

export default function PDFModernCleanTemplate({
  resume,
}: PDFModernCleanTemplateProps) {
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
  const { pagePadding, sectionGap } = PDF_SPACING_CLEAN[theme.spacing]
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
    <Text style={styles.sectionHeading} minPresenceAhead={40}>{children}</Text>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {basics.name || 'Adınız Soyadınız'}
          </Text>
          {basics.label && <Text style={styles.label}>{basics.label}</Text>}
        </View>

        {(basics.email || basics.phone || basics.profiles.length > 0) && (
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
        )}

        {basics.summary && (
          <View style={styles.section} wrap={false}>
            <SectionHeading>Özet</SectionHeading>
            <Text style={styles.summary}>{basics.summary}</Text>
          </View>
        )}

        {order.map((id) => (
          <Fragment key={id}>{renderers[id]?.()}</Fragment>
        ))}
      </Page>
    </Document>
  )

  function renderExperience(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={work}
        heading={<SectionHeading>Deneyim</SectionHeading>}
        renderItem={(item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
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
                  .map((h, i) => (
                    <Text key={i} style={styles.bullet}>
                      • {h}
                    </Text>
                  ))}
              </View>
            )}
          </View>
        )}
      />
    )
  }

  function renderEducation(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={education}
        heading={<SectionHeading>Eğitim</SectionHeading>}
        renderItem={(item) => (
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
        )}
      />
    )
  }

  function renderSkills(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={visibleSkills}
        heading={<SectionHeading>Yetenekler</SectionHeading>}
        renderItem={(skill) => (
          <View key={skill.id} style={styles.skillsGroup} wrap={false}>
            {(skill.name || skill.level) && (
              <Text style={styles.skillName}>
                {skill.name}
                {skill.level && SKILL_LEVEL_LABELS[skill.level] && (
                  <Text style={styles.skillLevel}>
                    {'  '}
                    {SKILL_LEVEL_LABELS[skill.level]}
                  </Text>
                )}
              </Text>
            )}
            <Text style={styles.skillKeywords}>
              {skill.keywords.join(' · ')}
            </Text>
          </View>
        )}
      />
    )
  }

  function renderProjects(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={projects}
        heading={<SectionHeading>Projeler</SectionHeading>}
        renderItem={(item) => (
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
            {item.url && <Text style={styles.url}>{item.url}</Text>}
          </View>
        )}
      />
    )
  }

  function renderLanguages(): ReactNode {
    if (languages.length === 0) return null
    return (
      <View style={styles.section} wrap={false}>
        <SectionHeading>Diller</SectionHeading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {languages.map((l) => (
            <View key={l.id} style={styles.languageItem}>
              <Text style={styles.langName}>{l.name}</Text>
              {l.proficiency && (
                <Text style={styles.langProf}>
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
    return (
      <PDFSection
        style={styles.section}
        items={certificates}
        heading={<SectionHeading>Sertifikalar</SectionHeading>}
        renderItem={(item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.name}
                {item.issuer && (
                  <Text style={{ fontWeight: 'normal', color: '#888888' }}>
                    {' — '}
                    {item.issuer}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
            </View>
            {item.url && <Text style={styles.url}>{item.url}</Text>}
          </View>
        )}
      />
    )
  }

  function renderVolunteer(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={volunteer}
        heading={<SectionHeading>Gönüllülük</SectionHeading>}
        renderItem={(item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
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
        )}
      />
    )
  }

  function renderPublications(): ReactNode {
    return (
      <PDFSection
        style={styles.section}
        items={publications}
        heading={<SectionHeading>Yayınlar</SectionHeading>}
        renderItem={(item) => (
          <View key={item.id} style={styles.itemBlock} wrap={false}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>
                {item.name}
                {item.publisher && (
                  <Text style={{ fontWeight: 'normal', color: '#888888' }}>
                    {' — '}
                    {item.publisher}
                  </Text>
                )}
              </Text>
              <Text style={styles.itemDate}>{formatMonth(item.date)}</Text>
            </View>
            {item.url && <Text style={styles.url}>{item.url}</Text>}
          </View>
        )}
      />
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
                <SectionHeading>{section.title}</SectionHeading>
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
