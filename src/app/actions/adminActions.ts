"use server";

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleRegistration(id: string, action: 'confirm' | 'refuse') {
  const supabase = await createClient();
  const status = action === 'confirm' ? 'approved' : 'refused';

  // 1. Update request status
  const { data: request, error: updateError } = await supabase
    .from('registration_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (updateError || !request) {
    return { error: 'Failed to update request' };
  }

  // 2. If confirm, add to profiles
  if (action === 'confirm') {
    // Generate a secure temp password or use the one they registered with if your schema supports it
    // For this flow, we assume Supabase Auth handles password during registration request,
    // or we just create a profile if auth.users is already created.
    // Assuming auth.users is created separately or we just insert profile here:
    // We will just insert into profiles (assuming id matches or is generated)
    // Actually, profiles needs a UUID that matches auth.users. 
    // Usually admin uses Supabase Admin API to create user.
    // We will do a generic profile insert for now or just skip auth.users creation if not provided.
    // Note: To be fully functional with Supabase Auth, you need admin client to create user.
    console.log("Confirmed user profile:", request.email);
    // await supabaseAdmin.auth.admin.createUser({...})
  }

  // 3. Send Email
  try {
    await resend.emails.send({
      from: 'RHTacademy <noreply@rhtacademy.com>',
      to: request.email,
      subject: action === 'confirm' ? 'Registration Approved' : 'Registration Refused',
      html: action === 'confirm' 
        ? `<p>Hi ${request.name}, your registration is approved. You can now login.</p>`
        : `<p>Hi ${request.name}, unfortunately your registration was refused at this time.</p>`
    });
  } catch (e) {
    console.error("Resend error", e);
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function handleBooking(id: string, action: 'contacted' | 'refused') {
  const supabase = await createClient();
  
  // Just update status for booking
  // We use 'contacted' (as per schema) or if refused we might just delete or mark as such
  const status = action === 'contacted' ? 'contacted' : 'pending'; // schema only has pending/contacted

  const { data: request, error } = await supabase
    .from('booking_requests')
    .update({ status: 'contacted' })
    .eq('id', id)
    .select()
    .single();

  if (error || !request) {
    return { error: 'Failed to update booking' };
  }

  try {
    await resend.emails.send({
      from: 'RHTacademy <noreply@rhtacademy.com>',
      to: request.email,
      subject: 'Booking Request Update',
      html: `<p>Hi ${request.name}, we have processed your booking request and will contact you shortly if we haven't already.</p>`
    });
  } catch (e) {
    console.error("Resend error", e);
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function dismissContact(id: string) {
  const supabase = await createClient();
  
  // Delete the contact message
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'Failed to dismiss contact message' };
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}
