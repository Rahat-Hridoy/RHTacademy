import { AttendanceTracker } from '@/components/admin/attendance/AttendanceTracker';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AttendancePage() {
  const supabase = await createAdminClient();

  const { data: students } = await supabase
    .from('profiles')
    .select('id, full_name, class, admin_custom_name, admin_custom_class')
    .eq('is_approved', true)
    .neq('role', 'admin')
    .order('created_at', { ascending: false });

  const { data: attendance } = await supabase
    .from('attendance')
    .select('*');

  return (
    <AttendanceTracker 
      students={students || []} 
      attendance={attendance || []} 
    />
  );
}
