import { useMutation, useQuery } from '@tanstack/react-query'
import { apiFetch, getAccessToken } from '../client'
import type {
  ChatMessage,
  ConversationDetailResponse,
  RecentConversationResponse,
  StartConversationRequest,
} from '../types'

export function useStartConversation() {
  return useMutation<ConversationDetailResponse, Error, StartConversationRequest>({
    mutationFn: (body) =>
      apiFetch<ConversationDetailResponse>('/conversations/', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  })
}

export function useSendMessage(conversationId: string | null) {
  return useMutation<ChatMessage, Error, string>({
    mutationFn: (content) => {
      if (!conversationId) {
        throw new Error('No conversation id')
      }
      return apiFetch<ChatMessage>(
        `/conversations/${conversationId}/messages`,
        { method: 'POST', body: JSON.stringify({ content }) },
      )
    },
  })
}

export function useResumeRecent(enabled = true) {
  return useQuery<RecentConversationResponse>({
    queryKey: ['conversations', 'recent'],
    queryFn: () =>
      apiFetch<RecentConversationResponse>('/conversations/recent'),
    enabled: enabled && getAccessToken() !== null,
    staleTime: 0,
  })
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery<ChatMessage[]>({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: () =>
      apiFetch<ChatMessage[]>(`/conversations/${conversationId}/messages`),
    enabled: !!conversationId && getAccessToken() !== null,
    staleTime: 1000 * 60 * 5,
  })
}
