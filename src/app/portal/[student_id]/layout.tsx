import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PortalShell } from '@/components/portal/PortalShell';

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;
  const supabase = await createClient();

  // Validate the authenticated user matches the requested student_id (security)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== studentId) {
    redirect('/auth');
  }

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, admin_custom_name, class, admin_custom_class, email, phone_number, institute, gender')
    .eq('id', studentId)
    .single();

  const displayName = profile?.admin_custom_name || profile?.full_name || 'Student';
  const displayClass = profile?.admin_custom_class || profile?.class || '';

  return (
    <PortalShell
      studentId={studentId}
      studentName={displayName}
      studentClass={displayClass}
      studentEmail={profile?.email ?? ''}
      studentPhone={profile?.phone_number ?? ''}
      studentInstitute={profile?.institute ?? ''}
      studentGender={(profile?.gender as 'male' | 'female') ?? 'male'}
    >
      {children}
    </PortalShell>
  );
}
