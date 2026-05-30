'use client';

import React, { useState } from 'react';

export default function QuickPromptTab({ onSubmit }: { onSubmit: (data: { prompt: string }) => void }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prompt Instruction</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. 'Rewrite my achievements to sound more metric-driven, highlighting leadership and React deployment achievements.'"
          rows={3}
          className="w-full bg-slate-950/40 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={!prompt.trim()}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors"
      >
        ✦ Generate Updates
      </button>
    </form>
  );
}
