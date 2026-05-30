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

    const { templateId } = await req.json();

    // In production: compile Handlebars HTML template, invoke Puppeteer to render to PDF,
    // upload the buffer to Supabase storage and return a signed URL.

    const mockPdfUrl = `https://mock-supabase-storage.supabase.co/storage/v1/object/public/pdfs/${id}-tailored-${templateId || 'minimal'}.pdf`;

    return NextResponse.json({
      url: mockPdfUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error exporting PDF' }, { status: 500 });
  }
}
