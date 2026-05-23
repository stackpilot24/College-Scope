import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'ADMIN';
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 25;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        college: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.review.count(),
  ]);

  return NextResponse.json({ reviews, total, pages: Math.ceil(total / limit) });
}
