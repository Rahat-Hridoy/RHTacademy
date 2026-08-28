"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// PROFILE TAB
export async function updateStudentProfile(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const customName = formData.get('customName') as string;
  const customClass = formData.get('customClass') as string;
  const customInstitute = formData.get('customInstitute') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      admin_custom_name: customName || null,
      admin_custom_class: customClass || null,
      admin_custom_institute: customInstitute || null,
    })
    .eq('id', id);

  if (error) return { error: 'Failed to update profile' };
  
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ATTENDANCE TAB
export async function markStudentAttendance(studentId: string, date: string, type: 'onsite' | 'online' | 'absent') {
  const supabase = await createClient();
  
  // Upsert attendance for the date
  // Since absent isn't in schema ['onsite', 'online'], we might just delete or store completed=false
  // If absent, we can set completed = false and class_type = null or keep it onsite/online but completed=false
  const isCompleted = type !== 'absent';
  const classType = type === 'absent' ? 'onsite' : type; 

  const { error } = await supabase
    .from('attendance')
    .upsert({
      student_id: studentId,
      date,
      class_type: classType,
      completed: isCompleted
    }, { onConflict: 'student_id, date' });

  if (error) return { error: 'Failed to mark attendance' };

  revalidatePath('/admin/dashboard/students');
  revalidatePath('/admin/dashboard/attendance');
  return { success: true };
}

// RESOURCE SHARE TAB
export async function createResourceFolder(studentId: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('resource_folders')
    .insert({ student_id: studentId, name });

  if (error) return { error: 'Failed to create folder' };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function addResource(studentId: string, folderId: string, folderName: string, formData: FormData) {
  const supabase = await createClient();
  
  const subject = formData.get('subject') as string;
  const drive_link = formData.get('drive_link') as string;
  const thumbnail_url = formData.get('thumbnail_url') as string;
  const note = formData.get('note') as string;

  const { error } = await supabase
    .from('resources')
    .insert({
      student_id: studentId,
      folder_id: folderId,
      folder_name: folderName,
      subject,
      drive_link,
      thumbnail_url,
      note
    });

  if (error) return { error: 'Failed to add resource' };
  
  // Create notification for student
  await supabase.from('notifications').insert({
    student_id: studentId,
    title: 'New Resource Added',
    message: `A new resource has been added to ${folderName}`
  });

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// SENT NOTICE TAB
export async function sendNotice(studentId: string, title: string, content: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notices')
    .insert({ student_id: studentId, title, content });

  if (error) return { error: 'Failed to send notice' };
  
  await supabase.from('notifications').insert({
    student_id: studentId,
    title: 'New Notice',
    message: title
  });

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteNotice(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete notice' };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// PAYMENT TAB
export async function updatePaymentCycleStatus(cycleId: string, status: 'due' | 'completed') {
  const supabase = await createClient();
  const { error } = await supabase
    .from('payment_cycles')
    .update({ 
      payment_status: status,
      paid_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', cycleId);

  if (error) return { error: 'Failed to update payment status' };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function togglePaymentAlert(studentId: string, isAlertEnabled: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ due_payment_alert: isAlertEnabled })
    .eq('id', studentId);

  if (error) return { error: 'Failed to toggle alert' };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ACTION TAB
export async function setAccountStatus(id: string, status: 'active' | 'paused') {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ account_status: status })
    .eq('id', id);

  if (error) return { error: 'Failed to update account status' };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteStudentAccount(id: string) {
  const supabase = await createClient();
  // Cascading deletes should handle the rest if set up in DB
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete account' };
  
  // Note: To completely delete auth.users, you'd need admin client. 
  // For this scope, deleting the profile is sufficient if foreign keys cascade.

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}
