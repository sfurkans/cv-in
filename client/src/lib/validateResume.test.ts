import { initialResume } from '@/store/resumeStore'
import type { Resume } from '@/types/resume'

import {
  getInvalidSectionCount,
  getTotalErrorCount,
  validateResume,
} from './validateResume'

function makeResume(overrides: Partial<Resume> = {}): Resume {
  return {
    ...initialResume,
    ...overrides,
    basics: {
      ...initialResume.basics,
      ...(overrides.basics ?? {}),
    },
  }
}

describe('validateResume', () => {
  describe('empty / boş resume', () => {
    it('boş resume da sadece personal da hata olur (name zorunlu)', () => {
      const result = validateResume(initialResume)

      expect(result.personal.isValid).toBe(false)
      expect(result.personal.errorCount).toBeGreaterThan(0)
      expect(result.experience.isValid).toBe(true)
      expect(result.education.isValid).toBe(true)
      expect(result.skills.isValid).toBe(true)
      expect(result.projects.isValid).toBe(true)
      expect(result.languages.isValid).toBe(true)
      expect(result.certificates.isValid).toBe(true)
      expect(result.volunteer.isValid).toBe(true)
      expect(result.publications.isValid).toBe(true)
      expect(result.custom.isValid).toBe(true)
    })
  })

  describe('personal section', () => {
    it('geçerli basics ile personal valid olur', () => {
      const resume = makeResume({ basics: { ...initialResume.basics, name: 'Furkan' } })
      const result = validateResume(resume)

      expect(result.personal.isValid).toBe(true)
    })

    it('geçersiz email ile personal hata verir', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan', email: 'bad-email' },
      })
      const result = validateResume(resume)

      expect(result.personal.isValid).toBe(false)
      expect(result.personal.errorCount).toBe(1)
    })
  })

  describe('section item validation', () => {
    it('work item dolu ve geçerli ise experience valid olur', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        work: [
          {
            id: 'w1',
            company: 'ABC',
            position: 'Developer',
            startDate: '2023-01',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)

      expect(result.experience.isValid).toBe(true)
    })

    it('work item de şirket boşsa experience hata verir', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        work: [
          {
            id: 'w1',
            company: '',
            position: 'Developer',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)

      expect(result.experience.isValid).toBe(false)
      expect(result.experience.errorCount).toBeGreaterThan(0)
    })

    it('project item de geçersiz URL hata verir', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        projects: [
          {
            id: 'p1',
            name: 'CV Builder',
            description: '',
            url: 'not-a-url',
            startDate: '',
            endDate: '',
          },
        ],
      })
      const result = validateResume(resume)

      expect(result.projects.isValid).toBe(false)
    })
  })

  describe('getTotalErrorCount', () => {
    it('tüm bölümlerdeki hataları toplar', () => {
      const result = validateResume(initialResume)
      const total = getTotalErrorCount(result)

      expect(total).toBe(result.personal.errorCount)
    })

    it('hiç hata yoksa 0 döner', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
      })
      const result = validateResume(resume)
      expect(getTotalErrorCount(result)).toBe(0)
    })
  })

  describe('custom sections', () => {
    it('boş customSections array i valid sayılır', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
      })
      const result = validateResume(resume)
      expect(result.custom.isValid).toBe(true)
    })

    it('geçerli customSection ile valid', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        customSections: [
          {
            id: 'cs1',
            title: 'Hobiler',
            fields: [{ id: 'f1', label: 'Spor', value: 'Koşu' }],
          },
        ],
      })
      const result = validateResume(resume)
      expect(result.custom.isValid).toBe(true)
    })

    it('boş title customSection hata verir', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        customSections: [
          {
            id: 'cs1',
            title: '',
            fields: [],
          },
        ],
      })
      const result = validateResume(resume)
      expect(result.custom.isValid).toBe(false)
    })
  })

  describe('Phase 5 — çoklu item validation', () => {
    it('work array de birden fazla geçerli item → experience valid', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        work: [
          {
            id: 'w1',
            company: 'ABC',
            position: 'Developer',
            startDate: '2023-01',
            endDate: '',
            summary: '',
            highlights: [],
          },
          {
            id: 'w2',
            company: 'XYZ',
            position: 'Senior',
            startDate: '2020-01',
            endDate: '2022-12',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)
      expect(result.experience.isValid).toBe(true)
    })

    it('work array de 1 geçerli + 1 hatalı → experience errorCount hata sayısı kadar', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        work: [
          {
            id: 'w1',
            company: 'ABC',
            position: 'Developer',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
          {
            id: 'w2',
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)
      expect(result.experience.isValid).toBe(false)
      expect(result.experience.errorCount).toBeGreaterThanOrEqual(2)
    })

    it('work array de birden fazla hatalı item → toplam hata sayısı', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        work: [
          {
            id: 'w1',
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
          {
            id: 'w2',
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)
      expect(result.experience.errorCount).toBe(4)
    })

    it('languages array de 3 geçerli item → languages valid', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
        languages: [
          { id: 'l1', name: 'İngilizce', proficiency: 'c1' },
          { id: 'l2', name: 'Almanca', proficiency: 'b1' },
          { id: 'l3', name: 'Fransızca', proficiency: 'a2' },
        ],
      })
      const result = validateResume(resume)
      expect(result.languages.isValid).toBe(true)
    })
  })

  describe('getInvalidSectionCount', () => {
    it('geçersiz bölümlerin sayısını döner', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: '' },
        work: [
          {
            id: 'w1',
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      })
      const result = validateResume(resume)
      expect(getInvalidSectionCount(result)).toBe(2)
    })

    it('hiç geçersiz yoksa 0 döner', () => {
      const resume = makeResume({
        basics: { ...initialResume.basics, name: 'Furkan' },
      })
      const result = validateResume(resume)
      expect(getInvalidSectionCount(result)).toBe(0)
    })
  })
})
