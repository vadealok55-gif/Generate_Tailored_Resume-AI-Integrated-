'use client';

import React, { useState } from 'react';
import { ResumeSection } from '@/lib/schema/resume';
import { useEditorStore } from '@/store/editorStore';
import QuickPromptTab from './QuickPromptTab';
import StructuredInputTab from './StructuredInputTab';
import BeforeAfterDiff from './BeforeAfterDiff';

export default function SectionAIPanel({ section }: { section: ResumeSection }) {
  const [tab, setTab] = useState<'quick' | 'structured'>('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPreview, setGeneratedPreview] = useState<any | null>(null);

  const discardAIPreview = useEditorStore((state) => state.discardAIPreview);
  const updateSection = useEditorStore((state) => state.updateSection);

  // Reactive reads — not using getState() to avoid stale closure
  const projectId = useEditorStore((state) => state.resume?.projectId);

  const handleGenerate = async (userInput: any) => {
    // Guard: must have a projectId before fetching
    if (!projectId) {
      setError('No active project found. Please reload the editor.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: section.id,
          sectionType: section.type,
          inputMode: tab === 'quick' ? 'quick_prompt' : 'structured',
          userInput,
          currentContent: section.content,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (data.generatedContent !== undefined) {
        setGeneratedPreview(data.generatedContent);
      } else {
        throw new Error('No content was returned from the server.');
      }
    } catch (err: any) {
      console.error('Section generation failed:', err);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = () => {
    if (generatedPreview !== null) {
      updateSection(section.id, generatedPreview);
      setGeneratedPreview(null);
      // Close the panel after accepting
      discardAIPreview();
    }
  };

  const handleDiscard = () => {
    setGeneratedPreview(null);
    setError(null);
  };

  const handleCancel = () => {
    setGeneratedPreview(null);
    setError(null);
    discardAIPreview();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 font-sans shadow-xl shadow-blue-500/5 mt-4">
      {generatedPreview !== null ? (
        <BeforeAfterDiff
          sectionTitle={section.title}
          original={section.content}
          generated={generatedPreview}
          onAccept={handleAccept}
          onDiscard={handleDiscard}
        />
      ) : (
        <div>
          {/* Header row: tabs + close button */}
          <div className="flex items-center justify-between border-b border-slate-800 mb-6">
            <div className="flex">
              <button
                onClick={() => setTab('quick')}
                className={`pb-2 text-xs font-semibold mr-6 tracking-wide uppercase transition-colors ${
                  tab === 'quick' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Quick Prompt
              </button>
              <button
                onClick={() => setTab('structured')}
                className={`pb-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                  tab === 'structured' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Structured Input
              </button>
            </div>
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="text-slate-600 hover:text-slate-300 text-xs pb-2 transition-colors"
              title="Close AI panel"
            >
              ✕
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-4 bg-red-950/30 border border-red-900/40 text-red-400 text-xs px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Tab content / loading */}
          {isGenerating ? (
            <div className="text-center py-8">
              <div className="flex justify-center space-x-1 mb-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-xs text-blue-400 font-semibold tracking-wide">
                Analyzing keywords &amp; crafting section...
              </p>
            </div>
          ) : tab === 'quick' ? (
            <QuickPromptTab onSubmit={handleGenerate} />
          ) : (
            <StructuredInputTab sectionType={section.type} onSubmit={handleGenerate} />
          )}
        </div>
      )}
    </div>
  );
}
