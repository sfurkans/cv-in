import { z } from 'zod'

import type { AuthUser } from '@/types/auth'

import { apiClient } from '../apiClient'

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

const authResponseSchema = z.object({
  data: z.object({
    user: userSchema,
    token: z.string(),
  }),
})

const meResponseSchema = z.object({
  data: userSchema,
})

export interface AuthResponse {
  user: AuthUser
  token: string
}

export async function registerUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/register', { email, password })
  const parsed = authResponseSchema.parse(res.data)
  return parsed.data
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/login', { email, password })
  const parsed = authResponseSchema.parse(res.data)
  return parsed.data
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiClient.get('/auth/me')
  const parsed = meResponseSchema.parse(res.data)
  return parsed.data
}
