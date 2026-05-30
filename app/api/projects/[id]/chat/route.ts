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

    const messages = await prisma.chatMessage.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching chat' }, { status: 500 });
  }
}

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

    const { content } = await req.json();

    // Save user message in DB
    const userMsg = await prisma.chatMessage.create({
      data: {
        projectId: id,
        role: 'user',
        content,
      },
    });

    // Mock AI response logic — replace with Claude streaming in production
    const mockAssistantResponse = `I've analyzed your request: "${content}". I recommend making surgical updates to the Skills and Experience section to emphasize this role. Let me know if you would like me to rewrite those bullets now.`;

    // Save assistant message in DB
    const assistantMsg = await prisma.chatMessage.create({
      data: {
        projectId: id,
        role: 'assistant',
        content: mockAssistantResponse,
      },
    });

    return NextResponse.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing chat' }, { status: 500 });
  }
}
