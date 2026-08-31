"use client";

import React, { useState, useMemo } from 'react';
import { Users, Check, Globe2, Building2 } from 'lucide-react';
import { markStudentAttendance, deleteStudentAttendance } from '@/app/actions/studentActions';

const weekdays = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' }
];

const tones = [
  'bg-blue-100 text-blue-800',
  'bg-teal-100 text-teal-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-emerald-100 text-emerald-800',
  'bg-pink-100 text-pink-800',
];

const getTone = (id: string) => {
  const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tones[sum % tones.length];
};

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export const AttendanceTracker = ({ students, attendance }: { students: any[], attendance: any[] }) => {
  // Use today's date in local YYYY-MM-DD format as the initial tracker date
  const [trackerDate, setTrackerDate] = useState(() => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - tzOffset).toISOString().split('T')[0];
  });
  const [processing, setProcessing] = useState<string | null>(null);

  // Get attendance for selected date
  const dateAttendance = useMemo(() => {
    return attendance.filter(a => a.date === trackerDate);
  }, [attendance, trackerDate]);

  const getStudentStatus = (studentId: string) => {
    const record = dateAttendance.find(a => a.student_id === studentId);
    if (!record) return 'Not Taken';
    if (!record.completed) return 'Not Taken'; 
    return record.class_type === 'onsite' ? 'Onsite' : 'Online';
  };

  const handleMark = async (studentId: string, type: 'onsite' | 'online' | 'absent') => {
    setProcessing(studentId);
    if (type === 'absent') {
      const record = dateAttendance.find(a => a.student_id === studentId);
      if (record) {
        await deleteStudentAttendance(record.id);
      }
    } else {
      await markStudentAttendance(studentId, trackerDate, type);
    }
    setProcessing(null);
  };

  // Stats
  const presentCount = dateAttendance.filter(a => a.completed).length;
  const onlineCount = dateAttendance.filter(a => a.completed && a.class_type === 'online').length;
  const onsiteCount = dateAttendance.filter(a => a.completed && a.class_type === 'onsite').length;

  // Calendar logic
  const [year, month, day] = trackerDate.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const displayDateStr = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <section aria-labelledby="attendance-title" className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Users className="text-[#1E40AF]" />
          <p className="mt-4 text-3xl font-bold"><span>{students.length}</span></p>
          <p className="text-sm font-medium text-slate-500"><span>Total Students</span></p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Check className="text-emerald-600" />
          <p className="mt-4 text-3xl font-bold"><span>{presentCount}</span></p>
          <p className="text-sm font-medium text-slate-500"><span>Present Today</span></p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Globe2 className="text-sky-500" />
          <p className="mt-4 text-3xl font-bold"><span>{onlineCount}</span></p>
          <p className="text-sm font-medium text-slate-500"><span>Online</span></p>
        </article>
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <Building2 className="text-[#0D9488]" />
          <p className="mt-4 text-3xl font-bold"><span>{onsiteCount}</span></p>
          <p className="text-sm font-medium text-slate-500"><span>Onsite</span></p>
        </article>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 id="attendance-title" className="text-2xl font-bold"><span>Interactive Monthly Calendar</span></h2>
            <p className="mt-1 text-sm text-slate-500"><span>Select a date to mark all student attendance.</span></p>
          </div>
          <input 
            type="date" 
            value={trackerDate} 
            onChange={(e) => {
              if(e.target.value) setTrackerDate(e.target.value);
            }} 
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200" 
          />
        </div>
        
        <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-3xl border border-slate-200 text-center text-sm">
          {weekdays.map(d => (
            <div key={`tracker-${d.id}`} className="bg-slate-50 px-2 py-3 font-semibold text-slate-500">
              {d.label}
            </div>
          ))}
          
          {Array.from({ length: startDay }).map((_, i) => (
             <div key={`empty-${i}`} className="min-h-16 border-t border-slate-100 bg-slate-50/30"></div>
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isSelected = trackerDate === dateStr;
            // Optionally, we could show marks on the calendar if we had global attendance counts
            return (
              <button 
                key={`tracker-day-${d}`} 
                type="button" 
                onClick={() => setTrackerDate(dateStr)} 
                className={`min-h-16 border-t border-slate-100 font-medium transition ${isSelected ? 'bg-blue-50 text-[#1E40AF] font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>{d}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-800"><span>Mark students for {displayDateStr}</span></h3>
        </div>
        <div className="divide-y divide-slate-100">
          {students.map(student => {
            const status = getStudentStatus(student.id);
            const displayName = student.admin_custom_name || student.full_name;
            const displayClass = student.admin_custom_class || student.class || 'No Class';
            const initials = getInitials(displayName);
            const tone = getTone(student.id);

            return (
              <div key={`mark-${student.id}`} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tone}`}>
                    {initials}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900"><span>{displayName}</span></p>
                    <p className="text-sm text-slate-500"><span>{displayClass}</span></p>
                  </div>
                </div>
                
                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <button 
                    type="button" 
                    onClick={() => handleMark(student.id, 'onsite')}
                    disabled={processing === student.id}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${status === 'Onsite' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'} ${processing === student.id ? 'opacity-50' : ''}`}
                  >
                    <span>Onsite</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleMark(student.id, 'online')}
                    disabled={processing === student.id}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${status === 'Online' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'} ${processing === student.id ? 'opacity-50' : ''}`}
                  >
                    <span>Online</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleMark(student.id, 'absent')}
                    disabled={processing === student.id}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${status === 'Not Taken' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'} ${processing === student.id ? 'opacity-50' : ''}`}
                  >
                    <span>Not Taken</span>
                  </button>
                </div>
              </div>
            );
          })}
          {students.length === 0 && (
            <div className="px-5 py-8 text-center text-sm font-medium text-slate-500">
              No students found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
