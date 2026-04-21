import { useAuthModalStore } from '@/store/authModalStore'

import { AuthModal } from './AuthModal'

export function GlobalAuthModal() {
  const { open, defaultTab, onSuccessCallback, closeModal } = useAuthModalStore()

  return (
    <AuthModal
      open={open}
      defaultTab={defaultTab}
      onClose={closeModal}
      onSuccess={() => {
        onSuccessCallback?.()
      }}
    />
  )
}
