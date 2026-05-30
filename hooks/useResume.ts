import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Resume } from '@/lib/schema/resume';

export interface UploadedFile {
  id: string;
  projectId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  parsedText: string;
  createdAt: string;
}

export function useResume(projectId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<{ resume: Resume | null; uploads: UploadedFile[] }>({
    queryKey: ['resume', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch resume');
      const data = await res.json();
      
      const dbResume = data.resume;
      const parsedResume = dbResume ? {
        ...(typeof dbResume.content === 'string' ? JSON.parse(dbResume.content) : dbResume.content),
        id: dbResume.id,
        projectId: dbResume.projectId,
        version: dbResume.version,
      } : null;

      return {
        resume: parsedResume,
        uploads: data.uploads || [],
      };
    },
    enabled: !!projectId,
  });

  const saveMutation = useMutation({
    mutationFn: async (content: Resume) => {
      // PATCH to the resumes route which updates the active resume
      const res = await fetch(`/api/projects/${projectId}/resumes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('Failed to save resume');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', projectId] });
    },
  });

  return {
    resume: query.data?.resume ?? null,
    uploads: query.data?.uploads ?? [],
    isLoading: query.isLoading,
    error: query.error,
    saveResume: saveMutation,
  };
}
