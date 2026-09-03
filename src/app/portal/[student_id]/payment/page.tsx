import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PaymentClient } from '@/components/portal/PaymentClient';

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== studentId) redirect('/auth');

  const [cyclesRes, attendanceRes, paymentConfigRes] = await Promise.all([
    supabase
      .from('payment_cycles')
      .select('id, cycle_number, payment_status, total_classes_count, cycle_class_limit, paid_at, alert_active, created_at')
      .eq('student_id', studentId)
      .order('cycle_number', { ascending: false }),

    supabase
      .from('attendance')
      .select('date, class_type, completed')
      .eq('student_id', studentId)
      .eq('completed', true)
      .order('date', { ascending: false }),

    // Fetch global payment config from settings table
    supabase
      .from('payment_config')
      .select('bank_account_name, bank_name, account_number, branch, swift_code, routing, bkash_number, nagad_number, rocket_number, taptap_number')
      .maybeSingle(),
  ]);

  return (
    <PaymentClient
      cycles={cyclesRes.data ?? []}
      attendance={attendanceRes.data ?? []}
      paymentConfig={paymentConfigRes.data}
    />
  );
}
