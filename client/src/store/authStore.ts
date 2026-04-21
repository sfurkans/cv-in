import { create } from 'zustand'

import { getMe, loginUser, registerUser } from '@/lib/api/auth'
import { clearToken, getToken, setToken } from '@/lib/authToken'
import { useResumeStore } from '@/store/resumeStore'
import type { AuthUser } from '@/types/auth'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isRestoring: boolean

  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  restoreSession: () => Promise<void>
}

function resetResumeSyncState(): void {
  const resumeStore = useResumeStore.getState()
  resumeStore.setRemoteId(null)
  useResumeStore.setState({
    syncStatus: 'idle',
    lastSyncedAt: null,
    lastSyncError: null,
  })
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isRestoring: true,

  register: async (email, password) => {
    const { user, token } = await registerUser(email, password)
    setToken(token)
    set({ user, isAuthenticated: true })
  },

  login: async (email, password) => {
    const { user, token } = await loginUser(email, password)
    setToken(token)
    // Farklı kullanıcıya geçişte eski remoteId stale olur → sıfırla
    resetResumeSyncState()
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    clearToken()
    resetResumeSyncState()
    set({ user: null, isAuthenticated: false })
  },

  restoreSession: async () => {
    const token = getToken()
    if (!token) {
      set({ isRestoring: false })
      return
    }
    try {
      const user = await getMe()
      set({ user, isAuthenticated: true, isRestoring: false })
    } catch {
      clearToken()
      set({ user: null, isAuthenticated: false, isRestoring: false })
    }
  },
}))
