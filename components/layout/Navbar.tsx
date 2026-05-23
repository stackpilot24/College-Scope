'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, Menu, X, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompareContext } from '@/context/CompareContext';
import { UserMenu } from '@/components/ui/UserMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/exams', label: 'Exams' },
  { href: '/scholarships', label: 'Scholarships' },
  { href: '/compare', label: 'Compare' },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { selectedColleges } = useCompareContext();

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-primary">
              College<span className="text-brand-secondary">Scope</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-brand-light text-brand-secondary'
                      : 'text-gray-600 hover:text-brand-primary hover:bg-gray-50'
                  )}
                >
                  {link.label === 'Compare' && selectedColleges.length > 0 ? (
                    <span className="flex items-center gap-1.5">
                      <GitCompare className="w-4 h-4" />
                      Compare
                      <span className="ml-1 bg-brand-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedColleges.length}
                      </span>
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth menu */}
          <div className="hidden md:flex items-center gap-3">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-brand-light text-brand-secondary'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}
