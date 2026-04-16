import { apiClient } from './apiClient'

const UPLOADS_PATH_RE = /^\/uploads\//

/**
 * Backend upload response'u `/uploads/xxx.jpg` gibi relative path döndürüyor.
 * Bu helper base64 ve http(s) URL'lerini olduğu gibi bırakır, `/uploads/`
 * yolunu `apiClient.baseURL`'ün origin'iyle birleştirir.
 */
export function resolvePhotoUrl(value: string | null | undefined): string {
  if (!value) return ''
  if (value.startsWith('data:') || /^https?:\/\//i.test(value)) return value
  if (UPLOADS_PATH_RE.test(value)) {
    const base = apiClient.defaults.baseURL ?? ''
    const origin = base.replace(/\/api\/?$/, '')
    return `${origin}${value}`
  }
  return value
}
