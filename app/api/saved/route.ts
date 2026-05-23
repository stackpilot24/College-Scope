import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 200 });

  const userId = (session.user as typeof session.user & { id: string }).id;

  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: { college: { include: { placement: true, courses: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(saved.map((s) => s.college));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as typeof session.user & { id: string }).id;
  const { collegeId } = await req.json();

  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });

  if (existing) {
    await prisma.savedCollege.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedCollege.create({ data: { userId, collegeId } });
  return NextResponse.json({ saved: true });
}
