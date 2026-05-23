'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { FilterState, College } from '@/lib/types';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  location: '',
  type: '',
  minRating: 0,
  maxFees: 1000000,
  sortBy: 'rating',
};

export function useFilters(allColleges: College[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: FilterState = useMemo(() => {
    return {
      search: searchParams.get('search') ?? DEFAULT_FILTERS.search,
      location: searchParams.get('location') ?? DEFAULT_FILTERS.location,
      type: searchParams.get('type') ?? DEFAULT_FILTERS.type,
      minRating: Number(searchParams.get('minRating') ?? DEFAULT_FILTERS.minRating),
      maxFees: Number(searchParams.get('maxFees') ?? DEFAULT_FILTERS.maxFees),
      sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) ?? DEFAULT_FILTERS.sortBy,
    };
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === '' || value === 0 || value === DEFAULT_FILTERS[key]) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const filteredColleges: College[] = useMemo(() => {
    let results = [...allColleges];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.city.toLowerCase().includes(q) ||
          c.location.state.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.location) {
      results = results.filter((c) => c.location.state === filters.location);
    }

    if (filters.type) {
      results = results.filter((c) => c.type === filters.type);
    }

    if (filters.minRating > 0) {
      results = results.filter((c) => c.rating >= filters.minRating);
    }

    if (filters.maxFees < 1000000) {
      results = results.filter((c) => c.fees.min <= filters.maxFees);
    }

    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'fees_low':
        results.sort((a, b) => a.fees.min - b.fees.min);
        break;
      case 'fees_high':
        results.sort((a, b) => b.fees.max - a.fees.max);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return results;
  }, [filters, allColleges]);

  return { filters, setFilter, resetFilters, filteredColleges };
}
