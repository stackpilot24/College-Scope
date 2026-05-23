import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CollegeCard } from '@/components/colleges/CollegeCard';
import type { College } from '@/lib/types';

interface FeaturedCollegesProps {
  colleges: College[];
}

export function FeaturedColleges({ colleges }: FeaturedCollegesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="section-title text-2xl sm:text-3xl">Top Ranked Colleges</h2>
          <p className="section-subtitle">Handpicked institutions with the best ratings and placements</p>
        </div>
        <Link
          href="/colleges"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-brand-secondary hover:underline"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <CollegeCard key={college.id} college={college} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/colleges" className="btn-outline text-sm inline-flex items-center gap-1.5">
          View All Colleges <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
