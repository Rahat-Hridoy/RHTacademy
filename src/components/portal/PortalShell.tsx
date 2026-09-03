'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AppSidebar } from '@/components/portal/AppSidebar';
import { TopBar } from '@/components/portal/TopBar';
import { usePathname, useRouter } from 'next/navigation';

interface PortalShellProps {
  children: React.ReactNode;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  studentPhone: string;
  studentInstitute: string;
  studentGender: 'male' | 'female';
}

export const PortalShell = ({
  children,
  studentId,
  studentName,
  studentClass,
  studentEmail,
  studentPhone,
  studentInstitute,
  studentGender,
}: PortalShellProps) => {
  const [mobileNav, setMobileNav] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: `/portal/${studentId}/dashboard` },
    { id: 'resources', label: 'Resources', path: `/portal/${studentId}/resources` },
    { id: 'payment', label: 'Payment', path: `/portal/${studentId}/payment` },
    { id: 'progress', label: 'Progress Track', path: `/portal/${studentId}/progress` },
    { id: 'todo', label: 'Todo', path: `/portal/${studentId}/todo` },
    { id: 'exam', label: 'Exam', path: `/portal/${studentId}/exam` },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="student-shell min-h-screen bg-[#F9FAFB] text-slate-900">
      <AppSidebar
        studentId={studentId}
        studentName={studentName}
        studentClass={studentClass}
        studentGender={studentGender}
      />
      <div className="min-h-screen md:pl-[220px]">
        <TopBar
          onMobileNavToggle={() => setMobileNav(!mobileNav)}
          studentName={studentName}
          studentClass={studentClass}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
          studentInstitute={studentInstitute}
          studentGender={studentGender}
          studentId={studentId}
        />

        {mobileNav && (
          <div className="fixed inset-0 z-30 bg-slate-900/20 md:hidden">
            <div className="h-full w-72 bg-white p-5 shadow-xl">
              <button
                onClick={() => setMobileNav(false)}
                aria-label="Close navigation"
                className="mb-5 rounded p-2"
              >
                <X size={20} />
              </button>
              <p className="font-bold">Navigation</p>
              <nav className="mt-5 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(item.path);
                      setMobileNav(false);
                    }}
                    className={`block w-full rounded-lg p-3 text-left font-semibold ${
                      pathname.startsWith(item.path) ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="mx-auto max-w-[1450px] px-5 py-7 md:px-9 lg:px-12">
          <section className="mb-8 flex flex-wrap items-end justify-between gap-5" aria-label="Page overview">
            <div>
              <p className="mb-2 text-sm font-semibold text-teal-700">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {greeting()}, {studentName.split(' ')[0]}.
              </h2>
              <p className="mt-2 text-sm text-slate-500">Here's your learning snapshot for today.</p>
            </div>

            <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.path)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    pathname.startsWith(item.path)
                      ? 'bg-blue-800 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
};
