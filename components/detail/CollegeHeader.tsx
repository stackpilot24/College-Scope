import Image from 'next/image';
import { MapPin, Calendar, Award } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge, CollegeTypeBadge } from '@/components/ui/Badge';
import type { College } from '@/lib/types';

interface CollegeHeaderProps {
  college: College;
}

export function CollegeHeader({ college }: CollegeHeaderProps) {
  return (
    <div className="card overflow-hidden">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 bg-gray-100">
        <Image
          src={college.image}
          alt={college.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
          <CollegeTypeBadge type={college.type} />
          {college.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="warning" />
          ))}
        </div>
      </div>

      {/* Info row */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4">
        {/* Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-gray-100 bg-white shadow-sm overflow-hidden relative shrink-0 -mt-10 sm:-mt-12 z-10">
          <Image
            src={college.logo}
            alt={`${college.name} logo`}
            fill
            className="object-contain p-1"
            sizes="80px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            {college.name}
          </h1>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {college.location.city}, {college.location.state}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Est. {college.established}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <RatingStars rating={college.rating} reviewCount={college.reviewCount} size="md" />
            <div className="flex flex-wrap gap-1.5">
              {college.accreditation.map((acc) => (
                <span
                  key={acc}
                  className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium"
                >
                  <Award className="w-3 h-3" />
                  {acc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
