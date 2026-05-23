'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

interface CourseRow { name: string; duration: string; fees: string; seats: string }
interface PlacementData { averagePackage: string; highestPackage: string; placementRate: string; topRecruiters: string }

interface InitialData {
  id?: string; name?: string; slug?: string; city?: string; state?: string;
  type?: string; established?: number; feesMin?: number; feesMax?: number;
  overview?: string; image?: string; logo?: string;
  accreditation?: string[]; tags?: string[];
  rating?: number; reviewCount?: number;
  courses?: { name: string; duration: string; fees: number; seats: number }[];
  placement?: { averagePackage: number; highestPackage: number; placementRate: number; topRecruiters: string[] } | null;
}

export function CollegeForm({ initial, collegeId }: { initial?: InitialData; collegeId?: string }) {
  const router = useRouter();
  const isEdit = !!collegeId;

  const [basic, setBasic] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    type: initial?.type ?? 'Government',
    established: String(initial?.established ?? new Date().getFullYear()),
    feesMin: String(initial?.feesMin ?? ''),
    feesMax: String(initial?.feesMax ?? ''),
    overview: initial?.overview ?? '',
    image: initial?.image ?? '',
    logo: initial?.logo ?? '',
    accreditation: initial?.accreditation?.join(', ') ?? '',
    tags: initial?.tags?.join(', ') ?? '',
    rating: String(initial?.rating ?? '0'),
    reviewCount: String(initial?.reviewCount ?? '0'),
  });

  const [placement, setPlacement] = useState<PlacementData>({
    averagePackage: String(initial?.placement?.averagePackage ?? ''),
    highestPackage: String(initial?.placement?.highestPackage ?? ''),
    placementRate: String(initial?.placement?.placementRate ?? ''),
    topRecruiters: initial?.placement?.topRecruiters?.join(', ') ?? '',
  });

  const [courses, setCourses] = useState<CourseRow[]>(
    initial?.courses?.map((c) => ({ name: c.name, duration: c.duration, fees: String(c.fees), seats: String(c.seats) })) ??
    [{ name: '', duration: '4 Years', fees: '', seats: '' }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...basic,
      established: parseInt(basic.established),
      feesMin: parseInt(basic.feesMin),
      feesMax: parseInt(basic.feesMax),
      rating: parseFloat(basic.rating),
      reviewCount: parseInt(basic.reviewCount),
      accreditation: basic.accreditation.split(',').map((s) => s.trim()).filter(Boolean),
      tags: basic.tags.split(',').map((s) => s.trim()).filter(Boolean),
      courses: courses.filter((c) => c.name).map((c) => ({
        name: c.name, duration: c.duration, fees: parseInt(c.fees) || 0, seats: parseInt(c.seats) || 0,
      })),
      placement: {
        averagePackage: parseFloat(placement.averagePackage) || 0,
        highestPackage: parseFloat(placement.highestPackage) || 0,
        placementRate: parseFloat(placement.placementRate) || 0,
        topRecruiters: placement.topRecruiters.split(',').map((s) => s.trim()).filter(Boolean),
      },
    };

    const url = isEdit ? `/api/admin/colleges/${collegeId}` : '/api/admin/colleges';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? 'Failed to save.'); return; }
    router.push('/admin/colleges');
    router.refresh();
  };

  const addCourse = () => setCourses([...courses, { name: '', duration: '4 Years', fees: '', seats: '' }]);
  const removeCourse = (i: number) => setCourses(courses.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, key: keyof CourseRow, val: string) =>
    setCourses(courses.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));

  const field = (label: string, key: keyof typeof basic, type = 'text', rows?: number) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={basic[key]} onChange={(e) => setBasic({ ...basic, [key]: e.target.value })} className="input-base resize-none" />
      ) : (
        <input type={type} value={basic[key]} onChange={(e) => setBasic({ ...basic, [key]: e.target.value })} className="input-base" />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('College Name *', 'name')}
          {field('Slug (URL-safe) *', 'slug')}
          {field('City *', 'city')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input value={basic.state} onChange={(e) => setBasic({ ...basic, state: e.target.value })} className="input-base" placeholder="e.g. Maharashtra" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select value={basic.type} onChange={(e) => setBasic({ ...basic, type: e.target.value })} className="input-base">
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Deemed">Deemed</option>
            </select>
          </div>
          {field('Established Year', 'established', 'number')}
          {field('Min Fees (₹/year)', 'feesMin', 'number')}
          {field('Max Fees (₹/year)', 'feesMax', 'number')}
          {field('Rating (0–5)', 'rating', 'number')}
          {field('Review Count', 'reviewCount', 'number')}
        </div>
        {field('Overview / Description *', 'overview', 'text', 4)}
      </div>

      {/* Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base">Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Cover Image URL', 'image')}
          {field('Logo URL', 'logo')}
        </div>
      </div>

      {/* Tags & Accreditation */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base">Tags & Accreditation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input value={basic.accreditation} onChange={(e) => setBasic({ ...basic, accreditation: e.target.value })} className="input-base" placeholder="NAAC A++, NBA, NIRF Rank 3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input value={basic.tags} onChange={(e) => setBasic({ ...basic, tags: e.target.value })} className="input-base" placeholder="IIT, Government, Top 10" />
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-base">Courses</h2>
          <button type="button" onClick={addCourse} className="flex items-center gap-1.5 text-sm text-brand-secondary hover:underline">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
        <div className="space-y-3">
          {courses.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input placeholder="Course name" value={c.name} onChange={(e) => updateCourse(i, 'name', e.target.value)} className="input-base col-span-4 text-sm" />
              <input placeholder="Duration" value={c.duration} onChange={(e) => updateCourse(i, 'duration', e.target.value)} className="input-base col-span-2 text-sm" />
              <input placeholder="Fees (₹)" type="number" value={c.fees} onChange={(e) => updateCourse(i, 'fees', e.target.value)} className="input-base col-span-3 text-sm" />
              <input placeholder="Seats" type="number" value={c.seats} onChange={(e) => updateCourse(i, 'seats', e.target.value)} className="input-base col-span-2 text-sm" />
              <button type="button" onClick={() => removeCourse(i)} className="col-span-1 flex justify-center text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Placement */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 text-base">Placement Data</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['averagePackage', 'highestPackage', 'placementRate'] as const).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key === 'averagePackage' ? 'Avg Package (LPA)' : key === 'highestPackage' ? 'Highest Package (LPA)' : 'Placement Rate (%)'}
              </label>
              <input type="number" value={placement[key]} onChange={(e) => setPlacement({ ...placement, [key]: e.target.value })} className="input-base" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Top Recruiters <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input value={placement.topRecruiters} onChange={(e) => setPlacement({ ...placement, topRecruiters: e.target.value })} className="input-base" placeholder="Google, Microsoft, TCS" />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Saving...' : isEdit ? 'Update College' : 'Create College'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
