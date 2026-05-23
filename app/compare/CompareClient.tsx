'use client';

import Link from 'next/link';
import { GitCompare, PlusCircle } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { CompareTable } from '@/components/compare/CompareTable';
import { CollegeSelector } from '@/components/compare/CollegeSelector';
import type { College } from '@/lib/types';

export function CompareClient() {
  const { selectedColleges, addCollege, removeCollege, clearAll } = useCompare();

  const handleSelect = (index: number, college: College | null) => {
    const current = selectedColleges[index];
    if (current) removeCollege(current.id);
    if (college) addCollege(college);
  };

  const selectedIds = selectedColleges.map((c) => c.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-3xl flex items-center gap-2">
            <GitCompare className="w-7 h-7 text-brand-secondary" />
            Compare Colleges
          </h1>
          <p className="section-subtitle mt-1">Select up to 3 colleges for a side-by-side comparison</p>
        </div>
        {selectedColleges.length > 0 && (
          <button
            onClick={clearAll}
            className="btn-outline text-sm self-start sm:self-auto"
          >
            Clear All
          </button>
        )}
      </div>

      {/* College Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              College {index + 1}
            </label>
            <CollegeSelector
              selected={selectedColleges[index] ?? null}
              onSelect={(college) => handleSelect(index, college)}
              excludeIds={selectedIds.filter((_, i) => i !== index)}
              label={`Select College ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Prompt when < 2 selected */}
      {selectedColleges.length < 2 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <PlusCircle className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">
            Select at least 2 colleges to compare
          </h3>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Use the dropdowns above or add colleges from the{' '}
            <Link href="/colleges" className="text-brand-secondary hover:underline">
              listings page
            </Link>
            .
          </p>
        </div>
      )}

      {/* Comparison Table */}
      {selectedColleges.length >= 2 && (
        <div className="pb-24">
          <CompareTable colleges={selectedColleges} onRemove={removeCollege} />
        </div>
      )}
    </div>
  );
}
