import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata = { title: 'Create Account — CollegeScope' };

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-primary to-brand-secondary flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">CollegeScope</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join 10 lakh+ students<br />making smarter choices.
          </h2>
          <p className="text-white/60 text-lg">
            Create a free account to save colleges, compare options, and share your experience.
          </p>
        </div>

        <p className="text-white/30 text-sm">© 2025 CollegeScope</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-brand-primary">CollegeScope</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Free forever. No credit card needed.</p>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
