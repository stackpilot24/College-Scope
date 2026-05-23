'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, GitCompare, BookOpen } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge, CollegeTypeBadge } from '@/components/ui/Badge';
import { useCompare } from '@/hooks/useCompare';
import { formatFees, cn } from '@/lib/utils';
import type { College } from '@/lib/types';

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const { addCollege, removeCollege, isSelected, isFull } = useCompare();
  const selected = isSelected(college.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selected) {
      removeCollege(college.id);
    } else if (!isFull) {
      addCollege(college);
    }
  };

  return (
    <div className="card overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={college.image}
          alt={college.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <CollegeTypeBadge type={college.type} />
          {college.tags.slice(0, 1).map((tag) => (
            <Badge key={tag} label={tag} variant="warning" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name & Location */}
        <div className="mb-2">
          <Link href={`/colleges/${college.slug}`}>
            <h3 className="font-semibold text-gray-900 leading-snug hover:text-brand-secondary transition-colors line-clamp-2">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>
              {college.location.city}, {college.location.state}
            </span>
          </div>
        </div>

        {/* Rating */}
        <RatingStars rating={college.rating} reviewCount={college.reviewCount} size="sm" />

        {/* Fees */}
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-800">
            {formatFees(college.fees.min)} – {formatFees(college.fees.max)}
          </span>
          <span className="text-gray-400"> / year</span>
        </div>

        {/* Top courses */}
        <div className="mt-3 space-y-1">
          {college.courses.slice(0, 2).map((course) => (
            <div key={course.id} className="flex items-center gap-1.5 text-xs text-gray-500">
              <BookOpen className="w-3 h-3 shrink-0 text-gray-400" />
              <span className="truncate">{course.name}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/colleges/${college.slug}`}
            className="flex-1 btn-primary text-sm text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleCompare}
            disabled={!selected && isFull}
            title={isFull && !selected ? 'Max 3 colleges can be compared' : 'Add to compare'}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
              selected
                ? 'bg-brand-light border-brand-secondary text-brand-secondary'
                : isFull
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:border-brand-secondary hover:text-brand-secondary'
            )}
          >
            <GitCompare className="w-4 h-4" />
            {selected ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}
