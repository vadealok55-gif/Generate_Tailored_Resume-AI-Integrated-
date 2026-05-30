'use client';

import React from 'react';
import { ResumeSection } from '../../../lib/schema/resume';
import SectionWrapper from './SectionWrapper';

export default function SectionList({ sections }: { sections?: ResumeSection[] }) {
  if (!sections || !Array.isArray(sections)) return null;

  const sortedSections = [...sections]
    .filter((sec) => sec.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedSections.map((section) => (
        <SectionWrapper key={section.id} section={section} />
      ))}
    </div>
  );
}
