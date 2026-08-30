"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  CalendarDays, 
  Clock3, 
  Folder, 
  FileText, 
  ExternalLink, 
  Bell, 
  Pause, 
  Trash2, 
  Plus, 
  Edit3,
  X
} from 'lucide-react';
import { 
  updateStudentProfile, 
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
  deleteStudentAccount
} from '@/app/actions/studentActions';

export type TabName = 'Profile' | 'Attendance' | 'Resource Share' | 'Sent Notice' | 'Payment' | 'Action';

// ------------------- PROFILE TAB -------------------
export const ProfileTab = ({ student }: { student: any }) => {
  const router = useRouter();
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setNotice(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateStudentProfile(student.id, formData);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: 'Profile updated successfully!', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <div>
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold bg-blue-100 text-blue-800 shadow-inner">
          {student.full_name?.substring(0, 2).toUpperCase() || 'ST'}
        </div>
        <p className="mt-3 text-center text-sm font-medium text-slate-500">
          Joined {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        {notice && (
          <div className={`sm:col-span-2 text-sm p-3 rounded-lg border font-semibold ${notice.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
            {notice.text}
          </div>
        )}

        <div className="sm:col-span-2 border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Original Profile Details</h3>
        </div>
        
        <label className="text-xs font-bold uppercase text-slate-500">
          Full Name
          <input 
            name="fullName"
            defaultValue={student.full_name || ''} 
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>
        
        <label className="text-xs font-bold uppercase text-slate-500">
          Phone Number
          <input 
            name="phoneNumber"
            defaultValue={student.phone_number || ''} 
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
            placeholder="e.g. +8801700000000"
          />
        </label>

        <label className="text-xs font-bold uppercase text-slate-500">
          Class / Grade
          <input 
            name="class"
            defaultValue={student.class || ''} 
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>

        <label className="text-xs font-bold uppercase text-slate-500">
          Institute / School
          <input 
            name="institute"
            defaultValue={student.institute || ''} 
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>
        
        <div className="sm:col-span-2 border-b border-slate-100 pb-2 mt-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Custom Overrides</h3>
        </div>
        
        <label className="text-xs font-bold uppercase text-slate-500">
          Custom Name
          <input 
            name="customName" 
            defaultValue={student.admin_custom_name || ''} 
            placeholder={student.full_name || 'Override display name'}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>
        <label className="text-xs font-bold uppercase text-slate-500">
          Custom Class
          <input 
            name="customClass" 
            defaultValue={student.admin_custom_class || ''} 
            placeholder={student.class || 'Override class'}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>
        <label className="text-xs font-bold uppercase text-slate-500 sm:col-span-2">
          Custom Institute
          <input 
            name="customInstitute" 
            defaultValue={student.admin_custom_institute || ''} 
            placeholder={student.institute || 'Override institute'}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none ring-blue-200 focus:ring-2" 
          />
        </label>
        
        <div className="sm:col-span-2 mt-2">
          <button 
            type="submit" 
            disabled={isPending} 
            className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-50 transition-colors shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              <Check size={16} />
              {isPending ? 'Saving...' : 'Save Profile Changes'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

// ------------------- ATTENDANCE TAB -------------------
export const AttendanceTab = ({ student, attendance }: { student: any, attendance: any[] }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleMark = async (type: 'onsite' | 'online' | 'absent') => {
    setIsPending(true);
    setNotice(null);
    const res = await markStudentAttendance(student.id, selectedDate, type);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Attendance marked as ${type.toUpperCase()} for ${selectedDate}`, type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to remove this attendance record?')) return;
    setIsPending(true);
    setNotice(null);
    const res = await deleteStudentAttendance(recordId);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: 'Attendance record deleted successfully.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Attendance Tracker</h3>
          <p className="text-sm text-slate-500">{attendance.filter(a => a.completed).length} total attended classes</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-slate-400" />
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2 font-medium text-slate-700"
          />
        </div>
      </div>
      
      {notice && (
        <div className={`mb-4 text-sm p-3 rounded-lg border font-semibold ${notice.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
          {notice.text}
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          disabled={isPending}
          onClick={() => handleMark('onsite')} 
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          Mark Onsite
        </button>
        <button 
          disabled={isPending}
          onClick={() => handleMark('online')} 
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          Mark Online
        </button>
        <button 
          disabled={isPending}
          onClick={() => handleMark('absent')} 
          className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          Mark Absent
        </button>
      </div>

      <h4 className="font-bold text-sm mb-3 text-slate-700">Attendance Records</h4>
      <div className="grid gap-2 text-sm">
        {attendance.length === 0 && <p className="text-slate-500 py-4 text-center border border-dashed rounded-xl">No attendance records found for this student.</p>}
        {attendance.map(record => (
          <div key={record.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${!record.completed ? 'bg-slate-300' : record.class_type === 'onsite' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <span className="font-semibold text-slate-800">{new Date(record.date).toDateString()}</span>
            <span className={`ml-auto font-medium text-xs px-2.5 py-1 rounded-full capitalize ${!record.completed ? 'bg-slate-100 text-slate-600' : record.class_type === 'onsite' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
              {!record.completed ? 'Absent' : record.class_type}
            </span>
            <button
              onClick={() => handleDelete(record.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-2"
              title="Delete attendance record"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------- RESOURCE TAB -------------------
export const ResourceTab = ({ student, folders, resources }: { student: any, folders: any[], resources: any[] }) => {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState<string | null>(folders.length > 0 ? folders[0].id : null);
  const [newFolderName, setNewFolderName] = useState('');
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsPending(true);
    setNotice(null);
    const res = await createResourceFolder(student.id, newFolderName);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Folder "${newFolderName}" created.`, type: 'success' });
      setNewFolderName('');
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDeleteFolder = async (e: React.MouseEvent, folderId: string, folderName: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete folder "${folderName}" and all its resources?`)) return;
    setIsPending(true);
    setNotice(null);
    const res = await deleteResourceFolder(folderId);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Folder "${folderName}" deleted.`, type: 'success' });
      if (activeFolder === folderId) {
        setActiveFolder(null);
      }
      router.refresh();
    }
    setIsPending(false);
  };

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeFolder) return;
    setIsPending(true);
    setNotice(null);
    const formData = new FormData(e.currentTarget);
    const folder = folders.find(f => f.id === activeFolder);
    const res = await addResource(student.id, activeFolder, folder?.name || '', formData);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: 'Resource file shared successfully.', type: 'success' });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    setIsPending(true);
    setNotice(null);
    const res = await deleteResource(resourceId);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: 'Resource deleted.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Shared Resources</h3>
          <p className="text-sm text-slate-500">Materials and files visible to {student.admin_custom_name || student.full_name}.</p>
        </div>
        <form onSubmit={handleCreateFolder} className="flex items-center gap-2">
          <input 
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            placeholder="New folder name..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2"
          />
          <button 
            type="submit" 
            disabled={isPending || !newFolderName.trim()} 
            className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-50 transition-colors shadow-sm"
          >
            Create Folder
          </button>
        </form>
      </div>

      {notice && (
        <div className={`mb-4 text-sm p-3 rounded-lg border font-semibold ${notice.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
          {notice.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
        {folders.map(folder => (
          <div 
            key={folder.id} 
            onClick={() => setActiveFolder(folder.id)}
            className={`group cursor-pointer flex items-center justify-between gap-3 rounded-xl border p-4 transition-all ${activeFolder === folder.id ? 'border-blue-800 bg-blue-50/70 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Folder className="text-amber-500 shrink-0" size={22} />
              <p className="font-bold text-slate-800 truncate">{folder.name}</p>
            </div>
            <button
              onClick={(e) => handleDeleteFolder(e, folder.id, folder.name)}
              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-white transition-colors shrink-0"
              title="Delete folder"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {folders.length === 0 && (
          <p className="col-span-full text-slate-500 py-6 text-center border border-dashed rounded-xl">
            No resource folders created yet. Create a folder above to start sharing resources.
          </p>
        )}
      </div>

      {activeFolder && (
        <div className="border-t border-slate-200 pt-6">
          <h4 className="font-bold text-slate-900 mb-4">Add Resource to Selected Folder</h4>
          <form onSubmit={handleAddResource} className="grid gap-4 sm:grid-cols-2 mb-8 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            <input name="subject" required placeholder="Subject / Title *" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2" />
            <input name="drive_link" required placeholder="Drive / File URL *" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2" />
            <input name="thumbnail_url" placeholder="Thumbnail URL (Optional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2" />
            <input name="note" placeholder="Short Note / Instructions (Optional)" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-blue-200 focus:ring-2" />
            <button 
              type="submit" 
              disabled={isPending}
              className="sm:col-span-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Plus size={16} />
                {isPending ? 'Sharing File...' : 'Share File with Student'}
              </span>
            </button>
          </form>

          <h4 className="font-bold text-slate-900 mb-4">Files in Folder</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {resources.filter(r => r.folder_id === activeFolder).map(resource => (
              <div key={resource.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{resource.subject}</p>
                    {resource.note && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{resource.note}</p>}
                    {resource.drive_link && (
                      <a 
                        href={resource.drive_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold mt-2"
                      >
                        <ExternalLink size={12} /> Open File
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  title="Delete file resource"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {resources.filter(r => r.folder_id === activeFolder).length === 0 && (
              <p className="col-span-full text-slate-500 py-6 text-center text-sm border border-dashed rounded-xl">
                No resources in this folder yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------- NOTICE TAB -------------------
export const NoticeTab = ({ student, notices }: { student: any, notices: any[] }) => {
  const router = useRouter();
  const [noticeState, setNoticeState] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setNoticeState(null);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    const res = await sendNotice(student.id, title, content);
    if (res?.error) {
      setNoticeState({ text: res.error, type: 'error' });
    } else {
      setNoticeState({ text: 'Notice sent to student successfully.', type: 'success' });
      (e.target as HTMLFormElement).reset();
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDelete = async (noticeId: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    setIsPending(true);
    setNoticeState(null);
    const res = await deleteNotice(noticeId);
    if (res?.error) {
      setNoticeState({ text: res.error, type: 'error' });
    } else {
      setNoticeState({ text: 'Notice deleted.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Send a Notice</h3>
        <p className="text-sm text-slate-500 mt-0.5 mb-4">Broadcast an announcement or alert to this student.</p>

        {noticeState && (
          <div className={`mb-4 text-sm p-3 rounded-lg border font-semibold ${noticeState.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
            {noticeState.text}
          </div>
        )}

        <form onSubmit={handleSend} className="flex flex-col gap-3">
          <input 
            name="title" 
            required 
            placeholder="Notice Title *" 
            className="rounded-xl border border-slate-200 p-3 text-sm outline-none ring-blue-200 focus:ring-2 font-medium" 
          />
          <textarea 
            name="content" 
            required 
            placeholder="Write notice content for this student..." 
            className="min-h-32 resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none ring-blue-200 focus:ring-2" 
          />
          <button 
            type="submit" 
            disabled={isPending} 
            className="self-start rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isPending ? 'Sending...' : 'Send Notice'}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Previously Sent Notices</h3>
        <div className="flex flex-col gap-3">
          {notices.length === 0 && (
            <p className="text-sm text-slate-500 py-6 text-center border border-dashed rounded-xl">No notices sent yet.</p>
          )}
          {notices.map(noticeItem => (
            <div key={noticeItem.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative group">
              <button 
                onClick={() => handleDelete(noticeItem.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1 rounded hover:bg-white transition-colors"
                title="Delete notice"
              >
                <Trash2 size={16} />
              </button>
              <p className="font-bold text-sm text-slate-900 mb-1 pr-8">{noticeItem.title}</p>
              <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{noticeItem.content}</p>
              <p className="text-[10px] font-semibold text-slate-400 mt-3">{new Date(noticeItem.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ------------------- PAYMENT TAB -------------------
export const PaymentTab = ({ student, paymentCycles }: { student: any, paymentCycles: any[] }) => {
  const router = useRouter();
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);

  const handleAlertToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPending(true);
    const res = await togglePaymentAlert(student.id, e.target.checked);
    if (res?.error) setNotice({ text: res.error, type: 'error' });
    else {
      setNotice({ text: 'Payment alert preference updated.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  const handleStatusChange = async (cycleId: string, status: 'due' | 'completed') => {
    setIsPending(true);
    const res = await updatePaymentCycleStatus(cycleId, status);
    if (res?.error) setNotice({ text: res.error, type: 'error' });
    else {
      setNotice({ text: 'Payment status updated.', type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  const handleAddCycle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setNotice(null);
    const formData = new FormData(e.currentTarget);
    const cycleNum = parseInt(formData.get('cycleNumber') as string) || 1;
    const totalClasses = parseInt(formData.get('totalClassesCount') as string) || 0;
    const classLimit = parseInt(formData.get('cycleClassLimit') as string) || 12;
    const status = formData.get('paymentStatus') as 'due' | 'completed';

    const res = await addPaymentCycle(student.id, cycleNum, totalClasses, classLimit, status);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Payment Cycle #${cycleNum} added successfully.`, type: 'success' });
      setShowAddForm(false);
      router.refresh();
    }
    setIsPending(false);
  };

  const handleUpdateCycle = async (e: React.FormEvent<HTMLFormElement>, cycleId: string) => {
    e.preventDefault();
    setIsPending(true);
    setNotice(null);
    const formData = new FormData(e.currentTarget);
    const cycleNum = parseInt(formData.get('cycleNumber') as string) || 1;
    const totalClasses = parseInt(formData.get('totalClassesCount') as string) || 0;
    const classLimit = parseInt(formData.get('cycleClassLimit') as string) || 12;
    const status = formData.get('paymentStatus') as 'due' | 'completed';

    const res = await updatePaymentCycle(cycleId, cycleNum, totalClasses, classLimit, status);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Cycle #${cycleNum} updated successfully.`, type: 'success' });
      setEditingCycleId(null);
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDeleteCycle = async (cycleId: string, cycleNum: number) => {
    if (!confirm(`Are you sure you want to delete Payment Cycle #${cycleNum}?`)) return;
    setIsPending(true);
    setNotice(null);
    const res = await deletePaymentCycle(cycleId);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Payment Cycle #${cycleNum} deleted.`, type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Payment & Class Cycles</h3>
          <p className="text-sm text-slate-500">Track class packages, limits, and due statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 cursor-pointer">
            <Bell size={15} className="text-red-500" />
            Due Alerts
            <input 
              type="checkbox" 
              defaultChecked={student.due_payment_alert} 
              onChange={handleAlertToggle}
              className="h-4 w-4 accent-red-500 cursor-pointer" 
            />
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Add Cycle
          </button>
        </div>
      </div>

      {notice && (
        <div className={`mb-4 text-sm p-3 rounded-lg border font-semibold ${notice.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
          {notice.text}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddCycle} className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/40 grid gap-3 sm:grid-cols-4 items-end">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Cycle Number</label>
            <input name="cycleNumber" type="number" defaultValue={(paymentCycles[0]?.cycle_number || 0) + 1} required className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Attended Classes</label>
            <input name="totalClassesCount" type="number" defaultValue={0} required className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Class Limit</label>
            <input name="cycleClassLimit" type="number" defaultValue={12} required className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
            <select name="paymentStatus" defaultValue="due" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
              <option value="due">Due</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="sm:col-span-4 flex items-center justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900 transition-colors">
              Save Cycle
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {paymentCycles.length === 0 && (
          <p className="text-sm text-slate-500 py-6 text-center border border-dashed rounded-xl">No payment cycles recorded yet.</p>
        )}

        {paymentCycles.map(cycle => {
          const isEditing = editingCycleId === cycle.id;

          if (isEditing) {
            return (
              <form key={cycle.id} onSubmit={(e) => handleUpdateCycle(e, cycle.id)} className="p-4 rounded-xl border border-blue-300 bg-white shadow-sm grid gap-3 sm:grid-cols-4 items-end">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Cycle Number</label>
                  <input name="cycleNumber" type="number" defaultValue={cycle.cycle_number} required className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Attended Classes</label>
                  <input name="totalClassesCount" type="number" defaultValue={cycle.total_classes_count} required className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Class Limit</label>
                  <input name="cycleClassLimit" type="number" defaultValue={cycle.cycle_class_limit} required className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
                  <select name="paymentStatus" defaultValue={cycle.payment_status} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none">
                    <option value="due">Due</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="sm:col-span-4 flex items-center justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setEditingCycleId(null)} className="px-3 py-1 text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" disabled={isPending} className="rounded-lg bg-blue-800 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-900">Update</button>
                </div>
              </form>
            );
          }

          return (
            <div key={cycle.id} className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center transition-colors ${cycle.payment_status === 'completed' ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}>
              <div>
                <p className="font-bold text-slate-900">
                  Cycle #{cycle.cycle_number} 
                  <span className="ml-2 text-sm font-semibold text-slate-500">({cycle.total_classes_count} / {cycle.cycle_class_limit} classes)</span>
                </p>
                <p className={`mt-1 text-xs font-semibold ${cycle.payment_status === 'completed' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {cycle.payment_status === 'completed' ? `Completed · Paid on ${new Date(cycle.paid_at || cycle.updated_at || Date.now()).toLocaleDateString()}` : 'Due · Payment Pending'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select 
                  value={cycle.payment_status}
                  onChange={(e) => handleStatusChange(cycle.id, e.target.value as 'due' | 'completed')}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none cursor-pointer ${cycle.payment_status === 'completed' ? 'border-emerald-200 bg-white text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-800'}`}
                >
                  <option value="due">Status: Due</option>
                  <option value="completed">Status: Completed</option>
                </select>

                <button
                  onClick={() => setEditingCycleId(cycle.id)}
                  className="p-2 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Edit cycle numbers"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => handleDeleteCycle(cycle.id, cycle.cycle_number)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete cycle"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ------------------- ACTION TAB -------------------
export const ActionTab = ({ student, onDeleted }: { student: any; onDeleted?: () => void }) => {
  const router = useRouter();
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handlePause = async () => {
    setIsPending(true);
    setNotice(null);
    const newStatus = student.account_status === 'paused' ? 'active' : 'paused';
    const res = await setAccountStatus(student.id, newStatus);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      setNotice({ text: `Account status updated to ${newStatus.toUpperCase()}.`, type: 'success' });
      router.refresh();
    }
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${student.full_name || 'this student'}? This action is permanent and cannot be undone.`)) return;
    setIsPending(true);
    setNotice(null);
    const res = await deleteStudentAccount(student.id);
    if (res?.error) {
      setNotice({ text: res.error, type: 'error' });
    } else {
      if (onDeleted) onDeleted();
      router.refresh();
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-xl">
      <h3 className="text-lg font-bold text-slate-900">Account Administrative Actions</h3>
      <p className="mt-1 text-sm text-slate-500">Manage student platform access status or remove student records.</p>
      
      {notice && (
        <div className={`mt-4 text-sm p-3 rounded-lg border font-semibold ${notice.type === 'success' ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-red-800 bg-red-50 border-red-200'}`}>
          {notice.text}
        </div>
      )}
      
      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          disabled={isPending}
          onClick={handlePause} 
          className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Pause size={16} />
          {student.account_status === 'paused' ? 'Resume Student Account' : 'Pause Student Account'}
        </button>
        
        <button 
          disabled={isPending}
          onClick={handleDelete} 
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Trash2 size={16} />
          Delete Student Account
        </button>
      </div>
      
      <div className="mt-6 rounded-xl border border-red-100 bg-red-50/70 p-4 text-xs text-red-900 leading-relaxed">
        <strong className="block font-bold mb-1">Permanent Removal Notice</strong>
        Deleting a student account removes their credentials from authentication and deletes all associated records (attendance, shared resources, notices, and payment cycles).
      </div>
    </div>
  );
};


