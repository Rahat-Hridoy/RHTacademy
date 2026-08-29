import React from 'react';
import { AppSidebar } from '@/components/admin/AppSidebar';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const supabaseAdmin = await createAdminClient();

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

  // Query pending request counts across all 3 tables
  const [{ count: regCount }, { count: bookingCount }, { count: contactCount }] = await Promise.all([
    supabaseAdmin.from('registration_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('booking_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }).or('status.eq.pending,status.is.null'),
  ]);

  const hasPendingRequests = ((regCount || 0) + (bookingCount || 0) + (contactCount || 0)) > 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <AppSidebar userRole="admin" activeItem="Dashboard" hasPendingRequests={hasPendingRequests} />
      <main className="min-h-screen ml-0 lg:ml-64 px-5 py-6 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}

