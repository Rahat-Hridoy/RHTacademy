"use client";

import React, { useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import { markStudentAttendance } from '@/app/actions/studentActions';

export const AttendanceTracker = ({ students, attendance }: { students: any[], attendance: any[] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notice, setNotice] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  // Get attendance for selected date
  const dateAttendance = attendance.filter(a => a.date === selectedDate);

  const getStudentStatus = (studentId: string) => {
    const record = dateAttendance.find(a => a.student_id === studentId);
    if (!record) return 'none';
    if (!record.completed) return 'absent';
    return record.class_type; // 'onsite' | 'online'
  };

  const handleMark = async (studentId: string, type: 'onsite' | 'online' | 'absent') => {
    setProcessing(studentId);
    setNotice('');
    const res = await markStudentAttendance(studentId, selectedDate, type);
    if (res.error) setNotice(res.error);
    setProcessing(null);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Daily Records</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Attendance Tracker</h1>
          <p className="mt-2 text-sm text-slate-500">Manage global attendance across all students for any given date.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-sm border border-slate-200">
          <CalendarDays className="text-slate-400 ml-2" size={20} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none outline-none bg-transparent px-2 font-semibold text-slate-700"
          />
        </div>
      </header>

      {notice && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold">{notice}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 bg-slate-50">
          <Users className="text-slate-400" />
          <h2 className="font-bold">Students</h2>
          <span className="ml-auto text-sm text-slate-500">{students.length} Total</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Student Name</th>
                <th className="px-5 py-4 font-semibold">Class</th>
                <th className="px-5 py-4 font-semibold">Status ({new Date(selectedDate).toLocaleDateString()})</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(student => {
                const status = getStudentStatus(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {student.admin_custom_name || student.full_name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {student.admin_custom_class || student.class}
                    </td>
                    <td className="px-5 py-4">
                      {status === 'none' && <span className="text-slate-400 font-medium">Not marked</span>}
                      {status === 'onsite' && <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Onsite</span>}
                      {status === 'online' && <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">Online</span>}
                      {status === 'absent' && <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">Absent</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleMark(student.id, 'onsite')}
                          disabled={processing === student.id || status === 'onsite'}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                        >
                          Onsite
                        </button>
                        <button 
                          onClick={() => handleMark(student.id, 'online')}
                          disabled={processing === student.id || status === 'online'}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                        >
                          Online
                        </button>
                        <button 
                          onClick={() => handleMark(student.id, 'absent')}
                          disabled={processing === student.id || status === 'absent'}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
