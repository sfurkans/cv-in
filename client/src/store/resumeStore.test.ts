import type { Profile } from '@/types/resume'

import { defaultTheme, initialResume, useResumeStore } from './resumeStore'

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

  // ============================================================================
  // Phase 5: dinamik liste actions
  // ============================================================================

  describe('Phase 5 — Work dinamik CRUD', () => {
    it('addWork yeni id döner ve listeye ekler', () => {
      const id = useResumeStore
        .getState()
        .addWork({ company: 'ABC', position: 'Dev' })

      expect(id).toBeTruthy()
      const work = useResumeStore.getState().resume.work
      expect(work).toHaveLength(1)
      expect(work[0].id).toBe(id)
      expect(work[0].company).toBe('ABC')
    })

    it('addWork defaults olmadan çağrılabilir', () => {
      const id = useResumeStore.getState().addWork()

      const work = useResumeStore.getState().resume.work
      expect(work).toHaveLength(1)
      expect(work[0].id).toBe(id)
      expect(work[0].company).toBe('')
    })

    it('addWork birden fazla item ekleyebilir', () => {
      const id1 = useResumeStore.getState().addWork({ company: 'ABC' })
      const id2 = useResumeStore.getState().addWork({ company: 'XYZ' })

      expect(id1).not.toBe(id2)
      expect(useResumeStore.getState().resume.work).toHaveLength(2)
    })

    it('updateWorkAt belirli item i günceller, diğerlerini etkilemez', () => {
      const id1 = useResumeStore.getState().addWork({ company: 'ABC' })
      const id2 = useResumeStore.getState().addWork({ company: 'XYZ' })

      useResumeStore.getState().updateWorkAt(id1, { position: 'Senior' })

      const work = useResumeStore.getState().resume.work
      expect(work.find((w) => w.id === id1)?.position).toBe('Senior')
      expect(work.find((w) => w.id === id2)?.position).toBe('')
    })

    it('removeWork belirli item i siler', () => {
      const id1 = useResumeStore.getState().addWork({ company: 'ABC' })
      const id2 = useResumeStore.getState().addWork({ company: 'XYZ' })

      useResumeStore.getState().removeWork(id1)

      const work = useResumeStore.getState().resume.work
      expect(work).toHaveLength(1)
      expect(work[0].id).toBe(id2)
    })

    it('reorderWork verilen sıraya göre düzenler', () => {
      const id1 = useResumeStore.getState().addWork({ company: 'A' })
      const id2 = useResumeStore.getState().addWork({ company: 'B' })
      const id3 = useResumeStore.getState().addWork({ company: 'C' })

      useResumeStore.getState().reorderWork([id3, id1, id2])

      const work = useResumeStore.getState().resume.work
      expect(work.map((w) => w.company)).toEqual(['C', 'A', 'B'])
    })

    it('reorderWork bilinmeyen id leri atlar', () => {
      const id1 = useResumeStore.getState().addWork({ company: 'A' })

      useResumeStore.getState().reorderWork([id1, 'unknown-id'])

      expect(useResumeStore.getState().resume.work).toHaveLength(1)
    })
  })

  describe('Phase 5 — Education dinamik CRUD', () => {
    it('add/update/remove/reorder tüm döngü çalışır', () => {
      const id1 = useResumeStore
        .getState()
        .addEducation({ institution: 'İTÜ' })
      const id2 = useResumeStore
        .getState()
        .addEducation({ institution: 'Boğaziçi' })

      useResumeStore.getState().updateEducationAt(id1, { degree: 'Lisans' })
      useResumeStore.getState().reorderEducation([id2, id1])

      const education = useResumeStore.getState().resume.education
      expect(education).toHaveLength(2)
      expect(education[0].id).toBe(id2)
      expect(education[1].degree).toBe('Lisans')

      useResumeStore.getState().removeEducation(id2)
      expect(useResumeStore.getState().resume.education).toHaveLength(1)
    })
  })

  describe('Phase 5 — Skills dinamik CRUD + keyword actions', () => {
    it('addSkill yeni skill ekler, defaults uygulanır', () => {
      const id = useResumeStore.getState().addSkill({ name: 'Frontend' })

      const skill = useResumeStore.getState().resume.skills[0]
      expect(skill.id).toBe(id)
      expect(skill.name).toBe('Frontend')
      expect(skill.keywords).toEqual([])
    })

    it('addKeywordToSkillAt sadece hedef skill e ekler', () => {
      const id1 = useResumeStore.getState().addSkill({ name: 'Frontend' })
      const id2 = useResumeStore.getState().addSkill({ name: 'Backend' })

      useResumeStore.getState().addKeywordToSkillAt(id1, 'React')
      useResumeStore.getState().addKeywordToSkillAt(id2, 'Node.js')

      const skills = useResumeStore.getState().resume.skills
      expect(skills.find((s) => s.id === id1)?.keywords).toEqual(['React'])
      expect(skills.find((s) => s.id === id2)?.keywords).toEqual(['Node.js'])
    })

    it('addKeywordToSkillAt duplicate keyword u engeller', () => {
      const id = useResumeStore.getState().addSkill({ name: 'Frontend' })

      useResumeStore.getState().addKeywordToSkillAt(id, 'React')
      useResumeStore.getState().addKeywordToSkillAt(id, 'React')

      expect(
        useResumeStore.getState().resume.skills[0].keywords
      ).toEqual(['React'])
    })

    it('removeKeywordFromSkillAt belirli indexi siler', () => {
      const id = useResumeStore.getState().addSkill({ name: 'Frontend' })
      useResumeStore.getState().addKeywordToSkillAt(id, 'React')
      useResumeStore.getState().addKeywordToSkillAt(id, 'Vue')
      useResumeStore.getState().addKeywordToSkillAt(id, 'Angular')

      useResumeStore.getState().removeKeywordFromSkillAt(id, 1)

      expect(
        useResumeStore.getState().resume.skills[0].keywords
      ).toEqual(['React', 'Angular'])
    })

    it('removeSkill tüm skill i siler', () => {
      const id1 = useResumeStore.getState().addSkill({ name: 'Frontend' })
      useResumeStore.getState().addSkill({ name: 'Backend' })

      useResumeStore.getState().removeSkill(id1)

      const skills = useResumeStore.getState().resume.skills
      expect(skills).toHaveLength(1)
      expect(skills[0].name).toBe('Backend')
    })
  })

  describe('Phase 5 — Diğer section ler (project / language / certificate / volunteer / publication)', () => {
    it('addProject + removeProject çalışır', () => {
      const id = useResumeStore
        .getState()
        .addProject({ name: 'CV Builder' })
      expect(useResumeStore.getState().resume.projects).toHaveLength(1)
      useResumeStore.getState().removeProject(id)
      expect(useResumeStore.getState().resume.projects).toHaveLength(0)
    })

    it('addLanguage + updateLanguageAt çalışır', () => {
      const id = useResumeStore
        .getState()
        .addLanguage({ name: 'İngilizce' })
      useResumeStore.getState().updateLanguageAt(id, { proficiency: 'c1' })

      const lang = useResumeStore.getState().resume.languages[0]
      expect(lang.name).toBe('İngilizce')
      expect(lang.proficiency).toBe('c1')
    })

    it('addCertificate + reorderCertificates çalışır', () => {
      const id1 = useResumeStore.getState().addCertificate({ name: 'AWS' })
      const id2 = useResumeStore.getState().addCertificate({ name: 'GCP' })
      useResumeStore.getState().reorderCertificates([id2, id1])
      expect(
        useResumeStore.getState().resume.certificates.map((c) => c.name)
      ).toEqual(['GCP', 'AWS'])
    })

    it('addVolunteer çalışır', () => {
      const id = useResumeStore
        .getState()
        .addVolunteer({ organization: 'LÖSEV', role: 'Koordinatör' })
      expect(
        useResumeStore.getState().resume.volunteer[0].id
      ).toBe(id)
    })

    it('addPublication + removePublication çalışır', () => {
      const id = useResumeStore
        .getState()
        .addPublication({ name: 'React 19' })
      expect(useResumeStore.getState().resume.publications).toHaveLength(1)
      useResumeStore.getState().removePublication(id)
      expect(useResumeStore.getState().resume.publications).toHaveLength(0)
    })
  })

  describe('Phase 5 — CustomSection CRUD', () => {
    it('addCustomSection yeni id döner ve listeye ekler', () => {
      const id = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })

      expect(id).toBeTruthy()
      const sections = useResumeStore.getState().resume.customSections
      expect(sections).toHaveLength(1)
      expect(sections[0].title).toBe('Hobiler')
      expect(sections[0].fields).toEqual([])
    })

    it('updateCustomSectionAt title güncelleyebilir', () => {
      const id = useResumeStore.getState().addCustomSection({ title: 'Eski' })
      useResumeStore.getState().updateCustomSectionAt(id, { title: 'Yeni' })

      expect(
        useResumeStore.getState().resume.customSections[0].title
      ).toBe('Yeni')
    })

    it('removeCustomSection belirli bölümü siler', () => {
      const id1 = useResumeStore.getState().addCustomSection({ title: 'A' })
      const id2 = useResumeStore.getState().addCustomSection({ title: 'B' })

      useResumeStore.getState().removeCustomSection(id1)

      const sections = useResumeStore.getState().resume.customSections
      expect(sections).toHaveLength(1)
      expect(sections[0].id).toBe(id2)
    })

    it('reorderCustomSections verilen sıraya göre düzenler', () => {
      const id1 = useResumeStore.getState().addCustomSection({ title: 'A' })
      const id2 = useResumeStore.getState().addCustomSection({ title: 'B' })
      const id3 = useResumeStore.getState().addCustomSection({ title: 'C' })

      useResumeStore.getState().reorderCustomSections([id3, id1, id2])

      const titles = useResumeStore
        .getState()
        .resume.customSections.map((s) => s.title)
      expect(titles).toEqual(['C', 'A', 'B'])
    })
  })

  describe('Phase 5 — CustomField CRUD', () => {
    it('addCustomFieldTo bölüme field ekler', () => {
      const sectionId = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })
      const fieldId = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'Spor', value: 'Koşu' })

      const section = useResumeStore.getState().resume.customSections[0]
      expect(section.fields).toHaveLength(1)
      expect(section.fields[0].id).toBe(fieldId)
      expect(section.fields[0].label).toBe('Spor')
      expect(section.fields[0].value).toBe('Koşu')
    })

    it('addCustomFieldTo sadece hedef bölüme ekler', () => {
      const sid1 = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })
      const sid2 = useResumeStore
        .getState()
        .addCustomSection({ title: 'Ödüller' })

      useResumeStore.getState().addCustomFieldTo(sid1, { label: 'Spor' })
      useResumeStore.getState().addCustomFieldTo(sid2, { label: 'Ödül' })

      const sections = useResumeStore.getState().resume.customSections
      expect(sections.find((s) => s.id === sid1)?.fields[0].label).toBe('Spor')
      expect(sections.find((s) => s.id === sid2)?.fields[0].label).toBe('Ödül')
    })

    it('updateCustomFieldAt belirli field i günceller', () => {
      const sectionId = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })
      const fieldId = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'Spor', value: '' })

      useResumeStore
        .getState()
        .updateCustomFieldAt(sectionId, fieldId, { value: 'Koşu' })

      const field = useResumeStore.getState().resume.customSections[0]
        .fields[0]
      expect(field.value).toBe('Koşu')
      expect(field.label).toBe('Spor')
    })

    it('removeCustomFieldFrom belirli field i siler', () => {
      const sectionId = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })
      const fid1 = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'A' })
      useResumeStore.getState().addCustomFieldTo(sectionId, { label: 'B' })

      useResumeStore.getState().removeCustomFieldFrom(sectionId, fid1)

      const section = useResumeStore.getState().resume.customSections[0]
      expect(section.fields).toHaveLength(1)
      expect(section.fields[0].label).toBe('B')
    })

    it('reorderCustomFieldsIn field leri yeniden sıralar', () => {
      const sectionId = useResumeStore
        .getState()
        .addCustomSection({ title: 'Hobiler' })
      const fid1 = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'A' })
      const fid2 = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'B' })
      const fid3 = useResumeStore
        .getState()
        .addCustomFieldTo(sectionId, { label: 'C' })

      useResumeStore
        .getState()
        .reorderCustomFieldsIn(sectionId, [fid3, fid1, fid2])

      const labels = useResumeStore
        .getState()
        .resume.customSections[0].fields.map((f) => f.label)
      expect(labels).toEqual(['C', 'A', 'B'])
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
      expect(parsed.version).toBe(3)
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

  describe('Phase 6 — Template & Theme', () => {
    it('initialResume varsayılan olarak classic template ve defaultTheme ile gelir', () => {
      const { resume } = useResumeStore.getState()
      expect(resume.templateId).toBe('classic')
      expect(resume.theme).toEqual(defaultTheme)
    })

    it('setTemplateId templateId i değiştirir', () => {
      useResumeStore.getState().setTemplateId('modern')
      expect(useResumeStore.getState().resume.templateId).toBe('modern')

      useResumeStore.getState().setTemplateId('creative')
      expect(useResumeStore.getState().resume.templateId).toBe('creative')
    })

    it('setTemplateId resume nun diğer alanlarını etkilemez', () => {
      useResumeStore.getState().updateBasics({ name: 'Furkan' })
      useResumeStore.getState().setTemplateId('modern')
      expect(useResumeStore.getState().resume.basics.name).toBe('Furkan')
    })

    it('updateTheme tek alanı günceller, diğerleri korunur', () => {
      useResumeStore.getState().updateTheme({ primaryColor: '#ff0000' })
      const theme = useResumeStore.getState().resume.theme
      expect(theme.primaryColor).toBe('#ff0000')
      expect(theme.textColor).toBe(defaultTheme.textColor)
      expect(theme.fontFamily).toBe(defaultTheme.fontFamily)
      expect(theme.spacing).toBe(defaultTheme.spacing)
    })

    it('updateTheme birden fazla alanı aynı anda günceller', () => {
      useResumeStore.getState().updateTheme({
        primaryColor: '#abcdef',
        fontFamily: 'serif',
        spacing: 'compact',
      })
      const theme = useResumeStore.getState().resume.theme
      expect(theme.primaryColor).toBe('#abcdef')
      expect(theme.fontFamily).toBe('serif')
      expect(theme.spacing).toBe('compact')
    })

    it('resetTheme theme i defaultTheme a döndürür', () => {
      useResumeStore.getState().updateTheme({
        primaryColor: '#ff0000',
        fontFamily: 'mono',
      })
      useResumeStore.getState().resetTheme()
      expect(useResumeStore.getState().resume.theme).toEqual(defaultTheme)
    })

    it('resetResume templateId ve theme i de defaultlara döndürür', () => {
      useResumeStore.getState().setTemplateId('creative')
      useResumeStore.getState().updateTheme({ primaryColor: '#ff0000' })
      useResumeStore.getState().resetResume()

      const { resume } = useResumeStore.getState()
      expect(resume.templateId).toBe('classic')
      expect(resume.theme).toEqual(defaultTheme)
    })

    it('persist template ve theme i de localStorage a yazar', () => {
      useResumeStore.getState().setTemplateId('modern')
      useResumeStore.getState().updateTheme({ primaryColor: '#0066cc' })

      const raw = localStorage.getItem('cv-builder:resume')
      const parsed = JSON.parse(raw!) as {
        state: { resume: typeof initialResume }
      }
      expect(parsed.state.resume.templateId).toBe('modern')
      expect(parsed.state.resume.theme.primaryColor).toBe('#0066cc')
    })
  })
})
