import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const state = searchParams.get('location') ?? '';
    const type = searchParams.get('type') ?? '';
    const minRating = parseFloat(searchParams.get('minRating') ?? '0');
    const maxFees = parseInt(searchParams.get('maxFees') ?? '10000000');
    const sortBy = searchParams.get('sortBy') ?? 'rating';

    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    if (state) where.state = state;
    if (type) where.type = type as Prisma.EnumCollegeTypeFilter['equals'];
    if (minRating > 0) where.rating = { gte: minRating };
    if (maxFees < 10000000) where.feesMin = { lte: maxFees };

    const orderBy: Prisma.CollegeOrderByWithRelationInput =
      sortBy === 'fees_low' ? { feesMin: 'asc' }
      : sortBy === 'fees_high' ? { feesMax: 'desc' }
      : sortBy === 'name' ? { name: 'asc' }
      : { rating: 'desc' };

    const colleges = await prisma.college.findMany({
      where,
      orderBy,
      include: { courses: true, placement: true },
    });

    return NextResponse.json(colleges);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch colleges.' }, { status: 500 });
  }
}
