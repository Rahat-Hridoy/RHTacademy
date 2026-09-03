import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResourcesClient } from '@/components/portal/ResourcesClient';

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id: studentId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== studentId) redirect('/auth');

  const [foldersRes, resourcesRes] = await Promise.all([
    supabase
      .from('resource_folders')
      .select('id, name, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),

    supabase
      .from('resources')
      .select('id, folder_id, folder_name, subject, drive_link, thumbnail_url, note, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
  ]);

  return (
    <ResourcesClient
      folders={foldersRes.data ?? []}
      resources={resourcesRes.data ?? []}
    />
  );
}
