import { useQuery } from '@tanstack/react-query'
import { apiFetch, getAccessToken } from '../client'
import type { AchievementCatalogEntry } from '../types'

export function useAchievementsCatalog() {
  return useQuery<AchievementCatalogEntry[]>({
    queryKey: ['achievements'],
    queryFn: () => apiFetch<AchievementCatalogEntry[]>('/achievements/'),
    enabled: getAccessToken() !== null,
    staleTime: Infinity,
  })
}
