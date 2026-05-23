'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, X, Search } from 'lucide-react';
import { colleges as allColleges } from '@/lib/mockData';
import type { College } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CollegeSelectorProps {
  selected: College | null;
  onSelect: (college: College | null) => void;
  excludeIds?: string[];
  label?: string;
}

export function CollegeSelector({
  selected,
  onSelect,
  excludeIds = [],
  label = 'Select a College',
}: CollegeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = allColleges.filter(
    (c) =>
      !excludeIds.includes(c.id) &&
      (query === '' || c.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm transition-colors text-left',
          selected
            ? 'border-brand-secondary bg-brand-light text-brand-primary'
            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
        )}
      >
        {selected ? (
          <>
            <div className="w-6 h-6 relative shrink-0">
              <Image src={selected.logo} alt={selected.name} fill className="object-contain" sizes="24px" />
            </div>
            <span className="flex-1 truncate font-medium text-gray-900">{selected.name}</span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onSelect(null); }}
              onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), onSelect(null))}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </span>
          </>
        ) : (
          <>
            <span className="flex-1">{label}</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', open ? 'rotate-180' : '')} />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search colleges..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-brand-secondary"
                autoFocus
              />
            </div>
          </div>

          {/* Options */}
          <ul className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No colleges found</li>
            ) : (
              filtered.map((college) => (
                <li key={college.id}>
                  <button
                    type="button"
                    onClick={() => { onSelect(college); setOpen(false); setQuery(''); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-brand-light transition-colors"
                  >
                    <div className="w-6 h-6 relative shrink-0">
                      <Image src={college.logo} alt={college.name} fill className="object-contain" sizes="24px" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-800 truncate">{college.name}</div>
                      <div className="text-xs text-gray-400">
                        {college.location.city} · {college.type}
                      </div>
                    </div>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
