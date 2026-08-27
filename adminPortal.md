***Admin Portal***

import { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { RequestCard, type RequestType } from './RequestCard';
import { Search, SlidersHorizontal, List, LayoutGrid, ArrowUpDown, ChevronLeft, ChevronRight, X, Check, CalendarDays, Bell, Trash2, Pause, ExternalLink, Folder, FileText, Clock3 } from 'lucide-react';
type Tab = 'Profile' | 'Attendance' | 'Resource Share' | 'Sent Notice' | 'Payment' | 'Action';
type Student = {
  id: string;
  initials: string;
  name: string;
  className: string;
  institute: string;
  tone: string;
};
type HistoryRequest = {
  id: string;
  type: RequestType;
  name: string;
  email: string;
  date: string;
  status: string;
};
const filterOptions = ['All', 'Registration', 'Booking', 'Contact'];
const historyRows: HistoryRequest[] = [{
  id: 'h1',
  type: 'registration',
  name: 'Amelia Rodriguez',
  email: 'amelia.r@example.com',
  date: 'Jun 12, 2024',
  status: 'Confirmed'
}, {
  id: 'h2',
  type: 'booking',
  name: 'Noah Williams',
  email: 'noah.w@example.com',
  date: 'Jun 11, 2024',
  status: 'Contacted'
}, {
  id: 'h3',
  type: 'contact',
  name: 'Olivia Chen',
  email: 'olivia.c@example.com',
  date: 'Jun 10, 2024',
  status: 'Replied'
}, {
  id: 'h4',
  type: 'registration',
  name: 'Ethan Brooks',
  email: 'ethan.b@example.com',
  date: 'Jun 08, 2024',
  status: 'Refused'
}, {
  id: 'h5',
  type: 'booking',
  name: 'Mia Patel',
  email: 'mia.p@example.com',
  date: 'Jun 07, 2024',
  status: 'Contacted'
}];
const students: Student[] = [{
  id: 's1',
  initials: 'AR',
  name: 'Amelia Rodriguez',
  className: 'Advanced English',
  institute: 'Northbridge Academy',
  tone: 'bg-blue-100 text-blue-800'
}, {
  id: 's2',
  initials: 'JW',
  name: 'James Wilson',
  className: 'Conversational English',
  institute: 'Westfield College',
  tone: 'bg-teal-100 text-teal-800'
}, {
  id: 's3',
  initials: 'SK',
  name: 'Sofia Kim',
  className: 'IELTS Preparation',
  institute: 'Riverside Institute',
  tone: 'bg-violet-100 text-violet-800'
}, {
  id: 's4',
  initials: 'DM',
  name: 'Daniel Martins',
  className: 'Business English',
  institute: 'Oakmont University',
  tone: 'bg-amber-100 text-amber-800'
}];
const calendarDays = [{
  day: '03',
  state: 'onsite'
}, {
  day: '05',
  state: 'online'
}, {
  day: '08',
  state: 'onsite'
}, {
  day: '12',
  state: 'absent'
}, {
  day: '15',
  state: 'onsite'
}, {
  day: '19',
  state: 'online'
}, {
  day: '22',
  state: 'onsite'
}, {
  day: '26',
  state: 'onsite'
}, {
  day: '29',
  state: 'online'
}];
export const AdminDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [tab, setTab] = useState<Tab>('Profile');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const handleConfirm = (id: string) => {
    setConfirmed(current => [...current, id]);
    setNotice('Request confirmed successfully');
  };
  const handleRefuse = () => setNotice('Request moved to history');
  const handleNavigate = (item: string) => setNotice(item === 'requests' ? '' : `${item.charAt(0).toUpperCase() + item.slice(1)} is available from the sidebar`);
  const visibleStudents = students.filter(student => student.name.toLowerCase().includes(search.toLowerCase()) || student.institute.toLowerCase().includes(search.toLowerCase()));
  return <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <AppSidebar userRole="admin" activeItem="Requests" onNavigate={handleNavigate} onLogout={() => setNotice('You have been safely logged out')} />
      <main className="min-h-screen ml-0 lg:ml-64 px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Administration / incoming</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Requests Hub</h1>
            <p className="mt-2 text-sm text-slate-500">Review new enquiries and keep your academy moving.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter requests">
            {filterOptions.map(filter => <button key={filter} onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300'}`}>{filter}</button>)}
          </div>
        </header>

        {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></div>}

        <section aria-labelledby="latest-heading" className="mb-10">
          <div className="mb-4 flex items-center justify-between"><h2 id="latest-heading" className="text-lg font-bold text-slate-950">Latest Incoming <span className="ml-2 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">3 new</span></h2><button className="text-sm font-semibold text-blue-800 hover:text-blue-950">View all</button></div>
          <div className="grid gap-5 xl:grid-cols-3">
            <div className="border-l-4 border-blue-600"><RequestCard id="r1" type="registration" title="Liam Thompson" subtitle="New student registration" timestamp="12 minutes ago" status={confirmed.includes('r1') ? 'confirmed' : 'pending'} details={{
              email: 'liam.t@example.com',
              phone: '+1 415 555 0182',
              class: 'General English'
            }} onConfirm={handleConfirm} onRefuse={handleRefuse} /></div>
            <div className="border-l-4 border-emerald-500"><RequestCard id="r2" type="booking" title="Grace Okafor" subtitle="Trial lesson request" timestamp="38 minutes ago" status="pending" details={{
              email: 'grace.o@example.com',
              subject: 'Tuesday, 4:30 PM'
            }} onConfirm={() => setNotice('Booking marked as contacted')} onRefuse={handleRefuse} /></div>
            <div className="border-l-4 border-orange-400"><RequestCard id="r3" type="contact" title="Henry Davis" subtitle="A question from your website" timestamp="1 hour ago" status="pending" details={{
              email: 'henry.d@example.com',
              subject: 'Course options',
              message: 'Could you share more details about the evening classes?'
            }} onConfirm={() => setNotice('Contact opened')} onRefuse={handleRefuse} /></div>
          </div>
        </section>

        <section aria-labelledby="history-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 id="history-heading" className="text-lg font-bold">Previous Requests</h2><p className="mt-1 text-sm text-slate-500">A record of your latest conversations.</p></div><button className="flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"><SlidersHorizontal size={16} /> <span>Export</span></button></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Name</th><th className="px-5 py-3 font-semibold">Email</th><th className="px-5 py-3 font-semibold"><span className="inline-flex items-center gap-1">Date <ArrowUpDown size={13} /></span></th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{historyRows.map(row => <tr key={row.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${row.type === 'registration' ? 'bg-blue-50 text-blue-700' : row.type === 'booking' ? 'bg-teal-50 text-teal-700' : 'bg-orange-50 text-orange-700'}`}>{row.type}</span></td><td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td><td className="px-5 py-4 text-slate-500">{row.email}</td><td className="px-5 py-4 text-slate-500">{row.date}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 font-semibold ${row.status === 'Refused' ? 'text-red-600' : row.status === 'Confirmed' ? 'text-emerald-700' : 'text-slate-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${row.status === 'Refused' ? 'bg-red-500' : row.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />{row.status}</span></td><td className="px-5 py-4"><button className="font-semibold text-blue-800 hover:underline">View</button></td></tr>)}</tbody></table></div>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><p className="text-xs text-slate-500">Showing 1–5 of 24 requests</p><nav className="flex items-center gap-1" aria-label="Pagination"><button className="rounded-md p-2 text-slate-400 hover:bg-slate-100" aria-label="Previous page"><ChevronLeft size={16} /></button><button className="rounded-md bg-blue-800 px-3 py-1.5 text-sm font-bold text-white">1</button><button className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">2</button><button className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">3</button><span className="px-1 text-slate-400">…</span><button className="rounded-md p-2 text-slate-600 hover:bg-slate-100" aria-label="Next page"><ChevronRight size={16} /></button></nav></div>
        </section>

        <section aria-labelledby="students-heading" className="mb-8"><div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">People & progress</p><h2 id="students-heading" className="text-2xl font-bold">Student Management</h2></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex min-w-[240px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400"><Search size={17} /><span className="sr-only">Search students</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search students" className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400" /></label><select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 outline-none"><option>Sort: Recently active</option><option>Sort: A–Z</option><option>Sort: Class</option></select><div className="flex rounded-lg border border-slate-200 bg-white p-1"><button aria-label="List view" onClick={() => setView('list')} className={`rounded-md p-2 ${view === 'list' ? 'bg-blue-50 text-blue-800' : 'text-slate-400'}`}><List size={17} /></button><button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded-md p-2 ${view === 'grid' ? 'bg-blue-50 text-blue-800' : 'text-slate-400'}`}><LayoutGrid size={17} /></button></div></div></div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{view === 'list' ? <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Student</th><th className="px-5 py-4">Class</th><th className="px-5 py-4">Institute</th><th className="px-5 py-4 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleStudents.map(student => <tr key={student.id} className={`${selectedStudent.id === student.id ? 'bg-blue-50/50' : ''} hover:bg-slate-50`}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${student.tone}`}>{student.initials}</span><span className="font-semibold text-slate-800">{student.name}</span></div></td><td className="px-5 py-4 text-slate-600">{student.className}</td><td className="px-5 py-4 text-slate-500">{student.institute}</td><td className="px-5 py-4 text-right"><button onClick={() => {
                      setSelectedStudent(student);
                      setTab('Profile');
                    }} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-50">View Details</button></td></tr>)}</tbody></table></div> : <div className="grid gap-4 p-5 sm:grid-cols-2">{visibleStudents.map(student => <article key={student.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold ${student.tone}`}>{student.initials}</span><div><h3 className="font-bold">{student.name}</h3><p className="text-xs text-slate-500">{student.className}</p></div></div><p className="mt-4 text-sm text-slate-500">{student.institute}</p><button onClick={() => {
                setSelectedStudent(student);
                setTab('Profile');
              }} className="mt-4 w-full rounded-lg bg-blue-800 py-2 text-xs font-bold text-white">View Details</button></article>)}</div>}</div>
        </section>

        <section aria-labelledby="detail-heading" className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Student detail preview</p><h2 id="detail-heading" className="mt-1 text-xl font-bold">{selectedStudent.name}</h2></div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-sm font-semibold text-emerald-700">Active account</span></div></div><div className="overflow-x-auto border-b border-slate-200"><div className="flex min-w-max px-5">{(['Profile', 'Attendance', 'Resource Share', 'Sent Notice', 'Payment', 'Action'] as Tab[]).map(item => <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-4 py-4 text-sm font-semibold transition first:pl-0 ${tab === item ? 'border-blue-800 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{item}</button>)}</div></div>
          <div className="p-5 sm:p-7">{tab === 'Profile' && <div className="grid gap-8 lg:grid-cols-[240px_1fr]"><div><div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold ${selectedStudent.tone}`}>{selectedStudent.initials}</div><p className="mt-3 text-center text-sm text-slate-500">Joined March 2024</p></div><form className="grid gap-4 sm:grid-cols-2" onSubmit={event => {
              event.preventDefault();
              setNotice('Student profile updated');
            }}><div className="sm:col-span-2"><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Original details</h3></div><label className="text-sm font-semibold text-slate-600">Name<input readOnly value={selectedStudent.name} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500" /></label><label className="text-sm font-semibold text-slate-600">Class<input readOnly value={selectedStudent.className} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500" /></label><div className="sm:col-span-2"><h3 className="mb-3 mt-2 text-sm font-bold uppercase tracking-wider text-slate-400">Admin override</h3></div>{['Custom Name', 'Custom Class', 'Custom Institute'].map(label => <label key={label} className="text-sm font-semibold text-slate-600">{label}<input defaultValue={label === 'Custom Name' ? selectedStudent.name : label === 'Custom Class' ? selectedStudent.className : selectedStudent.institute} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-200 focus:ring-2" /></label>)}<div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900"><span className="inline-flex items-center gap-2"><Check size={16} />Save changes</span></button></div></form></div>}
          {tab === 'Attendance' && <div><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="text-lg font-bold">June 2024</h3><p className="text-sm text-slate-500">8 of 10 classes attended</p></div><button className="rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-bold text-white"><span className="inline-flex items-center gap-2"><CalendarDays size={16} />Mark Attendance</span></button></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day} className="py-2">{day}</span>)}{calendarDays.map(item => <span key={item.day} className="flex h-12 flex-col items-center justify-center rounded-lg bg-slate-50 text-sm font-bold text-slate-700">{item.day}<span className={`mt-1 h-1.5 w-1.5 rounded-full ${item.state === 'onsite' ? 'bg-emerald-500' : item.state === 'online' ? 'bg-blue-500' : 'bg-slate-300'}`} /></span>)}</div><div className="mt-6 flex flex-wrap gap-5 text-xs font-semibold text-slate-500"><span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-500" />Onsite</span><span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-blue-500" />Online</span><span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-slate-300" />Absent</span><span className="inline-flex items-center gap-2"><Clock3 size={14} />Schedule: Tue & Thu · 4:30 PM</span></div></div>}
          {tab === 'Resource Share' && <div><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-bold">Shared resources</h3><p className="text-sm text-slate-500">Materials visible to {selectedStudent.name.split(' ')[0]}.</p></div><button className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white"><span className="inline-flex items-center gap-2"><ExternalLink size={15} />Share file</span></button></div><div className="grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><Folder className="text-amber-500" /><div><p className="font-semibold">Week 06 · Conversation</p><p className="text-xs text-slate-500">Google Drive folder · 12 items</p></div></div><div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><FileText className="text-blue-600" /><div><p className="font-semibold">Vocabulary review.pdf</p><p className="text-xs text-slate-500">Added yesterday · 2.4 MB</p></div></div></div></div>}
          {tab === 'Sent Notice' && <div className="max-w-2xl"><h3 className="text-lg font-bold">Send a notice</h3><textarea placeholder="Write a message for this student..." className="mt-4 min-h-32 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-200" /><button className="mt-3 rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white">Send notice</button></div>}
          {tab === 'Payment' && <div className="max-w-2xl"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-bold">Payment cycles</h3><p className="text-sm text-slate-500">Track class packages and due dates.</p></div><label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Bell size={16} className="text-red-500" />Due alerts<input type="checkbox" defaultChecked className="h-4 w-4 accent-red-500" /></label></div><div className="space-y-3"><div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"><div><p className="font-bold">Cycle #1 <span className="ml-2 text-sm font-normal text-slate-500">5 / 8 classes</span></p><p className="mt-1 text-xs text-red-600">Due · Paid date pending</p></div><select className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option>Due</option><option>Completed</option></select></div><div className="flex flex-col justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:flex-row sm:items-center"><div><p className="font-bold">Cycle #2 <span className="ml-2 text-sm font-normal text-slate-500">8 / 8 classes</span></p><p className="mt-1 text-xs text-emerald-700">Completed · Paid Jun 03, 2024</p></div><select className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"><option>Completed</option><option>Due</option></select></div></div></div>}
          {tab === 'Action' && <div className="max-w-xl"><h3 className="text-lg font-bold">Account actions</h3><p className="mt-1 text-sm text-slate-500">These actions affect the student’s access immediately.</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setNotice('Account paused for review')} className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800"><Pause size={16} />Pause Account</button><button onClick={() => setNotice('Delete confirmation preview opened')} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white"><Trash2 size={16} />Delete Account</button></div><div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"><strong>Delete confirmation preview</strong><p className="mt-1">Deleting this account removes access and payment history permanently. A second confirmation is required.</p></div></div>}</div></section>
      </main>
    </div>;
};

***App sidebar ***
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
  return <div className="hidden lg:flex w-64 h-screen bg-[#1E3A8A] text-slate-300 flex-col fixed left-0 top-0 border-r border-blue-950">
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
        return <button key={link.id} onClick={() => onNavigate?.(link.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-blue-950/20' : 'hover:bg-blue-900 hover:text-white text-blue-100/70'}`}>
              <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-white'}`} />
              <span className="font-medium text-sm">{link.name}</span>
              {link.id === 'requests' && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">3</span>}
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


***Request card***

import React from 'react';
import { CheckCircle2, XCircle, Clock, User, Mail, Phone, BookOpen, CalendarDays } from 'lucide-react';
export type RequestType = 'registration' | 'booking' | 'contact';
export type RequestStatus = 'pending' | 'confirmed' | 'refused';
interface RequestCardProps {
  id: string;
  type: RequestType;
  title: string;
  subtitle: string;
  timestamp: string;
  status: RequestStatus;
  details: {
    email?: string;
    phone?: string;
    class?: string;
    subject?: string;
    message?: string;
  };
  onConfirm: (id: string) => void;
  onRefuse: (id: string) => void;
}
export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  type,
  title,
  subtitle,
  timestamp,
  status,
  details,
  onConfirm,
  onRefuse
}) => {
  const getBadgeStyles = () => {
    switch (type) {
      case 'registration':
        return 'bg-blue-100 text-blue-700';
      case 'booking':
        return 'bg-teal-100 text-teal-700';
      case 'contact':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };
  const getStatusStyles = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500 text-white';
      case 'refused':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-amber-500 text-white';
    }
  };
  return <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getBadgeStyles()}`}>
              {type}
            </span>
            {status === 'pending' && <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusStyles()}`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        {details.phone && <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Phone size={14} className="text-slate-400" />
            <span>{details.phone}</span>
          </div>}
        {details.email && <div className="flex items-center gap-2 text-slate-600 text-xs">
            <Mail size={14} className="text-slate-400" />
            <span className="truncate">{details.email}</span>
          </div>}
        {details.class && <div className="flex items-center gap-2 text-slate-600 text-xs">
            <User size={14} className="text-slate-400" />
            <span>Class: {details.class}</span>
          </div>}
        {details.subject && <div className="flex items-center gap-2 text-slate-600 text-xs">
            <BookOpen size={14} className="text-slate-400" />
            <span>{details.subject}</span>
          </div>}
        <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2">
          <Clock size={14} className="text-slate-400" />
          <span>Requested: {timestamp}</span>
        </div>
        {details.message && <div className="col-span-2 mt-2 p-2 bg-slate-50 rounded-lg text-slate-600 text-xs italic">
            "{details.message}"
          </div>}
      </div>

      {status === 'pending' && <div className="flex gap-2 pt-4 border-t border-slate-100">
          <button onClick={() => onRefuse(id)} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
            <XCircle size={16} />
            Refuse
          </button>
          <button onClick={() => onConfirm(id)} className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-800 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">
            <CheckCircle2 size={16} />
            Confirm
          </button>
        </div>}
    </div>;
};