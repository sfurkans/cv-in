import axios, { AxiosError } from 'axios'

import { getToken } from './authToken'

const DEFAULT_BASE_URL = 'http://localhost:4000/api'

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_BASE_URL

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// 401 response → oturum düşmüş. authStore subscribe olup logout tetikler.
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      // /auth/login ve /auth/register kendi 401'lerini doğrudan yönetir,
      // sadece korumalı endpoint'lerde global logout tetikle
      const url = err.config?.url ?? ''
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
        }
      }
    }
    return Promise.reject(err)
  }
)

export interface ApiErrorShape {
  status: number
  message: string
  cause?: unknown
}

export function normalizeError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>
    const status = axiosError.response?.status ?? 0
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      'Ağ hatası'
    return { status, message, cause: error }
  }
  if (error instanceof Error) {
    return { status: 0, message: error.message, cause: error }
  }
  return { status: 0, message: 'Bilinmeyen hata', cause: error }
}
