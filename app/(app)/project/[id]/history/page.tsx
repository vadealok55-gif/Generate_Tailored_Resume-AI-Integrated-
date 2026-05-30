'use client';

import React from 'react';
import { use } from 'react';
import Link from 'next/link';

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-8 max-w-4xl w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Version History</h1>
          <p className="text-slate-400 text-sm">Browse and roll back to previous saves.</p>
        </div>
        <Link href={`/project/${id}`} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium py-2.5 px-5 rounded-lg text-sm transition-colors">
          Back to Editor
        </Link>
      </div>

      <div className="border border-slate-900 bg-slate-950/40 rounded-xl p-8 text-center text-slate-400">
        <p className="text-sm">No saved revisions yet. Edits made in the editor automatically create snapshots here.</p>
      </div>
    </div>
  );
}
