import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { AdminReviewTable } from '@/components/admin/AdminReviewTable';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage({ searchParams }: { searchParams: { page?: string } }) {
  await requireAdmin();

  const page = parseInt(searchParams.page ?? '1');
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

  const mapped = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} total reviews</p>
      </div>
      <AdminReviewTable reviews={mapped} total={total} page={page} pages={Math.ceil(total / limit)} />
    </div>
  );
}
