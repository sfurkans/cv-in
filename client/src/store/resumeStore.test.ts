import type { Profile } from '@/types/resume'

import { initialResume, useResumeStore } from './resumeStore'

describe('resumeStore', () => {
  beforeEach(() => {
    useResumeStore.getState().resetResume()
    localStorage.clear()
  })

  describe('updateBasics', () => {
    it('tek bir alanı günceller', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })

      expect(useResumeStore.getState().resume.basics.name).toBe('Furkan')
    })

    it('partial update diğer alanları korur', () => {
      useResumeStore.getState().updateBasics({
        name: 'Furkan',
        email: 'furkan@example.com',
      })
      useResumeStore.getState().updateBasics({ phone: '+90 555 111 22 33' })

      const basics = useResumeStore.getState().resume.basics
      expect(basics.name).toBe('Furkan')
      expect(basics.email).toBe('furkan@example.com')
      expect(basics.phone).toBe('+90 555 111 22 33')
    })

    it('diğer üst seviye resume alanlarını (work, education vs.) etkilemez', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })

      const resume = useResumeStore.getState().resume
      expect(resume.work).toEqual([])
      expect(resume.education).toEqual([])
      expect(resume.skills).toEqual([])
      expect(resume.customSections).toEqual([])
    })

    it('summary alanını textarea gibi uzun metinlerle güncelleyebilir', () => {
      const longSummary =
        'Full-stack developer with 5 years of experience in React, Node.js and PostgreSQL.'
      useResumeStore.getState().updateBasics({ summary: longSummary })

      expect(useResumeStore.getState().resume.basics.summary).toBe(longSummary)
    })
  })

  describe('updatePhoto', () => {
    it('photo alanını base64 string olarak ayarlar', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANS'
      useResumeStore.getState().updatePhoto(base64)

      expect(useResumeStore.getState().resume.basics.photo).toBe(base64)
    })

    it('photo güncellenince diğer basics alanları etkilenmez', () => {
      useResumeStore
        .getState()
        .updateBasics({ name: 'Furkan', email: 'f@x.com' })
      useResumeStore.getState().updatePhoto('data:image/png;base64,xyz')

      const basics = useResumeStore.getState().resume.basics
      expect(basics.name).toBe('Furkan')
      expect(basics.email).toBe('f@x.com')
      expect(basics.photo).toBe('data:image/png;base64,xyz')
    })

    it('boş string ile photo kaldırılabilir', () => {
      useResumeStore.getState().updatePhoto('data:image/png;base64,xyz')
      useResumeStore.getState().updatePhoto('')

      expect(useResumeStore.getState().resume.basics.photo).toBe('')
    })
  })

  describe('setProfiles', () => {
    it('profiles array ini tamamen değiştirir', () => {
      const profiles: Profile[] = [
        {
          network: 'LinkedIn',
          url: 'https://linkedin.com/in/furkan',
          username: 'furkan',
        },
        {
          network: 'GitHub',
          url: 'https://github.com/furkan',
          username: 'furkan',
        },
      ]

      useResumeStore.getState().setProfiles(profiles)

      expect(useResumeStore.getState().resume.basics.profiles).toEqual(
        profiles
      )
      expect(useResumeStore.getState().resume.basics.profiles).toHaveLength(2)
    })

    it('boş array geçince tüm profilleri siler', () => {
      useResumeStore.getState().setProfiles([
        { network: 'GitHub', url: 'https://github.com/f', username: 'f' },
      ])
      useResumeStore.getState().setProfiles([])

      expect(useResumeStore.getState().resume.basics.profiles).toEqual([])
    })

    it('profiles değiştirirken diğer basics alanlarını etkilemez', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })
      useResumeStore.getState().setProfiles([
        { network: 'Website', url: 'https://f.dev', username: 'f' },
      ])

      expect(useResumeStore.getState().resume.basics.name).toBe('Furkan')
    })
  })

  describe('loadResume', () => {
    it('tüm resume i verilen objeyle değiştirir', () => {
      useResumeStore.getState().updateBasics({ name: 'Eski İsim' })

      const newResume = {
        ...initialResume,
        basics: {
          ...initialResume.basics,
          name: 'Ada Yıldız',
          label: 'Full-Stack Developer',
        },
        work: [
          {
            id: 'w-1',
            company: 'ABC',
            position: 'Dev',
            startDate: '2023-01',
            endDate: '',
            summary: '',
            highlights: [],
          },
        ],
      }

      useResumeStore.getState().loadResume(newResume)

      const state = useResumeStore.getState().resume
      expect(state.basics.name).toBe('Ada Yıldız')
      expect(state.basics.label).toBe('Full-Stack Developer')
      expect(state.work).toHaveLength(1)
      expect(state.work[0].company).toBe('ABC')
    })
  })

  describe('resetResume', () => {
    it('tüm state i initialResume a döndürür', () => {
      useResumeStore.getState().updateBasics({
        name: 'Furkan',
        email: 'f@x.com',
        summary: 'Developer',
      })
      useResumeStore.getState().updatePhoto('data:image/png;base64,xyz')
      useResumeStore.getState().setProfiles([
        { network: 'GitHub', url: 'https://github.com/f', username: 'f' },
      ])

      useResumeStore.getState().resetResume()

      expect(useResumeStore.getState().resume).toEqual(initialResume)
    })
  })

  describe('updateWorkItem', () => {
    it('ilk çağrıda yeni bir work item oluşturur ve id atar', () => {
      useResumeStore
        .getState()
        .updateWorkItem({ company: 'Acme', position: 'Developer' })

      const work = useResumeStore.getState().resume.work
      expect(work).toHaveLength(1)
      expect(work[0].company).toBe('Acme')
      expect(work[0].position).toBe('Developer')
      expect(work[0].id).toBeTruthy()
    })

    it('sonraki çağrılar mevcut item üzerinde partial update yapar', () => {
      useResumeStore.getState().updateWorkItem({ company: 'Acme' })
      const firstId = useResumeStore.getState().resume.work[0].id

      useResumeStore.getState().updateWorkItem({ position: 'Senior Dev' })

      const work = useResumeStore.getState().resume.work
      expect(work).toHaveLength(1)
      expect(work[0].company).toBe('Acme')
      expect(work[0].position).toBe('Senior Dev')
      expect(work[0].id).toBe(firstId)
    })

    it('highlights array ini güncelleyebilir', () => {
      useResumeStore
        .getState()
        .updateWorkItem({ highlights: ['Başarı 1', 'Başarı 2'] })

      expect(useResumeStore.getState().resume.work[0].highlights).toEqual([
        'Başarı 1',
        'Başarı 2',
      ])
    })
  })

  describe('updateEducationItem', () => {
    it('education item oluşturur ve partial update destekler', () => {
      useResumeStore
        .getState()
        .updateEducationItem({ institution: 'İTÜ', degree: 'Lisans' })
      useResumeStore
        .getState()
        .updateEducationItem({ field: 'Bilgisayar Müh.' })

      const education = useResumeStore.getState().resume.education[0]
      expect(education.institution).toBe('İTÜ')
      expect(education.degree).toBe('Lisans')
      expect(education.field).toBe('Bilgisayar Müh.')
    })
  })

  describe('updateProjectItem', () => {
    it('project item oluşturur', () => {
      useResumeStore
        .getState()
        .updateProjectItem({ name: 'CV Builder', url: 'https://example.com' })

      const project = useResumeStore.getState().resume.projects[0]
      expect(project.name).toBe('CV Builder')
      expect(project.url).toBe('https://example.com')
    })
  })

  describe('updateLanguageItem', () => {
    it('language item oluşturur', () => {
      useResumeStore
        .getState()
        .updateLanguageItem({ name: 'İngilizce', proficiency: 'c1' })

      const language = useResumeStore.getState().resume.languages[0]
      expect(language.name).toBe('İngilizce')
      expect(language.proficiency).toBe('c1')
    })
  })

  describe('updateCertificateItem', () => {
    it('certificate item oluşturur', () => {
      useResumeStore
        .getState()
        .updateCertificateItem({ name: 'AWS SAA', issuer: 'AWS' })

      const cert = useResumeStore.getState().resume.certificates[0]
      expect(cert.name).toBe('AWS SAA')
      expect(cert.issuer).toBe('AWS')
    })
  })

  describe('updateVolunteerItem', () => {
    it('volunteer item oluşturur', () => {
      useResumeStore
        .getState()
        .updateVolunteerItem({ organization: 'LÖSEV', role: 'Koordinatör' })

      const vol = useResumeStore.getState().resume.volunteer[0]
      expect(vol.organization).toBe('LÖSEV')
      expect(vol.role).toBe('Koordinatör')
    })
  })

  describe('updatePublicationItem', () => {
    it('publication item oluşturur', () => {
      useResumeStore
        .getState()
        .updatePublicationItem({ name: 'React 19', publisher: 'Medium' })

      const pub = useResumeStore.getState().resume.publications[0]
      expect(pub.name).toBe('React 19')
      expect(pub.publisher).toBe('Medium')
    })
  })

  describe('addSkillKeyword', () => {
    it('ilk keyword eklendiğinde yeni bir Skill oluşturur', () => {
      useResumeStore.getState().addSkillKeyword('React')

      const skills = useResumeStore.getState().resume.skills
      expect(skills).toHaveLength(1)
      expect(skills[0].keywords).toEqual(['React'])
      expect(skills[0].id).toBeTruthy()
    })

    it('mevcut skill item ına keyword ekler', () => {
      useResumeStore.getState().addSkillKeyword('React')
      useResumeStore.getState().addSkillKeyword('TypeScript')
      useResumeStore.getState().addSkillKeyword('Node.js')

      const skill = useResumeStore.getState().resume.skills[0]
      expect(skill.keywords).toEqual(['React', 'TypeScript', 'Node.js'])
      expect(useResumeStore.getState().resume.skills).toHaveLength(1)
    })

    it('boş veya whitespace keyword eklenmez', () => {
      useResumeStore.getState().addSkillKeyword('')
      useResumeStore.getState().addSkillKeyword('   ')

      expect(useResumeStore.getState().resume.skills).toHaveLength(0)
    })

    it('duplicate keyword eklemez', () => {
      useResumeStore.getState().addSkillKeyword('React')
      useResumeStore.getState().addSkillKeyword('React')

      expect(useResumeStore.getState().resume.skills[0].keywords).toEqual([
        'React',
      ])
    })

    it('keyword u trim ederek ekler', () => {
      useResumeStore.getState().addSkillKeyword('  React  ')

      expect(useResumeStore.getState().resume.skills[0].keywords).toEqual([
        'React',
      ])
    })
  })

  describe('removeSkillKeywordAt', () => {
    it('belirtilen index teki keyword ü kaldırır', () => {
      useResumeStore.getState().addSkillKeyword('React')
      useResumeStore.getState().addSkillKeyword('TypeScript')
      useResumeStore.getState().addSkillKeyword('Node.js')

      useResumeStore.getState().removeSkillKeywordAt(1)

      expect(useResumeStore.getState().resume.skills[0].keywords).toEqual([
        'React',
        'Node.js',
      ])
    })

    it('skills boşsa hata vermez', () => {
      expect(() =>
        useResumeStore.getState().removeSkillKeywordAt(0)
      ).not.toThrow()
    })
  })

  describe('persist middleware', () => {
    it('state i localStorage a cv-builder:resume key i ile yazar', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })

      const raw = localStorage.getItem('cv-builder:resume')
      expect(raw).not.toBeNull()

      const parsed = JSON.parse(raw!) as {
        state: { resume: typeof initialResume }
        version: number
      }
      expect(parsed.state.resume.basics.name).toBe('Furkan')
      expect(parsed.version).toBe(1)
    })

    it('birden fazla güncelleme sonrası son state i yansıtır', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })
      useResumeStore.getState().updateBasics({ email: 'f@x.com' })
      useResumeStore.getState().updatePhoto('data:image/png;base64,xyz')

      const raw = localStorage.getItem('cv-builder:resume')
      const parsed = JSON.parse(raw!) as {
        state: { resume: typeof initialResume }
      }

      expect(parsed.state.resume.basics.name).toBe('Furkan')
      expect(parsed.state.resume.basics.email).toBe('f@x.com')
      expect(parsed.state.resume.basics.photo).toBe(
        'data:image/png;base64,xyz'
      )
    })
  })
})
