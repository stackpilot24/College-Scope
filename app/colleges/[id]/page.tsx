import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getCollegeBySlug, getReviewsByCollegeId } from '@/lib/api';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CollegeDetailClient } from './CollegeDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const college = await getCollegeBySlug(params.id);
  if (!college) return { title: 'College Not Found' };
  return {
    title: `${college.name} — CollegeScope`,
    description: college.overview.slice(0, 160),
  };
}

export default async function CollegeDetailPage({ params }: PageProps) {
  const [college, session] = await Promise.all([
    getCollegeBySlug(params.id),
    getServerSession(authOptions),
  ]);

  if (!college) notFound();

  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [reviews, savedRecord, rawQuestions] = await Promise.all([
    getReviewsByCollegeId(college.id),
    userId
      ? prisma.savedCollege
          .findUnique({ where: { userId_collegeId: { userId, collegeId: college.id } } })
          .catch(() => null)
      : Promise.resolve(null),
    prisma.question.findMany({
      where: { collegeId: college.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
        answers: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
    }).catch(() => []),
  ]);

  const questions = rawQuestions.map((q) => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
    answers: q.answers.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })),
  }));

  return (
    <CollegeDetailClient
      college={college}
      reviews={reviews}
      isSaved={!!savedRecord}
      questions={questions}
    />
  );
}
