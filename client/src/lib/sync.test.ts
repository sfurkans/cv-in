import { beforeEach, describe, expect, it, vi } from 'vitest'

import { initialResume, useResumeStore } from '@/store/resumeStore'
import type { Resume } from '@/types/resume'

import * as resumesApi from './api/resumes'
import { hasMeaningfulContent, resetSyncStateForTests, saveResume } from './sync'

vi.mock('./api/resumes', () => ({
  createResume: vi.fn(),
  updateResume: vi.fn(),
}))

describe('hasMeaningfulContent', () => {
  it('initialResume için false döner', () => {
    expect(hasMeaningfulContent(initialResume)).toBe(false)
  })

  it('basics.name doluysa true döner', () => {
    const r: Resume = {
      ...initialResume,
      basics: { ...initialResume.basics, name: 'Furkan' },
    }
    expect(hasMeaningfulContent(r)).toBe(true)
  })

  it('basics.email doluysa true döner', () => {
    const r: Resume = {
      ...initialResume,
      basics: { ...initialResume.basics, email: 'a@b.com' },
    }
    expect(hasMeaningfulContent(r)).toBe(true)
  })

  it('work listesi doluysa true döner', () => {
    const r: Resume = {
      ...initialResume,
      work: [
        {
          id: '1',
          company: 'X',
          position: '',
          startDate: '',
          endDate: '',
          summary: '',
          highlights: [],
        },
      ],
    }
    expect(hasMeaningfulContent(r)).toBe(true)
  })

  it('customSections doluysa true döner', () => {
    const r: Resume = {
      ...initialResume,
      customSections: [{ id: '1', title: 'Extra', fields: [] }],
    }
    expect(hasMeaningfulContent(r)).toBe(true)
  })

  it('sadece whitespace içeren name false döner', () => {
    const r: Resume = {
      ...initialResume,
      basics: { ...initialResume.basics, name: '   ' },
    }
    expect(hasMeaningfulContent(r)).toBe(false)
  })
})

describe('saveResume', () => {
  const mockCreate = vi.mocked(resumesApi.createResume)
  const mockUpdate = vi.mocked(resumesApi.updateResume)

  beforeEach(() => {
    vi.clearAllMocks()
    resetSyncStateForTests()
    useResumeStore.setState({
      resume: {
        ...initialResume,
        basics: { ...initialResume.basics, name: 'Test' },
      },
      remoteId: null,
      syncStatus: 'idle',
      lastSyncedAt: null,
      lastSyncError: null,
    })
  })

  it('remoteId yokken createResume çağırır ve markSynced yapar', async () => {
    mockCreate.mockResolvedValue({
      remoteId: 'new-id',
      resume: useResumeStore.getState().resume,
      photoUrl: null,
      updatedAt: '2026-04-15T10:00:00Z',
    })

    await saveResume()

    expect(mockCreate).toHaveBeenCalledOnce()
    expect(mockUpdate).not.toHaveBeenCalled()
    const state = useResumeStore.getState()
    expect(state.remoteId).toBe('new-id')
    expect(state.syncStatus).toBe('saved')
    expect(state.lastSyncedAt).toBe('2026-04-15T10:00:00Z')
    expect(state.lastSyncError).toBeNull()
  })

  it('remoteId varken updateResume çağırır', async () => {
    useResumeStore.setState({ remoteId: 'existing-id' })
    mockUpdate.mockResolvedValue({
      remoteId: 'existing-id',
      resume: useResumeStore.getState().resume,
      photoUrl: null,
      updatedAt: '2026-04-15T10:05:00Z',
    })

    await saveResume()

    expect(mockUpdate).toHaveBeenCalledWith('existing-id', expect.any(Object))
    expect(mockCreate).not.toHaveBeenCalled()
    const state = useResumeStore.getState()
    expect(state.syncStatus).toBe('saved')
    expect(state.lastSyncedAt).toBe('2026-04-15T10:05:00Z')
  })

  it('hata durumunda syncStatus error olur ve mesaj saklanır', async () => {
    mockCreate.mockRejectedValue(new Error('Network timeout'))

    await saveResume()

    const state = useResumeStore.getState()
    expect(state.syncStatus).toBe('error')
    expect(state.lastSyncError).toBe('Network timeout')
  })

  it('save sırasında çağrılan ikinci saveResume bekletilir (queue)', async () => {
    let resolveFirst: (value: Awaited<ReturnType<typeof resumesApi.createResume>>) => void = () => {}
    mockCreate.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        })
    )

    const firstSave = saveResume()
    // In-flight iken ikinci çağrı
    const secondSave = saveResume()
    expect(mockCreate).toHaveBeenCalledOnce()

    // Birinci bitir, ikincisi pending queue'dan devam etmeli
    mockCreate.mockResolvedValue({
      remoteId: 'second-id',
      resume: useResumeStore.getState().resume,
      photoUrl: null,
      updatedAt: '2026-04-15T10:10:00Z',
    })
    resolveFirst({
      remoteId: 'first-id',
      resume: useResumeStore.getState().resume,
      photoUrl: null,
      updatedAt: '2026-04-15T10:09:00Z',
    })

    await firstSave
    await secondSave
    // createResume remoteId set ettiği için, ikinci aslında update olmalı
    // Ama mock her iki senaryoda da "first done, sonra ikinci trigger" yapıyor.
    // İlk geldi → remoteId=first-id, ikinci updateResume'ı çağıracak.
    expect(mockUpdate).toHaveBeenCalledOnce()
  })
})
