import { PaymentMethodsAdmin } from '@/components/admin/payments/PaymentMethodsAdmin';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminPaymentsStream() {
  const supabase = await createAdminClient();

  const { data: methods } = await supabase
    .from('payment_methods')
    .select('id, method_type, details, is_active, created_at')
    .order('created_at', { ascending: true });

  return (
    <PaymentMethodsAdmin methods={methods || []} />
  );
}
