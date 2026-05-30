'use client';

import React, { useEffect } from 'react';
import { use } from 'react';
import { useResume } from '@/hooks/useResume';
import { useEditorStore } from '@/store/editorStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { resume: dbResume, uploads, isLoading } = useResume(id);
  const setResume = useEditorStore((state) => state.setResume);
  const activeResume = useEditorStore((state) => state.resume);

  useEffect(() => {
    if (dbResume) {
      setResume(dbResume);
    }
  }, [dbResume, setResume]);

  useAutoSave(id);

  if (isLoading || !activeResume) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="text-center animate-pulse">
          <p className="text-lg font-medium mb-1">Loading tailored resume...</p>
          <p className="text-xs text-slate-600">Retrieving secure state from database</p>
        </div>
      </div>
    );
  }

  return <EditorLayout projectId={id} uploads={uploads} />;
}
