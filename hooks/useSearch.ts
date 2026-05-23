'use client';

import { useState, useEffect } from 'react';

export function useSearch(initialValue = '', delay = 300): [string, string, (v: string) => void] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}
