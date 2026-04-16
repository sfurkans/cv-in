import { describe, expect, it } from 'vitest'

import { resumeFullResponseSchema, resumeListResponseSchema } from './schemas'

const validContent = {
  basics: {
    name: 'Furkan',
    label: 'Developer',
    email: 'f@example.com',
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
}

const validResumeFull = {
  id: 'abc-123',
  templateId: 'classic',
  theme: {
    primaryColor: '#1f2937',
    textColor: '#111827',
    fontFamily: 'sans' as const,
    spacing: 'normal' as const,
  },
  content: validContent,
  photoUrl: null,
  shareSlug: null,
  createdAt: '2026-04-15T10:00:00Z',
  updatedAt: '2026-04-15T10:00:00Z',
}

describe('resumeFullResponseSchema', () => {
  it('geçerli bir full response parse eder', () => {
    const result = resumeFullResponseSchema.parse({
      data: validResumeFull,
    })
    expect(result.data.id).toBe('abc-123')
    expect(result.data.content.basics.name).toBe('Furkan')
  })

  it('theme null olabilir', () => {
    const result = resumeFullResponseSchema.parse({
      data: { ...validResumeFull, theme: null },
    })
    expect(result.data.theme).toBeNull()
  })

  it('ownerUuid opsiyonel', () => {
    const withOwner = resumeFullResponseSchema.parse({
      data: { ...validResumeFull, ownerUuid: 'uuid-123' },
    })
    expect(withOwner.data.ownerUuid).toBe('uuid-123')

    const withoutOwner = resumeFullResponseSchema.parse({
      data: validResumeFull,
    })
    expect(withoutOwner.data.ownerUuid).toBeUndefined()
  })

  it('eksik content.basics alanında hata verir', () => {
    expect(() =>
      resumeFullResponseSchema.parse({
        data: {
          ...validResumeFull,
          content: { ...validContent, basics: { name: 'X' } },
        },
      })
    ).toThrow()
  })

  it('geçersiz fontFamily reddedilir', () => {
    expect(() =>
      resumeFullResponseSchema.parse({
        data: {
          ...validResumeFull,
          theme: { ...validResumeFull.theme, fontFamily: 'comic-sans' },
        },
      })
    ).toThrow()
  })

  it('geçersiz spacing reddedilir', () => {
    expect(() =>
      resumeFullResponseSchema.parse({
        data: {
          ...validResumeFull,
          theme: { ...validResumeFull.theme, spacing: 'ultra-wide' },
        },
      })
    ).toThrow()
  })

  it('content içinde work item shape kontrol edilir', () => {
    const withWork = resumeFullResponseSchema.parse({
      data: {
        ...validResumeFull,
        content: {
          ...validContent,
          work: [
            {
              id: 'w1',
              company: 'ACME',
              position: 'Dev',
              startDate: '2024-01',
              endDate: '',
              summary: '',
              highlights: ['TypeScript'],
            },
          ],
        },
      },
    })
    expect(withWork.data.content.work).toHaveLength(1)
    expect(withWork.data.content.work[0].company).toBe('ACME')
  })
})

describe('resumeListResponseSchema', () => {
  it('boş liste parse eder', () => {
    const result = resumeListResponseSchema.parse({ data: [] })
    expect(result.data).toEqual([])
  })

  it('birden fazla resume summary parse eder', () => {
    const result = resumeListResponseSchema.parse({
      data: [validResumeFull, { ...validResumeFull, id: 'def-456' }],
    })
    expect(result.data).toHaveLength(2)
    expect(result.data[1].id).toBe('def-456')
  })

  it('data alanı yoksa hata verir', () => {
    expect(() => resumeListResponseSchema.parse({})).toThrow()
  })
})
