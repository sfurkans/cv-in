import type {
  FontFamily,
  Resume,
  SectionId,
  Spacing,
  TemplateId,
} from '@/types/resume'
import { DEFAULT_SECTION_ORDER } from '@/types/resume'

import { europassDocSchema, type EuropassDoc } from './schema'

export interface ParseResult {
  ok: true
  resume: Resume
  skipped: string[]
}

export interface ParseError {
  ok: false
  error: string
}

const VALID_TEMPLATE_IDS: readonly TemplateId[] = [
  'classic',
  'modern',
  'creative',
  'sidebar-left',
  'ats',
  'color-accent',
  'modern-clean',
  'terminal',
  'infographic',
  'europass',
]

const VALID_SECTION_IDS: readonly SectionId[] = [
  'experience',
  'education',
  'skills',
  'projects',
  'languages',
  'certificates',
  'volunteer',
  'publications',
  'custom',
]

const VALID_FONTS: readonly FontFamily[] = ['sans', 'serif', 'mono']
const VALID_SPACINGS: readonly Spacing[] = ['compact', 'normal', 'relaxed']

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`
}

function pickTemplate(id: string | undefined): TemplateId {
  return VALID_TEMPLATE_IDS.find((t) => t === id) ?? 'europass'
}

function pickFont(f: string | undefined): FontFamily {
  return VALID_FONTS.find((v) => v === f) ?? 'sans'
}

function pickSpacing(s: string | undefined): Spacing {
  return VALID_SPACINGS.find((v) => v === s) ?? 'normal'
}

function pickSectionOrder(ids: string[] | undefined): SectionId[] {
  if (!ids || ids.length === 0) return [...DEFAULT_SECTION_ORDER]
  const valid = ids.filter((id): id is SectionId =>
    VALID_SECTION_IDS.includes(id as SectionId),
  )
  // Eksik section'ları varsayılan sırada sona ekle
  const missing = DEFAULT_SECTION_ORDER.filter((id) => !valid.includes(id))
  return [...valid, ...missing]
}

export function fromEuropass(doc: EuropassDoc): Resume {
  const l = doc.learner
  const id = l.identification

  const foreignLangs = l.skills.foreignLanguages.map((lang) => ({
    id: uid(),
    name: lang.name,
    proficiency: lang.overall,
    cefr: lang.cefr,
  }))

  const motherTongueLangs = l.skills.motherTongues
    .filter((name) => name)
    .map((name) => ({
      id: uid(),
      name,
      proficiency: 'native',
    }))

  return {
    basics: {
      name: id.fullName,
      label: id.headline,
      email: id.email,
      phone: id.telephone,
      summary: id.summary,
      photo: id.photo,
      profiles: id.profiles.map((p) => ({
        network: p.network,
        url: p.url,
        username: p.username,
      })),
    },
    work: l.workExperience.map((w) => ({
      id: uid(),
      company: w.employer,
      position: w.position,
      startDate: w.startDate,
      endDate: w.endDate,
      summary: w.summary,
      highlights: w.highlights,
    })),
    education: l.education.map((e) => ({
      id: uid(),
      institution: e.institution,
      degree: e.qualification,
      field: e.field,
      startDate: e.startDate,
      endDate: e.endDate,
    })),
    skills: l.skills.jobRelated.map((s) => ({
      id: uid(),
      name: s.name,
      level: s.level,
      keywords: s.keywords,
    })),
    projects: l.achievements.projects.map((p) => ({
      id: uid(),
      name: p.name,
      description: p.description,
      url: p.url,
      startDate: p.startDate,
      endDate: p.endDate,
    })),
    languages: [...motherTongueLangs, ...foreignLangs],
    certificates: l.achievements.certificates.map((c) => ({
      id: uid(),
      name: c.name,
      issuer: c.issuer,
      date: c.date,
      url: c.url,
    })),
    volunteer: l.achievements.volunteer.map((v) => ({
      id: uid(),
      organization: v.organization,
      role: v.role,
      startDate: v.startDate,
      endDate: v.endDate,
      summary: v.summary,
    })),
    publications: l.achievements.publications.map((p) => ({
      id: uid(),
      name: p.name,
      publisher: p.publisher,
      date: p.date,
      url: p.url,
    })),
    customSections: l.achievements.custom.map((c) => ({
      id: uid(),
      title: c.title,
      fields: c.fields.map((f) => ({
        id: uid(),
        label: f.label,
        value: f.value,
      })),
    })),
    sectionOrder: pickSectionOrder(l.preferences?.sectionOrder),
    templateId: pickTemplate(l.preferences?.templateId),
    theme: {
      primaryColor: l.preferences?.theme?.primaryColor || '#003399',
      textColor: l.preferences?.theme?.textColor || '#1a1a1a',
      fontFamily: pickFont(l.preferences?.theme?.fontFamily),
      spacing: pickSpacing(l.preferences?.theme?.spacing),
    },
  }
}

export function importEuropassJson(
  text: string,
): ParseResult | ParseError {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Geçerli bir JSON değil.' }
  }

  const parsed = europassDocSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const path = first?.path.join('.') || '?'
    return {
      ok: false,
      error: `Europass JSON formatı geçersiz: ${path} — ${first?.message ?? 'bilinmeyen hata'}`,
    }
  }

  return {
    ok: true,
    resume: fromEuropass(parsed.data),
    skipped: [],
  }
}
