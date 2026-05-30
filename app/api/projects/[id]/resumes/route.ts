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
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const resumes = await prisma.resume.findMany({
      where: { projectId: id },
      orderBy: { version: 'desc' },
      select: {
        id: true,
        version: true,
        createdAt: true,
        isActive: true,
      },
    });

    return NextResponse.json(resumes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching history' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Extract resumeId from the URL path manually — this route handles /api/projects/[id]/resumes
    // For PATCH on a specific resume, use /api/projects/[id]/resumes/[resumeId]
    // This is the general resumes PATCH for the active resume save
    const user = await getCurrentUser();
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { content } = await req.json();

    const activeResume = await prisma.resume.findFirst({
      where: { projectId: id, isActive: true },
    });

    if (!activeResume) {
      return NextResponse.json({ error: 'No active resume found' }, { status: 404 });
    }

    const updated = await prisma.resume.update({
      where: { id: activeResume.id },
      data: { content: content as any },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error saving resume' }, { status: 500 });
  }
}
