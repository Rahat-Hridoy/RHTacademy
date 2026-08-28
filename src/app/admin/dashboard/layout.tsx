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

  // getUser() validates the session with the Supabase auth server (unlike getSession which
  // returns a potentially stale cached token). This is the secure pattern.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin');
  }

  // Strictly enforce admin role
  let isAdmin = user.user_metadata?.role === 'admin';
  
  if (!isAdmin) {
    // Fallback check in case metadata is not updated yet
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    redirect('/portal/dashboard'); // Redirect non-admins to their portal, or somewhere safe
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <AppSidebar userRole="admin" activeItem="Dashboard" />
      <main className="min-h-screen ml-0 lg:ml-64 px-5 py-6 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
