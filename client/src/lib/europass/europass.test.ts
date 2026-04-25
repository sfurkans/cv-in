import type { Resume } from '@/types/resume'

import { fromEuropass, importEuropassJson } from './fromEuropass'
import { toEuropass } from './toEuropass'

function sampleResume(): Resume {
  return {
    basics: {
      name: 'Furkan Yılmaz',
      label: 'Full-stack Developer',
      email: 'furkan@example.com',
      phone: '+90 555 111 22 33',
      summary: 'React ve Node deneyimli geliştirici.',
      photo: '',
      profiles: [
        { network: 'GitHub', url: 'https://github.com/furkan', username: 'furkan' },
      ],
    },
    work: [
      {
        id: 'w1',
        company: 'Acme',
        position: 'Backend',
        startDate: '2022-06',
        endDate: '',
        summary: 'API tasarımı',
        highlights: ['Prisma migration', 'Redis cache'],
      },
    ],
    education: [
      {
        id: 'e1',
        institution: 'İTÜ',
        degree: 'Lisans',
        field: 'Bilgisayar Müh.',
        startDate: '2018-09',
        endDate: '2022-06',
      },
    ],
    skills: [
      { id: 's1', name: 'TypeScript', level: 'advanced', keywords: ['React', 'Vite'] },
    ],
    projects: [
      {
        id: 'p1',
        name: 'CV Builder',
        description: 'Europass uyumlu CV builder',
        url: 'https://example.com',
        startDate: '2026-01',
        endDate: '',
      },
    ],
    languages: [
      { id: 'l1', name: 'Türkçe', proficiency: 'native' },
      {
        id: 'l2',
        name: 'İngilizce',
        proficiency: 'b2',
        cefr: {
          listening: 'c1',
          reading: 'c1',
          spokenInteraction: 'b2',
          spokenProduction: 'b1',
          writing: 'b2',
        },
      },
    ],
    certificates: [
      { id: 'c1', name: 'AWS CP', issuer: 'Amazon', date: '2024-05', url: '' },
    ],
    volunteer: [
      {
        id: 'v1',
        organization: 'Kızılay',
        role: 'Kan bağışı gönüllüsü',
        startDate: '2023-01',
        endDate: '2023-12',
        summary: '',
      },
    ],
    publications: [
      {
        id: 'pub1',
        name: 'Blog yazısı',
        publisher: 'Medium',
        date: '2025-03',
        url: 'https://medium.com/x',
      },
    ],
    customSections: [
      {
        id: 'cs1',
        title: 'Hobiler',
        fields: [{ id: 'f1', label: 'İlgi', value: 'Fotoğrafçılık' }],
      },
    ],
    sectionOrder: [
      'experience',
      'education',
      'skills',
      'languages',
      'projects',
      'certificates',
      'volunteer',
      'publications',
      'custom',
    ],
    templateId: 'europass',
    theme: {
      primaryColor: '#003399',
      textColor: '#1a1a1a',
      fontFamily: 'sans',
      spacing: 'normal',
    },
  }
}

// ID'ler fromEuropass sırasında yeniden üretilir; karşılaştırma için çıkarıyoruz.
function stripIds(r: Resume): unknown {
  return {
    ...r,
    work: r.work.map(({ id: _id, ...rest }) => rest),
    education: r.education.map(({ id: _id, ...rest }) => rest),
    skills: r.skills.map(({ id: _id, ...rest }) => rest),
    projects: r.projects.map(({ id: _id, ...rest }) => rest),
    languages: r.languages.map(({ id: _id, ...rest }) => rest),
    certificates: r.certificates.map(({ id: _id, ...rest }) => rest),
    volunteer: r.volunteer.map(({ id: _id, ...rest }) => rest),
    publications: r.publications.map(({ id: _id, ...rest }) => rest),
    customSections: r.customSections.map(({ id: _id, fields, ...rest }) => ({
      ...rest,
      fields: fields.map(({ id: _fid, ...f }) => f),
    })),
  }
}

describe('europass', () => {
  describe('toEuropass', () => {
    it('CV alanlarını Europass learner yapısına maplar', () => {
      const r = sampleResume()
      const doc = toEuropass(r)
      expect(doc.kind).toBe('europass-cv')
      expect(doc.learner.identification.fullName).toBe('Furkan Yılmaz')
      expect(doc.learner.workExperience).toHaveLength(1)
      expect(doc.learner.skills.motherTongues).toEqual(['Türkçe'])
      expect(doc.learner.skills.foreignLanguages).toHaveLength(1)
      expect(doc.learner.skills.foreignLanguages[0].cefr?.listening).toBe('c1')
    })

    it('preferences bölümünde templateId ve sectionOrder tutar', () => {
      const doc = toEuropass(sampleResume())
      expect(doc.learner.preferences?.templateId).toBe('europass')
      expect(doc.learner.preferences?.sectionOrder).toHaveLength(9)
    })
  })

  describe('fromEuropass → toEuropass round-trip', () => {
    it('tam CV kayıpsız geri döner (ID hariç)', () => {
      const original = sampleResume()
      const json = JSON.stringify(toEuropass(original))
      const result = importEuropassJson(json)
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(stripIds(result.resume)).toEqual(stripIds(original))
    })

    it('ID yeniden üretir (eski ID kullanılmaz)', () => {
      const original = sampleResume()
      const json = JSON.stringify(toEuropass(original))
      const result = importEuropassJson(json)
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.resume.work[0].id).not.toBe('w1')
      expect(result.resume.languages.map((l) => l.id)).not.toContain('l1')
    })
  })

  describe('importEuropassJson', () => {
    it('bozuk JSON reddeder', () => {
      const result = importEuropassJson('{not json')
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error).toMatch(/JSON/i)
    })

    it('yanlış şema reddeder', () => {
      const result = importEuropassJson(JSON.stringify({ hello: 'world' }))
      expect(result.ok).toBe(false)
    })

    it('eksik preferences durumunda varsayılan tema ve sıra kullanır', () => {
      const minimal = {
        version: '1.0',
        kind: 'europass-cv',
        generatedAt: '2026-04-24T00:00:00Z',
        learner: {
          identification: {
            fullName: 'Ali',
            headline: '',
            email: '',
            telephone: '',
            photo: '',
            summary: '',
            profiles: [],
          },
          workExperience: [],
          education: [],
          skills: {
            jobRelated: [],
            motherTongues: [],
            foreignLanguages: [],
          },
          achievements: {
            certificates: [],
            projects: [],
            publications: [],
            volunteer: [],
            custom: [],
          },
        },
      }
      const result = importEuropassJson(JSON.stringify(minimal))
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.resume.basics.name).toBe('Ali')
      expect(result.resume.templateId).toBe('europass')
      expect(result.resume.sectionOrder).toHaveLength(9)
    })

    it('geçersiz templateId güvenli fallback verir', () => {
      const doc = toEuropass(sampleResume())
      doc.learner.preferences!.templateId = 'bogus-template'
      const result = importEuropassJson(JSON.stringify(doc))
      expect(result.ok).toBe(true)
      if (!result.ok) return
      expect(result.resume.templateId).toBe('europass')
    })
  })

  describe('fromEuropass (unit)', () => {
    it('motherTongues native proficiency ile languages başına eklenir', () => {
      const r = sampleResume()
      const doc = toEuropass(r)
      const back = fromEuropass(doc)
      const native = back.languages.find((l) => l.proficiency === 'native')
      expect(native?.name).toBe('Türkçe')
    })
  })
})
