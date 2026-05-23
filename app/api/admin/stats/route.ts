import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalColleges,
    totalUsers,
    totalReviews,
    newUsersThisMonth,
    newReviewsThisMonth,
    totalSaved,
    recentReviews,
    topColleges,
  ] = await Promise.all([
    prisma.college.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.review.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.savedCollege.count(),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, college: { select: { name: true } } },
    }),
    prisma.college.findMany({
      take: 5,
      orderBy: { reviewCount: 'desc' },
      select: { id: true, name: true, rating: true, reviewCount: true, state: true },
    }),
  ]);

  return NextResponse.json({
    totalColleges,
    totalUsers,
    totalReviews,
    newUsersThisMonth,
    newReviewsThisMonth,
    totalSaved,
    recentReviews,
    topColleges,
  });
}
