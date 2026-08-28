import { StudentManagement } from '@/components/admin/students/StudentManagement';
import { createAdminClient } from '@/lib/supabase/server';

export default async function StudentsPage() {
  const supabase = await createAdminClient();

  // Fetch approved students
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  // Pre-fetch related data for these students to pass to the client component
  // (In a highly scalable app, you'd fetch this data on-demand per student tab, 
  // but since we want it fast and simple for now, we'll pass it down)
  const { data: attendance } = await supabase.from('attendance').select('*');
  const { data: folders } = await supabase.from('resource_folders').select('*');
  const { data: resources } = await supabase.from('resources').select('*');
  const { data: notices } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
  const { data: paymentCycles } = await supabase.from('payment_cycles').select('*').order('cycle_number', { ascending: false });

  return (
    <StudentManagement 
      students={students || []} 
      attendance={attendance || []}
      folders={folders || []}
      resources={resources || []}
      notices={notices || []}
      paymentCycles={paymentCycles || []}
    />
  );
}
