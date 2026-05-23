'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Edit2, Trash2, ExternalLink, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface College {
  id: string; name: string; slug: string; city: string; state: string;
  type: string; rating: number; reviewCount: number; feesMin: number; feesMax: number; established: number;
}

interface Props {
  colleges: College[];
  total: number;
  page: number;
  pages: number;
  states: string[];
  currentQ: string;
  currentState: string;
}

const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

export function AdminCollegeTable({ colleges: initial, total, page, pages, states, currentQ, currentState }: Props) {
  const router = useRouter();
  const [colleges, setColleges] = useState(initial);
  const [, startTransition] = useTransition();

  const search = (q: string, state: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (state) params.set('state', state);
    startTransition(() => router.push(`/admin/colleges?${params}`));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also remove all reviews and saved records.`)) return;
    const res = await fetch(`/api/admin/colleges/${id}`, { method: 'DELETE' });
    if (res.ok) setColleges((prev) => prev.filter((c) => c.id !== id));
    else alert('Failed to delete college.');
  };

  const typeColor: Record<string, string> = {
    Government: 'bg-green-100 text-green-700',
    Private: 'bg-purple-100 text-purple-700',
    Deemed: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            defaultValue={currentQ}
            placeholder="Search college name…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            onChange={(e) => search(e.target.value, currentState)}
          />
        </div>
        <select
          defaultValue={currentState}
          onChange={(e) => search(currentQ, e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 outline-none"
        >
          <option value="">All States</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">College</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Fees</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Rating</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {colleges.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.city}, {c.state} · Est. {c.established}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                    {fmt(c.feesMin)} – {fmt(c.feesMax)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="font-medium text-gray-800">{c.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs ml-1">({c.reviewCount})</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/colleges/${c.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100" title="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/admin/colleges/${c.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-secondary hover:bg-blue-50" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {pages} · {total} total</span>
            <div className="flex gap-1">
              <Link
                href={`/admin/colleges?page=${page - 1}`}
                className={`p-1.5 rounded-lg border ${page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <Link
                href={`/admin/colleges?page=${page + 1}`}
                className={`p-1.5 rounded-lg border ${page >= pages ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
