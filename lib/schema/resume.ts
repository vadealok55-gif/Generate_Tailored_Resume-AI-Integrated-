export type SectionType =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface ResumeMeta {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  jobTitle?: string;
}

export interface BulletPoint {
  id: string;
  text: string;
  highlighted: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: BulletPoint[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate: string;
  achievements?: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  techStack: string[];
  bullets: BulletPoint[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  description?: string;
  bullets?: BulletPoint[];
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  visible: boolean;
  content: any; // Dynamic content based on SectionType
}

export interface Resume {
  id: string;
  projectId: string;
  version: number;
  meta: ResumeMeta;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}
