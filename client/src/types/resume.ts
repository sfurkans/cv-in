export interface Profile {
  network: string
  url: string
  username: string
}

export interface Basics {
  name: string
  label: string
  email: string
  phone: string
  summary: string
  photo: string
  profiles: Profile[]
}

export interface Work {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export interface Skill {
  id: string
  name: string
  level: string
  keywords: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  startDate: string
  endDate: string
}

export interface Language {
  id: string
  name: string
  proficiency: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  url: string
}

export interface Volunteer {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  summary: string
}

export interface Publication {
  id: string
  name: string
  publisher: string
  date: string
  url: string
}

export interface CustomField {
  id: string
  label: string
  value: string
}

export interface CustomSection {
  id: string
  title: string
  fields: CustomField[]
}

export type TemplateId = 'classic' | 'modern' | 'creative'

export type SectionId =
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certificates'
  | 'volunteer'
  | 'publications'
  | 'custom'

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'experience',
  'education',
  'skills',
  'projects',
  'languages',
  'certificates',
  'volunteer',
  'publications',
  'custom',
]

export type FontFamily = 'sans' | 'serif' | 'mono'

export type Spacing = 'compact' | 'normal' | 'relaxed'

export interface Theme {
  primaryColor: string
  textColor: string
  fontFamily: FontFamily
  spacing: Spacing
}

export interface Resume {
  basics: Basics
  work: Work[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  languages: Language[]
  certificates: Certificate[]
  volunteer: Volunteer[]
  publications: Publication[]
  customSections: CustomSection[]
  sectionOrder: SectionId[]
  templateId: TemplateId
  theme: Theme
}
