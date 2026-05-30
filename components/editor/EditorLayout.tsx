'use client';

import React from 'react';
import Toolbar from './Toolbar';
import ResumePanel from './ResumePanel/ResumePanel';
import ChatPanel from './ChatPanel/ChatPanel';
import { UploadedFile } from '@/hooks/useResume';

export default function EditorLayout({ projectId, uploads }: { projectId: string; uploads: UploadedFile[] }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      {/* Top Bar Toolbar */}
      <Toolbar projectId={projectId} />

      {/* Main Work Area */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left Side: Live Resume Preview */}
        <div className="w-2/3 overflow-y-auto border-r border-slate-900 bg-slate-950 p-8 flex justify-center">
          <div className="max-w-3xl w-full">
            <ResumePanel />
          </div>
        </div>

        {/* Right Side: AI Assistant Panel */}
        <div className="w-1/3 overflow-y-auto bg-slate-950 flex flex-col">
          <ChatPanel projectId={projectId} uploads={uploads} />
        </div>
      </div>
    </div>
  );
}
