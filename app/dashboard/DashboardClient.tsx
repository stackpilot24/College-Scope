'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Heart, BookOpen, TrendingUp } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars';
import { CollegeTypeBadge } from '@/components/ui/Badge';
import { formatFees, formatLPA } from '@/lib/utils';
import type { Session } from 'next-auth';

interface College {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  image: string;
  logo: string;
  courses: { id: string; name: string }[];
  placement: { averagePackage: number; placementRate: number } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  year: number;
  course: string;
  createdAt: string;
  college: { name: string; slug: string; image: string };
}

interface DashboardClientProps {
  user: Session['user'];
  savedColleges: College[];
  recentReviews: Review[];
  topColleges: College[];
}

function CollegeMiniCard({ college }: { college: College }) {
  return (
    <Link href={`/colleges/${college.slug}`} className="card p-4 flex gap-3 hover:border-brand-secondary/30 transition-colors">
      <div className="relative w-12 h-12 rounded-xl border border-gray-100 shrink-0 overflow-hidden bg-white">
        <Image src={college.logo} alt={college.name} fill className="object-contain p-1" sizes="48px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-gray-900 truncate">{college.name}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <MapPin className="w-3 h-3" /> {college.city}, {college.state}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <RatingStars rating={college.rating} size="sm" showNumber={false} />
          <span className="text-xs font-semibold text-gray-600">{college.rating}</span>
          <span className="text-xs text-gray-400">{formatFees(college.feesMin)}/yr</span>
        </div>
      </div>
    </Link>
  );
}

export function DashboardClient({ user, savedColleges, recentReviews, topColleges }: DashboardClientProps) {
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {firstName}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s your college discovery summary</p>
        </div>
        <Link href="/colleges" className="btn-primary self-start sm:self-auto flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Explore Colleges
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Saved Colleges', value: savedColleges.length.toString(), icon: <Heart className="w-5 h-5 text-red-400" />, bg: 'bg-red-50' },
          { label: 'Reviews Written', value: recentReviews.length.toString(), icon: <Star className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-50' },
          { label: 'Colleges Explored', value: '120+', icon: <MapPin className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-50' },
          { label: 'States Covered', value: '36', icon: <TrendingUp className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 ${stat.bg}`}>
            <div className="flex items-center gap-2 mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Colleges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-400" /> Saved Colleges
            </h2>
            <Link href="/colleges" className="text-xs text-brand-secondary hover:underline">Browse more →</Link>
          </div>

          {savedColleges.length === 0 ? (
            <div className="card p-8 text-center">
              <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No saved colleges yet.</p>
              <Link href="/colleges" className="btn-primary text-sm mt-3 inline-block">Explore Colleges</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedColleges.map((college) => (
                <CollegeMiniCard key={college.id} college={college} />
              ))}
            </div>
          )}

          {/* Recent Reviews */}
          {recentReviews.length > 0 && (
            <>
              <h2 className="font-semibold text-gray-800 flex items-center gap-1.5 mt-6">
                <Star className="w-4 h-4 text-amber-400" /> Your Reviews
              </h2>
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <Link key={review.id} href={`/colleges/${review.college.slug}`} className="card p-4 flex gap-3 hover:border-brand-secondary/30 transition-colors">
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={review.college.image} alt={review.college.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{review.college.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RatingStars rating={review.rating} size="sm" showNumber={false} />
                        <span className="text-xs text-gray-400">{review.course}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{review.comment}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar — Top Colleges */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-secondary" /> Top Rated Right Now
          </h2>
          <div className="space-y-3">
            {topColleges.map((college, i) => (
              <Link key={college.id} href={`/colleges/${college.slug}`} className="card p-4 flex gap-3 hover:border-brand-secondary/30 transition-colors">
                <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-sm font-bold text-brand-secondary shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 truncate">{college.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <RatingStars rating={college.rating} size="sm" showNumber={false} />
                    <CollegeTypeBadge type={college.type} />
                  </div>
                  {college.placement && (
                    <div className="text-xs text-gray-500 mt-1">
                      Avg: {formatLPA(college.placement.averagePackage)} · {college.placement.placementRate}% placed
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <Link href="/compare" className="card p-4 text-center block hover:border-brand-secondary/30 transition-colors mt-4">
            <div className="text-2xl mb-1">⚖️</div>
            <div className="font-semibold text-sm text-gray-800">Compare Colleges</div>
            <div className="text-xs text-gray-500 mt-0.5">Side-by-side comparison</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
