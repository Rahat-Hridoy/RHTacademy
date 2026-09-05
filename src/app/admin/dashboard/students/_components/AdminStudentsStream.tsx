import { StudentManagement } from '@/components/admin/students/StudentManagement';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminStudentsStream() {
  const supabase = await createAdminClient();

  // Run all queries in parallel
  const [
    studentsRes,
    attendanceRes,
    foldersRes,
    resourcesRes,
    noticesRes,
    paymentCyclesRes
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*') // Keeping * since student profiles have many fields needed by StudentManagement
      .eq('is_approved', true)
      .neq('role', 'admin')
      .order('created_at', { ascending: false }),
    supabase.from('attendance').select('*'),
    supabase.from('resource_folders').select('*'),
    supabase.from('resources').select('*'),
    supabase.from('notices').select('*').order('created_at', { ascending: false }),
    supabase.from('payment_cycles').select('*').order('cycle_number', { ascending: false })
  ]);

  return (
    <StudentManagement 
      students={studentsRes.data || []} 
      attendance={attendanceRes.data || []}
      folders={foldersRes.data || []}
      resources={resourcesRes.data || []}
      notices={noticesRes.data || []}
      paymentCycles={paymentCyclesRes.data || []}
    />
  );
}
