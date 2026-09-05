import { Suspense } from 'react';
import RequestsStream from './_components/RequestsStream';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RequestsStream />
    </Suspense>
  );
}
