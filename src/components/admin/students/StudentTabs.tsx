"use client";

import React, { useState } from 'react';
import { Check, CalendarDays, Clock3, Folder, FileText, ExternalLink, Bell, Pause, Trash2 } from 'lucide-react';
import { 
  updateStudentProfile, 
  markStudentAttendance, 
  createResourceFolder, 
  addResource, 
  sendNotice, 
  deleteNotice,
  updatePaymentCycleStatus,
  togglePaymentAlert,
  setAccountStatus,
  deleteStudentAccount
} from '@/app/actions/studentActions';

// Type definitions passed down
export type TabName = 'Profile' | 'Attendance' | 'Resource Share' | 'Sent Notice' | 'Payment' | 'Action';

export const ProfileTab = ({ student }: { student: any }) => {
  const [notice, setNotice] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateStudentProfile(student.id, formData);
    if (res.error) setNotice(res.error);
    else setNotice('Profile updated successfully');
    setIsPending(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold bg-blue-100 text-blue-800`}>
          {student.full_name?.substring(0, 2).toUpperCase()}
        </div>
        <p className="mt-3 text-center text-sm text-slate-500">Joined {new Date(student.created_at).toLocaleDateString()}</p>
      </div>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {notice && <div className="sm:col-span-2 text-sm text-emerald-700 bg-emerald-50 p-2 rounded">{notice}</div>}
        <div className="sm:col-span-2"><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">Original details</h3></div>
        
        <label className="text-sm font-semibold text-slate-600">Name
          <input readOnly value={student.full_name || ''} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500 outline-none" />
        </label>
        <label className="text-sm font-semibold text-slate-600">Class
          <input readOnly value={student.class || ''} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-500 outline-none" />
        </label>
        
        <div className="sm:col-span-2"><h3 className="mb-3 mt-2 text-sm font-bold uppercase tracking-wider text-slate-400">Admin override</h3></div>
        
        <label className="text-sm font-semibold text-slate-600">Custom Name
          <input name="customName" defaultValue={student.admin_custom_name || student.full_name} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-200 focus:ring-2" />
        </label>
        <label className="text-sm font-semibold text-slate-600">Custom Class
          <input name="customClass" defaultValue={student.admin_custom_class || student.class} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-200 focus:ring-2" />
        </label>
        <label className="text-sm font-semibold text-slate-600 sm:col-span-2">Custom Institute
          <input name="customInstitute" defaultValue={student.admin_custom_institute || student.institute} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none ring-blue-200 focus:ring-2" />
        </label>
        
        <div className="sm:col-span-2">
          <button type="submit" disabled={isPending} className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-50">
            <span className="inline-flex items-center gap-2"><Check size={16} />{isPending ? 'Saving...' : 'Save changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const AttendanceTab = ({ student, attendance }: { student: any, attendance: any[] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notice, setNotice] = useState('');

  const handleMark = async (type: 'onsite' | 'online' | 'absent') => {
    setNotice('');
    const res = await markStudentAttendance(student.id, selectedDate, type);
    if (res.error) setNotice(res.error);
    else setNotice(`Attendance marked as ${type}`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold">Attendance</h3>
          <p className="text-sm text-slate-500">{attendance.filter(a => a.completed).length} classes attended</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
      
      {notice && <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 p-2 rounded">{notice}</div>}
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => handleMark('onsite')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">Mark Onsite</button>
        <button onClick={() => handleMark('online')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Mark Online</button>
        <button onClick={() => handleMark('absent')} className="rounded-lg bg-slate-500 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600">Mark Absent</button>
      </div>

      <h4 className="font-semibold text-sm mb-3">Recent Attendance Records</h4>
      <div className="grid gap-2 text-sm">
        {attendance.length === 0 && <p className="text-slate-500">No records found.</p>}
        {attendance.map(record => (
          <div key={record.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200">
            <span className={`h-2.5 w-2.5 rounded-full ${!record.completed ? 'bg-slate-300' : record.class_type === 'onsite' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <span className="font-semibold">{new Date(record.date).toDateString()}</span>
            <span className="text-slate-500 ml-auto capitalize">{!record.completed ? 'Absent' : record.class_type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResourceTab = ({ student, folders, resources }: { student: any, folders: any[], resources: any[] }) => {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await createResourceFolder(student.id, newFolderName);
    setNewFolderName('');
  };

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeFolder) return;
    const formData = new FormData(e.currentTarget);
    const folder = folders.find(f => f.id === activeFolder);
    await addResource(student.id, activeFolder, folder.name, formData);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Shared resources</h3>
          <p className="text-sm text-slate-500">Materials visible to {student.full_name}.</p>
        </div>
        <form onSubmit={handleCreateFolder} className="flex items-center gap-2">
          <input 
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="New folder name..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button type="submit" className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900">
            Create Folder
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
        {folders.map(folder => (
          <div 
            key={folder.id} 
            onClick={() => setActiveFolder(folder.id)}
            className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 transition ${activeFolder === folder.id ? 'border-blue-800 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <Folder className="text-amber-500 shrink-0" />
            <div className="truncate">
              <p className="font-semibold truncate">{folder.name}</p>
            </div>
          </div>
        ))}
      </div>

      {activeFolder && (
        <div className="border-t border-slate-200 pt-6">
          <h4 className="font-bold mb-4">Add Resource to Folder</h4>
          <form onSubmit={handleAddResource} className="grid gap-4 sm:grid-cols-2 mb-8">
            <input name="subject" required placeholder="Subject / Title" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
            <input name="drive_link" required placeholder="Google Drive Link" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
            <input name="thumbnail_url" placeholder="Thumbnail URL (Optional)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
            <input name="note" placeholder="Short Note (Optional)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none" />
            <button type="submit" className="sm:col-span-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">
              <span className="inline-flex items-center gap-2"><ExternalLink size={15} />Share File</span>
            </button>
          </form>

          <h4 className="font-bold mb-4">Resources in Folder</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {resources.filter(r => r.folder_id === activeFolder).map(resource => (
              <div key={resource.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
                <FileText className="text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="font-semibold truncate">{resource.subject}</p>
                  <p className="text-xs text-slate-500 truncate">{resource.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const NoticeTab = ({ student, notices }: { student: any, notices: any[] }) => {
  const [isPending, setIsPending] = useState(false);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    await sendNotice(student.id, title, content);
    (e.target as HTMLFormElement).reset();
    setIsPending(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold">Send a notice</h3>
        <form onSubmit={handleSend} className="mt-4 flex flex-col gap-3">
          <input name="title" required placeholder="Notice Title" className="rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <textarea name="content" required placeholder="Write a message for this student..." className="min-h-32 resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200" />
          <button type="submit" disabled={isPending} className="self-start rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {isPending ? 'Sending...' : 'Send notice'}
          </button>
        </form>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Previously Sent Notices</h3>
        <div className="flex flex-col gap-3">
          {notices.length === 0 && <p className="text-sm text-slate-500">No notices sent.</p>}
          {notices.map(notice => (
            <div key={notice.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
              <button 
                onClick={() => deleteNotice(notice.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
              <p className="font-bold text-sm mb-1 pr-6">{notice.title}</p>
              <p className="text-xs text-slate-500 whitespace-pre-wrap">{notice.content}</p>
              <p className="text-[10px] text-slate-400 mt-2">{new Date(notice.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PaymentTab = ({ student, paymentCycles }: { student: any, paymentCycles: any[] }) => {
  const handleAlertToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await togglePaymentAlert(student.id, e.target.checked);
  };

  const handleStatusChange = async (cycleId: string, status: 'due' | 'completed') => {
    await updatePaymentCycleStatus(cycleId, status);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Payment cycles</h3>
          <p className="text-sm text-slate-500">Track class packages and due dates.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Bell size={16} className="text-red-500" />
          Due alerts
          <input 
            type="checkbox" 
            defaultChecked={student.due_payment_alert} 
            onChange={handleAlertToggle}
            className="h-4 w-4 accent-red-500 cursor-pointer" 
          />
        </label>
      </div>

      <div className="space-y-3">
        {paymentCycles.length === 0 && <p className="text-sm text-slate-500">No payment cycles found.</p>}
        {paymentCycles.map(cycle => (
          <div key={cycle.id} className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${cycle.payment_status === 'completed' ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
            <div>
              <p className="font-bold">Cycle #{cycle.cycle_number} <span className="ml-2 text-sm font-normal text-slate-500">{cycle.total_classes_count} / {cycle.cycle_class_limit} classes</span></p>
              <p className={`mt-1 text-xs ${cycle.payment_status === 'completed' ? 'text-emerald-700' : 'text-red-600'}`}>
                {cycle.payment_status === 'completed' ? `Completed · Paid ${new Date(cycle.paid_at).toLocaleDateString()}` : 'Due · Paid date pending'}
              </p>
            </div>
            <select 
              value={cycle.payment_status}
              onChange={(e) => handleStatusChange(cycle.id, e.target.value as 'due' | 'completed')}
              className={`rounded-lg border px-3 py-2 text-sm outline-none ${cycle.payment_status === 'completed' ? 'border-emerald-200 bg-white' : 'border-slate-200'}`}
            >
              <option value="due">Due</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ActionTab = ({ student }: { student: any }) => {
  const [notice, setNotice] = useState('');

  const handlePause = async () => {
    const newStatus = student.account_status === 'paused' ? 'active' : 'paused';
    const res = await setAccountStatus(student.id, newStatus);
    if (res.error) setNotice(res.error);
    else setNotice(`Account has been ${newStatus}.`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    const res = await deleteStudentAccount(student.id);
    if (res.error) setNotice(res.error);
    else {
      alert('Student deleted successfully');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-lg font-bold">Account actions</h3>
      <p className="mt-1 text-sm text-slate-500">These actions affect the student’s access immediately.</p>
      
      {notice && <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">{notice}</div>}
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          onClick={handlePause} 
          className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-100 transition-colors"
        >
          <Pause size={16} />
          {student.account_status === 'paused' ? 'Resume Account' : 'Pause Account'}
        </button>
        <button 
          onClick={handleDelete} 
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
      
      <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
        <strong>Delete confirmation preview</strong>
        <p className="mt-1">Deleting this account removes access and payment history permanently. A browser confirmation will be required.</p>
      </div>
    </div>
  );
};
