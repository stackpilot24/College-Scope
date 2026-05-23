import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

export type AdminSession = {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string };
};

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/signin');
  if ((session.user as { role?: string }).role !== 'ADMIN') redirect('/');
  return session as unknown as AdminSession;
}

export function getAdminSession(session: unknown): AdminSession['user'] | null {
  if (!session || typeof session !== 'object') return null;
  const s = session as { user?: { role?: string; id?: string } };
  if (s.user?.role !== 'ADMIN') return null;
  return s.user as AdminSession['user'];
}
