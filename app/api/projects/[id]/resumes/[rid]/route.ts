import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; rid: string }> }
) {
  try {
    const { id, rid } = await params;
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

    const { content } = await req.json();

    // Version Management Strategy:
    // Never mutate existing Resume rows. Every save creates a new version row.
    // Keep latest isActive: true. This gives full history with zero complexity.
    const latest = await prisma.resume.findFirst({
      where: { projectId: id, isActive: true },
      orderBy: { version: 'desc' },
    });

    if (latest) {
      await prisma.resume.update({
        where: { id: latest.id },
        data: { isActive: false },
      });
    }

    const nextVersion = (latest?.version ?? 0) + 1;

    const newResumeVersion = await prisma.resume.create({
      data: {
        projectId: id,
        version: nextVersion,
        content: content,
        isActive: true,
      },
    });

    return NextResponse.json(newResumeVersion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error saving resume' }, { status: 500 });
  }
}
