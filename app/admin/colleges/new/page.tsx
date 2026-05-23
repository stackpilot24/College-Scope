import { requireAdmin } from '@/lib/admin';
import { CollegeForm } from '@/components/admin/CollegeForm';

export default async function NewCollegePage() {
  await requireAdmin();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New College</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new college to the database.</p>
      </div>
      <CollegeForm />
    </div>
  );
}
