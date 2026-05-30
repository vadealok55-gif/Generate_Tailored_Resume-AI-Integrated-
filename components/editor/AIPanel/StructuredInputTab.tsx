'use client';

import React, { useState } from 'react';

export default function StructuredInputTab({
  sectionType,
  onSubmit,
}: {
  sectionType: string;
  onSubmit: (data: any) => void;
}) {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tech, setTech] = useState('');
  const [achievements, setAchievements] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [strengths, setStrengths] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [hardSkills, setHardSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sectionType === 'summary') {
      onSubmit({ yearsOfExperience, role, strengths, careerGoal });
    } else if (sectionType === 'experience') {
      onSubmit({ role, company, location, startDate, endDate, tech, achievements });
    } else if (sectionType === 'skills') {
      onSubmit({ hardSkills, softSkills });
    } else {
      onSubmit({});
    }
  };

  const inputClass =
    'w-full bg-slate-950/40 border border-slate-800 rounded-lg px-4 py-2 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-xs';
  const labelClass = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Summary ── */}
      {sectionType === 'summary' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Years Experience</label>
              <input
                type="text"
                placeholder="e.g. 5"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Current / Recent Role</label>
              <input
                type="text"
                placeholder="e.g. Frontend Lead"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Top Strengths</label>
            <input
              type="text"
              placeholder="e.g. React, Team Leadership, System Design"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Career Goal</label>
            <input
              type="text"
              placeholder="e.g. Lead scalable product engineering teams"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className={inputClass}
            />
          </div>
        </>
      )}

      {/* ── Experience ── */}
      {sectionType === 'experience' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Role Title</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                placeholder="e.g. Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="text"
                placeholder="e.g. Jan 2022"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input
                type="text"
                placeholder="e.g. Present"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tech &amp; Tools Used</label>
            <input
              type="text"
              placeholder="e.g. React, Node, AWS, Postgres"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Key Accomplishments</label>
            <textarea
              placeholder="e.g. Led team of 4 to deploy checkout pages, reducing load time by 30%..."
              rows={2}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>
        </>
      )}

      {/* ── Skills ── */}
      {sectionType === 'skills' && (
        <>
          <div>
            <label className={labelClass}>Technical / Hard Skills</label>
            <input
              type="text"
              placeholder="e.g. TypeScript, React, Next.js, Postgres"
              value={hardSkills}
              onChange={(e) => setHardSkills(e.target.value)}
              className={inputClass}
            />
            <p className="text-[10px] text-slate-600 mt-1">Separate with commas</p>
          </div>
          <div>
            <label className={labelClass}>Soft Skills (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Leadership, Communication, Mentoring"
              value={softSkills}
              onChange={(e) => setSoftSkills(e.target.value)}
              className={inputClass}
            />
          </div>
        </>
      )}

      {/* Unsupported fallback */}
      {!['summary', 'experience', 'skills'].includes(sectionType) && (
        <p className="text-xs text-slate-500 text-center py-4">
          Structured input is not available for this section type. Use Quick Prompt instead.
        </p>
      )}

      <button
        type="submit"
        disabled={!['summary', 'experience', 'skills'].includes(sectionType)}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors"
      >
        ✦ Generate Custom Rewrite
      </button>
    </form>
  );
}
