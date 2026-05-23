import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug: params.slug },
      include: {
        courses: true,
        placement: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found.' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch college.' }, { status: 500 });
  }
}
