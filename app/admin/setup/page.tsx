'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, ShieldCheck } from 'lucide-react';

export default function AdminSetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/setup')
      .then((r) => r.json())
      .then((d) => setHasAdmin(d.hasAdmin));
  }, []);

  if (status === 'loading' || hasAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    );
  }

  if (!session?.user) {
    router.push('/auth/signin');
    return null;
  }

  const role = (session.user as { role?: string }).role;
  if (role === 'ADMIN') {
    router.push('/admin');
    return null;
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin access restricted</h1>
          <p className="text-gray-500 text-sm">
            An admin already exists. Ask them to promote your account to Admin from the Users panel.
          </p>
        </div>
      </div>
    );
  }

  const handleClaim = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/setup', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    } else {
      setMessage(data.error ?? 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card p-8 max-w-md w-full text-center">
        <ShieldCheck className="w-14 h-14 text-brand-secondary mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Admin Access</h1>
        <p className="text-gray-500 text-sm mb-6">
          No admin exists yet. As the first registered user, you can claim admin rights to manage
          CollegeScope.
        </p>
        {message ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm mb-4">
            {message}
            <br />
            <button
              onClick={() => router.push('/auth/signin')}
              className="mt-3 btn-primary text-sm"
            >
              Sign out & Sign back in
            </button>
          </div>
        ) : (
          <button onClick={handleClaim} disabled={loading} className="btn-primary w-full">
            {loading ? 'Claiming...' : 'Claim Admin Access'}
          </button>
        )}
        <p className="text-xs text-gray-400 mt-4">Signed in as {session.user.email}</p>
      </div>
    </div>
  );
}
