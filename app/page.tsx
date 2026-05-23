import Link from 'next/link';
import { GitCompare, ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedColleges } from '@/components/home/FeaturedColleges';
import { getFeaturedColleges } from '@/lib/api';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect('/dashboard');

  const featured = await getFeaturedColleges(6);

  return (
    <div>
      <HeroSection />

      {/* Featured Colleges */}
      <FeaturedColleges colleges={featured} />

      {/* Compare CTA Banner */}
      <section className="bg-brand-light border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary mb-2">
              Can&apos;t decide between colleges?
            </h2>
            <p className="text-gray-600 max-w-md">
              Use our comparison tool to evaluate up to 3 colleges side-by-side on fees,
              placements, courses, and more.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/compare" className="btn-primary flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Compare Colleges
            </Link>
            <Link href="/colleges" className="btn-outline flex items-center gap-2">
              Browse All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why CollegeScope */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title text-2xl sm:text-3xl">Why CollegeScope?</h2>
          <p className="section-subtitle">Everything you need to make the right choice</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              emoji: '🔍',
              title: 'Smart Search',
              desc: 'Filter by location, fees, type, and rating with instant results.',
            },
            {
              emoji: '📊',
              title: 'Side-by-Side Compare',
              desc: 'Compare up to 3 colleges on placements, fees, and courses.',
            },
            {
              emoji: '💼',
              title: 'Placement Data',
              desc: 'Real placement stats — avg package, top recruiters, and rates.',
            },
            {
              emoji: '⭐',
              title: 'Student Reviews',
              desc: 'Genuine student & parent perspectives to guide your decision.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center hover:border-brand-secondary/30 transition-colors">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign up CTA */}
      <section className="bg-brand-primary text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to find your dream college?</h2>
          <p className="text-blue-200 mb-8 text-sm sm:text-base">
            Join thousands of students who discovered their perfect fit with CollegeScope.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="bg-white text-brand-primary font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Get Started — It&apos;s Free
            </Link>
            <Link href="/colleges" className="border border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
              Browse Colleges
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
