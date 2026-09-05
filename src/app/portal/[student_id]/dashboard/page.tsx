import React, { Suspense } from 'react';
import DashboardStream from './_components/DashboardStream';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardStream studentId={studentId} />
    </Suspense>
  );
}
