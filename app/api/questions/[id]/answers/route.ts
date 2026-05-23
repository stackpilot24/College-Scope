import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Sign in to answer.' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { body } = await req.json();

  if (!body?.trim()) return NextResponse.json({ error: 'Answer cannot be empty.' }, { status: 400 });

  const question = await prisma.question.findUnique({ where: { id: params.id } });
  if (!question) return NextResponse.json({ error: 'Question not found.' }, { status: 404 });

  const answer = await prisma.answer.create({
    data: { userId, questionId: params.id, body: body.trim() },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ ...answer, createdAt: answer.createdAt.toISOString() }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role?: string }).role;
  const { answerId } = await req.json();

  const answer = await prisma.answer.findUnique({ where: { id: answerId } });
  if (!answer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (answer.userId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.answer.delete({ where: { id: answerId } });
  return NextResponse.json({ ok: true });
}
