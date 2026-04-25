import type { Resume } from '@/types/resume'

import type { EuropassDoc } from './schema'

export function toEuropass(resume: Resume): EuropassDoc {
  const motherTongues = resume.languages
    .filter((l) => l.proficiency === 'native')
    .map((l) => l.name)
    .filter(Boolean)

  const foreignLanguages = resume.languages
    .filter((l) => l.proficiency !== 'native')
    .map((l) => ({
      name: l.name,
      overall: l.proficiency,
      cefr: l.cefr,
    }))

  return {
    version: '1.0',
    kind: 'europass-cv',
    generatedAt: new Date().toISOString(),
    learner: {
      identification: {
        fullName: resume.basics.name,
        headline: resume.basics.label,
        email: resume.basics.email,
        telephone: resume.basics.phone,
        photo: resume.basics.photo,
        summary: resume.basics.summary,
        profiles: resume.basics.profiles,
      },
      workExperience: resume.work.map((w) => ({
        position: w.position,
        employer: w.company,
        startDate: w.startDate,
        endDate: w.endDate,
        summary: w.summary,
        highlights: w.highlights,
      })),
      education: resume.education.map((e) => ({
        institution: e.institution,
        qualification: e.degree,
        field: e.field,
        startDate: e.startDate,
        endDate: e.endDate,
      })),
      skills: {
        jobRelated: resume.skills.map((s) => ({
          name: s.name,
          level: s.level,
          keywords: s.keywords,
        })),
        motherTongues,
        foreignLanguages,
      },
      achievements: {
        certificates: resume.certificates.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          url: c.url,
        })),
        projects: resume.projects.map((p) => ({
          name: p.name,
          description: p.description,
          url: p.url,
          startDate: p.startDate,
          endDate: p.endDate,
        })),
        publications: resume.publications.map((p) => ({
          name: p.name,
          publisher: p.publisher,
          date: p.date,
          url: p.url,
        })),
        volunteer: resume.volunteer.map((v) => ({
          role: v.role,
          organization: v.organization,
          summary: v.summary,
          startDate: v.startDate,
          endDate: v.endDate,
        })),
        custom: resume.customSections.map((c) => ({
          title: c.title,
          fields: c.fields.map((f) => ({ label: f.label, value: f.value })),
        })),
      },
      preferences: {
        sectionOrder: resume.sectionOrder,
        templateId: resume.templateId,
        theme: resume.theme,
      },
    },
  }
}

export function downloadEuropassJson(resume: Resume): void {
  const doc = toEuropass(resume)
  const json = JSON.stringify(doc, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().split('T')[0]
  const namePart =
    resume.basics.name
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cv'
  a.href = url
  a.download = `europass-${namePart}-${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
