"use client";

import React, { useState } from 'react';
import { Search, List, LayoutGrid } from 'lucide-react';
import {
  ProfileTab,
  AttendanceTab,
  ResourceTab,
  NoticeTab,
  PaymentTab,
  ActionTab,
  TabName
} from './StudentTabs';

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
  paymentCycles
}: StudentManagementProps) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabName>('Profile');

  const visibleStudents = students
    .filter(s => s.role !== 'admin')
    .filter(s =>
      (s.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.admin_custom_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.institute || '').toLowerCase().includes(search.toLowerCase())
    );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const renderTabContent = () => {
    if (!selectedStudent) return null;

    const studentAttendance = attendance.filter(a => a.student_id === selectedStudent.id);
    const studentFolders = folders.filter(f => f.student_id === selectedStudent.id);
    const studentResources = resources.filter(r => r.student_id === selectedStudent.id);
    const studentNotices = notices.filter(n => n.student_id === selectedStudent.id);
    const studentCycles = paymentCycles.filter(p => p.student_id === selectedStudent.id);

    switch (tab) {
      case 'Profile': return <ProfileTab student={selectedStudent} />;
      case 'Attendance': return <AttendanceTab student={selectedStudent} attendance={studentAttendance} />;
      case 'Resource Share': return <ResourceTab student={selectedStudent} folders={studentFolders} resources={studentResources} />;
      case 'Sent Notice': return <NoticeTab student={selectedStudent} notices={studentNotices} />;
      case 'Payment': return <PaymentTab student={selectedStudent} paymentCycles={studentCycles} />;
      case 'Action': return <ActionTab student={selectedStudent} onDeleted={() => setSelectedStudentId(null)} />;
      default: return null;
    }
  };

  return (
    <>
      {!selectedStudent ? (
        <section aria-labelledby="students-heading" className="mb-8">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">People & progress</p>
              <h2 id="students-heading" className="text-2xl font-bold">Student Management</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex min-w-[240px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={17} />
                <span className="sr-only">Search students</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students"
                  className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
                />
              </label>
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 outline-none hover:border-slate-300 transition-colors">
                <option>Sort: Recently active</option>
                <option>Sort: A–Z</option>
              </select>
              <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                <button aria-label="List view" onClick={() => setView('list')} className={`rounded-md p-2 transition-colors ${view === 'list' ? 'bg-blue-50 text-blue-800' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                  <List size={17} />
                </button>
                <button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded-md p-2 transition-colors ${view === 'grid' ? 'bg-blue-50 text-blue-800' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
                  <LayoutGrid size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {view === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50/50">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Student</th>
                      <th className="px-5 py-4 font-semibold">Class</th>
                      <th className="px-5 py-4 font-semibold">Institute</th>
                      <th className="px-5 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleStudents.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold bg-blue-100 text-blue-800 shrink-0">
                              {student.full_name?.substring(0, 2).toUpperCase()}
                            </span>
                            <span className="font-semibold text-slate-800">{student.admin_custom_name || student.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{student.admin_custom_class || student.class}</td>
                        <td className="px-5 py-4 text-slate-500">{student.admin_custom_institute || student.institute}</td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setTab('Profile');
                            }}
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visibleStudents.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleStudents.map(student => (
                  <article key={student.id} className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold bg-blue-100 text-blue-800 shrink-0">
                        {student.full_name?.substring(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold truncate text-slate-900">{student.admin_custom_name || student.full_name}</h3>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{student.admin_custom_class || student.class}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 truncate">{student.admin_custom_institute || student.institute}</p>
                    <button
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setTab('Profile');
                      }}
                      className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors shadow-sm"
                    >
                      View Details
                    </button>
                  </article>
                ))}
                {visibleStudents.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-500">
                    No students found.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section aria-labelledby="detail-heading" className="rounded-2xl border border-slate-200 bg-white shadow-sm animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Student detail preview</p>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedStudent.account_status === 'paused' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedStudent.account_status === 'paused' ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {selectedStudent.account_status === 'paused' ? 'Paused account' : 'Active account'}
                  </span>
                </div>
              </div>
              <h2 id="detail-heading" className="mt-2 text-xl font-bold">{selectedStudent.admin_custom_name || selectedStudent.full_name}</h2>
            </div>
            <button
              onClick={() => setSelectedStudentId(null)}
              className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              &larr; Back
            </button>
          </div>
          <div className="overflow-x-auto border-b border-slate-200 scrollbar-hide">
            <div className="flex min-w-max px-5">
              {(['Profile', 'Attendance', 'Resource Share', 'Sent Notice', 'Payment', 'Action'] as TabName[]).map(item => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`border-b-2 px-4 py-4 text-sm font-semibold transition-colors first:pl-0 ${tab === item ? 'border-blue-800 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5 sm:p-7">
            {renderTabContent()}
          </div>
        </section>
      )}
    </>
  );
};
