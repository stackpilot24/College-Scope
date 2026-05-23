'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string; name: string | null; email: string | null; role: string;
  createdAt: string; _count: { reviews: number; savedColleges: number };
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  STUDENT: 'bg-blue-100 text-blue-700',
  PARENT: 'bg-green-100 text-green-700',
};

export function AdminUserTable({ users: initial, total, page, pages, currentQ }: {
  users: User[]; total: number; page: number; pages: number; currentQ: string;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);

  const updateRole = async (id: string, role: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    else alert('Failed to update role.');
  };

  const handleDelete = async (id: string, name: string | null) => {
    if (!confirm(`Delete user "${name ?? 'this user'}"? Their reviews and saved colleges will also be removed.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== id));
    else alert('Failed to delete user.');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          defaultValue={currentQ}
          placeholder="Search by name or email…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          onChange={(e) => {
            const params = new URLSearchParams();
            if (e.target.value) params.set('q', e.target.value);
            router.push(`/admin/users?${params}`);
          }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">User</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Activity</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{u.name ?? '—'}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleColors[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">
                  {u._count.reviews} reviews · {u._count.savedColleges} saved
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => updateRole(u.id, 'ADMIN')}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                        title="Promote to Admin"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {u.role === 'ADMIN' && (
                      <button
                        onClick={() => updateRole(u.id, 'STUDENT')}
                        className="p-1.5 rounded-lg text-amber-600 hover:text-gray-400 hover:bg-gray-50"
                        title="Remove Admin"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Page {page} of {pages} · {total} total</span>
            <div className="flex gap-1">
              <Link href={`/admin/users?page=${page - 1}`} className={`p-1.5 rounded-lg border ${page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <Link href={`/admin/users?page=${page + 1}`} className={`p-1.5 rounded-lg border ${page >= pages ? 'opacity-30 pointer-events-none' : 'hover:bg-gray-50'}`}>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
