import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as typeof session.user & { id: string }).id;
  const review = await prisma.review.findUnique({ where: { id: params.id } });

  if (!review || review.userId !== userId) {
    return NextResponse.json({ error: 'Not found or forbidden.' }, { status: 404 });
  }

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
