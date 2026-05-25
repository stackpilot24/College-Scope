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

  const serializeCollege = (c: typeof topColleges[0]) => ({
    id: c.id, name: c.name, slug: c.slug, city: c.city, state: c.state,
    type: c.type, rating: c.rating, reviewCount: c.reviewCount,
    feesMin: c.feesMin, feesMax: c.feesMax, image: c.image, logo: c.logo,
    courses: c.courses.map(({ id, name }) => ({ id, name })),
    placement: c.placement ? { averagePackage: c.placement.averagePackage, placementRate: c.placement.placementRate } : null,
  });

  return (
    <DashboardClient
      user={session.user}
      savedColleges={savedColleges.map((s) => serializeCollege(s.college))}
      recentReviews={recentReviews.map((r) => ({
        id: r.id, rating: r.rating, comment: r.comment, year: r.year, course: r.course,
        createdAt: r.createdAt.toISOString(),
        college: { name: r.college.name, slug: r.college.slug, image: r.college.image },
      }))}
      topColleges={topColleges.map(serializeCollege)}
    />
  );
}
