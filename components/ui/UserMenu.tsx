'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Heart, ShieldCheck } from 'lucide-react';

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/signin" className="btn-outline text-sm">Sign In</Link>
        <Link href="/auth/signup" className="btn-primary text-sm">Sign Up</Link>
      </div>
    );
  }

  const user = session.user;
  const isAdmin = (user as { role?: string }).role === 'ADMIN';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {user?.image ? (
          <Image src={user.image} alt={user.name ?? ''} width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user?.name ?? user?.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <div className="font-semibold text-sm text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>

          {[
            { href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
            { href: '/dashboard/saved', icon: <Heart className="w-4 h-4" />, label: 'Saved Colleges' },
            ...(isAdmin ? [{ href: '/admin', icon: <ShieldCheck className="w-4 h-4" />, label: 'Admin Panel' }] : []),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-1">
            <button
              onClick={() => { signOut({ callbackUrl: '/' }); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
