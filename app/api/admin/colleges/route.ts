import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'ADMIN';
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const state = searchParams.get('state') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (state) where.state = state;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, slug: true, city: true, state: true,
        type: true, rating: true, reviewCount: true, feesMin: true, feesMax: true,
        established: true, _count: { select: { reviews: true } },
      },
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({ colleges, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { courses, placement, ...collegeData } = body;

  const college = await prisma.college.create({
    data: {
      ...collegeData,
      established: parseInt(collegeData.established),
      feesMin: parseInt(collegeData.feesMin),
      feesMax: parseInt(collegeData.feesMax),
      rating: parseFloat(collegeData.rating ?? '0'),
      reviewCount: parseInt(collegeData.reviewCount ?? '0'),
      courses: { create: courses ?? [] },
      placement: placement ? { create: {
        averagePackage: parseFloat(placement.averagePackage),
        highestPackage: parseFloat(placement.highestPackage),
        placementRate: parseFloat(placement.placementRate),
        topRecruiters: placement.topRecruiters,
      }} : undefined,
    },
  });

  return NextResponse.json({ college }, { status: 201 });
}
