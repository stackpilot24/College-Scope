import type { Metadata } from 'next';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SessionProviderWrapper } from '@/components/auth/SessionProviderWrapper';
import { CompareProvider } from '@/context/CompareContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CompareBar } from '@/components/compare/CompareBar';
import { YaraChat } from '@/components/yara/YaraChat';

export const metadata: Metadata = {
  title: 'CollegeScope — Find Your Perfect College',
  description: 'Discover, compare, and choose from 120+ colleges across India. Real reviews from students and parents.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error('[layout] getServerSession failed:', err);
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <SessionProviderWrapper session={session}>
          <CompareProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CompareBar />
            <YaraChat />
          </CompareProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
