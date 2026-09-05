import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import AdminPaymentsStream from './_components/AdminPaymentsStream';

export default function PaymentsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminPaymentsStream />
    </Suspense>
  );
}
