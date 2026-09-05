import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import AdminLandingStream from './_components/AdminLandingStream';

export default function LandingControlsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminLandingStream />
    </Suspense>
  );
}
