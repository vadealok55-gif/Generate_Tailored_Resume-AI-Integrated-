export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  atsScoreRating: 'High' | 'Medium' | 'Low';
  fonts: string[];
  layout: string;
}

export const PDF_TEMPLATES: TemplateInfo[] = [
  {
    id: 'minimal',
    name: 'Minimalist ATS',
    description: 'Clean single-column layout using standard serif typography. Perfect for standard applications and highest ATS compatibility.',
    atsScoreRating: 'High',
    fonts: ['Georgia', 'Times New Roman'],
    layout: 'Single Column',
  },
  {
    id: 'modern',
    name: 'Modern Accent',
    description: 'Beautiful two-column sidebar layout. High readability, color accents, and prominent skill metrics. Great for creative or tech roles.',
    atsScoreRating: 'Medium',
    fonts: ['Arial', 'Helvetica'],
    layout: 'Two Column',
  },
  {
    id: 'classic',
    name: 'Classic Chronological',
    description: 'Traditional resume styling with centralized header formatting and clear timeline separation. Recommended for academic or corporate paths.',
    atsScoreRating: 'High',
    fonts: ['Times New Roman', 'Arial'],
    layout: 'Single Column',
  },
];
