'use client';

import React from 'react';
import { SkillGroup } from '../../../../lib/schema/resume';
import { useEditorStore } from '../../../../store/editorStore';

export default function SkillsSection({ sectionId, content }: { sectionId: string; content: SkillGroup[] }) {
  const updateSection = useEditorStore((state) => state.updateSection);

  const handleUpdateCategory = (index: number, category: string) => {
    const nextContent = [...content];
    nextContent[index] = { ...nextContent[index], category };
    updateSection(sectionId, nextContent);
  };

  const handleUpdateSkills = (index: number, skillsText: string) => {
    const nextContent = [...content];
    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    nextContent[index] = { ...nextContent[index], skills };
    updateSection(sectionId, nextContent);
  };

  return (
    <div className="space-y-2 text-slate-800 text-[11px] font-sans">
      {content.map((group, groupIdx) => (
        <div key={group.id} className="flex items-start">
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleUpdateCategory(groupIdx, e.target.textContent || '')}
            className="outline-none font-bold text-slate-800 mr-2 min-w-[80px] focus:bg-blue-50/30 rounded px-0.5"
          >
            {group.category}
          </span>
          <span className="text-slate-400 mr-2">:</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleUpdateSkills(groupIdx, e.target.textContent || '')}
            className="outline-none flex-grow text-slate-700 font-serif focus:bg-blue-50/30 rounded px-0.5"
          >
            {group.skills.join(', ')}
          </span>
        </div>
      ))}
    </div>
  );
}
