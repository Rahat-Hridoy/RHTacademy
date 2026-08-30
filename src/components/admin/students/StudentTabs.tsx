"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check, Folder, FileText, ExternalLink, Bell,
  Pause, Trash2, Plus, Eye, AlertTriangle,
  ChevronLeft, ChevronRight, Link2, FileImage, Clock3, X
} from 'lucide-react';
import {
  updateStudentProfile,
  updateStudentAdminOverrides,
  markStudentAttendance,
  deleteStudentAttendance,
  createResourceFolder,
  deleteResourceFolder,
  addResource,
  deleteResource,
  sendNotice,
  deleteNotice,
  addPaymentCycle,
  updatePaymentCycle,
  updatePaymentCycleStatus,
  deletePaymentCycle,
  togglePaymentAlert,
  setAccountStatus,
  deleteStudentAccount,
  saveStudentScheduleTime,
  updateStudentCycleConfig,
} from '@/app/actions/studentActions';

export type TabName = 'Profile' | 'Attendance' | 'Resource Share' | 'Sent Notice' | 'Payment' | 'Action';

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function Feedback({ msg }: { msg: { text: string; type: 'success' | 'error' } | null }) {
  if (!msg) return null;
  return (
    <div
      className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
        msg.type === 'success'
          ? 'border-teal-200 bg-teal-50 text-teal-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      {msg.text}
    </div>
  );
}

function fmtDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────

export const ProfileTab = ({ student }: { student: any }) => {
  const router = useRouter();
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMsg(null);
    const res = await updateStudentAdminOverrides(student.id, new FormData(e.currentTarget));
    if (res?.error) {
      setMsg({ text: res.error, type: 'error' });
    } else {
      setMsg({ text: 'Admin view saved successfully.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Original Profile (read-only) ───────────────────────────── */}
      <section
        aria-labelledby="original-profile"
        className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
      >
        <h3 id="original-profile" className="text-lg font-black">
          <span>Original Student Profile</span>
        </h3>
        <dl className="mt-4 grid gap-3 text-sm">
          {[
            ['Original Name', student.full_name],
            ['Class', student.class],
            ['Institute', student.institute],
            ['Email', student.email],
            ['Phone', student.phone_number],
            ['Gender', student.gender],
            ['Created At', student.created_at ? new Date(student.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
          ].map(([label, value]) => (
            <div key={label as string} className="flex justify-between gap-4">
              <dt className="font-bold text-slate-500">{label}</dt>
              <dd className="font-bold text-slate-950">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Admin View Overrides ───────────────────────────────────── */}
      <form
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-black">
          <span>Admin View Overrides</span>
        </h3>
        <Feedback msg={msg} />
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-black text-slate-700">
            <span>Custom Name</span>
            <input
              name="customName"
              defaultValue={student.admin_custom_name || ''}
              placeholder={student.full_name || 'Override display name'}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block text-sm font-black text-slate-700">
            <span>Custom Class</span>
            <input
              name="customClass"
              defaultValue={student.admin_custom_class || ''}
              placeholder={student.class || 'Override class'}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block text-sm font-black text-slate-700">
            <span>Custom Institute</span>
            <input
              name="customInstitute"
              defaultValue={student.admin_custom_institute || ''}
              placeholder={student.institute || 'Override institute'}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>
        <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm font-semibold text-blue-800">
          <span>These changes only affect your admin view and do not modify the student's actual profile.</span>
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors"
        >
          <span>{isPending ? 'Saving…' : 'Save Admin View'}</span>
        </button>
      </form>
    </div>
  );
};

// ─── ATTENDANCE TAB ───────────────────────────────────────────────────────────

export const AttendanceTab = ({
  student,
  attendance,
}: {
  student: any;
  attendance: any[];
}) => {
  const router = useRouter();
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth()); // 0-indexed
  const [markFormOpen, setMarkFormOpen] = useState(false);
  const [markDate, setMarkDate] = useState(now.toISOString().split('T')[0]);
  const [markType, setMarkType] = useState<'onsite' | 'online'>('onsite');
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [scheduleTime, setScheduleTime] = useState(student.schedule_time || '16:30');
  const [schedulePending, setSchedulePending] = useState(false);

  // ── Calendar helpers ──────────────────────────────────────────────
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  // Index attendance by date string for O(1) lookup
  const attendanceByDate = useMemo(() => {
    const map: Record<string, any> = {};
    attendance.forEach(a => {
      const key = typeof a.date === 'string' ? a.date.substring(0, 10) : '';
      if (key) map[key] = a;
    });
    return map;
  }, [attendance]);

  function getCalDayRecord(day: number) {
    const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceByDate[key] ?? null;
  }

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  // ── Mark Attendance ───────────────────────────────────────────────
  const handleMark = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMsg(null);
    const res = await markStudentAttendance(student.id, markDate, markType);
    if (res?.error) {
      setMsg({ text: res.error, type: 'error' });
    } else {
      setMsg({ text: `Attendance confirmed as ${markType.toUpperCase()} for ${markDate}.`, type: 'success' });
      setMarkFormOpen(false);
      router.refresh();
    }
    setIsPending(false);
  };

  // ── Delete Attendance ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setIsPending(true);
    setMsg(null);
    const res = await deleteStudentAttendance(id);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Record removed.', type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  // ── Save Schedule Time ────────────────────────────────────────────
  const handleScheduleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchedulePending(true);
    const res = await saveStudentScheduleTime(student.id, scheduleTime);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Schedule time saved.', type: 'success' }); router.refresh(); }
    setSchedulePending(false);
  };

  const completedCount = attendance.filter(a => a.completed).length;

  return (
    <div className="space-y-6">
      {/* ── Header Row ───────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-black">
            {MONTH_NAMES[calMonth]} {calYear} Attendance
          </h3>
          <p className="text-sm text-slate-500">
            Green marks onsite · Sky-blue marks online · {completedCount} total attended
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMarkFormOpen(o => !o)}
          className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white hover:bg-blue-900 transition-colors"
        >
          <span>{markFormOpen ? 'Cancel' : 'Mark Attendance'}</span>
        </button>
      </div>

      <Feedback msg={msg} />

      {/* ── Mark Attendance Inline Form ───────────────────────────── */}
      {markFormOpen && (
        <form
          onSubmit={handleMark}
          className="grid gap-3 rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:grid-cols-4"
        >
          <label className="text-sm font-black text-slate-700">
            <span>Date</span>
            <input
              type="date"
              value={markDate}
              onChange={e => setMarkDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>
          <div className="text-sm font-black text-slate-700">
            <span>Class Type</span>
            <div className="mt-2 flex rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setMarkType('onsite')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-black transition ${markType === 'onsite' ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}
              >
                <span>Onsite</span>
              </button>
              <button
                type="button"
                onClick={() => setMarkType('online')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-black transition ${markType === 'online' ? 'bg-sky-500 text-white' : 'text-slate-600'}`}
              >
                <span>Online</span>
              </button>
            </div>
          </div>
          <label className="text-sm font-black text-slate-700">
            <span>Schedule Time</span>
            <input
              type="time"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <button
            type="submit"
            disabled={isPending}
            className="self-end rounded-xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors"
          >
            <span>{isPending ? '…' : 'Confirm'}</span>
          </button>
        </form>
      )}

      {/* ── Calendar Grid ────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="text-sm font-black text-slate-900">
            {MONTH_NAMES[calMonth]} {calYear}
          </p>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {/* Day Headers */}
        <div className="grid grid-cols-7 text-center text-sm">
          {WEEKDAY_LABELS.map(d => (
            <div key={d} className="bg-slate-50 px-2 py-3 font-black text-slate-500">
              {d}
            </div>
          ))}
          {/* Empty offset cells */}
          {Array.from({ length: mondayOffset }, (_, i) => (
            <div key={`empty-${i}`} className="border-t border-slate-100" />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const record = getCalDayRecord(day);
            return (
              <div key={`day-${day}`} className="min-h-20 border-t border-slate-100 px-2 py-3">
                <span className="font-black text-slate-700">{day}</span>
                {record && record.completed && (
                  <span
                    className={`mx-auto mt-2 block h-3 w-3 rounded-full ${
                      record.class_type === 'onsite' ? 'bg-emerald-500' : 'bg-sky-400'
                    }`}
                    aria-label={record.class_type}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── History + Schedule ───────────────────────────────────────── */}
      <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
        {/* Attendance History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h4 className="font-black text-slate-900">Attendance History</h4>
          <div className="mt-3 space-y-2">
            {attendance.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-500">
                No attendance records yet.
              </p>
            )}
            {attendance
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(record => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <span className="font-bold text-slate-700">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-black ${
                        !record.completed
                          ? 'bg-slate-100 text-slate-600'
                          : record.class_type === 'onsite'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {!record.completed
                        ? 'Absent'
                        : `${record.class_type.charAt(0).toUpperCase() + record.class_type.slice(1)} · Completed`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      disabled={isPending}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Schedule Time */}
        <form
          onSubmit={handleScheduleSave}
          className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h4 className="font-black text-slate-900">Schedule Time</h4>
          <p className="mt-1 text-xs font-semibold text-slate-500">Student's regular class time</p>
          <input
            type="time"
            value={scheduleTime}
            onChange={e => setScheduleTime(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={schedulePending}
            className="mt-3 w-full rounded-xl bg-[#0D9488] px-4 py-2.5 text-sm font-black text-white disabled:opacity-60 hover:bg-teal-700 transition-colors"
          >
            <span>{schedulePending ? 'Saving…' : 'Set Schedule'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── RESOURCE TAB ─────────────────────────────────────────────────────────────

export const ResourceTab = ({
  student,
  folders,
  resources,
}: {
  student: any;
  folders: any[];
  resources: any[];
}) => {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState<string | null>(
    folders.length > 0 ? folders[0].id : null
  );
  const [newFolderName, setNewFolderName] = useState('');
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const activeFolderData = folders.find(f => f.id === activeFolder);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsPending(true);
    setMsg(null);
    const res = await createResourceFolder(student.id, newFolderName.trim());
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: `Folder "${newFolderName.trim()}" created.`, type: 'success' });
      setNewFolderName('');
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDeleteFolder = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Delete folder "${name}" and all its files?`)) return;
    setIsPending(true);
    setMsg(null);
    const res = await deleteResourceFolder(id);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: `Folder deleted.`, type: 'success' });
      if (activeFolder === id) setActiveFolder(null);
      router.refresh();
    }
    setIsPending(false);
  };

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeFolder) return;
    setIsPending(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const res = await addResource(student.id, activeFolder, activeFolderData?.name || '', fd);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: 'Resource shared and student notified.', type: 'success' });
      setShowResourceForm(false);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setIsPending(true);
    setMsg(null);
    const res = await deleteResource(id);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Resource deleted.', type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  const activeFolderResources = resources.filter(r => r.folder_id === activeFolder);

  return (
    <div className="space-y-5">
      {/* ── Header Row ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black text-slate-500">
            Resources{activeFolderData ? ` › ${activeFolderData.name}` : ''}
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Google Drive-style Library</h3>
        </div>
        <div className="flex gap-2">
          {/* New Folder inline */}
          <form onSubmit={handleCreateFolder} className="flex items-center gap-2">
            <input
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Folder name…"
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200 w-36"
            />
            <button
              type="submit"
              disabled={isPending || !newFolderName.trim()}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
            >
              New Folder
            </button>
          </form>
          <button
            type="button"
            onClick={() => setShowResourceForm(o => !o)}
            className="rounded-2xl bg-[#1E40AF] px-4 py-2.5 text-sm font-black text-white hover:bg-blue-900 transition-colors"
          >
            {showResourceForm ? 'Cancel' : 'New Resource'}
          </button>
        </div>
      </div>

      <Feedback msg={msg} />

      {/* ── New Resource Form ─────────────────────────────────────────── */}
      {showResourceForm && (
        <form
          onSubmit={handleAddResource}
          className="grid gap-3 rounded-3xl border border-blue-100 bg-blue-50 p-5 lg:grid-cols-2"
        >
          <input name="subject" required placeholder="Title *" className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <input name="drive_link" required placeholder="Drive / File URL *" className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <input name="thumbnail_url" placeholder="Thumbnail URL (optional)" className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <select
            name="folder_id_override"
            defaultValue={activeFolder || ''}
            onChange={e => setActiveFolder(e.target.value)}
            className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none"
          >
            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <textarea name="note" placeholder="Short note / instructions (optional)" className="min-h-24 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 lg:col-span-2" />
          <button type="submit" disabled={isPending} className="rounded-xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors">
            <span>{isPending ? 'Sharing…' : 'Share Resource'}</span>
          </button>
        </form>
      )}

      {/* ── Folder Cards ──────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {folders.map(folder => {
          const count = resources.filter(r => r.folder_id === folder.id).length;
          return (
            <article
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`cursor-pointer rounded-3xl border bg-white p-5 shadow-sm transition-all ${
                activeFolder === folder.id
                  ? 'border-[#1E40AF] ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <Folder className="text-amber-500" size={32} aria-hidden="true" />
                <button
                  type="button"
                  onClick={e => handleDeleteFolder(e, folder.id, folder.name)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h4 className="mt-4 font-black text-slate-950">
                <span>{folder.name}</span>
              </h4>
              <p className="mt-1 text-sm font-bold text-slate-500">
                <span>{count} file{count !== 1 ? 's' : ''}</span>
              </p>
            </article>
          );
        })}
        {folders.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-slate-300 py-8 text-center text-sm font-semibold text-slate-500">
            No folders yet. Type a name above and click New Folder.
          </p>
        )}
      </div>

      {/* ── Resource Cards (active folder) ───────────────────────────── */}
      {activeFolder && (
        <div className="grid gap-4 md:grid-cols-2">
          {activeFolderResources.map(resource => (
            <article
              key={resource.id}
              className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                {resource.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resource.thumbnail_url}
                    alt={resource.subject}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <FileImage className="text-slate-400" aria-hidden="true" size={28} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-700">
                  {resource.folder_name || activeFolderData?.name}
                </span>
                <h4 className="mt-2 font-black text-slate-950">
                  <span>{resource.subject}</span>
                </h4>
                {resource.drive_link && (
                  <a
                    href={resource.drive_link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs font-bold text-[#1E40AF] hover:underline"
                  >
                    <Link2 size={13} />
                    <span className="truncate">{resource.drive_link.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {resource.note && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                    <span>{resource.note}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteResource(resource.id)}
                className="self-start rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}
          {activeFolderResources.length === 0 && (
            <p className="col-span-full rounded-3xl border border-dashed border-slate-200 py-8 text-center text-sm font-semibold text-slate-500">
              No resources in this folder yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── NOTICE TAB ───────────────────────────────────────────────────────────────

export const NoticeTab = ({
  student,
  notices,
}: {
  student: any;
  notices: any[];
}) => {
  const router = useRouter();
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const title = (fd.get('title') as string)?.trim();
    const content = (fd.get('content') as string)?.trim();
    if (!title || !content) { setIsPending(false); return; }
    const res = await sendNotice(student.id, title, content);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: 'Notice sent to student.', type: 'success' });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    setIsPending(true);
    setMsg(null);
    const res = await deleteNotice(id);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Notice deleted.', type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* ── Send Notice Form ──────────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-xl font-black">Send Notice</h3>
        <Feedback msg={msg} />
        <input
          name="title"
          required
          placeholder="Notice Title"
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-200"
        />
        <textarea
          name="content"
          required
          placeholder="Description"
          rows={4}
          className="mt-3 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-3 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors"
        >
          <span>{isPending ? 'Sending…' : 'Send Notice'}</span>
        </button>
      </form>

      {/* ── Previous Notices ──────────────────────────────────────────── */}
      <section
        aria-labelledby="previous-notices"
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 id="previous-notices" className="text-xl font-black">Previous Notices</h3>
        <div className="mt-4 space-y-3">
          {notices.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-sm font-semibold text-slate-500">
              No notices sent yet.
            </p>
          )}
          {notices.map(item => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-black text-slate-950 truncate">
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-500">
                    <span>
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="rounded-lg bg-white p-2 text-[#1E40AF] shadow-sm hover:bg-blue-50 transition-colors"
                    title={expandedId === item.id ? 'Collapse' : 'Expand'}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    className="rounded-lg bg-white p-2 text-red-600 shadow-sm hover:bg-red-50 transition-colors"
                    title="Delete notice"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p
                className={`mt-3 text-sm text-slate-600 ${
                  expandedId === item.id ? '' : 'line-clamp-2'
                }`}
              >
                <span>{item.content}</span>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── PAYMENT TAB ──────────────────────────────────────────────────────────────

export const PaymentTab = ({
  student,
  paymentCycles,
  attendance,
}: {
  student: any;
  paymentCycles: any[];
  attendance: any[];
}) => {
  const router = useRouter();
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [expandedCycleId, setExpandedCycleId] = useState<string | null>(null);
  const [paymentAlert, setPaymentAlert] = useState(!!student.due_payment_alert);
  // cycle config: prefer student's saved limit, default 8
  const savedLimit = student.cycle_class_limit || 8;
  const [cycleSize, setCycleSize] = useState<8 | 12>(savedLimit === 12 ? 12 : 8);

  // ── Derive attended dates per cycle ──────────────────────────────
  // Sort completed attendance by date ASC → slice by cumulative cycle counts
  const attendedSorted = useMemo(() =>
    attendance
      .filter(a => a.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [attendance]
  );

  const cyclesSorted = useMemo(() =>
    [...paymentCycles].sort((a, b) => a.cycle_number - b.cycle_number),
    [paymentCycles]
  );

  function getDatesForCycle(cycleId: string): string[] {
    let offset = 0;
    for (const c of cyclesSorted) {
      if (c.id === cycleId) {
        return attendedSorted
          .slice(offset, offset + c.total_classes_count)
          .map(a => a.date);
      }
      offset += c.total_classes_count;
    }
    return [];
  }

  // ── Save cycle config ─────────────────────────────────────────────
  const handleSaveCycleConfig = async () => {
    setIsPending(true);
    setMsg(null);
    const res = await updateStudentCycleConfig(student.id, cycleSize);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Payment cycle configuration saved.', type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  // ── Toggle payment alert ──────────────────────────────────────────
  const handleAlertToggle = async () => {
    const next = !paymentAlert;
    setPaymentAlert(next);
    setIsPending(true);
    const res = await togglePaymentAlert(student.id, next);
    if (res?.error) {
      setMsg({ text: res.error, type: 'error' });
      setPaymentAlert(!next); // revert on error
    } else {
      setMsg({ text: `Payment alert ${next ? 'enabled' : 'disabled'}.`, type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  // ── Quick status change ───────────────────────────────────────────
  const handleStatusChange = async (cycleId: string, status: 'due' | 'completed') => {
    setIsPending(true);
    setMsg(null);
    const res = await updatePaymentCycleStatus(cycleId, status);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: 'Payment status updated.', type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  // ── Delete cycle ──────────────────────────────────────────────────
  const handleDeleteCycle = async (cycleId: string, num: number) => {
    if (!confirm(`Delete Payment Cycle #${num}?`)) return;
    setIsPending(true);
    setMsg(null);
    const res = await deletePaymentCycle(cycleId);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else { setMsg({ text: `Cycle #${num} deleted.`, type: 'success' }); router.refresh(); }
    setIsPending(false);
  };

  // ── Add cycle (from expanded form) ───────────────────────────────
  const handleAddCycle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cycleNum = parseInt(fd.get('cycleNumber') as string) || 1;
    const total = parseInt(fd.get('totalClassesCount') as string) || 0;
    const limit = parseInt(fd.get('cycleClassLimit') as string) || cycleSize;
    const status = fd.get('paymentStatus') as 'due' | 'completed';
    setIsPending(true);
    setMsg(null);
    const res = await addPaymentCycle(student.id, cycleNum, total, limit, status);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: `Cycle #${cycleNum} added.`, type: 'success' });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setIsPending(false);
  };

  function statusBadge(s: string) {
    if (s === 'completed') return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    return 'bg-red-50 text-red-700 ring-red-200';
  }

  return (
    <div className="space-y-5">
      {/* ── Cycle Config Card ─────────────────────────────────────────── */}
      <section className="rounded-3xl border border-teal-200 bg-teal-50 p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-black text-slate-950">Payment Cycle Configuration</h3>
            <p className="mt-1 text-sm font-semibold text-teal-800">
              Select how many completed classes create one payment cycle.
            </p>
          </div>
          <div className="flex rounded-2xl bg-white p-1">
            <button
              type="button"
              onClick={() => setCycleSize(8)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${cycleSize === 8 ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}
            >
              8 Classes
            </button>
            <button
              type="button"
              onClick={() => setCycleSize(12)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${cycleSize === 12 ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}
            >
              12 Classes
            </button>
          </div>
          <button
            type="button"
            onClick={handleSaveCycleConfig}
            disabled={isPending}
            className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors"
          >
            Save Cycle
          </button>
        </div>
      </section>

      <Feedback msg={msg} />

      {/* ── Add New Cycle Form ────────────────────────────────────────── */}
      <details className="rounded-3xl border border-blue-100 bg-blue-50/40">
        <summary className="cursor-pointer px-5 py-4 text-sm font-black text-[#1E40AF] hover:bg-blue-50 rounded-3xl transition-colors">
          + Add New Payment Cycle
        </summary>
        <form onSubmit={handleAddCycle} className="grid gap-3 p-5 sm:grid-cols-4 items-end border-t border-blue-100">
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Cycle #</label>
            <input name="cycleNumber" type="number" defaultValue={(cyclesSorted[0]?.cycle_number || 0) + 1} required className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Classes Attended</label>
            <input name="totalClassesCount" type="number" defaultValue={0} required className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Class Limit</label>
            <input name="cycleClassLimit" type="number" defaultValue={cycleSize} required className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-black text-slate-600 block mb-1">Status</label>
            <select name="paymentStatus" defaultValue="due" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
              <option value="due">Due</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="sm:col-span-4 flex justify-end">
            <button type="submit" disabled={isPending} className="rounded-xl bg-[#1E40AF] px-5 py-2.5 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors">
              {isPending ? 'Saving…' : 'Save Cycle'}
            </button>
          </div>
        </form>
      </details>

      {/* ── Cycles List ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        {paymentCycles.length === 0 && (
          <p className="rounded-3xl border border-dashed border-slate-300 py-8 text-center text-sm font-semibold text-slate-500">
            No payment cycles recorded yet. Add one above.
          </p>
        )}
        {[...paymentCycles]
          .sort((a, b) => b.cycle_number - a.cycle_number)
          .map(cycle => {
            const isExpanded = expandedCycleId === cycle.id;
            const cycleDates = getDatesForCycle(cycle.id);
            return (
              <article key={cycle.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                {/* Cycle Row */}
                <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                  <div className="grid gap-2 sm:grid-cols-5 sm:items-center">
                    <p className="font-black text-slate-950">Cycle #{cycle.cycle_number}</p>
                    <p className="text-sm font-bold text-slate-500">{cycle.total_classes_count} classes</p>
                    <p className="text-sm font-bold text-slate-500">Limit: {cycle.cycle_class_limit}</p>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusBadge(cycle.payment_status)}`}>
                      {cycle.payment_status === 'completed' ? 'Completed' : 'Due'}
                    </span>
                    <p className="text-sm font-bold text-slate-500">
                      {cycle.payment_status === 'completed' && cycle.paid_at
                        ? new Date(cycle.paid_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Pending'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedCycleId(isExpanded ? null : cycle.id)}
                      className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-black text-[#1E40AF] hover:bg-blue-50 transition-colors"
                    >
                      {isExpanded ? 'Collapse' : 'Update'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCycle(cycle.id, cycle.cycle_number)}
                      disabled={isPending}
                      className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="mt-4 grid gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-2">
                    {/* Class dates derived from attendance */}
                    <div>
                      <p className="font-black text-slate-900">Class dates conducted</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {cycleDates.length === 0 ? (
                          <span className="text-xs font-semibold text-slate-500">
                            No attended records mapped to this cycle yet.
                          </span>
                        ) : (
                          cycleDates.map(d => (
                            <span key={d} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                              {fmtDate(d)}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick update form */}
                    <form
                      onSubmit={async e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const status = fd.get('status') as 'due' | 'completed';
                        await handleStatusChange(cycle.id, status);
                        setExpandedCycleId(null);
                      }}
                      className="grid gap-2 sm:grid-cols-2 items-end"
                    >
                      <div>
                        <label className="text-xs font-black text-slate-600 block mb-1">Status</label>
                        <select name="status" defaultValue={cycle.payment_status} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                          <option value="due">Due</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <button type="submit" disabled={isPending} className="rounded-xl bg-[#1E40AF] px-3 py-2 text-sm font-black text-white disabled:opacity-60 hover:bg-blue-900 transition-colors">
                        Save
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
      </section>

      {/* ── Due Payment Alert Toggle ──────────────────────────────────── */}
      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="flex gap-3">
          <Bell className="text-red-500 shrink-0 mt-0.5" size={22} aria-hidden="true" />
          <div>
            <h3 className="font-black text-slate-950">Due Payment Alert</h3>
            <p className="text-sm text-slate-500">
              When enabled, the student sees a payment due alert on their dashboard.
            </p>
          </div>
        </div>
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={handleAlertToggle}
          disabled={isPending}
          aria-pressed={paymentAlert}
          className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition-colors duration-200 ${paymentAlert ? 'bg-red-500' : 'bg-slate-300'}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${paymentAlert ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </section>
    </div>
  );
};

// ─── ACTION TAB ───────────────────────────────────────────────────────────────

export const ActionTab = ({
  student,
  onDeleted,
}: {
  student: any;
  onDeleted?: () => void;
}) => {
  const router = useRouter();
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [deletePreviewOpen, setDeletePreviewOpen] = useState(false);

  const isPaused = student.account_status === 'paused';

  const handlePause = async () => {
    setIsPending(true);
    setMsg(null);
    const newStatus = isPaused ? 'active' : 'paused';
    const res = await setAccountStatus(student.id, newStatus);
    if (res?.error) setMsg({ text: res.error, type: 'error' });
    else {
      setMsg({ text: `Account ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully.`, type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    setIsPending(true);
    setMsg(null);
    const res = await deleteStudentAccount(student.id);
    if (res?.error) {
      setMsg({ text: res.error, type: 'error' });
      setIsPending(false);
    } else {
      if (onDeleted) onDeleted();
      router.refresh();
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* ── Pause / Resume Card ───────────────────────────────────────── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-black">Pause / Resume Account</h3>
        <Feedback msg={msg} />
        <p className={`mt-3 flex items-center gap-2 text-sm font-black ${isPaused ? 'text-amber-700' : 'text-emerald-700'}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span>{isPaused ? 'Account Paused' : 'Account Active'}</span>
        </p>
        <button
          type="button"
          onClick={handlePause}
          disabled={isPending}
          className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white disabled:opacity-60 transition-colors ${isPaused ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
        >
          <Pause size={17} />
          <span>{isPaused ? 'Resume Account' : 'Pause Account'}</span>
        </button>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Paused students can log in but will see a restricted access page.
        </p>
      </section>

      {/* ── Delete Account Card ───────────────────────────────────────── */}
      <section className="rounded-3xl border border-red-200 bg-red-50 p-5">
        <h3 className="text-xl font-black text-red-800">Delete Account</h3>
        <button
          type="button"
          onClick={() => setDeletePreviewOpen(true)}
          disabled={isPending}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          <Trash2 size={17} />
          <span>Delete Student Account</span>
        </button>

        {/* Inline Confirmation Panel */}
        {deletePreviewOpen && (
          <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-red-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={20} aria-hidden="true" />
              <div>
                <p className="font-black text-slate-950">
                  Are you sure you want to delete this student?
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  This permanently removes their account, attendance, resources, notices, and payment records. This cannot be undone.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeletePreviewOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                  >
                    {isPending ? 'Deleting…' : 'Confirm Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
