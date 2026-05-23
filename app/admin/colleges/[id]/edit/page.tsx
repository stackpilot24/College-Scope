import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CollegeForm } from '@/components/admin/CollegeForm';

export const dynamic = 'force-dynamic';

export default async function EditCollegePage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const college = await prisma.college.findUnique({
    where: { id: params.id },
    include: { courses: true, placement: true },
  });
  if (!college) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit College</h1>
        <p className="text-sm text-gray-500 mt-1">{college.name}</p>
      </div>
      <CollegeForm
        collegeId={college.id}
        initial={{
          ...college,
          type: college.type as string,
          courses: college.courses,
          placement: college.placement,
        }}
      />
    </div>
  );
}
