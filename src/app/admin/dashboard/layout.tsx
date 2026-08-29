import React from 'react';
import { AppSidebar } from '@/components/admin/AppSidebar';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserCircle } from 'lucide-react';

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

  const adminEmail = user.email || ' ';
  const adminName = user.user_metadata?.full_name || 'Administrator';

  // Query pending request counts across all 3 tables
  const [{ count: regCount }, { count: bookingCount }, { count: contactCount }] = await Promise.all([
    supabaseAdmin.from('registration_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('booking_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('contact_messages').select('*', { count: 'exact', head: true }).or('status.eq.pending,status.is.null'),
  ]);

  const hasPendingRequests = ((regCount || 0) + (bookingCount || 0) + (contactCount || 0)) > 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <AppSidebar userRole="admin" hasPendingRequests={hasPendingRequests} />
      <div className="ml-0 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar with Profile Badge in Top Right */}
        <header className="sticky top-0 z-30 flex items-center justify-end border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-2 py-1.5 shadow-sm sm:px-2 lg:px-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 shadow-sm transition hover:bg-slate-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white shadow-sm">
              <UserCircle size={20} className="text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight text-slate-900">{adminName}</span>
              <span className="text-[10px] font-medium leading-tight text-slate-500">{adminEmail}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}



