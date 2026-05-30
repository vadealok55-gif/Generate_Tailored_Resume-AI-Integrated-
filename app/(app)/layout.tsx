'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              ResumeForge
            </span>
          </div>

          <nav className="space-y-1">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-blue-600/10 text-blue-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
              Settings
            </Link>
          </nav>
        </div>

        {/* User profile toggle */}
        <div className="border-t border-slate-900 pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserButton />
            <span className="text-sm font-medium text-slate-300">Account</span>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
