"use client";

import React, { useState } from 'react';
import { Settings, Save, Clock } from 'lucide-react';
import { updateAboutMe, updateBookingCard, updateSchedule } from '@/app/actions/landingActions';

export const LandingControls = ({ aboutMe, bookingCards, schedules }: { aboutMe: any[], bookingCards: any[], schedules: any[] }) => {
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<string | null>(null);

  const mainAbout = aboutMe[0];
  const mainCard = bookingCards[0];

  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mainAbout) return;
    setPending('about');
    setNotice('');
    const res = await updateAboutMe(mainAbout.id, new FormData(e.currentTarget));
    if (res.error) setNotice(res.error);
    else setNotice('About Me section updated successfully.');
    setPending(null);
  };

  const handleCardUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mainCard) return;
    setPending('card');
    setNotice('');
    const res = await updateBookingCard(mainCard.id, new FormData(e.currentTarget));
    if (res.error) setNotice(res.error);
    else setNotice('Booking Card updated successfully.');
    setPending(null);
  };

  const handleScheduleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setPending(id);
    setNotice('');
    const res = await updateSchedule(id, new FormData(e.currentTarget));
    if (res.error) setNotice(res.error);
    else setNotice('Schedule updated successfully.');
    setPending(null);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Public Front</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Landing Page Controls</h1>
          <p className="mt-2 text-sm text-slate-500">Update the content shown on the public landing page instantly.</p>
        </div>
      </header>

      {notice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold animate-in fade-in">
          {notice}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* ABOUT ME SECTION */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings size={20} className="text-slate-400" /> About Me Section
          </h2>
          {mainAbout ? (
            <form onSubmit={handleAboutUpdate} className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-slate-700">Admin Name
                <input name="admin_name" defaultValue={mainAbout.admin_name} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-slate-700">Degree
                  <input name="degree" defaultValue={mainAbout.degree} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
                <label className="text-sm font-semibold text-slate-700">Institute
                  <input name="institute" defaultValue={mainAbout.institute} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
              </div>
              <label className="text-sm font-semibold text-slate-700">Bio Content
                <textarea name="content" defaultValue={mainAbout.content} required className="mt-1 w-full min-h-32 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 resize-none" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Photo URL
                <input name="photo_url" defaultValue={mainAbout.photo_url} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
              </label>
              <button type="submit" disabled={pending === 'about'} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
                <Save size={16} /> {pending === 'about' ? 'Saving...' : 'Save About Me'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">No About Me record found in database.</p>
          )}
        </div>

        {/* BOOKING CARD SECTION */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings size={20} className="text-slate-400" /> Primary Booking Card
          </h2>
          {mainCard ? (
            <form onSubmit={handleCardUpdate} className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-slate-700">Card Title
                <input name="title" defaultValue={mainCard.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
              </label>
              <label className="text-sm font-semibold text-slate-700">Short Description
                <input name="short_description" defaultValue={mainCard.short_description} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm font-semibold text-slate-700">Price (BDT)
                  <input name="price" type="number" defaultValue={mainCard.price} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
                <label className="text-sm font-semibold text-slate-700">Badge Text (Optional)
                  <input name="badge_text" defaultValue={mainCard.badge_text} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
              </div>
              <label className="text-sm font-semibold text-slate-700">Features (One per line)
                <textarea name="features" defaultValue={(mainCard.features || []).join('\n')} required className="mt-1 w-full min-h-32 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 resize-none" placeholder="e.g.&#10;3 Classes per week&#10;Monthly mock test" />
              </label>
              <button type="submit" disabled={pending === 'card'} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50">
                <Save size={16} /> {pending === 'card' ? 'Saving...' : 'Save Booking Card'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-slate-500">No Booking Card record found in database.</p>
          )}
        </div>

        {/* SCHEDULE CONTROLS */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Availability Schedule
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {schedules.map(schedule => (
              <form key={schedule.id} onSubmit={(e) => handleScheduleUpdate(e, schedule.id)} className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
                <label className="text-sm font-bold text-slate-800 block mb-3">
                  {schedule.day_of_week}
                  <input type="hidden" name="day_of_week" value={schedule.day_of_week} />
                </label>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-xs font-semibold text-slate-500">Start Time
                    <input name="start_time" type="time" defaultValue={schedule.start_time} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1 outline-none focus:border-blue-500" />
                  </label>
                  <label className="text-xs font-semibold text-slate-500">End Time
                    <input name="end_time" type="time" defaultValue={schedule.end_time} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1 outline-none focus:border-blue-500" />
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-2">
                    <input type="checkbox" name="is_available" defaultChecked={schedule.is_available} className="h-4 w-4 accent-blue-600" />
                    Available this day
                  </label>
                </div>
                <button type="submit" disabled={pending === schedule.id} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-200 disabled:opacity-50">
                   {pending === schedule.id ? 'Saving...' : 'Update'}
                </button>
              </form>
            ))}
            {schedules.length === 0 && <p className="text-sm text-slate-500">No schedules configured.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};
