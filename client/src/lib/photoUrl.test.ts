import { describe, expect, it } from 'vitest'

import { resolvePhotoUrl } from './photoUrl'

describe('resolvePhotoUrl', () => {
  it('boş/undefined/null için boş string döner', () => {
    expect(resolvePhotoUrl('')).toBe('')
    expect(resolvePhotoUrl(null)).toBe('')
    expect(resolvePhotoUrl(undefined)).toBe('')
  })

  it('data: (base64) URL\'i olduğu gibi döner', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgo='
    expect(resolvePhotoUrl(dataUrl)).toBe(dataUrl)
  })

  it('http:// URL\'leri olduğu gibi döner', () => {
    const httpUrl = 'http://example.com/pic.jpg'
    expect(resolvePhotoUrl(httpUrl)).toBe(httpUrl)
  })

  it('https:// URL\'leri olduğu gibi döner', () => {
    const httpsUrl = 'https://cdn.example.com/pic.jpg'
    expect(resolvePhotoUrl(httpsUrl)).toBe(httpsUrl)
  })

  it('/uploads/ path\'lerini apiClient baseURL origin\'iyle birleştirir', () => {
    // apiClient default baseURL: http://localhost:4000/api → origin: http://localhost:4000
    const result = resolvePhotoUrl('/uploads/abc123.jpg')
    expect(result).toBe('http://localhost:4000/uploads/abc123.jpg')
  })

  it('tanımsız path formatını olduğu gibi döner', () => {
    expect(resolvePhotoUrl('photo.jpg')).toBe('photo.jpg')
  })
})
