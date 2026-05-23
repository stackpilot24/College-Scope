import { Calendar, Building2, BookOpen, Award } from 'lucide-react';
import type { College } from '@/lib/types';

interface OverviewTabProps {
  college: College;
}

export function OverviewTab({ college }: OverviewTabProps) {
  const highlights = [
    { icon: <Calendar className="w-5 h-5 text-brand-secondary" />, label: 'Established', value: college.established.toString() },
    { icon: <Building2 className="w-5 h-5 text-brand-secondary" />, label: 'Institute Type', value: college.type },
    { icon: <BookOpen className="w-5 h-5 text-brand-secondary" />, label: 'Total Courses', value: college.courses.length.toString() },
    { icon: <Award className="w-5 h-5 text-brand-secondary" />, label: 'Accreditations', value: college.accreditation.length.toString() },
  ];

  return (
    <div className="space-y-6">
      {/* About */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
        <p className="text-gray-600 leading-relaxed">{college.overview}</p>
      </div>

      {/* Key Highlights */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Key Highlights</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center p-4 bg-brand-light rounded-xl"
            >
              {item.icon}
              <span className="mt-2 text-xl font-bold text-brand-primary">{item.value}</span>
              <span className="text-xs text-gray-500 mt-0.5">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Accreditations & Rankings</h2>
        <div className="flex flex-wrap gap-2">
          {college.accreditation.map((acc) => (
            <span
              key={acc}
              className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-medium shadow-sm"
            >
              {acc}
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {college.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
