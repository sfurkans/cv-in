import { describe, expect, it } from 'vitest'

import { sampleResume } from '@/lib/sampleResume'
import type { Resume } from '@/types/resume'

import {
  generateJsonFileName,
  importResumeFromJson,
  serializeResume,
} from './jsonIO'

function makeMinimalResume(): Resume {
  return {
    basics: {
      name: '',
      label: '',
      email: '',
      phone: '',
      summary: '',
      photo: '',
      profiles: [],
    },
    work: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    certificates: [],
    volunteer: [],
    publications: [],
    customSections: [],
    templateId: 'classic',
    theme: {
      primaryColor: '#1f2937',
      textColor: '#111827',
      fontFamily: 'sans',
      spacing: 'normal',
    },
  }
}

describe('jsonIO', () => {
  describe('serializeResume', () => {
    it('resume i JSON string e çevirir ve 2 space pretty print yapar', () => {
      const resume = makeMinimalResume()
      const json = serializeResume(resume)

      expect(typeof json).toBe('string')
      expect(json).toContain('\n  ')
      expect(json).toContain('"basics"')
      expect(json).toContain('"templateId": "classic"')
    })

    it('sampleResume için geçerli JSON üretir (parse edilebilir)', () => {
      const json = serializeResume(sampleResume)
      const parsed = JSON.parse(json)
      expect(parsed.basics.name).toBe('Ada Yıldız')
      expect(parsed.work).toHaveLength(2)
    })
  })

  describe('generateJsonFileName', () => {
    it('basit ad için slugify ederek dosya adı üretir', () => {
      expect(generateJsonFileName('Ada Yıldız')).toBe('Ada_Yildiz_CV.json')
    })

    it('Türkçe karakterleri Latinize eder', () => {
      expect(generateJsonFileName('Çağrı Özgün')).toBe('Cagri_Ozgun_CV.json')
    })

    it('boş isim için default CV adını kullanır', () => {
      expect(generateJsonFileName('')).toBe('CV_CV.json')
    })

    it('özel karakterleri temizler', () => {
      expect(generateJsonFileName('John-Doe #1')).toBe('John_Doe_1_CV.json')
    })
  })

  describe('importResumeFromJson', () => {
    it('geçerli JSON ile round-trip yapar', () => {
      const original = makeMinimalResume()
      const json = serializeResume(original)
      const result = importResumeFromJson(json)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.resume).toEqual(original)
      }
    })

    it('sampleResume round-trip yapar', () => {
      const json = serializeResume(sampleResume)
      const result = importResumeFromJson(json)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.resume.basics.name).toBe('Ada Yıldız')
        expect(result.resume.work).toHaveLength(2)
        expect(result.resume.templateId).toBe('classic')
      }
    })

    it('geçersiz JSON için ok:false döner', () => {
      const result = importResumeFromJson('{ invalid json')
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toMatch(/Geçersiz JSON/)
      }
    })

    it('boş string için ok:false döner', () => {
      const result = importResumeFromJson('')
      expect(result.ok).toBe(false)
    })

    it('eksik alan (templateId yok) için validation hatası verir', () => {
      const resume = makeMinimalResume() as Partial<Resume>
      delete resume.templateId
      const result = importResumeFromJson(JSON.stringify(resume))

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toMatch(/templateId/)
      }
    })

    it('eksik alan (theme yok) için validation hatası verir', () => {
      const resume = makeMinimalResume() as Partial<Resume>
      delete resume.theme
      const result = importResumeFromJson(JSON.stringify(resume))

      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toMatch(/theme/)
      }
    })

    it('geçersiz templateId değeri için validation hatası verir', () => {
      const resume = { ...makeMinimalResume(), templateId: 'vintage' }
      const result = importResumeFromJson(JSON.stringify(resume))

      expect(result.ok).toBe(false)
    })

    it('geçersiz theme.fontFamily değeri için validation hatası verir', () => {
      const resume = makeMinimalResume()
      const mutated = {
        ...resume,
        theme: { ...resume.theme, fontFamily: 'comic' },
      }
      const result = importResumeFromJson(JSON.stringify(mutated))

      expect(result.ok).toBe(false)
    })

    it('geçersiz theme.spacing değeri için validation hatası verir', () => {
      const resume = makeMinimalResume()
      const mutated = {
        ...resume,
        theme: { ...resume.theme, spacing: 'huge' },
      }
      const result = importResumeFromJson(JSON.stringify(mutated))

      expect(result.ok).toBe(false)
    })

    it('work item da id eksikse hata verir', () => {
      const resume = makeMinimalResume()
      const mutated = {
        ...resume,
        work: [
          {
            company: 'X',
            position: 'Y',
            startDate: '',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      }
      const result = importResumeFromJson(JSON.stringify(mutated))

      expect(result.ok).toBe(false)
    })

    it('JSON array geçirilirse validation hatası verir', () => {
      const result = importResumeFromJson('[]')
      expect(result.ok).toBe(false)
    })

    it('null değer için validation hatası verir', () => {
      const result = importResumeFromJson('null')
      expect(result.ok).toBe(false)
    })
  })
})
