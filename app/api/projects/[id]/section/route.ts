import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { sectionId, sectionType, inputMode, userInput, currentContent } = await req.json();

    let generatedContent = currentContent;

    if (sectionType === 'summary') {
      if (inputMode === 'quick_prompt') {
        generatedContent = `Enhanced professional summary tailored for ${project.jobTitle} position: Solid background incorporating prompt: "${userInput.prompt}" with proven execution standards.`;
      } else {
        generatedContent = `Professional summary detailing ${userInput.yearsOfExperience || '5'} years of experience as a ${userInput.role || project.jobTitle}. Expert in ${userInput.strengths || 'development'} with a strong career goal to ${userInput.careerGoal || 'deliver value'}.`;
      }
    } else if (sectionType === 'experience') {
      generatedContent = [
        {
          id: sectionId || 'exp-item-1',
          role: userInput.role || 'Senior Software Engineer',
          company: userInput.company || 'Innovate Inc',
          location: userInput.location || 'Remote',
          startDate: userInput.startDate || '2022',
          endDate: userInput.endDate || 'Present',
          bullets: [
            {
              id: 'b-1',
              text: `Leveraged modern development cycles to build advanced features using ${userInput.tech || 'React and Node.js'}.`,
              highlighted: true,
            },
            {
              id: 'b-2',
              text: `Delivered high impact achievements: ${userInput.achievements || 'Improved pipeline performance by 25%.'}`,
              highlighted: true,
            },
          ],
        },
      ];
    } else if (sectionType === 'skills') {
      generatedContent = [
        {
          id: 'skills-group-1',
          category: 'Core Technologies',
          skills: (userInput.hardSkills || 'TypeScript, React, Node.js, Next.js')
            .split(',')
            .map((s: string) => s.trim()),
        },
      ];
    }

    const activeResume = await prisma.resume.findFirst({
      where: { projectId: id, isActive: true },
    });

    if (activeResume) {
      await prisma.sectionGeneration.create({
        data: {
          resumeId: activeResume.id,
          sectionId: sectionId || 'dummy-sec-id',
          sectionType,
          inputMode,
          userInput: userInput as any,
          generatedContent: generatedContent as any,
        },
      });
    }

    return NextResponse.json({
      generatedContent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error generating section' }, { status: 500 });
  }
}
