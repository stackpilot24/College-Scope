'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { College } from '@/lib/types';

interface CompareContextValue {
  selectedColleges: College[];
  addCollege: (college: College) => void;
  removeCollege: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);

  const addCollege = useCallback((college: College) => {
    setSelectedColleges((prev) => {
      if (prev.length >= 3 || prev.some((c) => c.id === college.id)) return prev;
      return [...prev, college];
    });
  }, []);

  const removeCollege = useCallback((id: string) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedColleges([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedColleges.some((c) => c.id === id),
    [selectedColleges]
  );

  const isFull = selectedColleges.length >= 3;

  return (
    <CompareContext.Provider
      value={{ selectedColleges, addCollege, removeCollege, clearAll, isSelected, isFull }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompareContext(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompareContext must be used inside CompareProvider');
  return ctx;
}
