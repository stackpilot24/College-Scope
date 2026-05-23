'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string; rating: number; comment: string; course: string;
  reviewerRole: string; createdAt: string;
  user: { id: string; name: string | null; email: string | null };
  college: { id: string; name: string; slug: string };
}

export function AdminReviewTable({ reviews: initial, total, page, pages }: {
  reviews: Review[]; total: number; page: number; pages: number;
}) {
  const [reviews, setReviews] = useState(initial);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
    else alert('Failed to delete review.');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">College</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Reviewer</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Rating</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Comment</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <Link href={`/colleges/${r.college.slug}`} target="_blank" className="font-medium text-gray-900 hover:text-brand-secondary">
                    {r.college.name}
                  </Link>
                  <div className="text-xs text-gray-400">{r.course}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="text-gray-800">{r.user.name ?? '—'}</div>
                  <div className="text-xs text-gray-400">{r.user.email}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{r.rating}</span>
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-gray-600 text-xs line-clamp-2">{r.comment}</p>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Page {page} of {pages} · {total} total</span>
          <div className="flex gap-1">
            <Link href={`/admin/reviews?page=${page - 1}`} className={`p-1.5 rounded-lg border ${page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}>
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link href={`/admin/reviews?page=${page + 1}`} className={`p-1.5 rounded-lg border ${page >= pages ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
