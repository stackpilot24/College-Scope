import { Suspense } from 'react';
import { CollegesClient } from './CollegesClient';
import { getColleges, getAllStates } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Colleges — CollegeScope',
  description: 'Search and filter from 120+ top colleges across all Indian states.',
};

export default async function CollegesPage() {
  const [colleges, states] = await Promise.all([
    getColleges(),
    Promise.resolve(getAllStates()),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-6" />
          <div className="h-11 bg-gray-200 rounded-lg mb-6" />
          <div className="flex gap-6">
            <div className="hidden lg:block w-64 h-96 bg-gray-200 rounded-2xl" />
            <div className="flex-1 grid grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CollegesClient colleges={colleges} states={states} />
    </Suspense>
  );
}
