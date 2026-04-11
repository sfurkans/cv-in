import { basicsSchema, profileSchema } from './basicsSchema'

const validBasics = {
  name: 'Furkan Yılmaz',
  label: 'Frontend Developer',
  email: 'furkan@example.com',
  phone: '+90 555 123 45 67',
  summary: 'Full-stack developer.',
  photo: '',
  profiles: [],
}

describe('basicsSchema', () => {
  describe('name', () => {
    it('geçerli isimle parse eder', () => {
      const result = basicsSchema.safeParse(validBasics)
      expect(result.success).toBe(true)
    })

    it('boş isim için hata verir', () => {
      const result = basicsSchema.safeParse({ ...validBasics, name: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('zorunlu')
      }
    })

    it('80 karakterden uzun isim için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        name: 'a'.repeat(81),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('email', () => {
    it('geçerli e-posta format ını kabul eder', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        email: 'test@domain.com',
      })
      expect(result.success).toBe(true)
    })

    it('boş e-posta ya izin verir (optional gibi)', () => {
      const result = basicsSchema.safeParse({ ...validBasics, email: '' })
      expect(result.success).toBe(true)
    })

    it('geçersiz e-posta için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        email: 'not-an-email',
      })
      expect(result.success).toBe(false)
    })

    it('eksik @ için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        email: 'furkan.example.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('phone', () => {
    it('rakam, boşluk, tire ve + içeren numarayı kabul eder', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        phone: '+90 (555) 123-4567',
      })
      expect(result.success).toBe(true)
    })

    it('boş telefona izin verir', () => {
      const result = basicsSchema.safeParse({ ...validBasics, phone: '' })
      expect(result.success).toBe(true)
    })

    it('harf içeren telefon için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        phone: '+90 555 ABCD',
      })
      expect(result.success).toBe(false)
    })

    it('25 karakterden uzun telefon için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        phone: '1'.repeat(26),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('summary', () => {
    it('boş özete izin verir', () => {
      const result = basicsSchema.safeParse({ ...validBasics, summary: '' })
      expect(result.success).toBe(true)
    })

    it('500 karakterden uzun özete hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        summary: 'a'.repeat(501),
      })
      expect(result.success).toBe(false)
    })

    it('tam 500 karakter özete izin verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        summary: 'a'.repeat(500),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('label', () => {
    it('boş ünvana izin verir', () => {
      const result = basicsSchema.safeParse({ ...validBasics, label: '' })
      expect(result.success).toBe(true)
    })

    it('100 karakterden uzun ünvana hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        label: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('profiles array', () => {
    it('boş profiles array ine izin verir', () => {
      const result = basicsSchema.safeParse({ ...validBasics, profiles: [] })
      expect(result.success).toBe(true)
    })

    it('geçerli profile objesi kabul eder', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        profiles: [
          {
            network: 'LinkedIn',
            url: 'https://linkedin.com/in/furkan',
            username: 'furkan',
          },
        ],
      })
      expect(result.success).toBe(true)
    })

    it('geçersiz url için hata verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        profiles: [
          { network: 'LinkedIn', url: 'not-a-url', username: 'f' },
        ],
      })
      expect(result.success).toBe(false)
    })

    it('boş url a izin verir', () => {
      const result = basicsSchema.safeParse({
        ...validBasics,
        profiles: [{ network: 'LinkedIn', url: '', username: 'f' }],
      })
      expect(result.success).toBe(true)
    })
  })
})

describe('profileSchema', () => {
  it('geçerli profile için başarılı parse', () => {
    const result = profileSchema.safeParse({
      network: 'GitHub',
      url: 'https://github.com/furkan',
      username: 'furkan',
    })
    expect(result.success).toBe(true)
  })

  it('boş network için hata verir', () => {
    const result = profileSchema.safeParse({
      network: '',
      url: 'https://github.com/furkan',
      username: 'furkan',
    })
    expect(result.success).toBe(false)
  })
})
