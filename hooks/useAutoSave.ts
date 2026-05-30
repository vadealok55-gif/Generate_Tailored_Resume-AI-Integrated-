import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { useResume } from './useResume';

export function useAutoSave(projectId: string) {
  const resume = useEditorStore((state) => state.resume);
  const isDirty = useEditorStore((state) => state.isDirty);
  const markSaved = useEditorStore((state) => state.markSaved);
  const { saveResume } = useResume(projectId);

  useEffect(() => {
    if (!isDirty || !resume) return;

    const timer = setTimeout(async () => {
      try {
        await saveResume.mutateAsync(resume);
        markSaved();
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [resume, isDirty, saveResume, markSaved]);
}
