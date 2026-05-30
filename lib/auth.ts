import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // Fallback: Fetch user details from Clerk and automatically seed/sync to local DB
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('User details could not be retrieved from Clerk.');
    }

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || 'no-email@clerk.user';
    user = await prisma.user.create({
      data: {
        clerkId,
        email: primaryEmail,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        avatar: clerkUser.imageUrl || null,
      },
    });
  }

  return user;
}

