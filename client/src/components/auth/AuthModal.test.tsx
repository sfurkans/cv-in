import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as authApi from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

import { AuthModal } from './AuthModal'

vi.mock('@/lib/api/auth', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  getMe: vi.fn(),
}))

const sampleUser = {
  id: 'user-1',
  email: 'a@example.com',
  createdAt: '2026-04-21T10:00:00Z',
}

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
  })

  it('open=false ise render olmaz', () => {
    const onClose = vi.fn()
    render(<AuthModal open={false} onClose={onClose} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('login tab varsayılan olarak gösterilir', () => {
    const onClose = vi.fn()
    render(<AuthModal open onClose={onClose} />)
    expect(screen.getByRole('heading', { name: 'Giriş Yap' })).toBeInTheDocument()
  })

  it('register tab defaultTab=register ile açılır', () => {
    const onClose = vi.fn()
    render(<AuthModal open defaultTab="register" onClose={onClose} />)
    expect(screen.getByRole('heading', { name: 'Kayıt Ol' })).toBeInTheDocument()
  })

  it('tab değiştirme çalışır', async () => {
    const user = userEvent.setup()
    render(<AuthModal open onClose={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Giriş Yap' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Kayıt Ol' }))
    expect(screen.getByRole('heading', { name: 'Kayıt Ol' })).toBeInTheDocument()
  })

  it('başarılı kayıt → onSuccess + onClose çağrılır', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    const onClose = vi.fn()
    vi.mocked(authApi.registerUser).mockResolvedValue({ user: sampleUser, token: 'tok' })

    render(<AuthModal open defaultTab="register" onClose={onClose} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText('E-posta'), 'a@example.com')
    await user.type(screen.getByLabelText('Şifre'), 'password123')
    await user.type(screen.getByLabelText('Şifre (tekrar)'), 'password123')
    await user.click(screen.getByRole('button', { name: /Hesap Oluştur/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('şifreler eşleşmezse hata gösterir, istek atılmaz', async () => {
    const user = userEvent.setup()
    render(<AuthModal open defaultTab="register" onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('E-posta'), 'a@example.com')
    await user.type(screen.getByLabelText('Şifre'), 'password123')
    await user.type(screen.getByLabelText('Şifre (tekrar)'), 'different99')
    await user.click(screen.getByRole('button', { name: /Hesap Oluştur/i }))

    expect(await screen.findByText('Şifreler eşleşmiyor')).toBeInTheDocument()
    expect(authApi.registerUser).not.toHaveBeenCalled()
  })

  it('login API hata verirse hata mesajı gösterir', async () => {
    const user = userEvent.setup()
    vi.mocked(authApi.loginUser).mockRejectedValue(
      Object.assign(new Error('E-posta veya şifre hatalı'), {
        isAxiosError: true,
        response: { data: { message: 'E-posta veya şifre hatalı' }, status: 401 },
      }),
    )

    render(<AuthModal open onClose={vi.fn()} />)

    await user.type(screen.getByLabelText('E-posta'), 'a@example.com')
    await user.type(screen.getByLabelText('Şifre'), 'wrongpass')
    // Tab button + submit button iki "Giriş Yap" oluşturur → submit'i type ile seç
    const submit = screen
      .getAllByRole('button', { name: 'Giriş Yap' })
      .find((b) => b.getAttribute('type') === 'submit')!
    await user.click(submit)

    expect(await screen.findByText(/E-posta veya şifre hatalı/i)).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('Escape tuşu ile kapanır', () => {
    const onClose = vi.fn()
    render(<AuthModal open onClose={onClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('backdrop click ile kapanır, card click yayılmaz', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<AuthModal open onClose={onClose} />)

    // Card içindeki E-posta input'una tıkla → kapanmamalı
    await user.click(screen.getByLabelText('E-posta'))
    expect(onClose).not.toHaveBeenCalled()

    // Backdrop'a tıkla
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })
})
