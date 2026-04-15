import { beforeEach, describe, expect, it } from 'vitest'

import { getOwnerUuid, resetOwnerUuidForTests } from './userUuid'

const STORAGE_KEY = 'cv-builder:ownerUuid'
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('userUuid', () => {
  beforeEach(() => {
    resetOwnerUuidForTests()
  })

  it('ilk çağrıda yeni UUID üretir', () => {
    const uuid = getOwnerUuid()
    expect(uuid).toMatch(UUID_REGEX)
  })

  it('aynı session içinde aynı UUID döner (cache)', () => {
    const first = getOwnerUuid()
    const second = getOwnerUuid()
    expect(first).toBe(second)
  })

  it('UUID localStorage\'a yazılır', () => {
    const uuid = getOwnerUuid()
    expect(localStorage.getItem(STORAGE_KEY)).toBe(uuid)
  })

  it('localStorage\'da mevcut UUID varsa onu kullanır (cold start)', () => {
    const stored = '12345678-1234-1234-1234-123456789012'
    localStorage.setItem(STORAGE_KEY, stored)
    resetOwnerUuidForTests()
    const result = getOwnerUuid()
    expect(result).toBe(stored)
  })

  it('localStorage\'daki bozuk değeri reddedip yeni UUID üretir', () => {
    localStorage.setItem(STORAGE_KEY, 'not-a-uuid')
    resetOwnerUuidForTests()
    const result = getOwnerUuid()
    expect(result).toMatch(UUID_REGEX)
    expect(result).not.toBe('not-a-uuid')
  })
})
