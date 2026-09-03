'use client';

import React, { useState } from 'react';
import { Bell, CircleAlert, FileText, Menu } from 'lucide-react';
import { MaleAvatar } from './MaleAvatar';
import { ProfileModal } from './ProfileModal';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface TopBarProps {
  onMobileNavToggle: () => void;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  studentPhone: string;
  studentInstitute: string;
  studentGender: 'male' | 'female';
  studentId: string;
}

export const TopBar = ({
  onMobileNavToggle,
  studentName,
  studentClass,
  studentEmail,
  studentPhone,
  studentInstitute,
  studentGender,
  studentId,
}: TopBarProps) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('notifications')
        .select('id, title, message, created_at, is_read')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    };
    fetchNotifications();
  }, [studentId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    const supabase = createClient();
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('student_id', studentId)
      .eq('is_read', false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 shadow-sm backdrop-blur md:px-9">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-slate-500 md:hidden"
            onClick={onMobileNavToggle}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-teal-700">RHTacademy</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Portal</h1>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-[310px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold">Notifications</h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-400">No notifications yet</p>
                ) : (
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex gap-3 rounded-xl p-3 ${notif.is_read ? 'hover:bg-slate-50' : 'bg-blue-50/60 hover:bg-blue-50'}`}
                      >
                        <span className={`rounded-lg p-2 ${notif.title.toLowerCase().includes('payment') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                          {notif.title.toLowerCase().includes('payment') ? <CircleAlert size={16} /> : <FileText size={16} />}
                        </span>
                        <div>
                          <p className="text-xs font-semibold">{notif.title}</p>
                          <p className="mt-1 text-xs leading-4 text-slate-500">{notif.message}</p>
                          <time className="mt-1 block text-[11px] text-slate-400">
                            {formatTime(notif.created_at)}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
            aria-label="Open profile"
          >
            <MaleAvatar />
            <span className="hidden text-left md:block">
              <strong className="block text-sm">{studentName}</strong>
              <span className="block text-[11px] text-slate-500">{studentClass}</span>
            </span>
          </button>
        </div>
      </header>

      {profileOpen && (
        <ProfileModal
          onClose={() => {
            setProfileOpen(false);
            router.refresh();
          }}
          studentId={studentId}
          studentName={studentName}
          studentClass={studentClass}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
          studentInstitute={studentInstitute}
        />
      )}
    </>
  );
};
