import { certificateSchema } from './certificateSchema'
import {
  customFieldSchema,
  customSectionSchema,
} from './customSectionSchema'
import { educationSchema } from './educationSchema'
import { languageSchema } from './languageSchema'
import { projectSchema } from './projectSchema'
import { publicationSchema } from './publicationSchema'
import { skillSchema } from './skillSchema'
import { volunteerSchema } from './volunteerSchema'
import { workSchema } from './workSchema'

describe('workSchema', () => {
  const valid = {
    company: 'ABC Teknoloji',
    position: 'Senior Developer',
    startDate: '2023-01',
    endDate: '',
    summary: '',
  }

  it('geçerli veri ile parse eder', () => {
    expect(workSchema.safeParse(valid).success).toBe(true)
  })

  it('boş şirket adı için hata verir', () => {
    const result = workSchema.safeParse({ ...valid, company: '' })
    expect(result.success).toBe(false)
  })

  it('boş pozisyon için hata verir', () => {
    const result = workSchema.safeParse({ ...valid, position: '' })
    expect(result.success).toBe(false)
  })

  it('hatalı tarih formatı için hata verir', () => {
    const result = workSchema.safeParse({ ...valid, startDate: '2023/01' })
    expect(result.success).toBe(false)
  })

  it('500 karakterden uzun özet için hata verir', () => {
    const result = workSchema.safeParse({
      ...valid,
      summary: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('educationSchema', () => {
  const valid = {
    institution: 'İTÜ',
    degree: 'Lisans',
    field: 'Bilgisayar Mühendisliği',
    startDate: '2015-09',
    endDate: '2019-06',
  }

  it('geçerli veri ile parse eder', () => {
    expect(educationSchema.safeParse(valid).success).toBe(true)
  })

  it('boş okul adı için hata verir', () => {
    const result = educationSchema.safeParse({ ...valid, institution: '' })
    expect(result.success).toBe(false)
  })

  it('boş derece ve alana izin verir', () => {
    const result = educationSchema.safeParse({
      ...valid,
      degree: '',
      field: '',
    })
    expect(result.success).toBe(true)
  })
})

describe('skillSchema', () => {
  const valid = {
    name: 'Teknik',
    level: '',
    keywords: ['React', 'TypeScript'],
  }

  it('geçerli veri ile parse eder', () => {
    expect(skillSchema.safeParse(valid).success).toBe(true)
  })

  it('boş keywords dizisine izin verir', () => {
    const result = skillSchema.safeParse({ ...valid, keywords: [] })
    expect(result.success).toBe(true)
  })

  it('keywords içinde boş string için hata verir', () => {
    const result = skillSchema.safeParse({
      ...valid,
      keywords: ['React', ''],
    })
    expect(result.success).toBe(false)
  })

  it('50 karakterden uzun keyword için hata verir', () => {
    const result = skillSchema.safeParse({
      ...valid,
      keywords: ['a'.repeat(51)],
    })
    expect(result.success).toBe(false)
  })
})

describe('projectSchema', () => {
  const valid = {
    name: 'CV Builder',
    description: 'Modern CV builder',
    url: 'https://github.com/user/cv-builder',
    startDate: '2025-01',
    endDate: '',
  }

  it('geçerli veri ile parse eder', () => {
    expect(projectSchema.safeParse(valid).success).toBe(true)
  })

  it('boş proje adı için hata verir', () => {
    expect(projectSchema.safeParse({ ...valid, name: '' }).success).toBe(
      false
    )
  })

  it('boş URL e izin verir', () => {
    expect(projectSchema.safeParse({ ...valid, url: '' }).success).toBe(true)
  })

  it('geçersiz URL için hata verir', () => {
    expect(
      projectSchema.safeParse({ ...valid, url: 'not-a-url' }).success
    ).toBe(false)
  })
})

describe('languageSchema', () => {
  const valid = { name: 'İngilizce', proficiency: 'c1' }

  it('geçerli veri ile parse eder', () => {
    expect(languageSchema.safeParse(valid).success).toBe(true)
  })

  it('boş dil adı için hata verir', () => {
    expect(languageSchema.safeParse({ ...valid, name: '' }).success).toBe(
      false
    )
  })

  it('boş seviyeye izin verir', () => {
    expect(
      languageSchema.safeParse({ ...valid, proficiency: '' }).success
    ).toBe(true)
  })
})

describe('certificateSchema', () => {
  const valid = {
    name: 'AWS SAA',
    issuer: 'Amazon',
    date: '2024-03',
    url: '',
  }

  it('geçerli veri ile parse eder', () => {
    expect(certificateSchema.safeParse(valid).success).toBe(true)
  })

  it('boş sertifika adı için hata verir', () => {
    expect(certificateSchema.safeParse({ ...valid, name: '' }).success).toBe(
      false
    )
  })

  it('boş veren kurum için hata verir', () => {
    expect(
      certificateSchema.safeParse({ ...valid, issuer: '' }).success
    ).toBe(false)
  })

  it('geçersiz URL için hata verir', () => {
    expect(
      certificateSchema.safeParse({ ...valid, url: 'not-a-url' }).success
    ).toBe(false)
  })
})

describe('volunteerSchema', () => {
  const valid = {
    organization: 'LÖSEV',
    role: 'Koordinatör',
    startDate: '2020-01',
    endDate: '',
    summary: '',
  }

  it('geçerli veri ile parse eder', () => {
    expect(volunteerSchema.safeParse(valid).success).toBe(true)
  })

  it('boş kuruluş için hata verir', () => {
    expect(
      volunteerSchema.safeParse({ ...valid, organization: '' }).success
    ).toBe(false)
  })

  it('boş rol için hata verir', () => {
    expect(volunteerSchema.safeParse({ ...valid, role: '' }).success).toBe(
      false
    )
  })
})

describe('publicationSchema', () => {
  const valid = {
    name: 'React 19 Özellikleri',
    publisher: 'Medium',
    date: '2025-01',
    url: 'https://medium.com/@user/article',
  }

  it('geçerli veri ile parse eder', () => {
    expect(publicationSchema.safeParse(valid).success).toBe(true)
  })

  it('boş yayın adı için hata verir', () => {
    expect(
      publicationSchema.safeParse({ ...valid, name: '' }).success
    ).toBe(false)
  })

  it('boş yayıncı için hata verir', () => {
    expect(
      publicationSchema.safeParse({ ...valid, publisher: '' }).success
    ).toBe(false)
  })

  it('boş URL e izin verir', () => {
    expect(
      publicationSchema.safeParse({ ...valid, url: '' }).success
    ).toBe(true)
  })
})

describe('customFieldSchema', () => {
  const valid = { label: 'Hobi', value: 'Koşu' }

  it('geçerli veri ile parse eder', () => {
    expect(customFieldSchema.safeParse(valid).success).toBe(true)
  })

  it('boş label için hata verir', () => {
    expect(
      customFieldSchema.safeParse({ ...valid, label: '' }).success
    ).toBe(false)
  })

  it('boş value a izin verir', () => {
    expect(
      customFieldSchema.safeParse({ ...valid, value: '' }).success
    ).toBe(true)
  })

  it('500 karakterden uzun value için hata verir', () => {
    expect(
      customFieldSchema.safeParse({ ...valid, value: 'a'.repeat(501) }).success
    ).toBe(false)
  })
})

describe('customSectionSchema', () => {
  const valid = {
    title: 'Hobiler',
    fields: [
      { label: 'Spor', value: 'Koşu' },
      { label: 'Müzik', value: 'Piyano' },
    ],
  }

  it('geçerli bölüm ile parse eder', () => {
    expect(customSectionSchema.safeParse(valid).success).toBe(true)
  })

  it('boş title için hata verir', () => {
    expect(
      customSectionSchema.safeParse({ ...valid, title: '' }).success
    ).toBe(false)
  })

  it('boş fields array ine izin verir', () => {
    expect(
      customSectionSchema.safeParse({ ...valid, fields: [] }).success
    ).toBe(true)
  })

  it('field içinde hatalı label varsa hata verir', () => {
    expect(
      customSectionSchema.safeParse({
        ...valid,
        fields: [{ label: '', value: 'x' }],
      }).success
    ).toBe(false)
  })
})
