import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses?.[0]?.email_address || '';

      await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
        },
      });
    } else if (type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses?.[0]?.email_address || '';

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
        },
        create: {
          clerkId: id,
          email: primaryEmail,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatar: image_url || null,
        },
      });
    } else if (type === 'user.deleted') {
      const { id } = data;
      // Safeguard: only delete if user exists
      const user = await prisma.user.findUnique({ where: { clerkId: id } });
      if (user) {
        await prisma.user.delete({
          where: { clerkId: id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing Clerk webhook' }, { status: 500 });
  }
}
