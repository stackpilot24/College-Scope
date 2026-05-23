import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const sizeMap = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function RatingStars({
  rating,
  reviewCount,
  size = 'md',
  showNumber = true,
}: RatingStarsProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = !filled && i < rating;
    return { filled, partial };
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((star, i) => (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              star.filled
                ? 'fill-amber-400 text-amber-400'
                : star.partial
                ? 'fill-amber-200 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
