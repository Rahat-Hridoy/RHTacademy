'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CheckSquare, ClipboardCheck, CreditCard, Folder, Home, LogOut, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MaleAvatar } from './MaleAvatar';

interface AppSidebarProps {
  studentId: string;
  studentName: string;
  studentClass: string;
  studentGender: 'male' | 'female';
}

export const AppSidebar = ({ studentId, studentName, studentClass, studentGender }: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const studentLinks = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, path: `/portal/${studentId}/dashboard` },
    { id: 'resources', name: 'Resources', icon: Folder, path: `/portal/${studentId}/resources` },
    { id: 'payments', name: 'Payment', icon: CreditCard, path: `/portal/${studentId}/payment` },
    { id: 'progress', name: 'Progress Track', icon: TrendingUp, path: `/portal/${studentId}/progress` },
    { id: 'todo', name: 'Todo', icon: CheckSquare, path: `/portal/${studentId}/todo` },
    { id: 'exam', name: 'Exam', icon: ClipboardCheck, path: `/portal/${studentId}/exam` },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[220px] flex-col border-r border-slate-200 bg-white text-slate-700 shadow-sm md:flex">
      <section className="border-b border-slate-100 px-5 py-6" aria-label="Student account">
        <div className="flex items-center gap-3">
          <MaleAvatar size="h-11 w-11" />
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">{studentName}</h2>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{studentClass}</p>
          </div>
        </div>
      </section>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Student portal navigation">
        {studentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.path);
          return (
            <Link
              key={link.id}
              href={link.path}
              className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-3 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={19} className={isActive ? 'text-teal-700' : 'text-slate-400'} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <section className="border-t border-slate-100 p-3" aria-label="Session actions">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </section>
    </aside>
  );
};
