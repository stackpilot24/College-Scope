import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Building2, Users, MessageSquare, Bookmark, TrendingUp, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await requireAdmin();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalColleges, totalUsers, totalReviews, totalSaved,
    newUsers, newReviews,
    recentReviews, topColleges,
  ] = await Promise.all([
    prisma.college.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.savedCollege.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.review.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.review.findMany({
      take: 6, orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, college: { select: { name: true, slug: true } } },
    }),
    prisma.college.findMany({
      take: 5, orderBy: { reviewCount: 'desc' },
      select: { id: true, name: true, rating: true, reviewCount: true, state: true, slug: true },
    }),
  ]);

  const stats = [
    { label: 'Total Colleges', value: totalColleges, sub: 'in database', icon: Building2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Users', value: totalUsers, sub: `+${newUsers} this month`, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Total Reviews', value: totalReviews, sub: `+${newReviews} this month`, icon: MessageSquare, color: 'text-amber-600 bg-amber-50' },
    { label: 'Saved Colleges', value: totalSaved, sub: 'bookmarks', icon: Bookmark, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">CollegeScope platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-secondary" />
              Recent Reviews
            </h2>
            <Link href="/admin/reviews" className="text-xs text-brand-secondary hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReviews.map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{r.college.name}</div>
                  <div className="text-xs text-gray-500 truncate">by {r.user.name ?? 'Anonymous'}</div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.comment}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{r.rating}</span>
                </div>
              </div>
            ))}
            {recentReviews.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No reviews yet</div>
            )}
          </div>
        </div>

        {/* Top Colleges */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-secondary" />
              Most Reviewed
            </h2>
            <Link href="/admin/colleges" className="text-xs text-brand-secondary hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topColleges.map((c, i) => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.state}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {c.rating.toFixed(1)}
                  </span>
                  <span>{c.reviewCount} reviews</span>
                  <Link href={`/admin/colleges/${c.id}/edit`} className="text-brand-secondary hover:underline">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
