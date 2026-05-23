import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CollegeScope</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              India&apos;s most comprehensive college discovery platform. Find, compare, and choose
              the perfect institution for your future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Explore</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {['All Colleges', 'IITs', 'NITs', 'Private Universities', 'Deemed Universities'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/colleges"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Resources</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {['Compare Colleges', 'Placement Rankings', 'Fee Comparison', 'Reviews'].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/colleges"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h4 className="font-semibold mb-3 text-white/90">Platform Stats</h4>
            <div className="space-y-2">
              {[
                { value: '20,000+', label: 'Colleges Listed' },
                { value: '50+', label: 'Entrance Exams' },
                { value: '10L+', label: 'Students Helped' },
              ].map((stat) => (
                <div key={stat.label}>
                  <span className="text-brand-accent font-bold">{stat.value}</span>
                  <span className="text-white/60 text-sm ml-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/40">
          <span>© 2026 CollegeScope. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
