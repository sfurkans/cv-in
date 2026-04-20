import type { Resume, SectionId } from '@/types/resume'

export type CompletionKey = 'personal' | SectionId

const hasText = (value: string | undefined | null): boolean =>
  typeof value === 'string' && value.trim().length > 0

const average = (values: number[]): number => {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
}

const ratioPercent = (fulfilled: number, total: number): number =>
  total === 0 ? 0 : Math.round((fulfilled / total) * 100)

const checks: Record<CompletionKey, (resume: Resume) => number> = {
  personal: (resume) => {
    const b = resume.basics
    const fields = [b.name, b.label, b.email, b.phone, b.summary].map(hasText)
    return ratioPercent(fields.filter(Boolean).length, fields.length)
  },
  experience: (resume) => {
    if (resume.work.length === 0) return 0
    return average(
      resume.work.map((w) => {
        const fields = [w.company, w.position, w.startDate, w.summary].map(
          hasText,
        )
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  education: (resume) => {
    if (resume.education.length === 0) return 0
    return average(
      resume.education.map((e) => {
        const fields = [e.institution, e.degree, e.startDate].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  skills: (resume) => {
    if (resume.skills.length === 0) return 0
    return average(
      resume.skills.map((s) => {
        const name = hasText(s.name) ? 50 : 0
        const keywords = s.keywords.length > 0 ? 50 : 0
        return name + keywords
      }),
    )
  },
  projects: (resume) => {
    if (resume.projects.length === 0) return 0
    return average(
      resume.projects.map((p) => {
        const fields = [p.name, p.description, p.url].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  languages: (resume) => {
    if (resume.languages.length === 0) return 0
    return average(
      resume.languages.map((l) => {
        const fields = [l.name, l.proficiency].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  certificates: (resume) => {
    if (resume.certificates.length === 0) return 0
    return average(
      resume.certificates.map((c) => {
        const fields = [c.name, c.issuer, c.date].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  volunteer: (resume) => {
    if (resume.volunteer.length === 0) return 0
    return average(
      resume.volunteer.map((v) => {
        const fields = [v.organization, v.role, v.startDate].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  publications: (resume) => {
    if (resume.publications.length === 0) return 0
    return average(
      resume.publications.map((p) => {
        const fields = [p.name, p.publisher, p.date].map(hasText)
        return ratioPercent(fields.filter(Boolean).length, fields.length)
      }),
    )
  },
  custom: (resume) => {
    if (resume.customSections.length === 0) return 0
    return average(
      resume.customSections.map((cs) => {
        if (!hasText(cs.title)) return 0
        if (cs.fields.length === 0) return 50
        return 100
      }),
    )
  },
}

export function getSectionCompletion(
  resume: Resume,
  key: CompletionKey,
): number {
  return checks[key](resume)
}

export function getAllCompletions(
  resume: Resume,
): Record<CompletionKey, number> {
  const keys = Object.keys(checks) as CompletionKey[]
  return keys.reduce(
    (acc, key) => {
      acc[key] = checks[key](resume)
      return acc
    },
    {} as Record<CompletionKey, number>,
  )
}
