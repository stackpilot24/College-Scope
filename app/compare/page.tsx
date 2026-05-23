import { Suspense } from 'react';
import { CompareClient } from './CompareClient';

export const metadata = {
  title: 'Compare Colleges — CollegeScope',
  description: 'Side-by-side comparison of Indian colleges.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>}>
      <CompareClient />
    </Suspense>
  );
}
