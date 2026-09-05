import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/portal/DashboardClient';

export default async function DashboardStream({
  studentId,
}: {
  studentId: string;
}) {
  const supabase = await createClient();

  // Route is protected by middleware, so we can skip redundant getUser()
  // Fetch all dashboard data in parallel
  const [attendanceRes, noticesRes, cyclesRes] = await Promise.all([
    supabase
      .from('attendance')
      .select('date, class_type, completed')
      .eq('student_id', studentId)
      .order('date', { ascending: true }),

    supabase
      .from('notices')
      .select('id, title, content, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(20),

    supabase
      .from('payment_cycles')
      .select('id, cycle_number, payment_status, total_classes_count, cycle_class_limit, paid_at, alert_active')
      .eq('student_id', studentId)
      .order('cycle_number', { ascending: false }),
  ]);

  const attendance = attendanceRes.data ?? [];
  const notices = noticesRes.data ?? [];
  const cycles = cyclesRes.data ?? [];

  // Determine current/latest cycle for gauge + due alert
  const latestCycle = cycles[0] ?? null;
  const hasDueAlert = latestCycle?.payment_status === 'due' && (latestCycle?.alert_active ?? true);

  return (
    <DashboardClient
      studentId={studentId}
      attendance={attendance}
      notices={notices}
      latestCycle={latestCycle}
      hasDueAlert={hasDueAlert}
    />
  );
}
