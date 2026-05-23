import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars';
import { CollegeTypeBadge } from '@/components/ui/Badge';
import { formatFees, formatLPA, cn } from '@/lib/utils';
import type { College } from '@/lib/types';

interface CompareTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
}

type RowDef = {
  label: string;
  key: string;
  render: (c: College) => React.ReactNode;
  compare?: (c: College) => number;
  highlight?: 'max' | 'min';
};

const rows: RowDef[] = [
  {
    label: 'Location',
    key: 'location',
    render: (c) => `${c.location.city}, ${c.location.state}`,
  },
  {
    label: 'Type',
    key: 'type',
    render: (c) => <CollegeTypeBadge type={c.type} />,
  },
  {
    label: 'Established',
    key: 'established',
    render: (c) => c.established.toString(),
  },
  {
    label: 'Rating',
    key: 'rating',
    render: (c) => <RatingStars rating={c.rating} reviewCount={c.reviewCount} size="sm" />,
    compare: (c) => c.rating,
    highlight: 'max',
  },
  {
    label: 'Annual Fees',
    key: 'fees',
    render: (c) => `${formatFees(c.fees.min)} – ${formatFees(c.fees.max)}`,
    compare: (c) => c.fees.min,
    highlight: 'min',
  },
  {
    label: 'Avg Package',
    key: 'avgPackage',
    render: (c) => formatLPA(c.placements.averagePackage),
    compare: (c) => c.placements.averagePackage,
    highlight: 'max',
  },
  {
    label: 'Highest Package',
    key: 'highestPackage',
    render: (c) => formatLPA(c.placements.highestPackage),
    compare: (c) => c.placements.highestPackage,
    highlight: 'max',
  },
  {
    label: 'Placement Rate',
    key: 'placementRate',
    render: (c) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 max-w-[80px] h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${c.placements.placementRate}%` }}
          />
        </div>
        <span>{c.placements.placementRate}%</span>
      </div>
    ),
    compare: (c) => c.placements.placementRate,
    highlight: 'max',
  },
  {
    label: 'Accreditations',
    key: 'accreditation',
    render: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.accreditation.map((a) => (
          <span key={a} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
            {a}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: 'Top Courses',
    key: 'courses',
    render: (c) => (
      <ul className="space-y-1">
        {c.courses.slice(0, 3).map((course) => (
          <li key={course.id} className="text-xs text-gray-600 truncate">
            • {course.name}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: 'Top Recruiters',
    key: 'recruiters',
    render: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.placements.topRecruiters.slice(0, 4).map((r) => (
          <span key={r} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {r}
          </span>
        ))}
      </div>
    ),
  },
];

function getBestIndex(colleges: College[], row: RowDef): number {
  if (!row.compare || !row.highlight) return -1;
  const values = colleges.map(row.compare);
  const best = row.highlight === 'max' ? Math.max(...values) : Math.min(...values);
  return values.indexOf(best);
}

export function CompareTable({ colleges, onRemove }: CompareTableProps) {
  const colCount = colleges.length;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full min-w-[640px]">
        {/* Header */}
        <thead>
          <tr className="bg-gray-50">
            <th className="w-36 sm:w-48 px-4 py-3 text-left text-sm font-semibold text-gray-500 border-b border-gray-200">
              Attribute
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="px-4 py-3 border-b border-gray-200 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-12 h-12 rounded-xl border border-gray-100 bg-white overflow-hidden">
                    <Image
                      src={college.logo}
                      alt={college.name}
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  </div>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-brand-secondary transition-colors text-center line-clamp-2"
                  >
                    {college.name}
                  </Link>
                  <button
                    onClick={() => onRemove(college.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${college.name}`}
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </th>
            ))}
            {/* Empty column placeholders */}
            {Array.from({ length: 3 - colCount }).map((_, i) => (
              <th key={`empty-${i}`} className="px-4 py-3 border-b border-gray-200 bg-gray-50/50" />
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, rowIdx) => {
            const bestIdx = getBestIndex(colleges, row);
            return (
              <tr
                key={row.key}
                className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-100 align-top">
                  {row.label}
                </td>
                {colleges.map((college, colIdx) => (
                  <td
                    key={college.id}
                    className={cn(
                      'px-4 py-3 text-sm text-gray-700 align-top',
                      bestIdx === colIdx ? 'bg-green-50' : ''
                    )}
                  >
                    {row.render(college)}
                    {bestIdx === colIdx && (
                      <div className="text-xs text-green-600 font-medium mt-1">✓ Best</div>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - colCount }).map((_, i) => (
                  <td key={`empty-${i}`} className="px-4 py-3 bg-gray-50/30" />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
