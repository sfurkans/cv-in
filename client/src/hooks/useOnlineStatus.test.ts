import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import { useOnlineStatus } from './useOnlineStatus'

describe('useOnlineStatus', () => {
  const originalOnLine = Object.getOwnPropertyDescriptor(navigator, 'onLine')

  function setOnline(value: boolean) {
    Object.defineProperty(navigator, 'onLine', {
      value,
      writable: true,
      configurable: true,
    })
  }

  beforeEach(() => {
    setOnline(true)
  })

  afterEach(() => {
    if (originalOnLine) {
      Object.defineProperty(navigator, 'onLine', originalOnLine)
    } else {
      setOnline(true)
    }
  })

  it('online iken true döner', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })

  it('offline iken false döner', () => {
    setOnline(false)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)
  })

  it('offline event gelince false olarak guncellenir', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    act(() => {
      setOnline(false)
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)
  })

  it('online event gelince true olarak guncellenir', () => {
    setOnline(false)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)

    act(() => {
      setOnline(true)
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })
})
