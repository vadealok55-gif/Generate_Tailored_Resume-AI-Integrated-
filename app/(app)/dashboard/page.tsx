'use client';

import React from 'react';
import Link from 'next/link';
import { useProjects } from '../../../hooks/useProjects';
import ProjectCard from '../../../components/dashboard/ProjectCard';

export default function DashboardPage() {
  const { projects, isLoading } = useProjects();

  return (
    <div className="p-8 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Projects</h1>
          <p className="text-slate-400 text-sm">Manage and tailor your active resume versions.</p>
        </div>
        <Link href="/project/new" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors shadow-lg shadow-blue-500/20">
          Tailor New Resume
        </Link>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-slate-900 bg-slate-950 rounded-xl p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-slate-800 rounded-xl py-16 text-center">
          <h3 className="text-lg font-medium text-slate-300 mb-2">No projects yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Upload an existing resume and paste a job description to tailor your first version!
          </p>
          <Link href="/project/new" className="inline-flex bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium py-2.5 px-5 rounded-lg text-sm transition-colors">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
