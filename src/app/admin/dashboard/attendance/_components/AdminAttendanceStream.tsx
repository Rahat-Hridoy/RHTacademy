import { AttendanceTracker } from '@/components/admin/attendance/AttendanceTracker';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminAttendanceStream() {
  const supabase = await createAdminClient();

  // Run independent queries in parallel
  const [studentsRes, attendanceRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, class, admin_custom_name, admin_custom_class')
      .eq('is_approved', true)
      .neq('role', 'admin')
      .order('created_at', { ascending: false }),
    supabase
      .from('attendance')
      .select('id, student_id, date, class_type, completed')
  ]);

  return (
    <AttendanceTracker 
      students={studentsRes.data || []} 
      attendance={attendanceRes.data || []} 
    />
  );
}
