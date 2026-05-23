'use client';

import { useState } from 'react';
import { ArrowUpDown, Users, Clock, IndianRupee } from 'lucide-react';
import { formatFees } from '@/lib/utils';
import type { College } from '@/lib/types';

interface CoursesTabProps {
  college: College;
}

type SortKey = 'name' | 'fees' | 'duration' | 'seats';
type SortDir = 'asc' | 'desc';

export function CoursesTab({ college }: CoursesTabProps) {
  const [sortKey, setSortKey] = useState<SortKey>('fees');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...college.courses].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'fees') diff = a.fees - b.fees;
    else if (sortKey === 'seats') diff = a.seats - b.seats;
    else if (sortKey === 'name') diff = a.name.localeCompare(b.name);
    else if (sortKey === 'duration') diff = a.duration.localeCompare(b.duration);
    return sortDir === 'asc' ? diff : -diff;
  });

  const SortIcon = ({ col }: { col: SortKey }) => (
    <ArrowUpDown
      className={`w-3.5 h-3.5 ml-1 inline ${sortKey === col ? 'text-brand-secondary' : 'text-gray-400'}`}
    />
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Courses Offered</h2>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {sorted.map((course) => (
          <div key={course.id} className="card p-4 space-y-2">
            <div className="font-medium text-gray-900">{course.name}</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <IndianRupee className="w-3.5 h-3.5" />
                {formatFees(course.fees)}/yr
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-3.5 h-3.5" />
                {course.seats} seats
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-brand-secondary select-none"
                onClick={() => handleSort('name')}
              >
                Course Name <SortIcon col="name" />
              </th>
              <th
                className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-brand-secondary select-none"
                onClick={() => handleSort('duration')}
              >
                Duration <SortIcon col="duration" />
              </th>
              <th
                className="text-right px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-brand-secondary select-none"
                onClick={() => handleSort('fees')}
              >
                Annual Fees <SortIcon col="fees" />
              </th>
              <th
                className="text-right px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:text-brand-secondary select-none"
                onClick={() => handleSort('seats')}
              >
                Seats <SortIcon col="seats" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{course.name}</td>
                <td className="px-4 py-3 text-gray-600">{course.duration}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-primary">
                  {formatFees(course.fees)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{course.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
