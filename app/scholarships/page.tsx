'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, DollarSign, Calendar, FileText, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, RefreshCw } from 'lucide-react';
import { scholarships, categoryColors, levelColors } from '@/lib/scholarshipData';
import type { ScholarshipCategory, ScholarshipLevel } from '@/lib/scholarshipData';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES: ScholarshipCategory[] = ['Merit', 'Need-Based', 'State', 'Minority', 'SC/ST/OBC', 'Sports', 'Girl Child', 'Differently Abled'];
const ALL_LEVELS: ScholarshipLevel[] = ['UG', 'PG', 'Both', 'Doctoral'];

function ScholarshipCard({ s }: { s: typeof scholarships[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', categoryColors[s.category])}>
                {s.category}
              </span>
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', levelColors[s.level])}>
                {s.level}
              </span>
              {s.renewable && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Renewable
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-snug">{s.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{s.provider}</p>
          </div>
          <a
            href={s.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs flex items-center gap-1 text-brand-secondary hover:underline"
          >
            Apply <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{s.description}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.amount}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Application Period</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.applicationPeriod}</p>
            </div>
          </div>
          {s.seats && (
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Available Seats</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{s.seats}</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Eligibility & Documents</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Eligibility</p>
              <p className="text-sm text-gray-700 leading-relaxed">{s.eligibility}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Selection Criteria</p>
              <p className="text-sm text-gray-700 leading-relaxed">{s.selectionCriteria}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Documents Required
              </p>
              <ul className="space-y-1.5">
                {s.documentsRequired.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ScholarshipCategory | 'All'>('All');
  const [activeLevel, setActiveLevel] = useState<ScholarshipLevel | 'All'>('All');
  const [renewableOnly, setRenewableOnly] = useState(false);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      const matchLevel = activeLevel === 'All' || s.level === activeLevel || s.level === 'Both';
      const matchRenewable = !renewableOnly || s.renewable;
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.provider.toLowerCase().includes(search.toLowerCase()) ||
        s.eligibility.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchLevel && matchRenewable && matchSearch;
    });
  }, [search, activeCategory, activeLevel, renewableOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scholarship Finder</h1>
        <p className="mt-2 text-gray-600">
          Discover government and private scholarships for Indian students — filter by category, level, and eligibility.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scholarships, providers…"
              className="input-base pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={activeLevel}
              onChange={(e) => setActiveLevel(e.target.value as ScholarshipLevel | 'All')}
              className="input-base text-sm"
            >
              <option value="All">All Levels</option>
              {ALL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={renewableOnly}
              onChange={(e) => setRenewableOnly(e.target.checked)}
              className="rounded"
            />
            Renewable only
          </label>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {(['All', ...ALL_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                activeCategory === cat
                  ? 'bg-brand-secondary text-white border-brand-secondary'
                  : 'border-gray-200 text-gray-600 hover:border-brand-secondary hover:text-brand-secondary'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-semibold text-gray-800">{filtered.length}</span> scholarship{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No scholarships match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} s={s} />
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center">
        Scholarship details are indicative. Always verify amounts, dates, and eligibility at official sources before applying.
      </p>
    </div>
  );
}
