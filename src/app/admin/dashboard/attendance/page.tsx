import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import AdminAttendanceStream from './_components/AdminAttendanceStream';

export default function AttendancePage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminAttendanceStream />
    </Suspense>
  );
}
