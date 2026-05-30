import { Resume, ResumeSection } from './resume';

export function createEmptyResume(projectId: string): Resume {
  const sections: ResumeSection[] = [
    {
      id: 'summary-sec-id',
      type: 'summary',
      title: 'Professional Summary',
      order: 0,
      visible: true,
      content: 'A result-driven professional with experience in...'
    },
    {
      id: 'experience-sec-id',
      type: 'experience',
      title: 'Work Experience',
      order: 1,
      visible: true,
      content: [
        {
          id: 'exp-item-1',
          role: 'Software Engineer',
          company: 'Example Corp',
          location: 'San Francisco, CA',
          startDate: 'Jan 2022',
          endDate: 'Present',
          bullets: [
            {
              id: 'exp-bullet-1',
              text: 'Designed and implemented microservices with Node.js and TypeScript, increasing application stability.',
              highlighted: false
            },
            {
              id: 'exp-bullet-2',
              text: 'Collaborated with cross-functional teams to deploy scalable React components with tailwind integration.',
              highlighted: false
            }
          ]
        }
      ]
    },
    {
      id: 'skills-sec-id',
      type: 'skills',
      title: 'Skills',
      order: 2,
      visible: true,
      content: [
        {
          id: 'skill-group-1',
          category: 'Languages',
          skills: ['TypeScript', 'JavaScript', 'HTML/CSS', 'Python']
        },
        {
          id: 'skill-group-2',
          category: 'Frameworks & Tools',
          skills: ['Next.js', 'React', 'Node.js', 'Prisma', 'Supabase', 'Git']
        }
      ]
    },
    {
      id: 'education-sec-id',
      type: 'education',
      title: 'Education',
      order: 3,
      visible: true,
      content: [
        {
          id: 'edu-item-1',
          degree: 'B.S. in Computer Science',
          institution: 'State University',
          location: 'New York, NY',
          startDate: '2018',
          endDate: '2022',
          achievements: ['Graduated Magna Cum Laude', 'Dean\'s List for 6 Semesters']
        }
      ]
    }
  ];

  return {
    id: 'resume-placeholder-id',
    projectId,
    version: 1,
    meta: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 019-2834',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      website: 'johndoe.dev',
      jobTitle: 'Software Engineer'
    },
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
