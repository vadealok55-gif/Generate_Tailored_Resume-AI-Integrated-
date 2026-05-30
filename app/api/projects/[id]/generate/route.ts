import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { tailorResume } from '@/lib/ai/tailoring';

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

    const { rawText, structuredResume, uploadedFile } = await req.json();

    // Call the intelligent parsing and tailoring layer to generate the resume matching actual uploaded content
    const tailoredData = await tailorResume(project.id, structuredResume, rawText, project.jobTitle, project.jobDescription);

    // Save uploaded file to user's secure project space in DB if present
    if (uploadedFile) {
      await prisma.uploadedFile.create({
        data: {
          projectId: project.id,
          fileName: uploadedFile.fileName,
          filePath: uploadedFile.filePath,
          fileType: uploadedFile.fileType,
          parsedText: uploadedFile.parsedText,
        },
      });
    }

    // Deactivate any existing active resume versions first
    await prisma.resume.updateMany({
      where: { projectId: project.id, isActive: true },
      data: { isActive: false },
    });

    // Save version 1 as the active tailored resume
    const newResume = await prisma.resume.create({
      data: {
        projectId: project.id,
        version: 1,
        content: tailoredData as any,
        isActive: true,
      },
    });

    return NextResponse.json(newResume);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error generating tailored resume' }, { status: 500 });
  }
}
