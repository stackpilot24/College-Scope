import { prisma } from './prisma';
import type { College, ReviewData, FilterState } from './types';
import { colleges as mockColleges } from './mockData';

// All 36 Indian states/UTs (static — used by FilterPanel client-side)
const INDIA_STATES = [
  'Andaman & Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra & Nagar Haveli',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

type DBCollege = {
  id: string; name: string; slug: string; city: string; state: string;
  type: string; established: number; rating: number; reviewCount: number;
  feesMin: number; feesMax: number; overview: string; image: string; logo: string;
  accreditation: string[]; tags: string[];
  courses: { id: string; name: string; duration: string; fees: number; seats: number }[];
  placement: { averagePackage: number; highestPackage: number; placementRate: number; topRecruiters: string[] } | null;
};

function mapCollege(c: DBCollege): College {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    location: { city: c.city, state: c.state },
    type: c.type as College['type'],
    established: c.established,
    rating: c.rating,
    reviewCount: c.reviewCount,
    fees: { min: c.feesMin, max: c.feesMax },
    courses: c.courses,
    placements: c.placement ?? { averagePackage: 0, highestPackage: 0, placementRate: 0, topRecruiters: [] },
    overview: c.overview,
    accreditation: c.accreditation,
    image: c.image,
    logo: c.logo,
    tags: c.tags,
  };
}

export async function getColleges(): Promise<College[]> {
  try {
    const rows = await prisma.college.findMany({
      include: { courses: true, placement: true },
      orderBy: { rating: 'desc' },
    });
    if (rows.length > 0) return rows.map(mapCollege);
  } catch { /* DB not ready — fall through */ }
  return [...mockColleges].sort((a, b) => b.rating - a.rating);
}

export async function getCollegeBySlug(slug: string): Promise<College | null> {
  try {
    const row = await prisma.college.findUnique({
      where: { slug },
      include: { courses: true, placement: true },
    });
    return row ? mapCollege(row) : null;
  } catch {
    return mockColleges.find((c) => c.slug === slug) ?? null;
  }
}

export async function getFeaturedColleges(limit = 6): Promise<College[]> {
  try {
    const rows = await prisma.college.findMany({
      include: { courses: true, placement: true },
      orderBy: { rating: 'desc' },
      take: limit,
    });
    if (rows.length > 0) return rows.map(mapCollege);
  } catch { /* fall through */ }
  return [...mockColleges].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export async function getReviewsByCollegeId(collegeId: string): Promise<ReviewData[]> {
  try {
    const rows = await prisma.review.findMany({
      where: { collegeId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({
      id: r.id,
      collegeId: r.collegeId,
      userId: r.userId,
      rating: r.rating,
      comment: r.comment,
      year: r.year,
      course: r.course,
      reviewerRole: r.reviewerRole,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
    }));
  } catch {
    return [];
  }
}

export function getAllStates(): string[] {
  return INDIA_STATES;
}
