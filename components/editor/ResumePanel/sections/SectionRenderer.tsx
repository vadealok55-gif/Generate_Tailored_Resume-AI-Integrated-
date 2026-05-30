'use client';

import React from 'react';
import { ResumeSection } from '../../../../lib/schema/resume';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';

export default function SectionRenderer({ section }: { section: ResumeSection }) {
  switch (section.type) {
    case 'summary':
      return <SummarySection sectionId={section.id} content={section.content} />;
    case 'experience':
      return <ExperienceSection sectionId={section.id} content={section.content} />;
    case 'skills':
      return <SkillsSection sectionId={section.id} content={section.content} />;
    case 'education':
      return <EducationSection sectionId={section.id} content={section.content} />;
    default:
      return <div className="text-slate-400 text-xs italic">Section content type not supported.</div>;
  }
}
