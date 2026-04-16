import { create } from 'zustand'

export type ToastType = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: ToastItem[]
  show: (type: ToastType, message: string, durationMs?: number) => string
  dismiss: (id: string) => void
  clearAll: () => void
}

const DEFAULT_DURATION_MS = 5000

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (type, message, durationMs = DEFAULT_DURATION_MS) => {
    const id = generateId()
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    if (durationMs > 0) {
      setTimeout(() => {
        get().dismiss(id)
      }, durationMs)
    }
    return id
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}))

export const toast = {
  info: (message: string, durationMs?: number) =>
    useToastStore.getState().show('info', message, durationMs),
  success: (message: string, durationMs?: number) =>
    useToastStore.getState().show('success', message, durationMs),
  error: (message: string, durationMs?: number) =>
    useToastStore.getState().show('error', message, durationMs),
}
