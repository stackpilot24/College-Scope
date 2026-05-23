import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role?: string }).role;

  const question = await prisma.question.findUnique({ where: { id: params.id } });
  if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (question.userId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.question.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
