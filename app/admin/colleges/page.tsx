import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AdminCollegeTable } from '@/components/admin/AdminCollegeTable';
import { PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminCollegesPage({
  searchParams,
}: {
  searchParams: { q?: string; state?: string; page?: string };
}) {
  await requireAdmin();

  const q = searchParams.q ?? '';
  const state = searchParams.state ?? '';
  const page = parseInt(searchParams.page ?? '1');
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (state) where.state = state;

  const [colleges, total, states] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, slug: true, city: true, state: true,
        type: true, rating: true, reviewCount: true, feesMin: true, feesMax: true, established: true,
      },
    }),
    prisma.college.count({ where }),
    prisma.college.findMany({ select: { state: true }, distinct: ['state'], orderBy: { state: 'asc' } }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
          <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} colleges in database</p>
        </div>
        <Link href="/admin/colleges/new" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle className="w-4 h-4" />
          Add College
        </Link>
      </div>

      <AdminCollegeTable
        colleges={colleges}
        total={total}
        page={page}
        pages={Math.ceil(total / limit)}
        states={states.map((s) => s.state)}
        currentQ={q}
        currentState={state}
      />
    </div>
  );
}
