'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { RatingStars } from '@/components/ui/RatingStars';
import { ReviewForm } from '@/components/reviews/ReviewForm';

interface ReviewUser {
  name: string | null;
  image: string | null;
}

interface ReviewData {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  comment: string;
  year: number;
  course: string;
  reviewerRole: string;
  createdAt: string;
  user: ReviewUser;
}

interface ReviewsTabProps {
  collegeId: string;
  initialReviews: ReviewData[];
  overallRating: number;
}

export function ReviewsTab({ collegeId, initialReviews, overallRating }: ReviewsTabProps) {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete your review? This cannot be undone.')) return;
    setDeletingId(reviewId);
    const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    }
    setDeletingId(null);
  };

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Student Reviews</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-outline text-sm"
        >
          {showForm ? 'Cancel' : '+ Write a Review'}
        </button>
      </div>

      {/* Write review form */}
      {showForm && (
        <ReviewForm
          collegeId={collegeId}
          onSubmitted={async () => {
            setShowForm(false);
            const res = await fetch(`/api/reviews?collegeId=${collegeId}`);
            if (res.ok) setReviews(await res.json());
          }}
        />
      )}

      {reviews.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-sm">
          No reviews yet. Be the first to review this college!
        </div>
      ) : (
        <>
          {/* Overall breakdown */}
          <div className="card p-5 flex flex-col sm:flex-row gap-6">
            <div className="text-center sm:text-left shrink-0">
              <div className="text-5xl font-bold text-brand-primary">{overallRating.toFixed(1)}</div>
              <RatingStars rating={overallRating} size="md" showNumber={false} />
              <div className="text-xs text-gray-500 mt-1">{reviews.length} reviews</div>
            </div>
            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 w-3">{star}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-gray-400 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {review.user.image ? (
                      <Image src={review.user.image} alt={review.user.name ?? ''} width={36} height={36} className="rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-secondary" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{review.user.name ?? 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">
                        {review.reviewerRole === 'PARENT' ? '👨‍👩‍👧 Parent' : '🎓 Student'} · {review.course} · {review.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} size="sm" showNumber={false} />
                    {currentUserId === review.userId && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
