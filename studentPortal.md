***appsidebar***

import React from 'react';
import { LayoutDashboard, Users, Calendar, CreditCard, FileText, Bell, Settings, LogOut, UserCircle, BookOpen, ClipboardList } from 'lucide-react';
interface AppSidebarProps {
  userRole?: 'admin' | 'student';
  activeItem?: string;
  onNavigate?: (item: string) => void;
  onLogout?: () => void;
}
export const AppSidebar: React.FC<AppSidebarProps> = ({
  userRole = 'student',
  activeItem = 'Dashboard',
  onNavigate,
  onLogout
}) => {
  const adminLinks = [{
    name: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard'
  }, {
    name: 'Requests',
    icon: Bell,
    id: 'requests'
  }, {
    name: 'Students',
    icon: Users,
    id: 'students'
  }, {
    name: 'Attendance',
    icon: Calendar,
    id: 'attendance'
  }, {
    name: 'Payments',
    icon: CreditCard,
    id: 'payments'
  }, {
    name: 'Resources',
    icon: BookOpen,
    id: 'resources'
  }];
  const studentLinks = [{
    name: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard'
  }, {
    name: 'Track Attendance',
    icon: ClipboardList,
    id: 'track'
  }, {
    name: 'Resources',
    icon: BookOpen,
    id: 'resources'
  }, {
    name: 'Payments',
    icon: CreditCard,
    id: 'payments'
  }, {
    name: 'Notices',
    icon: FileText,
    id: 'notices'
  }];
  const links = userRole === 'admin' ? adminLinks : studentLinks;
  return <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white">
          R
        </div>
        <div>
          <h1 className="font-bold text-white text-lg leading-tight">RHTacademy</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {userRole} Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map(link => {
        const Icon = link.icon;
        const isActive = activeItem.toLowerCase() === link.id;
        return <button key={link.id} onClick={() => onNavigate?.(link.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}>
              <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-white'}`} />
              <span className="font-medium text-sm">{link.name}</span>
            </button>;
      })}
      </nav>

      {/* User & Settings Footer */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-slate-400 mb-1" onClick={() => onNavigate?.('settings')}>
          <Settings size={20} />
          <span className="font-medium text-sm">Settings</span>
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-slate-400">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
        
        <div className="mt-4 flex items-center gap-3 px-2 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            <UserCircle size={24} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">User Account</p>
            <p className="text-[10px] text-slate-500 truncate lowercase">user@rhtacademy.com</p>
          </div>
        </div>
      </div>
    </div>;
};

***AttendanceGauge***

import React from 'react';
interface AttendanceGaugeProps {
  completed: number;
  total: number;
  label?: string;
  size?: number;
}
export const AttendanceGauge: React.FC<AttendanceGaugeProps> = ({
  completed,
  total,
  label = "Class Progress",
  size = 200
}) => {
  const percentage = Math.min(Math.round(completed / total * 100), 100);
  const strokeWidth = 14;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;
  return <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center shadow-sm w-full max-w-sm">
      <h3 className="text-slate-500 font-semibold text-sm mb-6 uppercase tracking-wider">{label}</h3>
      
      <div className="relative" style={{
      width: size,
      height: size
    }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100" />
          {/* Progress Circle */}
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="text-teal-600 transition-all duration-1000 ease-out" />
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-900">{completed}</span>
          <span className="text-slate-400 text-sm font-medium">out of {total}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 w-full gap-4">
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
          <span className="text-slate-400 text-[10px] uppercase font-bold mb-1">Percentage</span>
          <span className="text-teal-700 font-bold text-lg">{percentage}%</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
          <span className="text-slate-400 text-[10px] uppercase font-bold mb-1">Remaining</span>
          <span className="text-blue-800 font-bold text-lg">{total - completed}</span>
        </div>
      </div>

      {percentage === 100 ? <div className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Cycle completed!
        </div> : <p className="mt-4 text-slate-400 text-xs text-center">
          {total - completed} classes remaining for this cycle.
        </p>}
    </div>;
};

***studentPortal***

import { useState } from 'react';
import { Bell, BookOpen, CalendarDays, ChevronLeft, ChevronRight, CircleAlert, CreditCard, FileText, Folder, Grid2X2, Landmark, List, LockKeyhole, Mail, Menu, MoreHorizontal, Phone, Search, ShieldCheck, Smartphone, Upload, UserRound, X } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { AttendanceGauge } from './AttendanceGauge';
type PortalTab = 'dashboard' | 'resources' | 'payments';
const calendarDays = [{
  day: 1,
  kind: 'onsite'
}, {
  day: 2,
  kind: 'online'
}, {
  day: 3,
  kind: ''
}, {
  day: 4,
  kind: ''
}, {
  day: 5,
  kind: 'onsite'
}, {
  day: 6,
  kind: ''
}, {
  day: 7,
  kind: ''
}, {
  day: 8,
  kind: 'online'
}, {
  day: 9,
  kind: 'onsite'
}, {
  day: 10,
  kind: ''
}, {
  day: 11,
  kind: ''
}, {
  day: 12,
  kind: 'onsite'
}, {
  day: 13,
  kind: ''
}, {
  day: 14,
  kind: ''
}, {
  day: 15,
  kind: 'online'
}, {
  day: 16,
  kind: ''
}, {
  day: 17,
  kind: 'onsite'
}, {
  day: 18,
  kind: ''
}, {
  day: 19,
  kind: ''
}, {
  day: 20,
  kind: 'onsite'
}, {
  day: 21,
  kind: ''
}, {
  day: 22,
  kind: 'online'
}, {
  day: 23,
  kind: ''
}, {
  day: 24,
  kind: ''
}, {
  day: 25,
  kind: 'onsite'
}, {
  day: 26,
  kind: ''
}, {
  day: 27,
  kind: ''
}, {
  day: 28,
  kind: ''
}, {
  day: 29,
  kind: 'onsite'
}, {
  day: 30,
  kind: ''
}, {
  day: 31,
  kind: ''
}];
const notices = [{
  title: 'Mid-cycle assessment schedule',
  date: '28 Jan 2025',
  text: 'Your upcoming assessment will be held during the regular class slot. Please bring your calculator.'
}, {
  title: 'New ICT resources available',
  date: '26 Jan 2025',
  text: 'Chapter 04 notes and practice materials are now available in the Resources section.'
}, {
  title: 'Campus closed on 21 February',
  date: '23 Jan 2025',
  text: 'All onsite classes will move online for Language Martyrs’ Day. Your link will be shared soon.'
}, {
  title: 'Payment reminder for Cycle #1',
  date: '20 Jan 2025',
  text: 'A gentle reminder to clear your pending cycle payment to keep your enrollment active.'
}, {
  title: 'Welcome to the January cycle',
  date: '15 Jan 2025',
  text: 'We are excited to learn with you. Check your dashboard regularly for updates and notices.'
}];
const resources = [{
  name: 'Physics',
  count: '18 files',
  color: 'bg-blue-50 text-blue-700',
  detail: 'Mechanics, waves & optics'
}, {
  name: 'Chemistry',
  count: '24 files',
  color: 'bg-teal-50 text-teal-700',
  detail: 'Organic & physical chemistry'
}, {
  name: 'ICT',
  count: '12 files',
  color: 'bg-indigo-50 text-indigo-700',
  detail: 'Programming & databases'
}];
const paymentDates = ['08 Jan · Onsite', '12 Jan · Online', '15 Jan · Onsite', '19 Jan · Onsite', '22 Jan · Online', '26 Jan · Onsite', '29 Jan · Onsite', '02 Feb · Online'];
const MaleAvatar = ({
  size = 'h-10 w-10'
}: {
  size?: string;
}) => <span className={`${size} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700`} aria-label="Student profile avatar">
    <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Male student avatar">
      <circle cx="24" cy="24" r="24" fill="#dbeafe" /><path d="M12 43c1.9-8.1 6.4-12 12-12s10.1 3.9 12 12" fill="#1e40af" /><circle cx="24" cy="21" r="8" fill="#f4c7a1" /><path d="M16 20c.4-8.5 4.2-11.5 9.4-11.5 5.1 0 8.2 3.8 7.5 9.2-3.3-2.7-7.7-3.6-12.9-2.2z" fill="#334155" /><path d="M21 24.5c2 1.4 4 1.4 6 0" fill="none" stroke="#9a5d43" strokeWidth="1.2" strokeLinecap="round" /></svg>
  </span>;
export const StudentPortal = () => {
  const [tab, setTab] = useState<PortalTab>('dashboard');
  const [profileOpen, setProfileOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  return <div className="student-shell min-h-screen bg-[#F9FAFB] text-slate-900">
      <AppSidebar userRole="student" activeItem={tab === 'payments' ? 'payments' : tab === 'resources' ? 'resources' : 'dashboard'} onNavigate={item => {
      if (item === 'dashboard' || item === 'resources' || item === 'payments') setTab(item);
    }} />
      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 shadow-sm backdrop-blur md:px-9">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 md:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={21} /></button><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-700">RHTacademy</p><h1 className="text-xl font-bold tracking-tight text-slate-900">Student Portal</h1></div></div>
          <div className="flex items-center gap-5"><div className="relative"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-800" aria-label="Notifications"><Bell size={20} /><span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">2</span></button>{notificationsOpen && <div className="absolute right-0 top-12 w-[310px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-bold">Notifications</h2><button className="text-xs font-semibold text-blue-700 hover:underline">Mark all read</button></div><div className="space-y-1"><div className="flex gap-3 rounded-xl p-3 hover:bg-slate-50"><span className="rounded-lg bg-red-50 p-2 text-red-600"><CircleAlert size={16} /></span><div><p className="text-xs font-semibold">Payment due reminder</p><p className="mt-1 text-xs leading-4 text-slate-500">Cycle #1 payment is waiting.</p><time className="mt-1 block text-[11px] text-slate-400">2 hours ago</time></div></div><div className="flex gap-3 rounded-xl p-3 hover:bg-slate-50"><span className="rounded-lg bg-blue-50 p-2 text-blue-700"><FileText size={16} /></span><div><p className="text-xs font-semibold">New resource uploaded</p><p className="mt-1 text-xs leading-4 text-slate-500">ICT Chapter 04 is ready to view.</p><time className="mt-1 block text-[11px] text-slate-400">Yesterday</time></div></div></div></div>}</div><button onClick={() => setProfileOpen(true)} className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2" aria-label="Open profile"><MaleAvatar /><span className="hidden text-left md:block"><strong className="block text-sm">Arif Hasan</strong><span className="block text-[11px] text-slate-500">Class 11 · Science</span></span></button></div>
        </header>
        {mobileNav && <div className="fixed inset-0 z-30 bg-slate-900/20 md:hidden"><div className="h-full w-72 bg-white p-5 shadow-xl"><button onClick={() => setMobileNav(false)} aria-label="Close navigation" className="mb-5 rounded p-2"><X size={20} /></button><p className="font-bold">Navigation</p><nav className="mt-5 space-y-2"><button onClick={() => {
              setTab('dashboard');
              setMobileNav(false);
            }} className="block w-full rounded-lg bg-blue-50 p-3 text-left font-semibold text-blue-800">Dashboard</button><button onClick={() => {
              setTab('resources');
              setMobileNav(false);
            }} className="block w-full rounded-lg p-3 text-left">Resources</button><button onClick={() => {
              setTab('payments');
              setMobileNav(false);
            }} className="block w-full rounded-lg p-3 text-left">Payments</button></nav></div></div>}

        <main className="mx-auto max-w-[1450px] px-5 py-7 md:px-9 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-medium text-teal-700">Tuesday, 04 February 2025</p><h2 className="text-3xl font-bold tracking-tight md:text-4xl">Good morning, Arif.</h2><p className="mt-2 text-sm text-slate-500">Here’s your learning snapshot for today.</p></div><div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"><button onClick={() => setTab('dashboard')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'dashboard' ? 'bg-blue-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</button><button onClick={() => setTab('resources')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'resources' ? 'bg-blue-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}>Resources</button><button onClick={() => setTab('payments')} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'payments' ? 'bg-blue-800 text-white' : 'text-slate-500 hover:text-slate-900'}`}>Payment</button></div></div>

          {tab === 'dashboard' && <div className="space-y-7"><section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="rounded-full bg-red-100 p-2.5 text-red-600"><CircleAlert size={21} /></span><div><h3 className="font-bold text-red-900">Pending payment due</h3><p className="text-sm text-red-700">You have a pending payment due. Please complete your payment.</p></div></div><button onClick={() => setTab('payments')} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700">View Payment</button></section><section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Class track</p><h3 className="mt-1 text-xl font-bold">January 2025</h3></div><button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Search calendar"><Search size={17} /></button></div><div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase text-slate-400">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}</div><div className="grid grid-cols-7 gap-y-3 text-center">{calendarDays.map(item => <span key={item.day} className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${item.kind === 'onsite' ? 'bg-emerald-500 font-bold text-white' : item.kind === 'online' ? 'bg-sky-400 font-bold text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{item.day}</span>)}</div><div className="mt-7 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-600"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Onsite</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-sky-400" />Online</span></div></article><article className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><AttendanceGauge completed={5} total={8} label="Classes Completed" size={190} /><div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-4"><div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current cycle</p><p className="mt-1 text-sm font-semibold text-slate-700">Jan 2025 – Feb 2025</p></div><span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">DUE</span></div></article></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Stay informed</p><h3 className="mt-1 text-xl font-bold">Notice Board</h3></div><button className="text-sm font-semibold text-blue-800 hover:underline">View all</button></div><div className="grid gap-3">{notices.map(notice => <article key={notice.title} className="border-l-4 border-blue-700 py-2 pl-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold text-slate-800">{notice.title}</h4><time className="text-xs font-medium text-slate-400">{notice.date}</time></div><p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-5 text-slate-500">{notice.text}</p><button className="mt-2 text-xs font-bold text-blue-800 hover:underline">Read More <span aria-hidden="true">→</span></button></article>)}</div><div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs font-semibold text-slate-500">Page 1 of 3</span><div className="flex gap-2"><button className="rounded-lg border border-slate-200 p-2 text-slate-400" aria-label="Previous page"><ChevronLeft size={16} /></button><button className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50" aria-label="Next page"><ChevronRight size={16} /></button></div></div></section></div>}

          {tab === 'resources' && <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Your materials</p><h2 className="mt-1 text-2xl font-bold">Resources</h2><p className="mt-1 text-sm text-slate-500">Everything you need for your current cycle.</p></div><div className="flex rounded-lg border border-slate-200 p-1"><button className="rounded p-2 text-blue-800 shadow-sm" aria-label="Grid view"><Grid2X2 size={17} /></button><button className="rounded p-2 text-slate-400" aria-label="List view"><List size={17} /></button></div></div><div className="grid gap-5 md:grid-cols-3">{resources.map(resource => <article key={resource.name} className="rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-md"><div className={`mb-7 inline-flex rounded-xl p-3 ${resource.color}`}><Folder size={25} /></div><h3 className="text-lg font-bold">{resource.name}</h3><p className="mt-1 text-sm text-slate-500">{resource.detail}</p><div className="mt-6 flex items-center justify-between"><span className="text-xs font-semibold text-slate-400">{resource.count}</span><button className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900">Open folder</button></div></article>)}</div></section>}

          {tab === 'payments' && <div className="space-y-7"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Payment history</p><h2 className="mt-1 text-2xl font-bold">Your cycles</h2></div><button className="rounded-lg border border-slate-200 p-2 text-slate-500" aria-label="More payment options"><MoreHorizontal size={19} /></button></div><div className="mt-6 grid gap-4 lg:grid-cols-2"><article className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5"><div className="flex justify-between"><div><h3 className="font-bold">Cycle #2</h3><p className="mt-1 text-sm text-slate-600">8/8 classes · Jan–Feb 2025</p></div><span className="h-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">COMPLETED</span></div><ul className="mt-5 grid gap-2 text-xs font-medium text-slate-600 sm:grid-cols-2">{paymentDates.map(date => <li key={date} className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600" />{date}</li>)}</ul></article><article className="rounded-xl border border-red-200 bg-red-50/50 p-5"><div className="flex justify-between"><div><h3 className="font-bold">Cycle #1</h3><p className="mt-1 text-sm text-slate-600">5/8 classes · Dec 2024–Jan 2025</p></div><span className="h-fit rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">DUE</span></div><p className="mt-6 text-sm leading-6 text-slate-600">Complete your outstanding payment to keep your learning plan active.</p><button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white">Pay now</button></article></div><button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-bold text-blue-800 hover:bg-slate-50">See More <ChevronRight size={16} /></button></section><section><h2 className="mb-4 text-xl font-bold">Payment methods</h2><div className="grid gap-4 md:grid-cols-3"><article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><Landmark className="mb-4 text-blue-800" size={22} /><h3 className="font-bold">Bank transfer</h3><p className="mt-2 text-sm leading-6 text-slate-500">Dutch-Bangla Bank<br />A/C: 124.110.00987<br />RHTacademy Ltd.</p></article><article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><Smartphone className="mb-4 text-pink-600" size={22} /><h3 className="font-bold">bKash</h3><p className="mt-2 text-sm leading-6 text-slate-500">Send money to<br /><strong className="text-slate-800">01712-345678</strong><br />Reference: your student ID</p></article><article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><Smartphone className="mb-4 text-orange-500" size={22} /><h3 className="font-bold">Nagad</h3><p className="mt-2 text-sm leading-6 text-slate-500">Send money to<br /><strong className="text-slate-800">01812-987654</strong><br />Reference: your student ID</p></article></div></section></div>}
        </main>
      </div>

      {profileOpen && <dialog open aria-labelledby="profile-title" className="fixed inset-0 z-40 m-auto max-h-[calc(100vh-32px)] w-[min(680px,calc(100%-32px))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Account settings</p><h2 id="profile-title" className="mt-1 text-xl font-bold">My profile</h2></div><button onClick={() => setProfileOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close profile"><X size={19} /></button></div><form className="space-y-5 p-6" onSubmit={event => event.preventDefault()}><div className="flex items-center gap-4"><div className="relative"><MaleAvatar size="h-20 w-20" /><button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-800 p-1.5 text-white" aria-label="Upload avatar"><Upload size={13} /></button></div><div><h3 className="font-bold">Profile photo</h3><p className="mt-1 text-xs text-slate-500">JPG or PNG, max 2MB.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input defaultValue="Arif Hasan" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100" /></label><label className="text-sm font-semibold">Class<select defaultValue="Class 11 — Science" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700"><option>Class 11 — Science</option><option>Class 12 — Science</option></select></label><label className="text-sm font-semibold">Institute<input defaultValue="RHT Academy" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700" /></label><label className="text-sm font-semibold">Phone<div className="relative mt-2"><Phone size={15} className="absolute left-3 top-3 text-slate-400" /><input defaultValue="+880 1712 345678" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-700" /></div></label></div><label className="block text-sm font-semibold">Email<div className="mt-2 flex gap-2"><div className="relative flex-1"><Mail size={15} className="absolute left-3 top-3 text-slate-400" /><input defaultValue="arif.hasan@email.com" className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-700" /></div><button type="button" onClick={() => setOtpSent(true)} className="whitespace-nowrap rounded-lg border border-blue-200 px-3 text-xs font-bold text-blue-800 hover:bg-blue-50">Send OTP to change</button></div></label><div className="border-t border-slate-100 pt-5"><div className="mb-3 flex items-center gap-2"><LockKeyhole size={17} className="text-blue-800" /><h3 className="font-bold">Change password</h3></div><div className="grid gap-3 sm:grid-cols-2"><input type="password" placeholder="Current password" aria-label="Current password" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700" /><input type="password" placeholder="New password" aria-label="New password" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700" /></div>{otpSent && <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-800"><ShieldCheck size={16} /><span>OTP sent. Enter the 6-digit code from your email to verify sensitive changes.</span><input maxLength={6} aria-label="OTP verification code" placeholder="000000" className="ml-auto w-20 rounded border border-blue-200 bg-white px-2 py-1.5 text-center" /></div>}</div><div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => setProfileOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button><button type="submit" onClick={() => setProfileOpen(false)} className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-900">Save changes</button></div></form></dialog>}
    </div>;
};