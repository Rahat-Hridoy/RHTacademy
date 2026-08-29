"use client";

import React from 'react';
import { LayoutDashboard, Users, Calendar, CreditCard, LogOut, BookOpen, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  userRole?: 'admin' | 'student';
  activeItem?: string;
  hasPendingRequests?: boolean;
}

export const AppSidebar = ({
  userRole = 'student',
  hasPendingRequests = false,
}: AppSidebarProps) => {
  const pathname = usePathname();

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Students', icon: Users, href: '/admin/dashboard/students' },
    { name: 'Attendance', icon: Calendar, href: '/admin/dashboard/attendance' },
    { name: 'Payments', icon: CreditCard, href: '/admin/dashboard/payments' },
    { name: 'Landing Page', icon: BookOpen, href: '/admin/dashboard/landing' }
  ];

  const studentLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/portal/dashboard' },
    { name: 'Track Attendance', icon: ClipboardList, href: '/portal/track' },
    { name: 'Resources', icon: BookOpen, href: '/portal/resources' },
    { name: 'Payments', icon: CreditCard, href: '/portal/payments' },
  ];

  const links = userRole === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="hidden lg:flex w-64 h-screen bg-[#1E3A8A] text-slate-300 flex-col fixed left-0 top-0 border-r border-blue-950 z-40">
      <Link href="/" className="p-6 border-b border-slate-800 flex items-center gap-3 hover:bg-blue-900/40 transition-colors group cursor-pointer">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white group-hover:scale-105 transition-transform">
          R
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight">RHTacademy</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {userRole} Portal
          </p>
        </div>
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = (link.href === '/admin/dashboard' || link.href === '/portal/dashboard')
            ? pathname === link.href
            : pathname ? pathname.startsWith(link.href) : false;

          return (
            <Link key={link.name} href={link.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-blue-950/20 font-bold' : 'hover:bg-blue-900 hover:text-white text-blue-100/70 font-medium'}`}>
                <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                <span className="text-sm">{link.name}</span>
                {link.name === 'Dashboard' && userRole === 'admin' && hasPendingRequests && (
                  <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md animate-pulse">New</span>
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="/">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-slate-400 font-medium">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </Link>
      </div>
    </div>
  );
};


