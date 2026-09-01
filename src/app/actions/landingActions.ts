"use server";

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAboutMe(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  
  // Column names match the actual DB schema: name, description, about_me_photo
  const description = formData.get('description') as string;
  const name = formData.get('name') as string;
  const degree = formData.get('degree') as string;
  const institute = formData.get('institute') as string;
  const about_me_photo = formData.get('about_me_photo') as string;

  const { error } = await supabase
    .from('about_me')
    .update({ description, name, degree, institute, about_me_photo })
    .eq('id', id);

  if (error) return { error: 'Failed to update About Me' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function uploadAboutMePhoto(formData: FormData) {
  const supabase = await createAdminClient();
  const file = formData.get('file') as File;
  const oldPhotoUrl = formData.get('old_photo_url') as string | null;

  if (!file || file.size === 0) return { error: 'No file provided' };

  // ── Delete the previous file from storage (if one exists) ──────────
  if (oldPhotoUrl) {
    try {
      // Extract the file path after "/object/public/about-me-photos/"
      const marker = '/object/public/about-me-photos/';
      const markerIndex = oldPhotoUrl.indexOf(marker);
      if (markerIndex !== -1) {
        const oldFilePath = decodeURIComponent(
          oldPhotoUrl.slice(markerIndex + marker.length).split('?')[0]
        );
        // Ignore errors — the file might already be gone
        await supabase.storage.from('about-me-photos').remove([oldFilePath]);
      }
    } catch {
      // Non-fatal: continue with the upload even if delete fails
    }
  }
  // ──────────────────────────────────────────────────────────────────

  const fileExt = file.name.split('.').pop();
  const fileName = `about-me-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('about-me-photos')
    .upload(fileName, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

  const { data } = supabase.storage
    .from('about-me-photos')
    .getPublicUrl(fileName);

  return { success: true, publicUrl: data.publicUrl };
}

export async function addServiceCard(title: string, badge: string, description: string, subjects: string[]) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('service_cards')
    .insert([{ title, badge, description, subjects }])
    .select()
    .single();

  if (error) return { error: 'Failed to add Service Card' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true, data };
}

export async function updateServiceCard(id: string, title: string, badge: string, description: string, subjects: string[]) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('service_cards')
    .update({ title, badge, description, subjects })
    .eq('id', id);

  if (error) return { error: 'Failed to update Service Card' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function deleteServiceCard(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('service_cards')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete Service Card' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function updateAvailableSeats(available_seats: number) {
  const supabase = await createAdminClient();
  
  // Try to update the first row, or insert if none exists
  const { data: existing } = await supabase.from('booking_settings').select('id').limit(1);
  let error;
  if (existing && existing.length > 0) {
    const res = await supabase
      .from('booking_settings')
      .update({ available_seats })
      .eq('id', existing[0].id);
    error = res.error;
  } else {
    const res = await supabase
      .from('booking_settings')
      .insert([{ available_seats }]);
    error = res.error;
  }

  if (error) return { error: 'Failed to update Available Seats' };
  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}

export async function saveBookingSlots(slots: { id?: string; day_text: string; time_text: string }[]) {
  const supabase = await createAdminClient();
  
  // First, clear all existing slots (simple overwrite strategy)
  const { error: deleteError } = await supabase.from('booking_time_slots').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) return { error: 'Failed to clear old Booking Slots' };

  if (slots.length > 0) {
    const { error: insertError } = await supabase
      .from('booking_time_slots')
      .insert(slots.map(s => ({ day_text: s.day_text, time_text: s.time_text })));
      
    if (insertError) return { error: 'Failed to save Booking Slots' };
  }

  revalidatePath('/admin/dashboard/landing');
  revalidatePath('/');
  return { success: true };
}
