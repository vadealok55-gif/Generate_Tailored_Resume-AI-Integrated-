'use client';

import React from 'react';
import { ResumeMeta } from '../../../lib/schema/resume';

export default function ResumeHeader({ meta }: { meta?: ResumeMeta }) {
  if (!meta) return null;

  return (
    <header className="text-center mb-6 border-b pb-4 border-slate-200">
      <h1 className="text-3xl font-bold font-sans tracking-wide text-slate-900 uppercase">
        {meta.fullName}
      </h1>
      {meta.jobTitle && (
        <p className="text-sm font-sans font-semibold text-slate-500 uppercase tracking-widest mt-1">
          {meta.jobTitle}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2 text-xs font-sans text-slate-500 mt-2.5">
        <span>{meta.email}</span>
        <span>•</span>
        <span>{meta.phone}</span>
        <span>•</span>
        <span>{meta.location}</span>
        {meta.website && (
          <>
            <span>•</span>
            <a href={`https://${meta.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {meta.website}
            </a>
          </>
        )}
        {meta.linkedin && (
          <>
            <span>•</span>
            <a href={`https://${meta.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {meta.linkedin}
            </a>
          </>
        )}
        {meta.github && (
          <>
            <span>•</span>
            <a href={`https://${meta.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {meta.github}
            </a>
          </>
        )}
      </div>
    </header>
  );
}
