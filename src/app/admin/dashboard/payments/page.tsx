import { PaymentMethodsAdmin } from '@/components/admin/payments/PaymentMethodsAdmin';
import { createAdminClient } from '@/lib/supabase/server';

export default async function PaymentsPage() {
  const supabase = await createAdminClient();

  const { data: methods } = await supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <PaymentMethodsAdmin methods={methods || []} />
  );
}
