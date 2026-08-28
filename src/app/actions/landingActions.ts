"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAboutMe(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const content = formData.get('content') as string;
  const admin_name = formData.get('admin_name') as string;
  const degree = formData.get('degree') as string;
  const institute = formData.get('institute') as string;
  const photo_url = formData.get('photo_url') as string;

  const { error } = await supabase
    .from('about_me')
    .update({ content, admin_name, degree, institute, photo_url })
    .eq('id', id);

  if (error) return { error: 'Failed to update About Me' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function updateBookingCard(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get('title') as string;
  const short_description = formData.get('short_description') as string;
  const price = parseFloat(formData.get('price') as string);
  const badge_text = formData.get('badge_text') as string;
  
  // Note: features are stored as text[] in Supabase, we can parse it from a newline separated string
  const featuresStr = formData.get('features') as string;
  const features = featuresStr.split('\n').map(f => f.trim()).filter(f => f.length > 0);

  const { error } = await supabase
    .from('booking_cards')
    .update({ title, short_description, price, badge_text, features })
    .eq('id', id);

  if (error) return { error: 'Failed to update Booking Card' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function updateSchedule(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const day_of_week = formData.get('day_of_week') as string;
  const start_time = formData.get('start_time') as string;
  const end_time = formData.get('end_time') as string;
  const is_available = formData.get('is_available') === 'on';

  const { error } = await supabase
    .from('schedule_booking')
    .update({ day_of_week, start_time, end_time, is_available })
    .eq('id', id);

  if (error) return { error: 'Failed to update Schedule' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}
