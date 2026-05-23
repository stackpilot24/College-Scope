'use client';

import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn, formatFees } from '@/lib/utils';
import type { FilterState } from '@/lib/types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  totalResults: number;
  states: string[];
}

const COLLEGE_TYPES = ['Government', 'Private', 'Deemed'];
const MAX_FEES = 500000;

export function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  totalResults,
  states,
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.location !== '' ||
    filters.type !== '' ||
    filters.minRating > 0 ||
    filters.maxFees < MAX_FEES;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-secondary" />
          <span className="font-semibold text-gray-800">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-brand-secondary hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* State / Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="input-base text-sm"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* College Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
        <div className="space-y-2">
          {COLLEGE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="collegeType"
                value={type}
                checked={filters.type === type}
                onChange={() =>
                  onFilterChange('type', filters.type === type ? '' : type)
                }
                className="w-4 h-4 accent-brand-secondary cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-brand-primary">
                {type}
              </span>
            </label>
          ))}
          {filters.type && (
            <button
              onClick={() => onFilterChange('type', '')}
              className="text-xs text-gray-400 hover:text-gray-600 mt-1"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Min Rating</label>
          <span className="text-sm font-semibold text-brand-secondary">
            {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(e) => onFilterChange('minRating', Number(e.target.value))}
          className="w-full accent-brand-secondary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Max Fees */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Max Annual Fees</label>
          <span className="text-sm font-semibold text-brand-secondary">
            {filters.maxFees >= MAX_FEES ? 'Any' : formatFees(filters.maxFees)}
          </span>
        </div>
        <input
          type="range"
          min={50000}
          max={MAX_FEES}
          step={25000}
          value={filters.maxFees}
          onChange={(e) => onFilterChange('maxFees', Number(e.target.value))}
          className="w-full accent-brand-secondary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹50K</span>
          <span>₹5L</span>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
        {totalResults} college{totalResults !== 1 ? 's' : ''} match your filters
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="card p-5 sticky top-24">{content}</div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className={cn(
            'flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors',
            hasActiveFilters
              ? 'border-brand-secondary text-brand-secondary bg-brand-light'
              : 'border-gray-200 text-gray-700 hover:border-gray-300'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
          )}
          <ChevronDown
            className={cn('w-4 h-4 transition-transform', mobileOpen ? 'rotate-180' : '')}
          />
        </button>

        {mobileOpen && (
          <div className="card p-5 mt-3 animate-fade-in">{content}</div>
        )}
      </div>
    </>
  );
}
