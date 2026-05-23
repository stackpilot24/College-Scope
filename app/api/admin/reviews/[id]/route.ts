import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'ADMIN';
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.review.delete({ where: { id: params.id } });

  const agg = await prisma.review.aggregate({
    where: { collegeId: review.collegeId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.college.update({
    where: { id: review.collegeId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count.id,
    },
  });

  return NextResponse.json({ ok: true });
}
