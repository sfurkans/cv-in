const STORAGE_KEY = 'cv-builder:ownerUuid'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function readStoredUuid(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value && UUID_REGEX.test(value)) return value.toLowerCase()
    return null
  } catch {
    return null
  }
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = ((bytes[6] as number) & 0x0f) | 0x40
  bytes[8] = ((bytes[8] as number) & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

let cached: string | null = null

export function getOwnerUuid(): string {
  if (cached) return cached
  const stored = readStoredUuid()
  if (stored) {
    cached = stored
    return stored
  }
  const fresh = generateUuid()
  try {
    localStorage.setItem(STORAGE_KEY, fresh)
  } catch {
    // localStorage may be disabled; still return the UUID for this session
  }
  cached = fresh
  return fresh
}

export function resetOwnerUuidForTests(): void {
  cached = null
}
