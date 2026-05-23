import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });

  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (adminCount > 0) {
    return NextResponse.json({ error: 'An admin already exists. Contact them to promote you.' }, { status: 403 });
  }

  await prisma.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  return NextResponse.json({ ok: true, message: 'You are now an admin. Please sign out and sign back in.' });
}

export async function GET() {
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  return NextResponse.json({ hasAdmin: adminCount > 0 });
}
