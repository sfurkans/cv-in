import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as authApi from '@/lib/api/auth'
import * as authToken from '@/lib/authToken'
import { useResumeStore } from '@/store/resumeStore'

import { useAuthStore } from './authStore'

vi.mock('@/lib/api/auth', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getMe: vi.fn(),
}))

const sampleUser = {
  id: 'user-1',
  email: 'a@example.com',
  createdAt: '2026-04-21T10:00:00Z',
}

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isRestoring: true,
    })
    useResumeStore.setState({
      remoteId: null,
      syncStatus: 'idle',
      lastSyncedAt: null,
      lastSyncError: null,
    })
  })

  describe('register', () => {
    it('başarılı kayıt token saklar, isAuthenticated true', async () => {
      vi.mocked(authApi.registerUser).mockResolvedValue({
        user: sampleUser,
        token: 'jwt-abc',
      })

      await useAuthStore.getState().register('a@example.com', 'password123')

      expect(authToken.getToken()).toBe('jwt-abc')
      const state = useAuthStore.getState()
      expect(state.user).toEqual(sampleUser)
      expect(state.isAuthenticated).toBe(true)
    })

    it('başarısız kayıt state değiştirmez, exception propagate olur', async () => {
      vi.mocked(authApi.registerUser).mockRejectedValue(new Error('409'))

      await expect(
        useAuthStore.getState().register('a@example.com', 'password123')
      ).rejects.toThrow()

      expect(authToken.getToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('başarılı giriş token saklar, remoteId sıfırlanır', async () => {
      // Önceden bir remoteId varmış gibi ayarla (önceki kullanıcıdan artakalma)
      useResumeStore.setState({ remoteId: 'old-id', lastSyncedAt: 'x' })

      vi.mocked(authApi.loginUser).mockResolvedValue({
        user: sampleUser,
        token: 'jwt-login',
      })

      await useAuthStore.getState().login('a@example.com', 'password123')

      expect(authToken.getToken()).toBe('jwt-login')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useResumeStore.getState().remoteId).toBeNull()
      expect(useResumeStore.getState().lastSyncedAt).toBeNull()
    })
  })

  describe('logout', () => {
    it('token siler, state sıfırlar, remoteId temizler', () => {
      authToken.setToken('some-token')
      useAuthStore.setState({ user: sampleUser, isAuthenticated: true })
      useResumeStore.setState({ remoteId: 'abc', lastSyncedAt: 't' })

      useAuthStore.getState().logout()

      expect(authToken.getToken()).toBeNull()
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(useResumeStore.getState().remoteId).toBeNull()
    })
  })

  describe('restoreSession', () => {
    it('token yoksa isRestoring false yapar, başka değişiklik yok', async () => {
      await useAuthStore.getState().restoreSession()

      const state = useAuthStore.getState()
      expect(state.isRestoring).toBe(false)
      expect(state.isAuthenticated).toBe(false)
      expect(authApi.getMe).not.toHaveBeenCalled()
    })

    it('geçerli token varsa /me çağırır ve kullanıcıyı hidrate eder', async () => {
      authToken.setToken('valid-token')
      vi.mocked(authApi.getMe).mockResolvedValue(sampleUser)

      await useAuthStore.getState().restoreSession()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(sampleUser)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isRestoring).toBe(false)
    })

    it('/me hata verirse token silinir', async () => {
      authToken.setToken('stale-token')
      vi.mocked(authApi.getMe).mockRejectedValue(new Error('401'))

      await useAuthStore.getState().restoreSession()

      expect(authToken.getToken()).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
