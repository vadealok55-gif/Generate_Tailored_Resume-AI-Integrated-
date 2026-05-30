'use client';

import React from 'react';
import Link from 'next/link';
import { useEditorStore } from '../../store/editorStore';

export default function Toolbar({ projectId }: { projectId: string }) {
  const isDirty = useEditorStore((state) => state.isDirty);
  const activeResume = useEditorStore((state) => state.resume);

  // Zundo temporal actions
  const { undo, redo } = useEditorStore.temporal.getState();

  return (
    <header className="border-b border-slate-900 bg-slate-950 py-4 px-6 flex justify-between items-center z-10">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
          ← Dashboard
        </Link>
        <div className="h-4 w-px bg-slate-900" />
        <div>
          <span className="text-white font-semibold text-sm">
            {activeResume?.meta?.fullName || 'Tailored Resume'}
          </span>
          <span className="text-slate-500 text-xs ml-3">
            {isDirty ? 'Saving changes...' : 'All changes saved'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Undo/Redo Controls */}
        <div className="flex items-center bg-slate-900/60 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => undo()}
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Undo
          </button>
          <div className="w-px h-3 bg-slate-800" />
          <button
            onClick={() => redo()}
            className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Redo
          </button>
        </div>

        <Link
          href={`/project/${projectId}/history`}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold py-1.5 px-4 rounded-lg text-xs transition-colors"
        >
          History
        </Link>

        <Link
          href={`/project/${projectId}/export`}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 px-4 rounded-lg text-xs transition-colors shadow-lg shadow-blue-500/10"
        >
          Export PDF
        </Link>
      </div>
    </header>
  );
}
