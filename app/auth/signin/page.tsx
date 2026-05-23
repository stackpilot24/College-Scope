import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { SignInForm } from '@/components/auth/SignInForm';

export const metadata = { title: 'Sign In — CollegeScope' };

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">CollegeScope</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your college journey<br />starts here.
          </h2>
          <p className="text-white/60 text-lg">
            Discover, compare, and save colleges. Read real reviews from students and parents across India.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: '🔍', text: 'Search 120+ colleges across all Indian states' },
              { icon: '📊', text: 'Side-by-side comparison of fees, placements, courses' },
              { icon: '⭐', text: 'Read and write verified student & parent reviews' },
              { icon: '❤️', text: 'Save favourites and track your shortlist' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/80">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-sm">© 2025 CollegeScope</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-brand-primary">CollegeScope</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
