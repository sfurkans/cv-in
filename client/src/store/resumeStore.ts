import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  Basics,
  Certificate,
  Education,
  Language,
  Profile,
  Project,
  Publication,
  Resume,
  Skill,
  Volunteer,
  Work,
} from '@/types/resume'

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
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Phase 3: formlar tek item mantığıyla çalışıyor. Bu helper ilk item'ı
// upsert eder — yoksa defaults + id ile yeni item oluşturur, varsa partial ile
// günceller. Phase 5'te dinamik listeye geçince aynı array üzerinde indexed
// update kullanılacak.
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

interface ResumeState {
  resume: Resume

  // Basics
  updateBasics: (partial: Partial<Basics>) => void
  updatePhoto: (base64: string) => void
  setProfiles: (profiles: Profile[]) => void

  // Bulk
  loadResume: (resume: Resume) => void

  // Section item updaters (tek item upsert)
  updateWorkItem: (partial: Partial<Omit<Work, 'id'>>) => void
  updateEducationItem: (partial: Partial<Omit<Education, 'id'>>) => void
  updateProjectItem: (partial: Partial<Omit<Project, 'id'>>) => void
  updateLanguageItem: (partial: Partial<Omit<Language, 'id'>>) => void
  updateCertificateItem: (partial: Partial<Omit<Certificate, 'id'>>) => void
  updateVolunteerItem: (partial: Partial<Omit<Volunteer, 'id'>>) => void
  updatePublicationItem: (partial: Partial<Omit<Publication, 'id'>>) => void

  // Skills (chip/keyword bazlı — skills[0].keywords üzerinde çalışır)
  addSkillKeyword: (keyword: string) => void
  removeSkillKeywordAt: (index: number) => void

  // Reset
  resetResume: () => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resume: initialResume,

      // Basics
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

      // Bulk
      loadResume: (resume) => set({ resume }),

      // Section item updaters
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

      // Skills
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
            return {
              resume: { ...state.resume, skills: [newSkill] },
            }
          }
          const [first, ...rest] = skills
          if (first.keywords.includes(trimmed)) {
            return state
          }
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

      // Reset
      resetResume: () => set({ resume: initialResume }),
    }),
    {
      name: 'cv-builder:resume',
      version: 1,
    }
  )
)
