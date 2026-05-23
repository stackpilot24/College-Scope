'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Award, Users } from 'lucide-react';
import { formatLPA } from '@/lib/utils';
import type { College } from '@/lib/types';

interface PlacementsTabProps {
  college: College;
}

export function PlacementsTab({ college }: PlacementsTabProps) {
  const { placements } = college;

  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-secondary" />,
      label: 'Average Package',
      value: formatLPA(placements.averagePackage),
      bg: 'bg-blue-50',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      label: 'Highest Package',
      value: formatLPA(placements.highestPackage),
      bg: 'bg-amber-50',
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      label: 'Placement Rate',
      value: `${placements.placementRate}%`,
      bg: 'bg-green-50',
    },
  ];

  const chartData = [
    { name: 'Avg Package', lpa: placements.averagePackage, fill: '#2563EB' },
    { name: 'Median (est.)', lpa: Math.round(placements.averagePackage * 0.85), fill: '#60A5FA' },
    {
      name: 'Highest Pkg',
      lpa: placements.highestPackage > 100
        ? placements.highestPackage / 10
        : placements.highestPackage,
      fill: '#F59E0B',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Placement Statistics</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl p-5 flex items-start gap-3`}
          >
            <div className="mt-0.5">{stat.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placement Rate Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Placement Rate</span>
          <span className="font-semibold">{placements.placementRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-secondary to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${placements.placementRate}%` }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Package Overview (LPA)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" L" />
              <Tooltip
                formatter={(value: number) => [`₹${value} LPA`, 'Package']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="lpa" radius={[4, 4, 0, 0]} fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Recruiters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Recruiters</h3>
        <div className="flex flex-wrap gap-2">
          {placements.topRecruiters.map((recruiter) => (
            <span
              key={recruiter}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:border-brand-secondary hover:text-brand-secondary transition-colors"
            >
              {recruiter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
