import React, { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import StudentResourcesStream from './_components/StudentResourcesStream';

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentResourcesStream studentId={studentId} />
    </Suspense>
  );
}
