import axios, { AxiosError } from 'axios'

import { getOwnerUuid } from './userUuid'

const DEFAULT_BASE_URL = 'http://localhost:4000/api'

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? DEFAULT_BASE_URL

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  config.headers = config.headers ?? {}
  config.headers['X-Owner-Uuid'] = getOwnerUuid()
  return config
})

export interface ApiErrorShape {
  status: number
  message: string
  cause?: unknown
}

export function normalizeError(error: unknown): ApiErrorShape {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: { message?: string } }>
    const status = axiosError.response?.status ?? 0
    const message =
      axiosError.response?.data?.error?.message ??
      axiosError.message ??
      'Ağ hatası'
    return { status, message, cause: error }
  }
  if (error instanceof Error) {
    return { status: 0, message: error.message, cause: error }
  }
  return { status: 0, message: 'Bilinmeyen hata', cause: error }
}
