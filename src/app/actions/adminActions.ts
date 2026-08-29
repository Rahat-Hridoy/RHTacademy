"use server";

import { createAdminClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleRegistration(id: string, action: 'confirm' | 'refuse') {
  try {
    const supabaseAdmin = await createAdminClient();
    const status = action === 'confirm' ? 'approved' : 'refused';

    // 1. Update registration request status
    const { data: request, error: updateError } = await supabaseAdmin
      .from('registration_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (updateError || !request) {
      console.error("Failed to update registration request:", updateError);
      return { error: updateError?.message || 'Failed to update registration request' };
    }

    // 2. If confirm, create/approve user profile
    if (action === 'confirm') {
      try {
        // Check if user already exists in auth.users by email
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        let userId: string | null = null;

        if (!listError && usersData?.users) {
          const existingUser = usersData.users.find(u => u.email?.toLowerCase() === request.email.toLowerCase());
          if (existingUser) {
            userId = existingUser.id;
          }
        }

        // If not found, create new auth user with temp password or stored password
        if (!userId) {
          const userPassword = request.password || 'Student@12345';
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: request.email,
            password: userPassword,
            email_confirm: true,
            user_metadata: {
              role: 'student',
              is_approved: true,
              full_name: request.name
            }
          });

          if (createError) {
            console.error("Auth user creation warning:", createError);
          } else if (newUser?.user) {
            userId = newUser.user.id;
          }
        } else {
          // Update metadata if user exists
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { role: 'student', is_approved: true }
          });
        }

        // Upsert into profiles table if userId is present
        if (userId) {
          const baseUsername = request.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
          const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: userId,
              username: username,
              email: request.email,
              phone_number: request.phone || null,
              full_name: request.name,
              class: request.class || null,
              gender: request.gender || null,
              institute: request.institute || null,
              is_approved: true,
              account_status: 'active'
            }, { onConflict: 'id' });

          if (profileError) {
            console.error("Profile upsert error:", profileError);
          }
        }
      } catch (profileErr) {
        console.error("Error creating student profile on confirm:", profileErr);
      }
    }

    // 3. Send email notification
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'RHTacademy <noreply@rhtacademy.com>',
          to: request.email,
          subject: action === 'confirm' ? 'Registration Approved - RHTacademy' : 'Registration Status Update - RHTacademy',
          html: action === 'confirm' 
            ? `<p>Hi <strong>${request.name}</strong>,</p><p>Congratulations! Your registration for RHTacademy has been approved. You can now log into your student dashboard.</p>`
            : `<p>Hi <strong>${request.name}</strong>,</p><p>Thank you for your interest in RHTacademy. Unfortunately, your registration request could not be approved at this time.</p>`
        });
      }
    } catch (emailErr) {
      console.error("Resend notification email warning:", emailErr);
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("handleRegistration error:", err);
    return { error: err.message || 'An unexpected error occurred during registration update' };
  }
}

export async function handleBooking(id: string, action: 'confirm' | 'refuse' | 'contacted') {
  try {
    const supabaseAdmin = await createAdminClient();
    const status = action === 'confirm' ? 'confirmed' : action === 'refuse' ? 'refused' : 'contacted';

    // Update booking_requests status
    let { data: request, error } = await supabaseAdmin
      .from('booking_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    // Fallback if status constraint restricts values to pending/contacted
    if (error) {
      console.warn("Retrying booking update with fallback status 'contacted':", error.message);
      const fallbackStatus = action === 'refuse' ? 'contacted' : 'contacted';
      const fallbackRes = await supabaseAdmin
        .from('booking_requests')
        .update({ status: fallbackStatus })
        .eq('id', id)
        .select()
        .single();
      
      request = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error || !request) {
      console.error("Failed to update booking request:", error);
      return { error: error?.message || 'Failed to update booking request' };
    }

    // Send email notification
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'RHTacademy <noreply@rhtacademy.com>',
          to: request.email,
          subject: 'Booking Request Update - RHTacademy',
          html: `<p>Hi <strong>${request.name}</strong>,</p><p>Your booking request for <strong>${request.selected_subject || 'class'}</strong> (${request.class_time || 'scheduled time'}) has been updated to: <strong>${status}</strong>.</p>`
        });
      }
    } catch (emailErr) {
      console.error("Resend booking email warning:", emailErr);
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("handleBooking error:", err);
    return { error: err.message || 'An unexpected error occurred while updating booking' };
  }
}

export async function markContactSeen(id: string) {
  try {
    const supabaseAdmin = await createAdminClient();
    
    // Try updating status column to 'seen' if column exists
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .update({ status: 'seen' })
      .eq('id', id);

    if (error) {
      console.warn("markContactSeen info:", error.message);
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("markContactSeen error:", err);
    return { error: err.message || 'Failed to mark contact as seen' };
  }
}

export async function handleContactReply(id: string, replyMessage: string) {
  try {
    if (!replyMessage || !replyMessage.trim()) {
      return { error: 'Reply message cannot be empty' };
    }

    const supabaseAdmin = await createAdminClient();

    // 1. Fetch contact message
    const { data: contact, error: fetchErr } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !contact) {
      return { error: 'Contact message not found' };
    }

    // 2. Send Email reply
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: 'RHTacademy <noreply@rhtacademy.com>',
          to: contact.email,
          subject: 'Response to your message - RHTacademy',
          html: `<p>Hi <strong>${contact.name}</strong>,</p><p>${replyMessage.replace(/\n/g, '<br/>')}</p><hr/><p style="color:#666;font-size:12px;">Original Message:<br/>"${contact.message}"</p>`
        });
      }
    } catch (emailErr: any) {
      console.error("Failed to send reply email:", emailErr);
      return { error: emailErr.message || 'Failed to send reply email' };
    }

    // 3. Update status in database to 'replied'
    const { error: updateErr } = await supabaseAdmin
      .from('contact_messages')
      .update({ status: 'replied' })
      .eq('id', id);

    if (updateErr) {
      console.warn("Updating status to replied warning:", updateErr.message);
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("handleContactReply error:", err);
    return { error: err.message || 'An unexpected error occurred while replying to contact message' };
  }
}

export async function dismissContact(id: string) {
  try {
    const supabaseAdmin = await createAdminClient();

    // Try updating status to 'dismissed' first
    const { error: updateErr } = await supabaseAdmin
      .from('contact_messages')
      .update({ status: 'dismissed' })
      .eq('id', id);

    if (updateErr) {
      // If status column doesn't support update, delete record
      const { error: deleteErr } = await supabaseAdmin
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (deleteErr) {
        return { error: deleteErr.message };
      }
    }

    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error("dismissContact error:", err);
    return { error: err.message || 'Failed to dismiss contact message' };
  }
}

