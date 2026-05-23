'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, MessageSquare, Users, GraduationCap, ExternalLink, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/admin/users', label: 'Users', icon: Users },
];

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-brand-primary text-white min-h-screen">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold leading-none">CollegeScope</div>
            <div className="text-xs text-white/50 mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/10">
          <Link
            href="/admin/colleges/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            Add College
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View Site
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{user.name ?? 'Admin'}</div>
            <div className="text-xs text-white/50 truncate">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
