import { useQuery } from '@tanstack/react-query'
import { apiFetch, getAccessToken } from '../client'
import type { DashboardOverview, Recommendation } from '../types'

const STALE = 1000 * 30

export function useOverview() {
  return useQuery<DashboardOverview>({
    queryKey: ['progress', 'overview'],
    queryFn: () => apiFetch<DashboardOverview>('/progress/overview'),
    enabled: getAccessToken() !== null,
    staleTime: STALE,
  })
}

export function useRecommendation() {
  return useQuery<Recommendation | null>({
    queryKey: ['progress', 'recommend'],
    queryFn: () => apiFetch<Recommendation | null>('/progress/recommend'),
    enabled: getAccessToken() !== null,
    staleTime: STALE,
  })
}
