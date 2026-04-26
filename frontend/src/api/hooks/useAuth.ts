import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, clearTokens, getAccessToken, setTokens } from '../client'
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from '../types'

const ME_QUERY_KEY = ['me'] as const

export function useCurrentUser() {
  return useQuery<UserResponse>({
    queryKey: ME_QUERY_KEY,
    queryFn: () => apiFetch<UserResponse>('/auth/me'),
    enabled: getAccessToken() !== null,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: (body) =>
      apiFetch<TokenResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (tokens) => {
      setTokens(tokens)
      qc.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation<TokenResponse, Error, RegisterRequest>({
    mutationFn: (body) =>
      apiFetch<TokenResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (tokens) => {
      setTokens(tokens)
      qc.invalidateQueries({ queryKey: ME_QUERY_KEY })
    },
  })
}

export function useLogout(): () => void {
  const qc = useQueryClient()
  return () => {
    clearTokens()
    qc.clear()
  }
}
