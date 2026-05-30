'use client';

import React from 'react';
import { useEditorStore } from '../../../store/editorStore';
import ResumeHeader from './ResumeHeader';
import SectionList from './SectionList';

export default function ResumePanel() {
  const activeResume = useEditorStore((state) => state.resume);

  if (!activeResume) return null;

  return (
    <div className="bg-white text-slate-900 shadow-2xl rounded-sm p-12 min-h-[11in] w-[8.5in] border border-slate-200 select-text flex flex-col font-serif relative mx-auto">
      <div>
        <ResumeHeader meta={activeResume.meta} />
        <SectionList sections={activeResume.sections} />
      </div>
    </div>
  );
}
