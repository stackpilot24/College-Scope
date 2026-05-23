import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get('collegeId');
  if (!collegeId) return NextResponse.json([], { status: 200 });

  const reviews = await prisma.review.findMany({
    where: { collegeId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to post a review.' }, { status: 401 });
  }

  try {
    const { collegeId, rating, comment, year, course, reviewerRole } = await req.json();

    if (!collegeId || !rating || !comment || !year || !course) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const userId = (session.user as typeof session.user & { id: string }).id;

    const review = await prisma.review.upsert({
      where: { userId_collegeId: { userId, collegeId } },
      update: { rating, comment, year, course, reviewerRole: reviewerRole ?? 'STUDENT' },
      create: { userId, collegeId, rating, comment, year, course, reviewerRole: reviewerRole ?? 'STUDENT' },
      include: { user: { select: { name: true, image: true } } },
    });

    // Recalculate college rating
    const agg = await prisma.review.aggregate({
      where: { collegeId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.college.update({
      where: { id: collegeId },
      data: {
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.id,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
