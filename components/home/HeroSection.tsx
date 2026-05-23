'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, TrendingUp, BookOpen, Users } from 'lucide-react';

const STATS = [
  { icon: <BookOpen className="w-5 h-5" />, value: '20,000+', label: 'Colleges Listed' },
  { icon: <TrendingUp className="w-5 h-5" />, value: '50+', label: 'Entrance Exams' },
  { icon: <Users className="w-5 h-5" />, value: '10L+', label: 'Students Helped' },
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/colleges');
    }
  };

  return (
    <section className="relative bg-brand-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-brand-accent" />
          India&apos;s #1 College Discovery Platform
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
          Find Your Perfect
          <br />
          <span className="text-brand-accent">College in India</span>
        </h1>

        <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Compare placements, fees, courses, and reviews from 20,000+ institutions.
          Make an informed decision for your future.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by college name, city, or state..."
                className="w-full h-12 pl-12 pr-4 text-gray-900 bg-transparent outline-none text-base placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              Search
            </button>
          </div>

          {/* Quick searches */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {['IIT', 'NIT', 'MBA', 'Private', 'Bangalore', 'Mumbai'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  router.push(`/colleges?search=${encodeURIComponent(tag)}`);
                }}
                className="text-xs text-white/60 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors border border-white/10"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
