import { useEffect } from 'react'

import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/apiClient'
import { toast } from '@/lib/toast'
import { useAuthStore } from '@/store/authStore'

/**
 * App mount'ta çağrılır:
 * - localStorage'daki token'ı /auth/me ile doğrulayıp authStore'u hidrate eder
 * - 401 event'lerini dinleyip oturumu düşürür (logout + toast)
 */
export function useAuthBootstrap(): void {
  useEffect(() => {
    void useAuthStore.getState().restoreSession()

    const onUnauthorized = () => {
      const { isAuthenticated, logout } = useAuthStore.getState()
      if (isAuthenticated) {
        logout()
        toast.error('Oturum süresi doldu, tekrar giriş yapın')
      }
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    }
  }, [])
}
