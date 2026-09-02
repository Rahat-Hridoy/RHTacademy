"use server";

import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitBookingRequest(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const class_time = formData.get('class_time') as string;
  const service_type = formData.get('kind') as string;
  const subjects = JSON.parse(formData.get('subjects') as string || '[]');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rhtacademy.com';

  if (!name || !email || !phone || !class_time) {
    return { error: 'All fields are required' };
  }

  // Check if email already has pending/contacted booking
  const { data: existingBooking } = await supabase
    .from('booking_requests')
    .select('id')
    .eq('email', email)
    .in('status', ['pending', 'contacted'])
    .single();

  if (existingBooking) {
    return { error: 'The email is already booked a schedule' };
  }

  // Insert the booking
  const { error: insertError } = await supabase
    .from('booking_requests')
    .insert({
      name,
      email,
      phone,
      selected_subject: subjects.join(', '),
      class_time,
      service_type,
      status: 'pending'
    });

  if (insertError) {
    return { error: 'Failed to submit booking request' };
  }

  // Decrease available seat
  const { data: scheduleData } = await supabase
    .from('schedule_booking')
    .select('id, available_seat')
    .limit(1)
    .single();

  if (scheduleData && scheduleData.available_seat > 0) {
    await supabase
      .from('schedule_booking')
      .update({ available_seat: scheduleData.available_seat - 1 })
      .eq('id', scheduleData.id);
  }

  // Send email to admin
  try {
    await resend.emails.send({
      from: 'RHTacademy <noreply@rhtacademy.com>',
      to: adminEmail,
      subject: 'New Booking Request',
      html: `
        <h3>New Booking Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subjects:</strong> ${subjects.join(', ')}</p>
        <p><strong>Time:</strong> ${class_time}</p>
      `
    });
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
    // Even if email fails, the booking was successful
  }

  return { success: true };
}

export async function submitContactMessage(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'All fields are required' };
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message });

  if (error) {
    return { error: 'Failed to submit message' };
  }

  return { success: true };
}
