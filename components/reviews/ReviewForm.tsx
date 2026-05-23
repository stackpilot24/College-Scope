'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  collegeId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string;
    year: number;
    course: string;
    reviewerRole: string;
  } | null;
  onSubmitted?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export function ReviewForm({ collegeId, existingReview, onSubmitted }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({
    comment: existingReview?.comment ?? '',
    year: existingReview?.year ?? CURRENT_YEAR,
    course: existingReview?.course ?? '',
    reviewerRole: existingReview?.reviewerRole ?? 'STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!session) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-500 text-sm mb-3">Sign in to write a review</p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="btn-primary text-sm"
        >
          Sign In to Review
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!form.course.trim()) { setError('Please enter the course name.'); return; }

    setError('');
    setLoading(true);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId, rating, ...form }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Failed to submit. Try again.');
    } else {
      setSuccess(true);
      onSubmitted?.();
      router.refresh();
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold text-green-800">Review submitted!</p>
        <p className="text-sm text-green-600 mt-1">Thank you for helping other students.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">
        {existingReview ? 'Edit your review' : 'Write a review'}
      </h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={cn(
                  'w-8 h-8 transition-colors',
                  (hovered || rating) >= star
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-gray-600 self-center">
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
        <div className="flex gap-3">
          {(['STUDENT', 'PARENT'] as const).map((r) => (
            <label key={r} className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-colors',
              form.reviewerRole === r ? 'border-brand-secondary bg-brand-light text-brand-secondary' : 'border-gray-200 text-gray-600'
            )}>
              <input type="radio" className="sr-only" value={r} checked={form.reviewerRole === r} onChange={() => setForm({ ...form, reviewerRole: r })} />
              {r === 'STUDENT' ? '🎓 Student' : '👨‍👩‍👧 Parent'}
            </label>
          ))}
        </div>
      </div>

      {/* Course */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Course / Program *</label>
        <input
          type="text"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          placeholder="e.g. B.Tech Computer Science"
          className="input-base"
          required
        />
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch / Passout Year</label>
        <select
          value={form.year}
          onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
          className="input-base"
        >
          {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Experience *</label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Share your experience — academics, placements, infrastructure, campus life..."
          rows={4}
          required
          minLength={30}
          className="input-base resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{form.comment.length} chars (min 30)</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-60">
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}
