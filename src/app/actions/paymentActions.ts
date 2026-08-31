"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertPaymentMethod(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('id') as string | null;
  const type = formData.get('type') as 'bank' | 'mfs';
  const name = formData.get('name') as string;
  const account_name = formData.get('account_name') as string;
  const account_number = formData.get('account_number') as string;
  
  // Optional fields for bank
  const branch_name = formData.get('branch_name') as string || null;
  const swift_code = formData.get('swift_code') as string || null;
  const routing_number = formData.get('routing_number') as string || null;
  
  const icon = formData.get('icon') as string || null;

  const dataToUpsert = {
    type,
    name,
    account_name,
    account_number,
    branch_name,
    swift_code,
    routing_number,
    icon
  };

  let error;

  if (id) {
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update(dataToUpsert)
      .eq('id', id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert(dataToUpsert);
    error = insertError;
  }

  if (error) {
    console.error("Payment method error", error);
    return { error: error.message || error.details || 'Failed to save payment method' };
  }

  revalidatePath('/admin/dashboard/payments');
  return { success: true };
}

export async function deletePaymentMethod(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('payment_methods').delete().eq('id', id);
  if (error) return { error: 'Failed to delete payment method' };
  revalidatePath('/admin/dashboard/payments');
  return { success: true };
}
