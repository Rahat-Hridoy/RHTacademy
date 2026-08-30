"use server";

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// PROFILE TAB
export async function updateStudentProfile(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  
  const fullName = formData.get('fullName') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const studentClass = formData.get('class') as string;
  const institute = formData.get('institute') as string;

  const customName = formData.get('customName') as string;
  const customClass = formData.get('customClass') as string;
  const customInstitute = formData.get('customInstitute') as string;

  const updateData: Record<string, any> = {
    full_name: fullName,
    phone_number: phoneNumber || null,
    class: studentClass || null,
    institute: institute || null,
    admin_custom_name: customName || null,
    admin_custom_class: customClass || null,
    admin_custom_institute: customInstitute || null,
  };

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error("updateStudentProfile error:", error);
    return { error: 'Failed to update profile: ' + error.message };
  }
  
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ATTENDANCE TAB
export async function markStudentAttendance(studentId: string, date: string, type: 'onsite' | 'online' | 'absent') {
  const supabase = await createAdminClient();
  
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

  if (error) return { error: 'Failed to mark attendance: ' + error.message };

  revalidatePath('/admin/dashboard/students');
  revalidatePath('/admin/dashboard/attendance');
  return { success: true };
}

export async function deleteStudentAttendance(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete attendance record: ' + error.message };

  revalidatePath('/admin/dashboard/students');
  revalidatePath('/admin/dashboard/attendance');
  return { success: true };
}

// RESOURCE SHARE TAB
export async function createResourceFolder(studentId: string, name: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('resource_folders')
    .insert({ student_id: studentId, name });

  if (error) return { error: 'Failed to create folder: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteResourceFolder(folderId: string) {
  const supabase = await createAdminClient();
  // Delete resources in folder first
  await supabase.from('resources').delete().eq('folder_id', folderId);

  const { error } = await supabase
    .from('resource_folders')
    .delete()
    .eq('id', folderId);

  if (error) return { error: 'Failed to delete folder: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function addResource(studentId: string, folderId: string, folderName: string, formData: FormData) {
  const supabase = await createAdminClient();
  
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
      thumbnail_url: thumbnail_url || null,
      note: note || null
    });

  if (error) return { error: 'Failed to add resource: ' + error.message };
  
  // Create notification for student
  await supabase.from('notifications').insert({
    student_id: studentId,
    title: 'New Resource Added',
    message: `A new resource has been added to ${folderName}`
  });

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteResource(resourceId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId);

  if (error) return { error: 'Failed to delete resource: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// SENT NOTICE TAB
export async function sendNotice(studentId: string, title: string, content: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('notices')
    .insert({ student_id: studentId, title, content });

  if (error) return { error: 'Failed to send notice: ' + error.message };
  
  await supabase.from('notifications').insert({
    student_id: studentId,
    title: 'New Notice',
    message: title
  });

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteNotice(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('notices')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete notice: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// PAYMENT TAB
export async function addPaymentCycle(
  studentId: string, 
  cycleNumber: number, 
  totalClassesCount: number, 
  cycleClassLimit: number, 
  status: 'due' | 'completed'
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('payment_cycles')
    .insert({
      student_id: studentId,
      cycle_number: cycleNumber,
      total_classes_count: totalClassesCount,
      cycle_class_limit: cycleClassLimit,
      payment_status: status,
      paid_at: status === 'completed' ? new Date().toISOString() : null
    });

  if (error) return { error: 'Failed to add payment cycle: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function updatePaymentCycle(
  cycleId: string, 
  cycleNumber: number, 
  totalClassesCount: number, 
  cycleClassLimit: number, 
  status: 'due' | 'completed'
) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('payment_cycles')
    .update({
      cycle_number: cycleNumber,
      total_classes_count: totalClassesCount,
      cycle_class_limit: cycleClassLimit,
      payment_status: status,
      paid_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', cycleId);

  if (error) return { error: 'Failed to update payment cycle: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function updatePaymentCycleStatus(cycleId: string, status: 'due' | 'completed') {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('payment_cycles')
    .update({ 
      payment_status: status,
      paid_at: status === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', cycleId);

  if (error) return { error: 'Failed to update payment status: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deletePaymentCycle(cycleId: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('payment_cycles')
    .delete()
    .eq('id', cycleId);

  if (error) return { error: 'Failed to delete payment cycle: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function togglePaymentAlert(studentId: string, isAlertEnabled: boolean) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ due_payment_alert: isAlertEnabled })
    .eq('id', studentId);

  if (error) return { error: 'Failed to toggle alert: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ACTION TAB
export async function setAccountStatus(id: string, status: 'active' | 'paused') {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ account_status: status })
    .eq('id', id);

  if (error) return { error: 'Failed to update account status: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

export async function deleteStudentAccount(id: string) {
  const supabase = await createAdminClient();
  
  // 1. Delete from auth.users (if user exists)
  try {
    await supabase.auth.admin.deleteUser(id);
  } catch (authErr) {
    console.warn("Auth user deletion warning:", authErr);
  }

  // 2. Delete profile record (cascade deletes attendance, resources, notices, cycles via FK)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete profile: ' + error.message };

  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ─── ADMIN VIEW OVERRIDES ONLY ───────────────────────────────────────────────
// Separate from updateStudentProfile so submitting overrides never nulls
// the student's original full_name / class / institute fields.
export async function updateStudentAdminOverrides(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const customName = (formData.get('customName') as string)?.trim() || null;
  const customClass = (formData.get('customClass') as string)?.trim() || null;
  const customInstitute = (formData.get('customInstitute') as string)?.trim() || null;

  const { error } = await supabase
    .from('profiles')
    .update({
      admin_custom_name: customName,
      admin_custom_class: customClass,
      admin_custom_institute: customInstitute,
    })
    .eq('id', id);

  if (error) return { error: 'Failed to save admin overrides: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ─── SCHEDULE TIME ────────────────────────────────────────────────────────────
// Saves the student's recurring class time (e.g. "16:30") to profiles.schedule_time.
export async function saveStudentScheduleTime(studentId: string, scheduleTime: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ schedule_time: scheduleTime })
    .eq('id', studentId);

  if (error) return { error: 'Failed to save schedule time: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

// ─── PAYMENT CYCLE CONFIG ─────────────────────────────────────────────────────
// Updates the per-student default class limit per payment cycle (8 or 12).
// Column in profiles table: cycle_class_limit
export async function updateStudentCycleConfig(studentId: string, cycleLimit: number) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ cycle_class_limit: cycleLimit })
    .eq('id', studentId);

  if (error) return { error: 'Failed to update cycle config: ' + error.message };
  revalidatePath('/admin/dashboard/students');
  return { success: true };
}

