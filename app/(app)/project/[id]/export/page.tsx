'use client';

import React, { useState } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { PDF_TEMPLATES, TemplateInfo } from '@/lib/pdf/templates';

export default function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/projects/${id}/export/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplate }),
      });
      const data = await res.json();
      if (data.url) {
        setDownloadUrl(data.url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Export Resume</h1>
          <p className="text-slate-400 text-sm">Select a style template and download a PDF.</p>
        </div>
        <Link href={`/project/${id}`} className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium py-2.5 px-5 rounded-lg text-sm transition-colors">
          Back to Editor
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {PDF_TEMPLATES.map((tmpl: TemplateInfo) => (
          <button
            key={tmpl.id}
            onClick={() => setSelectedTemplate(tmpl.id)}
            className={`border rounded-xl p-6 text-left transition-all ${selectedTemplate === tmpl.id ? 'border-blue-600 bg-blue-900/5' : 'border-slate-900 bg-slate-950/20 hover:border-slate-800'}`}
          >
            <h3 className="font-semibold text-white mb-2">{tmpl.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{tmpl.description}</p>
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
              <span>ATS Friendly: {tmpl.atsScoreRating}</span>
              <span>{tmpl.layout}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        {isExporting ? (
          <div className="text-sm text-blue-400 animate-pulse font-medium">Exporting to high fidelity PDF...</div>
        ) : downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-8 rounded-xl transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5"
          >
            Download Tailored PDF
          </a>
        ) : (
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 px-8 rounded-xl transition-all shadow-xl shadow-blue-500/20 transform hover:-translate-y-0.5"
          >
            Generate PDF
          </button>
        )}
      </div>
    </div>
  );
}
