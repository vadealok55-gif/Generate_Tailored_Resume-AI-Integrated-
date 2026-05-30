'use client';

import React from 'react';
import { ExperienceItem } from '../../../../lib/schema/resume';
import { useEditorStore } from '../../../../store/editorStore';

export default function ExperienceSection({ sectionId, content }: { sectionId: string; content: ExperienceItem[] }) {
  const updateSection = useEditorStore((state) => state.updateSection);

  const handleUpdateItem = (index: number, updatedItem: Partial<ExperienceItem>) => {
    const nextContent = [...content];
    nextContent[index] = { ...nextContent[index], ...updatedItem };
    updateSection(sectionId, nextContent);
  };

  const handleBulletBlur = (itemIndex: number, bulletIndex: number, text: string) => {
    const nextContent = [...content];
    const item = { ...nextContent[itemIndex] };
    const bullets = [...item.bullets];
    bullets[bulletIndex] = { ...bullets[bulletIndex], text };
    item.bullets = bullets;
    nextContent[itemIndex] = item;
    updateSection(sectionId, nextContent);
  };

  return (
    <div className="space-y-4">
      {content.map((item, itemIdx) => (
        <div key={item.id} className="group/item">
          <div className="flex justify-between items-start text-xs font-sans text-slate-800">
            <div>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { role: e.target.textContent || '' })}
                className="outline-none font-bold focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.role}
              </span>
              <span className="mx-1 text-slate-400">|</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { company: e.target.textContent || '' })}
                className="outline-none italic font-medium focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.company}
              </span>
            </div>
            <div className="text-slate-500 font-medium">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdateItem(itemIdx, { startDate: e.target.textContent || '' })}
                className="outline-none focus:bg-blue-50/30 rounded px-0.5"
              >
                {item.startDate}
              </span>
              <span className="mx-1">-</span>
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

          <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-700 text-[11px] font-serif">
            {item.bullets.map((bullet, bulletIdx) => (
              <li
                key={bullet.id}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBulletBlur(itemIdx, bulletIdx, e.target.textContent || '')}
                className={`outline-none focus:bg-blue-50/30 rounded px-0.5 leading-relaxed ${bullet.highlighted ? 'bg-blue-50/40 border-l border-blue-500/30 pl-1 font-semibold' : ''}`}
              >
                {bullet.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
