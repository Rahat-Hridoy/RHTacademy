import React, { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import StudentPaymentStream from './_components/StudentPaymentStream';

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentPaymentStream studentId={studentId} />
    </Suspense>
  );
}
