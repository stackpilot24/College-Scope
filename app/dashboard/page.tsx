import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardClient } from './DashboardClient';

export const metadata = { title: 'Dashboard — CollegeScope' };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/signin');

  const userId = (session.user as typeof session.user & { id: string }).id;

  const [savedColleges, recentReviews, topColleges] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId },
      include: { college: { include: { placement: true, courses: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.review.findMany({
      where: { userId },
      include: { college: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.college.findMany({
      orderBy: { rating: 'desc' },
      take: 3,
      include: { placement: true, courses: true },
    }),
  ]);

  return (
    <DashboardClient
      user={session.user}
      savedColleges={savedColleges.map((s) => s.college)}
      recentReviews={recentReviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
      topColleges={topColleges}
    />
  );
}
