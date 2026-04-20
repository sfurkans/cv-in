import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_SECTION_ORDER,
  type Basics,
  type Certificate,
  type CustomField,
  type CustomSection,
  type Education,
  type Language,
  type Profile,
  type Project,
  type Publication,
  type Resume,
  type SectionId,
  type Skill,
  type TemplateId,
  type Theme,
  type Volunteer,
  type Work,
} from '@/types/resume'

// ============================================================================
// Defaults
// ============================================================================

const emptyBasics: Basics = {
  name: '',
  label: '',
  email: '',
  phone: '',
  summary: '',
  photo: '',
  profiles: [],
}

const emptyWork: Omit<Work, 'id'> = {
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  summary: '',
  highlights: [],
}

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
}

const emptySkill: Omit<Skill, 'id'> = {
  name: '',
  level: '',
  keywords: [],
}

const emptyProject: Omit<Project, 'id'> = {
  name: '',
  description: '',
  url: '',
  startDate: '',
  endDate: '',
}

const emptyLanguage: Omit<Language, 'id'> = {
  name: '',
  proficiency: '',
}

const emptyCertificate: Omit<Certificate, 'id'> = {
  name: '',
  issuer: '',
  date: '',
  url: '',
}

const emptyVolunteer: Omit<Volunteer, 'id'> = {
  organization: '',
  role: '',
  startDate: '',
  endDate: '',
  summary: '',
}

const emptyPublication: Omit<Publication, 'id'> = {
  name: '',
  publisher: '',
  date: '',
  url: '',
}

const emptyCustomSection: Omit<CustomSection, 'id'> = {
  title: '',
  fields: [],
}

const emptyCustomField: Omit<CustomField, 'id'> = {
  label: '',
  value: '',
}

export const defaultTheme: Theme = {
  primaryColor: '#1f2937',
  textColor: '#111827',
  fontFamily: 'sans',
  spacing: 'normal',
}

export const initialResume: Resume = {
  basics: emptyBasics,
  work: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certificates: [],
  volunteer: [],
  publications: [],
  customSections: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  templateId: 'classic',
  theme: defaultTheme,
}

// ============================================================================
// Helpers
// ============================================================================

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Eski Phase 3-4 pattern: tek item upsert. Phase 5'te dinamik liste
// actions (addXxx/updateXxxAt/removeXxx) eklendi, ama form refactor'ları
// bitene kadar bu helper uyumluluk için tutuluyor.
function upsertFirstItem<T extends { id: string }>(
  items: T[],
  partial: Partial<Omit<T, 'id'>>,
  defaults: Omit<T, 'id'>
): T[] {
  if (items.length === 0) {
    return [{ ...defaults, ...partial, id: generateId() } as T]
  }
  const [first, ...rest] = items
  return [{ ...first, ...partial }, ...rest]
}

function appendItem<T extends { id: string }>(
  items: T[],
  defaults: Omit<T, 'id'>,
  partial?: Partial<Omit<T, 'id'>>
): { items: T[]; id: string } {
  const id = generateId()
  const newItem = { ...defaults, ...partial, id } as T
  return { items: [...items, newItem], id }
}

function updateItemById<T extends { id: string }>(
  items: T[],
  id: string,
  partial: Partial<Omit<T, 'id'>>
): T[] {
  return items.map((item) =>
    item.id === id ? { ...item, ...partial } : item
  )
}

function removeItemById<T extends { id: string }>(
  items: T[],
  id: string
): T[] {
  return items.filter((item) => item.id !== id)
}

function reorderItemsByIds<T extends { id: string }>(
  items: T[],
  ids: string[]
): T[] {
  const map = new Map(items.map((item) => [item.id, item]))
  const ordered: T[] = []
  for (const id of ids) {
    const item = map.get(id)
    if (item) ordered.push(item)
  }
  return ordered
}

// ============================================================================
// State interface
// ============================================================================

export type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error'

interface ResumeState {
  resume: Resume

  // Remote sync state (Phase 9a)
  remoteId: string | null
  syncStatus: SyncStatus
  lastSyncedAt: string | null
  lastSyncError: string | null

  setRemoteId: (id: string | null) => void
  setSyncStatus: (status: SyncStatus, error?: string | null) => void
  markSynced: (remoteId: string, updatedAt: string) => void

  // Basics
  updateBasics: (partial: Partial<Basics>) => void
  updatePhoto: (base64: string) => void
  setProfiles: (profiles: Profile[]) => void

  // Template & Theme (Phase 6)
  setTemplateId: (id: TemplateId) => void
  updateTheme: (partial: Partial<Theme>) => void
  resetTheme: () => void

  // Section order
  reorderSections: (ids: SectionId[]) => void

  // Bulk
  loadResume: (resume: Resume) => void
  resetResume: () => void

  // ----- Deprecated (Phase 3-4 uyumluluğu, form refactor sonrası silinecek)
  updateWorkItem: (partial: Partial<Omit<Work, 'id'>>) => void
  updateEducationItem: (partial: Partial<Omit<Education, 'id'>>) => void
  updateProjectItem: (partial: Partial<Omit<Project, 'id'>>) => void
  updateLanguageItem: (partial: Partial<Omit<Language, 'id'>>) => void
  updateCertificateItem: (partial: Partial<Omit<Certificate, 'id'>>) => void
  updateVolunteerItem: (partial: Partial<Omit<Volunteer, 'id'>>) => void
  updatePublicationItem: (partial: Partial<Omit<Publication, 'id'>>) => void
  addSkillKeyword: (keyword: string) => void
  removeSkillKeywordAt: (index: number) => void

  // ----- Phase 5: dinamik liste actions (CRUD + reorder)
  // Work
  addWork: (defaults?: Partial<Omit<Work, 'id'>>) => string
  updateWorkAt: (id: string, partial: Partial<Omit<Work, 'id'>>) => void
  removeWork: (id: string) => void
  reorderWork: (ids: string[]) => void

  // Education
  addEducation: (defaults?: Partial<Omit<Education, 'id'>>) => string
  updateEducationAt: (
    id: string,
    partial: Partial<Omit<Education, 'id'>>
  ) => void
  removeEducation: (id: string) => void
  reorderEducation: (ids: string[]) => void

  // Skill
  addSkill: (defaults?: Partial<Omit<Skill, 'id'>>) => string
  updateSkillAt: (id: string, partial: Partial<Omit<Skill, 'id'>>) => void
  removeSkill: (id: string) => void
  reorderSkills: (ids: string[]) => void
  addKeywordToSkillAt: (skillId: string, keyword: string) => void
  removeKeywordFromSkillAt: (skillId: string, index: number) => void

  // Project
  addProject: (defaults?: Partial<Omit<Project, 'id'>>) => string
  updateProjectAt: (
    id: string,
    partial: Partial<Omit<Project, 'id'>>
  ) => void
  removeProject: (id: string) => void
  reorderProjects: (ids: string[]) => void

  // Language
  addLanguage: (defaults?: Partial<Omit<Language, 'id'>>) => string
  updateLanguageAt: (
    id: string,
    partial: Partial<Omit<Language, 'id'>>
  ) => void
  removeLanguage: (id: string) => void
  reorderLanguages: (ids: string[]) => void

  // Certificate
  addCertificate: (defaults?: Partial<Omit<Certificate, 'id'>>) => string
  updateCertificateAt: (
    id: string,
    partial: Partial<Omit<Certificate, 'id'>>
  ) => void
  removeCertificate: (id: string) => void
  reorderCertificates: (ids: string[]) => void

  // Volunteer
  addVolunteer: (defaults?: Partial<Omit<Volunteer, 'id'>>) => string
  updateVolunteerAt: (
    id: string,
    partial: Partial<Omit<Volunteer, 'id'>>
  ) => void
  removeVolunteer: (id: string) => void
  reorderVolunteer: (ids: string[]) => void

  // Publication
  addPublication: (defaults?: Partial<Omit<Publication, 'id'>>) => string
  updatePublicationAt: (
    id: string,
    partial: Partial<Omit<Publication, 'id'>>
  ) => void
  removePublication: (id: string) => void
  reorderPublications: (ids: string[]) => void

  // CustomSection (Phase 5 — kullanıcı tanımlı bölümler)
  addCustomSection: (
    defaults?: Partial<Omit<CustomSection, 'id'>>
  ) => string
  updateCustomSectionAt: (
    id: string,
    partial: Partial<Omit<CustomSection, 'id' | 'fields'>>
  ) => void
  removeCustomSection: (id: string) => void
  reorderCustomSections: (ids: string[]) => void

  // CustomField (section içinde)
  addCustomFieldTo: (
    sectionId: string,
    defaults?: Partial<Omit<CustomField, 'id'>>
  ) => string
  updateCustomFieldAt: (
    sectionId: string,
    fieldId: string,
    partial: Partial<Omit<CustomField, 'id'>>
  ) => void
  removeCustomFieldFrom: (sectionId: string, fieldId: string) => void
  reorderCustomFieldsIn: (sectionId: string, fieldIds: string[]) => void
}

// ============================================================================
// Store
// ============================================================================

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resume: initialResume,

      // ---- Remote sync (Phase 9a)
      remoteId: null,
      syncStatus: 'idle',
      lastSyncedAt: null,
      lastSyncError: null,

      setRemoteId: (id) => set({ remoteId: id }),
      setSyncStatus: (status, error = null) =>
        set({ syncStatus: status, lastSyncError: error }),
      markSynced: (remoteId, updatedAt) =>
        set({
          remoteId,
          syncStatus: 'saved',
          lastSyncedAt: updatedAt,
          lastSyncError: null,
        }),

      // ---- Basics
      updateBasics: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: { ...state.resume.basics, ...partial },
          },
        })),

      updatePhoto: (base64) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: { ...state.resume.basics, photo: base64 },
          },
        })),

      setProfiles: (profiles) =>
        set((state) => ({
          resume: {
            ...state.resume,
            basics: { ...state.resume.basics, profiles },
          },
        })),

      // ---- Template & Theme (Phase 6)
      setTemplateId: (id) =>
        set((state) => ({
          resume: { ...state.resume, templateId: id },
        })),

      updateTheme: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            theme: { ...state.resume.theme, ...partial },
          },
        })),

      resetTheme: () =>
        set((state) => ({
          resume: { ...state.resume, theme: defaultTheme },
        })),

      reorderSections: (ids) =>
        set((state) => {
          const valid = new Set<SectionId>(DEFAULT_SECTION_ORDER)
          const seen = new Set<SectionId>()
          const normalized: SectionId[] = []
          for (const id of ids) {
            if (valid.has(id) && !seen.has(id)) {
              seen.add(id)
              normalized.push(id)
            }
          }
          for (const id of DEFAULT_SECTION_ORDER) {
            if (!seen.has(id)) normalized.push(id)
          }
          return {
            resume: { ...state.resume, sectionOrder: normalized },
          }
        }),

      // ---- Bulk
      loadResume: (resume) =>
        set({
          resume: {
            ...resume,
            sectionOrder:
              resume.sectionOrder && resume.sectionOrder.length > 0
                ? resume.sectionOrder
                : [...DEFAULT_SECTION_ORDER],
          },
        }),
      resetResume: () => set({ resume: initialResume }),

      // ---- Deprecated upsert-first actions (Phase 3-4 geriye dönük)
      updateWorkItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            work: upsertFirstItem(state.resume.work, partial, emptyWork),
          },
        })),

      updateEducationItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: upsertFirstItem(
              state.resume.education,
              partial,
              emptyEducation
            ),
          },
        })),

      updateProjectItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: upsertFirstItem(
              state.resume.projects,
              partial,
              emptyProject
            ),
          },
        })),

      updateLanguageItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: upsertFirstItem(
              state.resume.languages,
              partial,
              emptyLanguage
            ),
          },
        })),

      updateCertificateItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: upsertFirstItem(
              state.resume.certificates,
              partial,
              emptyCertificate
            ),
          },
        })),

      updateVolunteerItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            volunteer: upsertFirstItem(
              state.resume.volunteer,
              partial,
              emptyVolunteer
            ),
          },
        })),

      updatePublicationItem: (partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: upsertFirstItem(
              state.resume.publications,
              partial,
              emptyPublication
            ),
          },
        })),

      addSkillKeyword: (keyword) => {
        const trimmed = keyword.trim()
        if (!trimmed) return
        set((state) => {
          const skills = state.resume.skills
          if (skills.length === 0) {
            const newSkill: Skill = {
              ...emptySkill,
              id: generateId(),
              keywords: [trimmed],
            }
            return { resume: { ...state.resume, skills: [newSkill] } }
          }
          const [first, ...rest] = skills
          if (first.keywords.includes(trimmed)) return state
          return {
            resume: {
              ...state.resume,
              skills: [
                { ...first, keywords: [...first.keywords, trimmed] },
                ...rest,
              ],
            },
          }
        })
      },

      removeSkillKeywordAt: (index) =>
        set((state) => {
          const skills = state.resume.skills
          if (skills.length === 0) return state
          const [first, ...rest] = skills
          const nextKeywords = first.keywords.filter((_, i) => i !== index)
          return {
            resume: {
              ...state.resume,
              skills: [{ ...first, keywords: nextKeywords }, ...rest],
            },
          }
        }),

      // ---- Phase 5: Work dinamik CRUD
      addWork: (defaults) => {
        const { items, id } = appendItem(
          get().resume.work,
          emptyWork,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, work: items },
        }))
        return id
      },
      updateWorkAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            work: updateItemById(state.resume.work, id, partial),
          },
        })),
      removeWork: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            work: removeItemById(state.resume.work, id),
          },
        })),
      reorderWork: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            work: reorderItemsByIds(state.resume.work, ids),
          },
        })),

      // ---- Education
      addEducation: (defaults) => {
        const { items, id } = appendItem(
          get().resume.education,
          emptyEducation,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, education: items },
        }))
        return id
      },
      updateEducationAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: updateItemById(state.resume.education, id, partial),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: removeItemById(state.resume.education, id),
          },
        })),
      reorderEducation: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: reorderItemsByIds(state.resume.education, ids),
          },
        })),

      // ---- Skill
      addSkill: (defaults) => {
        const { items, id } = appendItem(
          get().resume.skills,
          emptySkill,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, skills: items },
        }))
        return id
      },
      updateSkillAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: updateItemById(state.resume.skills, id, partial),
          },
        })),
      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: removeItemById(state.resume.skills, id),
          },
        })),
      reorderSkills: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: reorderItemsByIds(state.resume.skills, ids),
          },
        })),
      addKeywordToSkillAt: (skillId, keyword) => {
        const trimmed = keyword.trim()
        if (!trimmed) return
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((skill) => {
              if (skill.id !== skillId) return skill
              if (skill.keywords.includes(trimmed)) return skill
              return { ...skill, keywords: [...skill.keywords, trimmed] }
            }),
          },
        }))
      },
      removeKeywordFromSkillAt: (skillId, index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((skill) => {
              if (skill.id !== skillId) return skill
              return {
                ...skill,
                keywords: skill.keywords.filter((_, i) => i !== index),
              }
            }),
          },
        })),

      // ---- Project
      addProject: (defaults) => {
        const { items, id } = appendItem(
          get().resume.projects,
          emptyProject,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, projects: items },
        }))
        return id
      },
      updateProjectAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: updateItemById(state.resume.projects, id, partial),
          },
        })),
      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: removeItemById(state.resume.projects, id),
          },
        })),
      reorderProjects: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: reorderItemsByIds(state.resume.projects, ids),
          },
        })),

      // ---- Language
      addLanguage: (defaults) => {
        const { items, id } = appendItem(
          get().resume.languages,
          emptyLanguage,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, languages: items },
        }))
        return id
      },
      updateLanguageAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: updateItemById(state.resume.languages, id, partial),
          },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: removeItemById(state.resume.languages, id),
          },
        })),
      reorderLanguages: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            languages: reorderItemsByIds(state.resume.languages, ids),
          },
        })),

      // ---- Certificate
      addCertificate: (defaults) => {
        const { items, id } = appendItem(
          get().resume.certificates,
          emptyCertificate,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, certificates: items },
        }))
        return id
      },
      updateCertificateAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: updateItemById(
              state.resume.certificates,
              id,
              partial
            ),
          },
        })),
      removeCertificate: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: removeItemById(state.resume.certificates, id),
          },
        })),
      reorderCertificates: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: reorderItemsByIds(state.resume.certificates, ids),
          },
        })),

      // ---- Volunteer
      addVolunteer: (defaults) => {
        const { items, id } = appendItem(
          get().resume.volunteer,
          emptyVolunteer,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, volunteer: items },
        }))
        return id
      },
      updateVolunteerAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            volunteer: updateItemById(state.resume.volunteer, id, partial),
          },
        })),
      removeVolunteer: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            volunteer: removeItemById(state.resume.volunteer, id),
          },
        })),
      reorderVolunteer: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            volunteer: reorderItemsByIds(state.resume.volunteer, ids),
          },
        })),

      // ---- Publication
      addPublication: (defaults) => {
        const { items, id } = appendItem(
          get().resume.publications,
          emptyPublication,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, publications: items },
        }))
        return id
      },
      updatePublicationAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: updateItemById(
              state.resume.publications,
              id,
              partial
            ),
          },
        })),
      removePublication: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: removeItemById(state.resume.publications, id),
          },
        })),
      reorderPublications: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            publications: reorderItemsByIds(state.resume.publications, ids),
          },
        })),

      // ---- CustomSection
      addCustomSection: (defaults) => {
        const { items, id } = appendItem(
          get().resume.customSections,
          emptyCustomSection,
          defaults
        )
        set((state) => ({
          resume: { ...state.resume, customSections: items },
        }))
        return id
      },
      updateCustomSectionAt: (id, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: updateItemById(
              state.resume.customSections,
              id,
              partial
            ),
          },
        })),
      removeCustomSection: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: removeItemById(state.resume.customSections, id),
          },
        })),
      reorderCustomSections: (ids) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: reorderItemsByIds(
              state.resume.customSections,
              ids
            ),
          },
        })),

      // ---- CustomField (section içinde)
      addCustomFieldTo: (sectionId, defaults) => {
        const fieldId = generateId()
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) => {
              if (section.id !== sectionId) return section
              return {
                ...section,
                fields: [
                  ...section.fields,
                  { ...emptyCustomField, ...defaults, id: fieldId },
                ],
              }
            }),
          },
        }))
        return fieldId
      },
      updateCustomFieldAt: (sectionId, fieldId, partial) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) => {
              if (section.id !== sectionId) return section
              return {
                ...section,
                fields: section.fields.map((field) =>
                  field.id === fieldId ? { ...field, ...partial } : field
                ),
              }
            }),
          },
        })),
      removeCustomFieldFrom: (sectionId, fieldId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) => {
              if (section.id !== sectionId) return section
              return {
                ...section,
                fields: section.fields.filter((f) => f.id !== fieldId),
              }
            }),
          },
        })),
      reorderCustomFieldsIn: (sectionId, fieldIds) =>
        set((state) => ({
          resume: {
            ...state.resume,
            customSections: state.resume.customSections.map((section) => {
              if (section.id !== sectionId) return section
              return {
                ...section,
                fields: reorderItemsByIds(section.fields, fieldIds),
              }
            }),
          },
        })),
    }),
    {
      name: 'cv-builder:resume',
      version: 4,
      partialize: (state) => ({
        resume: state.resume,
        remoteId: state.remoteId,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // v1 → v2: templateId + theme eklendi.
      // v2 → v3: remoteId + lastSyncedAt eklendi (Phase 9a backend sync).
      // v3 → v4: sectionOrder eklendi (bölüm sıralama).
      migrate: (persistedState, version) => {
        const state = persistedState as {
          resume?: Partial<Resume>
          remoteId?: string | null
          lastSyncedAt?: string | null
        } | null
        if (!state?.resume) return persistedState
        if (version < 2) {
          state.resume.templateId ??= 'classic'
          state.resume.theme ??= defaultTheme
        }
        if (version < 3) {
          state.remoteId ??= null
          state.lastSyncedAt ??= null
        }
        if (version < 4) {
          state.resume.sectionOrder ??= [...DEFAULT_SECTION_ORDER]
        }
        return state
      },
    }
  )
)
