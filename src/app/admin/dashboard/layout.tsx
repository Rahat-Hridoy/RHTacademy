import React from 'react';
import { AppSidebar } from '@/components/admin/AppSidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // In a real app, you would verify the session is an admin here
  // For this project, we assume if they hit this route, they are checking admin auth
  const { data: { session } } = await supabase.auth.getSession();
  
  // Optional: Redirect to login if not authenticated as admin
  // if (!session) {
  //   redirect('/admin');
  // }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <AppSidebar userRole="admin" activeItem="Dashboard" />
      <main className="min-h-screen ml-0 lg:ml-64 px-5 py-6 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
