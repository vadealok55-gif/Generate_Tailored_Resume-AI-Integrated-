'use client';

import React from 'react';
import { ResumeSection } from '../../../lib/schema/resume';
import { useEditorStore } from '../../../store/editorStore';
import SectionRenderer from './sections/SectionRenderer';
import SectionAIPanel from '../AIPanel/SectionAIPanel';

export default function SectionWrapper({ section }: { section: ResumeSection }) {
  const activeAIPanel = useEditorStore((state) => state.activeAIPanel);
  const openAIPanel = useEditorStore((state) => state.openAIPanel);
  const isAIPanelOpen = activeAIPanel === section.id;

  return (
    <div className="relative group/section border border-transparent hover:border-blue-500/20 hover:bg-slate-50/50 rounded-lg p-4 transition-all duration-300">
      {/* Surgical AI Hover FAB Button */}
      <button
        onClick={() => openAIPanel(section.id, 'quick')}
        className="absolute -right-3 top-3 opacity-0 group-hover/section:opacity-100 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full p-1.5 shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-110 z-10"
        title="Generate with AI"
      >
        <span className="text-[10px]">✦</span>
      </button>

      {/* Title */}
      <h2 className="text-sm font-sans font-bold text-slate-800 uppercase border-b pb-1 border-slate-200 mb-3 tracking-wide flex items-center justify-between">
        <span>{section.title}</span>
      </h2>

      {/* Content Rendering based on Section Type */}
      <div className="text-xs leading-relaxed text-slate-700 font-serif">
        <SectionRenderer section={section} />
      </div>

      {/* Embedded Inline AI Generation Panel */}
      {isAIPanelOpen && (
        <div className="mt-4 border-t pt-4 border-slate-100">
          <SectionAIPanel section={section} />
        </div>
      )}
    </div>
  );
}
