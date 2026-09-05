import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import AdminStudentsStream from './_components/AdminStudentsStream';

export default function StudentsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminStudentsStream />
    </Suspense>
  );
}
