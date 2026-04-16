import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { toast, useToastStore } from './toast'

describe('toast store', () => {
  beforeEach(() => {
    useToastStore.getState().clearAll()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('show ile yeni toast eklenir', () => {
    const id = useToastStore.getState().show('info', 'Merhaba')
    expect(id).toBeTruthy()
    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe('info')
    expect(toasts[0].message).toBe('Merhaba')
  })

  it('dismiss ile toast kaldırılır', () => {
    const id = useToastStore.getState().show('success', 'Tamam')
    useToastStore.getState().dismiss(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('varsayılan süre sonunda otomatik kapanır', () => {
    useToastStore.getState().show('info', 'Geçici')
    expect(useToastStore.getState().toasts).toHaveLength(1)
    vi.advanceTimersByTime(5000)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('durationMs=0 verildiğinde otomatik kapanmaz', () => {
    useToastStore.getState().show('error', 'Kalıcı', 0)
    vi.advanceTimersByTime(10000)
    expect(useToastStore.getState().toasts).toHaveLength(1)
  })

  it('helper fonksiyonları (info/success/error) çalışır', () => {
    toast.info('a')
    toast.success('b')
    toast.error('c')
    const types = useToastStore.getState().toasts.map((t) => t.type)
    expect(types).toEqual(['info', 'success', 'error'])
  })

  it('clearAll tüm toast\'ları kaldırır', () => {
    toast.info('1')
    toast.info('2')
    toast.info('3')
    useToastStore.getState().clearAll()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
