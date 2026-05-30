'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '../../hooks/useProjects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border border-slate-900 bg-slate-950/40 hover:border-slate-800 rounded-xl p-6 transition-all duration-300 shadow-lg flex flex-col justify-between h-44 group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
            {project.jobTitle}
          </h3>
        </div>
        {project.companyName && (
          <p className="text-slate-400 text-sm mb-1">{project.companyName}</p>
        )}
        <p className="text-slate-500 text-[11px]">
          Created on {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex space-x-3 mt-4">
        <Link
          href={`/project/${project.id}`}
          className="flex-grow text-center bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-2 rounded-lg text-xs font-semibold transition-all duration-300 border border-blue-500/20 hover:border-transparent"
        >
          Open Editor
        </Link>
        <Link
          href={`/project/${project.id}/export`}
          className="px-3 text-center bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white py-2 rounded-lg text-xs font-semibold transition-colors border border-slate-800"
        >
          Export
        </Link>
      </div>
    </div>
  );
}
