'use client';

import React from 'react';
import { useEditorStore } from '../../../../store/editorStore';

export default function SummarySection({ sectionId, content }: { sectionId: string; content: string }) {
  const updateSection = useEditorStore((state) => state.updateSection);

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    updateSection(sectionId, e.target.textContent || '');
  };

  return (
    <p
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      className="outline-none focus:bg-blue-50/30 rounded px-1 text-slate-700 leading-relaxed font-serif text-[12px]"
    >
      {content}
    </p>
  );
}
