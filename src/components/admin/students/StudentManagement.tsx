"use client";

import React, { useState, useMemo } from 'react';
import { Search, List, Grid3X3, Mail, Phone, ArrowLeft } from 'lucide-react';
import {
  ProfileTab,
  AttendanceTab,
  ResourceTab,
  NoticeTab,
  PaymentTab,
  ActionTab,
  TabName
} from './StudentTabs';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const TONES = [
  'bg-blue-100 text-blue-800',
  'bg-teal-100 text-teal-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-emerald-100 text-emerald-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
];

function getStudentTone(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return TONES[Math.abs(hash) % TONES.length];
}

function getInitials(name: string): string {
  return (name || '??')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function statusBadge(status: string) {
  if (status === 'active') return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (status === 'paused') return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-slate-50 text-slate-600 ring-slate-200';
}

const TABS: TabName[] = ['Profile', 'Attendance', 'Resource Share', 'Sent Notice', 'Payment', 'Action'];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface StudentManagementProps {
  students: any[];
  attendance: any[];
  folders: any[];
  resources: any[];
  notices: any[];
  paymentCycles: any[];
}

export const StudentManagement = ({
  students,
  attendance,
  folders,
  resources,
  notices,
  paymentCycles,
}: StudentManagementProps) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabName>('Profile');

  const visibleStudents = useMemo(
    () =>
      students
        .filter(s => s.role !== 'admin')
        .filter(s => {
          const q = search.toLowerCase();
          return (
            (s.admin_custom_name || s.full_name || '').toLowerCase().includes(q) ||
            (s.admin_custom_class || s.class || '').toLowerCase().includes(q) ||
            (s.admin_custom_institute || s.institute || '').toLowerCase().includes(q)
          );
        }),
    [students, search]
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId) ?? null;

  const selectStudent = (student: any) => {
    setSelectedStudentId(student.id);
    setTab('Profile');
  };

  // ── DETAIL VIEW ─────────────────────────────────────────────────────────────
  if (selectedStudent) {
    const tone = getStudentTone(selectedStudent.id);
    const displayName = selectedStudent.admin_custom_name || selectedStudent.full_name || 'Student';
    const initials = getInitials(displayName);
    const acctStatus = selectedStudent.account_status || 'active';

    const studentAttendance = attendance.filter(a => a.student_id === selectedStudent.id);
    const studentFolders = folders.filter(f => f.student_id === selectedStudent.id);
    const studentResources = resources.filter(r => r.student_id === selectedStudent.id);
    const studentNotices = notices.filter(n => n.student_id === selectedStudent.id);
    const studentCycles = paymentCycles.filter(p => p.student_id === selectedStudent.id);

    return (
      <section aria-labelledby="student-detail-title" className="space-y-5">
        {/* ── Header Card ───────────────────────────────────────────── */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Large Avatar */}
              <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-medium ${tone}`}>
                <span>{initials}</span>
              </div>
              {/* Info */}
              <div>
                <h2 id="student-detail-title" className="text-3xl font-medium tracking-tight text-slate-950">
                  <span>{displayName}</span>
                </h2>
                <p className="mt-1 text-sm font-normal text-slate-600">
                  <span>
                    {selectedStudent.admin_custom_class || selectedStudent.class || 'N/A'}
                    {' · '}
                    {selectedStudent.admin_custom_institute || selectedStudent.institute || 'N/A'}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadge(acctStatus)}`}>
                    {acctStatus === 'paused' ? 'Paused' : 'Active'}
                  </span>
                  {selectedStudent.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail size={14} />
                      {selectedStudent.email}
                    </span>
                  )}
                  {selectedStudent.phone_number && (
                    <span className="inline-flex items-center gap-1">
                      <Phone size={14} />
                      {selectedStudent.phone_number}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* ── Back Button (top-right of header) ─────────────────── */}
            <button
              type="button"
              onClick={() => setSelectedStudentId(null)}
              className="self-start inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1E40AF] shadow-sm hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to List</span>
            </button>
          </div>

          {/* ── Tab Bar ───────────────────────────────────────────────── */}
          <div className="mt-6 overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max gap-1">
              {TABS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`border-b-2 px-4 py-3 text-sm font-medium transition ${tab === t
                    ? 'border-[#1E40AF] text-[#1E40AF]'
                    : 'border-transparent text-slate-500 hover:text-slate-950'
                    }`}
                >
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab Content ───────────────────────────────────────────── */}
          <div className="pt-6">
            {tab === 'Profile' && (
              <ProfileTab student={selectedStudent} />
            )}
            {tab === 'Attendance' && (
              <AttendanceTab student={selectedStudent} attendance={studentAttendance} />
            )}
            {tab === 'Resource Share' && (
              <ResourceTab student={selectedStudent} folders={studentFolders} resources={studentResources} />
            )}
            {tab === 'Sent Notice' && (
              <NoticeTab student={selectedStudent} notices={studentNotices} />
            )}
            {tab === 'Payment' && (
              <PaymentTab
                student={selectedStudent}
                paymentCycles={studentCycles}
                attendance={studentAttendance}
              />
            )}
            {tab === 'Action' && (
              <ActionTab student={selectedStudent} onDeleted={() => setSelectedStudentId(null)} />
            )}
          </div>
        </div>
      </section>
    );
  }

  // ── STUDENT LIST ────────────────────────────────────────────────────────────
  return (
    <section aria-labelledby="students-title" className="space-y-5">
      {/* ── List Header Controls ────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-end">
        <div>
          <h2 id="students-title" className="text-2xl font-medium">
            <span>Students</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            <span>Search, sort, and open the full student profile panel.</span>
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Search */}
          <label className="flex min-w-[280px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search students</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full bg-transparent font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
          {/* View Toggle */}
          <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              aria-label="List View"
              onClick={() => setView('list')}
              className={`rounded-xl p-3 transition ${view === 'list' ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={17} />
            </button>
            <button
              type="button"
              aria-label="Grid View"
              onClick={() => setView('grid')}
              className={`rounded-xl p-3 transition ${view === 'grid' ? 'bg-blue-50 text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid3X3 size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ── List View ───────────────────────────────────────────────── */}
      {view === 'list' ? (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Avatar</th>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Institute</th>
                  <th className="px-5 py-3">Account Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleStudents.map(student => {
                  const tone = getStudentTone(student.id);
                  const initials = getInitials(student.admin_custom_name || student.full_name || '??');
                  const acctStatus = student.account_status || 'active';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-medium ${tone}`}>
                          {initials}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-950">
                        {student.admin_custom_name || student.full_name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {student.admin_custom_class || student.class || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {student.admin_custom_institute || student.institute || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadge(acctStatus)}`}>
                          {acctStatus === 'paused' ? 'Paused' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => selectStudent(student)}
                          className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-medium text-[#1E40AF] hover:bg-blue-50 transition-colors"
                        >
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {visibleStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center font-semibold text-slate-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Grid View ─────────────────────────────────────────────── */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleStudents.map(student => {
            const tone = getStudentTone(student.id);
            const initials = getInitials(student.admin_custom_name || student.full_name || '??');
            const acctStatus = student.account_status || 'active';
            return (
              <article key={student.id} className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-medium ${tone}`}>
                  {initials}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">
                  <span>{student.admin_custom_name || student.full_name}</span>
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  <span>
                    {student.admin_custom_class || student.class || '—'}
                    {' · '}
                    {student.admin_custom_institute || student.institute || '—'}
                  </span>
                </p>
                <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusBadge(acctStatus)}`}>
                  {acctStatus === 'paused' ? 'Paused' : 'Active'}
                </span>
                <button
                  type="button"
                  onClick={() => selectStudent(student)}
                  className="mt-4 w-full rounded-2xl border border-blue-200 px-4 py-3 text-sm font-medium text-[#1E40AF] hover:bg-blue-50 transition-colors"
                >
                  <span>View Details</span>
                </button>
              </article>
            );
          })}
          {visibleStudents.length === 0 && (
            <div className="col-span-full py-10 text-center font-semibold text-slate-500">
              No students found.
            </div>
          )}
        </div>
      )}
    </section>
  );
};
