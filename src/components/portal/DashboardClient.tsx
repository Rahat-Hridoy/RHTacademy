'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CircleAlert, Search } from 'lucide-react';
import { AttendanceGauge } from '@/components/portal/AttendanceGauge';

interface AttendanceRecord {
  date: string;
  class_type: string;
  completed: boolean;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface PaymentCycle {
  id: string;
  cycle_number: number;
  payment_status: string;
  total_classes_count: number;
  cycle_class_limit: number;
  paid_at: string | null;
  alert_active: boolean;
}

interface DashboardClientProps {
  studentId: string;
  attendance: AttendanceRecord[];
  notices: Notice[];
  latestCycle: {
    id: string;
    cycle_number: number;
    payment_status: string;
    total_classes_count: number;
    cycle_class_limit: number;
    paid_at: string | null;
    alert_active: boolean;
  } | null;
  hasDueAlert: boolean;
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NOTICES_PER_PAGE = 5;

// Build calendar month grid for current month
const buildMonthGrid = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, firstDay, daysInMonth };
};

export const DashboardClient = ({
  studentId,
  attendance,
  notices,
  latestCycle,
  hasDueAlert,
}: DashboardClientProps) => {
  const router = useRouter();
  const [noticePage, setNoticePage] = useState(1);
  const { year, month, firstDay, daysInMonth } = buildMonthGrid();

  // Build a quick lookup: dateString → class_type
  const attendanceMap = new Map(
    attendance.filter((a) => a.completed).map((a) => [a.date, a.class_type])
  );

  const completedCount = attendance.filter((a) => a.completed).length;
  const cycleLimit = latestCycle?.cycle_class_limit ?? 8;

  // Month name
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Paginate notices
  const totalNoticePages = Math.max(1, Math.ceil(notices.length / NOTICES_PER_PAGE));
  const visibleNotices = notices.slice(
    (noticePage - 1) * NOTICES_PER_PAGE,
    noticePage * NOTICES_PER_PAGE
  );

  // Build calendar grid cells (blanks for firstDay offset)
  const calendarCells: Array<{ day: number | null; dateKey: string | null }> = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push({ day: null, dateKey: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateKey });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const formatNoticeDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-7">
      {/* Due Payment Alert */}
      {hasDueAlert && (
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white p-2.5 text-red-600 shadow-sm">
              <CircleAlert size={21} />
            </span>
            <div>
              <h3 className="font-semibold text-red-900">Pending payment due</h3>
              <p className="text-sm text-red-700">You have a pending payment due. Please complete your payment.</p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/portal/${studentId}/payment`)}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            View Payment
          </button>
        </section>
      )}

      {/* Calendar + Gauge */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        {/* Calendar */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Class track</p>
              <h3 className="mt-1 text-xl font-semibold">{monthName}</h3>
            </div>
            <span className="rounded-lg border border-slate-200 p-2 text-slate-400">
              <Search size={17} />
            </span>
          </div>
          {/* Weekday headers */}
          <div className="mb-4 grid grid-cols-7 text-center text-xs font-bold uppercase text-slate-400">
            {WEEK_DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {calendarCells.map((cell, idx) => {
              if (!cell.day || !cell.dateKey) {
                return <span key={`blank-${idx}`} />;
              }
              const kind = attendanceMap.get(cell.dateKey);
              const isToday = cell.dateKey === todayStr;
              return (
                <span
                  key={cell.dateKey}
                  className={`mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-full text-sm font-semibold text-slate-700 ${isToday ? 'bg-blue-800 text-white' : 'hover:bg-slate-50'}`}
                >
                  <span>{cell.day}</span>
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                      kind === 'onsite' ? 'bg-emerald-500' : kind === 'online' ? 'bg-sky-400' : 'bg-transparent'
                    }`}
                  />
                </span>
              );
            })}
          </div>
          <div className="mt-7 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Onsite</span>
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-sky-400" />Online</span>
          </div>
        </article>

        {/* Attendance Gauge */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7">
          <AttendanceGauge
            completed={completedCount}
            total={cycleLimit}
            label="Classes Completed"
            size={190}
          />
          <div className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current cycle</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Cycle #{latestCycle?.cycle_number ?? 1}
              </p>
            </div>
            {latestCycle?.payment_status === 'due' ? (
              <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">DUE</span>
            ) : latestCycle?.payment_status === 'completed' ? (
              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">PAID</span>
            ) : (
              <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">—</span>
            )}
          </div>
        </article>
      </section>

      {/* Notice Board */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-7">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Stay informed</p>
            <h3 className="mt-1 text-xl font-semibold">Notice Board</h3>
          </div>
        </div>

        {notices.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-medium text-slate-500">
            No notices yet. Your teacher will post updates here.
          </p>
        ) : (
          <div className="grid gap-3">
            {visibleNotices.map((notice) => (
              <article
                key={notice.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-semibold text-slate-800">{notice.title}</h4>
                  <time className="text-xs font-medium text-slate-400">{formatNoticeDate(notice.created_at)}</time>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">{notice.content}</p>
              </article>
            ))}
          </div>
        )}

        {totalNoticePages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold text-slate-500">
              Page {noticePage} of {totalNoticePages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={noticePage === 1}
                onClick={() => setNoticePage((p) => p - 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={noticePage === totalNoticePages}
                onClick={() => setNoticePage((p) => p + 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
