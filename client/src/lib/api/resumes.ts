import type { Resume, TemplateId, Theme } from '@/types/resume'

import { apiClient } from '../apiClient'
import {
  resumeFullResponseSchema,
  resumeListResponseSchema,
  type ValidatedResumeFull,
  type ValidatedResumeSummary,
} from './schemas'

export type ResumeSummary = ValidatedResumeSummary

type ApiResumeFull = ValidatedResumeFull

type ResumeContentPayload = Pick<
  Resume,
  | 'basics'
  | 'work'
  | 'education'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certificates'
  | 'volunteer'
  | 'publications'
  | 'customSections'
>

export interface RemoteResume {
  remoteId: string
  resume: Resume
  photoUrl: string | null
  updatedAt: string
}

interface CreateUpdateBody {
  templateId: TemplateId
  theme: Theme
  content: ResumeContentPayload
}

function toBody(resume: Resume): CreateUpdateBody {
  const {
    basics,
    work,
    education,
    skills,
    projects,
    languages,
    certificates,
    volunteer,
    publications,
    customSections,
    templateId,
    theme,
  } = resume
  return {
    templateId,
    theme,
    content: {
      basics,
      work,
      education,
      skills,
      projects,
      languages,
      certificates,
      volunteer,
      publications,
      customSections,
    },
  }
}

function fromApi(api: ApiResumeFull): RemoteResume {
  const resume: Resume = {
    ...api.content,
    templateId: api.templateId as TemplateId,
    theme: api.theme as Theme,
  }
  return {
    remoteId: api.id,
    resume,
    photoUrl: api.photoUrl,
    updatedAt: api.updatedAt,
  }
}

export async function listResumes(): Promise<ResumeSummary[]> {
  const res = await apiClient.get('/resumes')
  const parsed = resumeListResponseSchema.parse(res.data)
  return parsed.data
}

export async function getResume(id: string): Promise<RemoteResume> {
  const res = await apiClient.get(`/resumes/${id}`)
  const parsed = resumeFullResponseSchema.parse(res.data)
  return fromApi(parsed.data)
}

export async function createResume(resume: Resume): Promise<RemoteResume> {
  const res = await apiClient.post('/resumes', toBody(resume))
  const parsed = resumeFullResponseSchema.parse(res.data)
  return fromApi(parsed.data)
}

export async function updateResume(
  id: string,
  resume: Resume
): Promise<RemoteResume> {
  const res = await apiClient.put(`/resumes/${id}`, toBody(resume))
  const parsed = resumeFullResponseSchema.parse(res.data)
  return fromApi(parsed.data)
}

export async function deleteResume(id: string): Promise<void> {
  await apiClient.delete(`/resumes/${id}`)
}

export async function uploadResumePhoto(
  id: string,
  file: File
): Promise<RemoteResume> {
  const formData = new FormData()
  formData.append('photo', file)
  const res = await apiClient.post(`/resumes/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const parsed = resumeFullResponseSchema.parse(res.data)
  return fromApi(parsed.data)
}
