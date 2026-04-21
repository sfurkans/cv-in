import { create } from 'zustand'

import type { AuthTab } from '@/components/auth/AuthModal'

interface AuthModalState {
  open: boolean
  defaultTab: AuthTab
  onSuccessCallback: (() => void) | null

  openModal: (tab?: AuthTab, onSuccess?: () => void) => void
  closeModal: () => void
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  defaultTab: 'login',
  onSuccessCallback: null,

  openModal: (tab = 'login', onSuccess) =>
    set({
      open: true,
      defaultTab: tab,
      onSuccessCallback: onSuccess ?? null,
    }),

  closeModal: () =>
    set({ open: false, onSuccessCallback: null }),
}))
