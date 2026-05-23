import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdmin(session: unknown) {
  return (session as { user?: { role?: string } })?.user?.role === 'ADMIN';
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const college = await prisma.college.findUnique({
    where: { id: params.id },
    include: { courses: true, placement: true },
  });
  if (!college) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(college);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { courses, placement, ...collegeData } = body;

  await prisma.$transaction(async (tx) => {
    await tx.college.update({
      where: { id: params.id },
      data: {
        name: collegeData.name,
        slug: collegeData.slug,
        city: collegeData.city,
        state: collegeData.state,
        type: collegeData.type,
        established: parseInt(collegeData.established),
        feesMin: parseInt(collegeData.feesMin),
        feesMax: parseInt(collegeData.feesMax),
        overview: collegeData.overview,
        image: collegeData.image,
        logo: collegeData.logo,
        accreditation: collegeData.accreditation,
        tags: collegeData.tags,
        rating: parseFloat(collegeData.rating ?? '0'),
        reviewCount: parseInt(collegeData.reviewCount ?? '0'),
      },
    });

    await tx.course.deleteMany({ where: { collegeId: params.id } });
    if (courses?.length) {
      await tx.course.createMany({
        data: courses.map((c: { name: string; duration: string; fees: number; seats: number }) => ({
          collegeId: params.id,
          name: c.name,
          duration: c.duration,
          fees: parseInt(String(c.fees)),
          seats: parseInt(String(c.seats)),
        })),
      });
    }

    if (placement) {
      await tx.placement.upsert({
        where: { collegeId: params.id },
        update: {
          averagePackage: parseFloat(placement.averagePackage),
          highestPackage: parseFloat(placement.highestPackage),
          placementRate: parseFloat(placement.placementRate),
          topRecruiters: placement.topRecruiters,
        },
        create: {
          collegeId: params.id,
          averagePackage: parseFloat(placement.averagePackage),
          highestPackage: parseFloat(placement.highestPackage),
          placementRate: parseFloat(placement.placementRate),
          topRecruiters: placement.topRecruiters,
        },
      });
    }
  });

  const updated = await prisma.college.findUnique({
    where: { id: params.id },
    include: { courses: true, placement: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.college.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
