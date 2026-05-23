'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, GitCompare } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { cn } from '@/lib/utils';

export function CompareBar() {
  const { selectedColleges, removeCollege, clearAll } = useCompare();

  if (selectedColleges.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-brand-primary text-white shadow-2xl border-t border-white/10',
        'transition-transform duration-300 animate-fade-in'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Label */}
          <div className="text-xs text-white/60 shrink-0 hidden sm:block">
            Compare ({selectedColleges.length}/3):
          </div>

          {/* College chips */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {selectedColleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1.5 text-sm max-w-[200px]"
              >
                <div className="w-5 h-5 relative rounded shrink-0">
                  <Image
                    src={college.logo}
                    alt={college.name}
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
                <span className="truncate text-xs font-medium">{college.name}</span>
                <button
                  onClick={() => removeCollege(college.id)}
                  className="shrink-0 text-white/50 hover:text-white transition-colors ml-0.5"
                  aria-label={`Remove ${college.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-28 h-8 border border-dashed border-white/20 rounded-lg flex items-center justify-center text-xs text-white/30"
              >
                + Add college
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearAll}
              className="text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded"
            >
              Clear All
            </button>
            <Link
              href="/compare"
              className={cn(
                'flex items-center gap-1.5 bg-brand-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors',
                selectedColleges.length < 2 && 'opacity-60 pointer-events-none'
              )}
            >
              <GitCompare className="w-4 h-4" />
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
