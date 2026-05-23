'use client';

import { useState, useMemo } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/colleges/SearchBar';
import { FilterPanel } from '@/components/colleges/FilterPanel';
import { CollegeGrid } from '@/components/colleges/CollegeGrid';
import { Pagination } from '@/components/colleges/Pagination';
import { CollegeGridSkeleton } from '@/components/ui/LoadingSkeletons';
import { ArrowUpDown } from 'lucide-react';
import type { College, FilterState } from '@/lib/types';

const PAGE_SIZE = 9;

const SORT_OPTIONS: { value: FilterState['sortBy']; label: string }[] = [
  { value: 'rating', label: 'Best Match' },
  { value: 'fees_low', label: 'Fees: Low → High' },
  { value: 'fees_high', label: 'Fees: High → Low' },
  { value: 'name', label: 'Name A–Z' },
];

interface CollegesClientProps {
  colleges: College[];
  states: string[];
}

export function CollegesClient({ colleges, states }: CollegesClientProps) {
  const { filters, setFilter, resetFilters, filteredColleges } = useFilters(colleges);
  const [rawSearch, , setRawSearch] = useSearch(filters.search);
  const [page, setPage] = useState(1);

  const handleSearchChange = (value: string) => {
    setRawSearch(value);
    setFilter('search', value);
    setPage(1);
  };

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilter(key, value);
    setPage(1);
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredColleges.slice(start, start + PAGE_SIZE);
  }, [filteredColleges, page]);

  const totalPages = Math.ceil(filteredColleges.length / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="section-title text-3xl">Find Your College</h1>
        <p className="section-subtitle">Discover from {colleges.length}+ top Indian institutions</p>
      </div>

      {/* Search */}
      <SearchBar
        value={rawSearch}
        onChange={handleSearchChange}
        className="mb-4"
        size="md"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={() => {
            resetFilters();
            setRawSearch('');
            setPage(1);
          }}
          totalResults={filteredColleges.length}
          states={states}
        />

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <p className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-800">
                {filteredColleges.length === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, filteredColleges.length)}–
                {Math.min(page * PAGE_SIZE, filteredColleges.length)}
              </span>{' '}
              of <span className="font-semibold text-gray-800">{filteredColleges.length}</span>{' '}
              colleges
            </p>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-secondary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          <CollegeGrid colleges={paginated} />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      </div>
    </div>
  );
}
