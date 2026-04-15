import type { Resume, TemplateId, Theme } from '@/types/resume'

import { apiClient } from '../apiClient'

export interface ResumeSummary {
  id: string
  templateId: string
  photoUrl: string | null
  shareSlug: string | null
  createdAt: string
  updatedAt: string
}

interface ApiResumeFull {
  id: string
  ownerUuid?: string
  templateId: string
  theme: Theme | null
  content: ResumeContentPayload
  photoUrl: string | null
  shareSlug: string | null
  createdAt: string
  updatedAt: string
}

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
  const res = await apiClient.get<{ data: ResumeSummary[] }>('/resumes')
  return res.data.data
}

export async function getResume(id: string): Promise<RemoteResume> {
  const res = await apiClient.get<{ data: ApiResumeFull }>(`/resumes/${id}`)
  return fromApi(res.data.data)
}

export async function createResume(resume: Resume): Promise<RemoteResume> {
  const res = await apiClient.post<{ data: ApiResumeFull }>(
    '/resumes',
    toBody(resume)
  )
  return fromApi(res.data.data)
}

export async function updateResume(
  id: string,
  resume: Resume
): Promise<RemoteResume> {
  const res = await apiClient.put<{ data: ApiResumeFull }>(
    `/resumes/${id}`,
    toBody(resume)
  )
  return fromApi(res.data.data)
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
  const res = await apiClient.post<{ data: ApiResumeFull }>(
    `/resumes/${id}/photo`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return fromApi(res.data.data)
}
