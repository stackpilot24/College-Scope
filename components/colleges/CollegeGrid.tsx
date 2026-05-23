import { CollegeCard } from './CollegeCard';
import { ErrorState } from '@/components/ui/ErrorState';
import type { College } from '@/lib/types';

interface CollegeGridProps {
  colleges: College[];
}

export function CollegeGrid({ colleges }: CollegeGridProps) {
  if (colleges.length === 0) {
    return <ErrorState type="empty" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}
