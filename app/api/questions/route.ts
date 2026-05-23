import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get('collegeId');
  if (!collegeId) return NextResponse.json({ error: 'collegeId required' }, { status: 400 });

  const questions = await prisma.question.findMany({
    where: { collegeId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, image: true } },
      answers: {
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  return NextResponse.json(questions.map((q) => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
    answers: q.answers.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
  })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Sign in to ask a question.' }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { collegeId, title, body } = await req.json();

  if (!collegeId || !title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'All fields required.' }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: { userId, collegeId, title: title.trim(), body: body.trim() },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json({ ...question, createdAt: question.createdAt.toISOString(), answers: [] }, { status: 201 });
}
