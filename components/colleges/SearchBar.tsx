'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-9 text-sm pl-9 pr-9',
  md: 'h-11 text-sm pl-10 pr-10',
  lg: 'h-14 text-base pl-12 pr-12',
};

const iconSizes = {
  sm: 'w-4 h-4 left-2.5',
  md: 'w-4 h-4 left-3',
  lg: 'w-5 h-5 left-4',
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search colleges by name, city, state...',
  className,
  size = 'md',
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none',
          iconSizes[size]
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'input-base',
          sizeStyles[size],
          'transition-all focus:shadow-md'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors',
            size === 'lg' ? 'right-4' : 'right-3'
          )}
          aria-label="Clear search"
        >
          <X className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
        </button>
      )}
    </div>
  );
}
