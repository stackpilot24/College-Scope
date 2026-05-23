'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronLeft, GitCompare, Heart } from 'lucide-react';
import { CollegeHeader } from '@/components/detail/CollegeHeader';
import { OverviewTab } from '@/components/detail/OverviewTab';
import { CoursesTab } from '@/components/detail/CoursesTab';
import { PlacementsTab } from '@/components/detail/PlacementsTab';
import { ReviewsTab } from '@/components/detail/ReviewsTab';
import { QATab } from '@/components/detail/QATab';
import { useCompare } from '@/hooks/useCompare';
import { formatFees } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { College, ReviewData } from '@/lib/types';

const TABS = ['Overview', 'Courses', 'Placements', 'Reviews', 'Q&A'] as const;
type Tab = (typeof TABS)[number];

interface QUser { id: string; name: string | null; image: string | null }
interface Answer { id: string; body: string; createdAt: string; user: QUser }
interface Question { id: string; title: string; body: string; createdAt: string; user: QUser; answers: Answer[] }

interface CollegeDetailClientProps {
  college: College;
  reviews: ReviewData[];
  isSaved: boolean;
  questions: Question[];
}

export function CollegeDetailClient({ college, reviews, isSaved: initialSaved, questions }: CollegeDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const { addCollege, removeCollege, isSelected, isFull } = useCompare();
  const { data: session } = useSession();
  const router = useRouter();
  const selected = isSelected(college.id);

  const handleCompare = () => {
    if (selected) removeCollege(college.id);
    else if (!isFull) addCollege(college);
  };

  const handleSave = async () => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(`/colleges/${college.slug}`));
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: college.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/colleges"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-secondary mb-5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Colleges
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-5">
          <CollegeHeader college={college} />

          {/* Tab navigation */}
          <div className="card p-1 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 min-w-[90px] px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  activeTab === tab
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {tab}
                {tab === 'Reviews' && reviews.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">({reviews.length})</span>
                )}
                {tab === 'Q&A' && questions.length > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">({questions.length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="card p-5 sm:p-6 animate-fade-in">
            {activeTab === 'Overview' && <OverviewTab college={college} />}
            {activeTab === 'Courses' && <CoursesTab college={college} />}
            {activeTab === 'Placements' && <PlacementsTab college={college} />}
            {activeTab === 'Reviews' && (
              <ReviewsTab
                collegeId={college.id}
                initialReviews={reviews}
                overallRating={college.rating}
              />
            )}
            {activeTab === 'Q&A' && (
              <QATab collegeId={college.id} initialQuestions={questions} />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="card p-5 space-y-4 sticky top-24">
            <h3 className="font-semibold text-gray-800">Quick Facts</h3>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Type', value: college.type },
                { label: 'Established', value: college.established.toString() },
                { label: 'Rating', value: `${college.rating} / 5` },
                {
                  label: 'Annual Fees',
                  value: `${formatFees(college.fees.min)} – ${formatFees(college.fees.max)}`,
                },
                { label: 'Total Courses', value: college.courses.length.toString() },
                { label: 'Avg Placement', value: `₹${college.placements.averagePackage} LPA` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-semibold text-gray-800 text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                  saved
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50',
                  saving && 'opacity-60 cursor-not-allowed'
                )}
              >
                <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
                {saved ? 'Saved' : 'Save College'}
              </button>

              <button
                onClick={handleCompare}
                disabled={!selected && isFull}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                  selected
                    ? 'bg-brand-light border-brand-secondary text-brand-secondary'
                    : isFull
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-brand-secondary text-brand-secondary hover:bg-brand-light'
                )}
              >
                <GitCompare className="w-4 h-4" />
                {selected ? 'Added to Compare' : isFull ? 'Compare Full (3/3)' : 'Add to Compare'}
              </button>

              <Link
                href="/compare"
                className="w-full btn-primary text-sm text-center block"
              >
                Compare Colleges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
