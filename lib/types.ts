export interface College {
  id: string;
  name: string;
  slug: string;
  location: {
    city: string;
    state: string;
  };
  type: 'Government' | 'Private' | 'Deemed';
  established: number;
  rating: number;
  reviewCount: number;
  fees: {
    min: number;
    max: number;
  };
  courses: Course[];
  placements: Placement;
  overview: string;
  accreditation: string[];
  image: string;
  logo: string;
  tags: string[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
}

export interface Placement {
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface Review {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  comment: string;
  year: number;
  course: string;
}

export interface ReviewData {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  comment: string;
  year: number;
  course: string;
  reviewerRole: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

export interface FilterState {
  search: string;
  location: string;
  type: string;
  minRating: number;
  maxFees: number;
  sortBy: 'rating' | 'fees_low' | 'fees_high' | 'name';
}
