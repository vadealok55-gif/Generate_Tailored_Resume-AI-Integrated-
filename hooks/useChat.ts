import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export function useChat(projectId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<ChatMessage[]>({
    queryKey: ['chat', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/chat`);
      if (!res.ok) throw new Error('Failed to fetch chat history');
      return res.json();
    },
    enabled: !!projectId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', projectId] });
    },
  });

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    sendMessage: sendMessageMutation,
  };
}
