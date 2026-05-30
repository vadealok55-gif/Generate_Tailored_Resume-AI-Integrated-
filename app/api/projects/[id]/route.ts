import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        resumes: {
          where: { isActive: true },
          take: 1,
        },
        uploads: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resume = project.resumes[0] || null;

    return NextResponse.json({
      project: {
        id: project.id,
        jobTitle: project.jobTitle,
        jobDescription: project.jobDescription,
        companyName: project.companyName,
        createdAt: project.createdAt,
      },
      resume,
      uploads: project.uploads || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
