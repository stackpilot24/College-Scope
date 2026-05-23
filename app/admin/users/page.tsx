import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { AdminUserTable } from '@/components/admin/AdminUserTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
  await requireAdmin();

  const page = parseInt(searchParams.page ?? '1');
  const q = searchParams.q ?? '';
  const limit = 25;

  const where = q
    ? { OR: [{ name: { contains: q, mode: 'insensitive' as const } }, { email: { contains: q, mode: 'insensitive' as const } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, email: true, role: true, image: true, createdAt: true,
        _count: { select: { reviews: true, savedColleges: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const mapped = users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} registered users</p>
      </div>
      <AdminUserTable users={mapped} total={total} page={page} pages={Math.ceil(total / limit)} currentQ={q} />
    </div>
  );
}
