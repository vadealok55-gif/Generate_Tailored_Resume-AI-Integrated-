'use client';

import React from 'react';
import { EducationItem } from '../../../../lib/schema/resume';
import { useEditorStore } from '../../../../store/editorStore';

export default function EducationSection({ sectionId, content }: { sectionId: string; content: EducationItem[] }) {
  const updateSection = useEditorStore((state) => state.updateSection);

  const handleUpdateItem = (index: number, updatedItem: Partial<EducationItem>) => {
    const nextContent = [...content];
    nextContent[index] = { ...nextContent[index], ...updatedItem };
    updateSection(sectionId, nextContent);
  };

  return (
    <div className="space-y-4">
      {content.map((item, itemIdx) => (
        <div key={item.id} className="group/edu">
          <div className="flex justify-between items-start text-xs font-sans text-slate-800">
            <div>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { degree: e.target.textContent || '' })}
                className="outline-none font-bold focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.degree}
              </span>
              <span className="mx-1 text-slate-400">|</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { institution: e.target.textContent || '' })}
                className="outline-none italic font-medium focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.institution}
              </span>
            </div>
            <div className="text-slate-500 font-medium">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { endDate: e.target.textContent || '' })}
                className="outline-none focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.endDate}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
