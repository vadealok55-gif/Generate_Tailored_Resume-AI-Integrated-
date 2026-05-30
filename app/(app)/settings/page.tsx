'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl w-full mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
      <p className="text-slate-400 text-sm mb-8">Manage your API integrations and defaults.</p>

      <div className="space-y-6">
        <div className="border border-slate-900 bg-slate-950/40 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">API Configurations</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Anthropic Claude API Key</label>
              <input
                type="password"
                placeholder="sk-ant-••••••••••••••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Provide your custom Anthropic key to activate custom streaming speeds.
              </span>
            </div>
          </div>
        </div>

        <div className="border border-slate-900 bg-slate-950/40 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Account Tier</h3>
          <div className="flex justify-between items-center bg-blue-900/10 border border-blue-950 rounded-lg p-4">
            <div>
              <span className="text-sm font-semibold text-white block">ResumeForge Free Pro</span>
              <span className="text-xs text-slate-400">Unlimited tailored resumes during public beta.</span>
            </div>
            <span className="bg-blue-600 text-white text-[10px] uppercase font-bold py-1 px-2.5 rounded-full tracking-wider">
              Beta Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
