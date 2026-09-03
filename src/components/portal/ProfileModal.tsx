'use client';

import React, { useState, useTransition } from 'react';
import { LockKeyhole, Mail, Phone, ShieldCheck, Upload, X } from 'lucide-react';
import { MaleAvatar } from './MaleAvatar';
import { createClient } from '@/lib/supabase/client';

interface ProfileModalProps {
  onClose: () => void;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  studentPhone: string;
  studentInstitute: string;
}

export const ProfileModal = ({
  onClose,
  studentId,
  studentName,
  studentClass,
  studentEmail,
  studentPhone,
  studentInstitute,
}: ProfileModalProps) => {
  const [name, setName] = useState(studentName);
  const [cls, setCls] = useState(studentClass);
  const [institute, setInstitute] = useState(studentInstitute);
  const [phone, setPhone] = useState(studentPhone);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      setErrorMsg('');
      setSuccessMsg('');
      const supabase = createClient();

      // Update profile fields
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          class: cls,
          institute,
          phone_number: phone,
        })
        .eq('id', studentId);

      if (profileErr) {
        setErrorMsg('Failed to update profile: ' + profileErr.message);
        return;
      }

      // If changing password
      if (newPassword.trim()) {
        if (!currentPassword.trim()) {
          setErrorMsg('Please enter your current password to change it.');
          return;
        }
        // Re-authenticate then update password
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) { setErrorMsg('Session expired. Please log in again.'); return; }

        // Verify current password by re-signing in
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });
        if (signInErr) { setErrorMsg('Current password is incorrect.'); return; }

        const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
        if (pwErr) { setErrorMsg('Failed to update password: ' + pwErr.message); return; }
      }

      setSuccessMsg('Profile updated successfully!');
      setTimeout(onClose, 1200);
    });
  };

  return (
    <dialog
      open
      aria-labelledby="profile-title"
      className="fixed inset-0 z-40 m-auto max-h-[calc(100vh-32px)] w-[min(680px,calc(100%-32px))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-900/30"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-700">Account settings</p>
          <h2 id="profile-title" className="mt-1 text-xl font-bold">My profile</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close profile"
        >
          <X size={19} />
        </button>
      </div>

      <div className="space-y-5 p-6">
        {/* Avatar row */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <MaleAvatar size="h-20 w-20" />
            <button
              className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-800 p-1.5 text-white"
              aria-label="Upload avatar"
              type="button"
            >
              <Upload size={13} />
            </button>
          </div>
          <div>
            <h3 className="font-bold">Profile photo</h3>
            <p className="mt-1 text-xs text-slate-500">JPG or PNG, max 2MB.</p>
          </div>
        </div>

        {/* Success / Error messages */}
        {successMsg && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Profile fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="text-sm font-semibold">
            Class
            <input
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-sm font-semibold">
            Institute
            <input
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none focus:border-blue-700"
            />
          </label>
          <label className="text-sm font-semibold">
            Phone
            <div className="relative mt-2">
              <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:border-blue-700"
              />
            </div>
          </label>
        </div>

        {/* Email (read-only — requires OTP to change) */}
        <label className="block text-sm font-semibold">
          Email
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                defaultValue={studentEmail}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-normal text-slate-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setOtpSent(true)}
              className="whitespace-nowrap rounded-lg border border-blue-200 px-3 text-xs font-bold text-blue-800 hover:bg-blue-50"
            >
              Send OTP to change
            </button>
          </div>
        </label>

        {otpSent && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-800">
            <ShieldCheck size={16} />
            <span>OTP sent to your email. Enter it to verify sensitive changes.</span>
            <input
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              aria-label="OTP verification code"
              placeholder="000000"
              className="ml-auto w-20 rounded border border-blue-200 bg-white px-2 py-1.5 text-center"
            />
          </div>
        )}

        {/* Change Password */}
        <div className="border-t border-slate-100 pt-5">
          <div className="mb-3 flex items-center gap-2">
            <LockKeyhole size={17} className="text-blue-800" />
            <h3 className="font-bold">Change password</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="password"
              placeholder="Current password"
              aria-label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700"
            />
            <input
              type="password"
              placeholder="New password"
              aria-label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </dialog>
  );
};
