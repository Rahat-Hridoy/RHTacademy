"use client";

import React, { useState, useRef } from 'react';
import { Upload, UserRound, Plus, Edit3, Trash2, Save, Loader2, AlertTriangle } from 'lucide-react';
import {
  updateAboutMe,
  uploadAboutMePhoto,
  addServiceCard,
  updateServiceCard,
  deleteServiceCard,
  updateAvailableSeats,
  saveBookingSlots
} from '@/app/actions/landingActions';

type LandingTab = 'About Me' | 'Service Card' | 'Booking Schedule';
const landingTabs: { id: LandingTab; label: string; }[] = [
  { id: 'About Me', label: 'About Me' },
  { id: 'Service Card', label: 'Service Card' },
  { id: 'Booking Schedule', label: 'Booking Schedule' }
];

// ─── Typed interfaces matching the DB schema ────────────────────────
type AboutMeRow = {
  id: string;
  name: string | null;
  degree: string | null;
  institute: string | null;
  description: string | null;
  about_me_photo: string | null;
};

type ServiceCard = {
  id: string;
  title: string;
  badge: string;
  description: string;
  subjects: string[];
};

type BookingSetting = {
  id: string;
  available_seats: number;
};

type BookingTimeSlot = {
  id: string;
  day_text: string;
  time_text: string;
};
// ─────────────────────────────────────────────────────────────────────

export const LandingControls = ({
  aboutMe,
  serviceCards: initialServiceCards,
  bookingSettings,
  bookingTimeSlots
}: {
  aboutMe: AboutMeRow[];
  serviceCards: ServiceCard[];
  bookingSettings: BookingSetting[];
  bookingTimeSlots: BookingTimeSlot[];
}) => {
  const [notice, setNotice] = useState('');
  const [landingTab, setLandingTab] = useState<LandingTab>('About Me');

  // About Me State
  const mainAbout = aboutMe[0];
  const [pendingAbout, setPendingAbout] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(mainAbout?.about_me_photo ?? '');
  const [photoSizeError, setPhotoSizeError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Service Cards State
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(initialServiceCards);
  const [editingServiceCardId, setEditingServiceCardId] = useState('');
  const [pendingServiceCardDeleteId, setPendingServiceCardDeleteId] = useState('');
  const [newServiceCardOpen, setNewServiceCardOpen] = useState(false);

  const [newServiceCard, setNewServiceCard] = useState({
    title: '', badge: '', description: '', subjects: [] as { id: string, name: string }[]
  });
  const [newServiceSubjectDraft, setNewServiceSubjectDraft] = useState('');
  const [serviceSubjectDrafts, setServiceSubjectDrafts] = useState<Record<string, string>>({});

  // Booking Schedule State
  const [availableSeats, setAvailableSeats] = useState(bookingSettings[0]?.available_seats ?? 1);
  const [bookingSlots, setBookingSlots] = useState<{ id: string, day: string, time: string }[]>(
    bookingTimeSlots.map(s => ({ id: s.id, day: s.day_text, time: s.time_text }))
  );

  const [pendingSeats, setPendingSeats] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState(false);

  // Handlers for About Me
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2 MB limit
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setPhotoSizeError(`Maximum image size is ${MAX_SIZE_MB} MB`);
      // Reset the input so the user can try again
      e.target.value = '';
      return;
    }

    setPhotoSizeError('');
    setUploadingPhoto(true);
    setNotice('');
    const fd = new FormData();
    fd.append('file', file);
    // Pass the current photo URL so the server can delete the old file first
    if (photoUrl) fd.append('old_photo_url', photoUrl);
    const res = await uploadAboutMePhoto(fd);
    if (res.error) {
      setNotice(res.error);
    } else if (res.publicUrl) {
      setPhotoUrl(res.publicUrl);
      setNotice('Photo replaced! Click Save Changes to apply.');
    }
    setUploadingPhoto(false);
  };

  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mainAbout) return;
    setPendingAbout(true);
    setNotice('');
    const formData = new FormData(e.currentTarget);
    formData.set('about_me_photo', photoUrl);
    const res = await updateAboutMe(mainAbout.id, formData);
    if (res.error) setNotice(res.error);
    else setNotice('About Me section updated successfully.');
    setPendingAbout(false);
  };

  // Handlers for Service Cards
  const addSubjectToCard = (cardId: string) => {
    const nextSubject = serviceSubjectDrafts[cardId]?.trim();
    if (!nextSubject) return;

    setServiceCards(current => current.map(card => {
      if (card.id === cardId && !card.subjects.includes(nextSubject)) {
        return { ...card, subjects: [...card.subjects, nextSubject] };
      }
      return card;
    }));
    setServiceSubjectDrafts(current => ({ ...current, [cardId]: '' }));
  };

  const removeSubjectFromCard = (cardId: string, subjectToRemove: string) => {
    setServiceCards(current => current.map(card => {
      if (card.id === cardId) {
        return { ...card, subjects: card.subjects.filter(s => s !== subjectToRemove) };
      }
      return card;
    }));
  };

  const addSubjectToNewCard = () => {
    const nextSubject = newServiceSubjectDraft.trim();
    if (!nextSubject || newServiceCard.subjects.some(s => s.name.toLowerCase() === nextSubject.toLowerCase())) return;
    setNewServiceCard(current => ({
      ...current,
      subjects: [...current.subjects, { id: `subj-${Date.now()}`, name: nextSubject }]
    }));
    setNewServiceSubjectDraft('');
  };

  const createServiceCard = async () => {
    const res = await addServiceCard(
      newServiceCard.title.trim(),
      newServiceCard.badge.trim(),
      newServiceCard.description.trim(),
      newServiceCard.subjects.map(s => s.name)
    );
    if (res.error) {
      setNotice(res.error);
      return;
    }
    setServiceCards([...serviceCards, res.data]);
    setNewServiceCardOpen(false);
    setNewServiceCard({ title: '', badge: '', description: '', subjects: [] });
    setNotice('Service card created successfully.');
  };

  const handleUpdateServiceCard = async (cardId: string) => {
    const card = serviceCards.find(c => c.id === cardId);
    if (!card) return;
    const res = await updateServiceCard(card.id, card.title, card.badge, card.description, card.subjects);
    if (res.error) {
      setNotice(res.error);
      return;
    }
    setEditingServiceCardId('');
    setNotice('Service card updated successfully.');
  };

  const handleDeleteServiceCard = async (cardId: string) => {
    const res = await deleteServiceCard(cardId);
    if (res.error) {
      setNotice(res.error);
      return;
    }
    setServiceCards(current => current.filter(c => c.id !== cardId));
    setPendingServiceCardDeleteId('');
    setNotice('Service card deleted.');
  };

  // Handlers for Booking Schedule
  const updateBookingSlot = (slotId: string, updates: Partial<{ day: string, time: string }>) => {
    setBookingSlots(current => current.map(slot => slot.id === slotId ? { ...slot, ...updates } : slot));
  };

  const handleSaveSeats = async () => {
    setPendingSeats(true);
    const res = await updateAvailableSeats(availableSeats);
    if (res.error) setNotice(res.error);
    else setNotice('Available seats saved successfully.');
    setPendingSeats(false);
  };

  const handleSaveSchedule = async () => {
    setPendingSchedule(true);
    const formattedSlots = bookingSlots.map(s => ({
      id: s.id.startsWith('slot-') ? undefined : s.id,
      day_text: s.day,
      time_text: s.time
    }));
    const res = await saveBookingSlots(formattedSlots);
    if (res.error) setNotice(res.error);
    else setNotice('Booking schedule saved successfully.');
    setPendingSchedule(false);
  };

  const getSubjectBadgeTone = (index: number) => {
    const tones = ['bg-blue-50 text-blue-700 ring-blue-100', 'bg-teal-50 text-teal-700 ring-teal-100', 'bg-violet-50 text-violet-700 ring-violet-100', 'bg-amber-50 text-amber-700 ring-amber-100'];
    return tones[index % tones.length];
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {notice && (
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} className="rounded-full p-1 hover:bg-teal-100">
            ×
          </button>
        </div>
      )}

      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-2xl font-black text-slate-950">Landing Page Controls</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {landingTabs.map(tab => (
            <button key={tab.id} type="button" onClick={() => setLandingTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-black ${landingTab === tab.id ? 'bg-[#1E40AF] text-white' : 'bg-slate-100 text-slate-600'}`}>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {landingTab === 'About Me' && (
        <form onSubmit={handleAboutUpdate} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          {mainAbout ? (
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-50 text-[#1E40AF] overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Admin" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <UserRound size={42} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="mt-3 cursor-pointer inline-flex items-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-sm font-semibold text-[#1E40AF] hover:bg-blue-50 disabled:opacity-50"
                >
                  {uploadingPhoto ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  <span>{uploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                {/* Size limit warning */}
                {photoSizeError && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-500" />
                    <p className="text-xs leading-snug text-amber-700">{photoSizeError}</p>
                  </div>
                )}
                <input name="about_me_photo" value={photoUrl} type="hidden" readOnly />
              </div>
              <div className="grid flex-1 gap-3 md:grid-cols-3">
                <input name="name" placeholder="Name" defaultValue={mainAbout.name ?? ''} className="rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                <input name="degree" placeholder="Degree" defaultValue={mainAbout.degree ?? ''} className="rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                <input name="institute" placeholder="Institute" defaultValue={mainAbout.institute ?? ''} className="rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                <textarea name="description" placeholder="Description" defaultValue={mainAbout.description ?? ''} className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 md:col-span-3 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 resize-none" />
                <button type="submit" disabled={pendingAbout} className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  {pendingAbout ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{pendingAbout ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No About Me record found.</p>
          )}
        </form>
      )}

      {landingTab === 'Service Card' && (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Service Cards</h3>
              <p className="mt-1 text-sm text-slate-500">Edit the service cards shown on the public landing page.</p>
            </div>
            <button type="button" onClick={() => setNewServiceCardOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-800">
              <Plus size={16} /><span>Add New Card</span>
            </button>
          </div>
          <div className="space-y-4">
            {serviceCards.map((card, idx) => (
              <article key={card.id} className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${getSubjectBadgeTone(idx)}`}>{card.badge}</span>
                    <h4 className="mt-3 text-2xl font-black tracking-tight text-slate-950">{card.title}</h4>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => { setPendingServiceCardDeleteId(''); setEditingServiceCardId(card.id); }} className="rounded-xl bg-blue-50 p-2.5 text-[#1E40AF] hover:bg-blue-100">
                      <Edit3 size={16} />
                    </button>
                    <button type="button" onClick={() => { setEditingServiceCardId(''); setPendingServiceCardDeleteId(card.id); }} className="rounded-xl bg-red-50 p-2.5 text-red-600 hover:bg-red-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {pendingServiceCardDeleteId === card.id && (
                  <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                    <p className="font-bold text-red-800">Delete this service card?</p>
                    <p className="mt-1 text-sm text-red-700">This will remove it from the landing page.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleDeleteServiceCard(card.id)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white hover:bg-red-700">Yes, Delete</button>
                      <button type="button" onClick={() => setPendingServiceCardDeleteId('')} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                )}

                {editingServiceCardId === card.id ? (
                  <div className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-semibold text-slate-700">Title
                        <input value={card.title} onChange={e => setServiceCards(curr => curr.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                      </label>
                      <label className="block text-sm font-semibold text-slate-700">Badge
                        <input value={card.badge} onChange={e => setServiceCards(curr => curr.map(c => c.id === card.id ? { ...c, badge: e.target.value } : c))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                      </label>
                    </div>
                    <label className="block text-sm font-semibold text-slate-700">Description
                      <textarea rows={3} value={card.description} onChange={e => setServiceCards(curr => curr.map(c => c.id === card.id ? { ...c, description: e.target.value } : c))} className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                    </label>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Subjects</p>
                      <div className="mt-2 flex gap-2">
                        <input value={serviceSubjectDrafts[card.id] ?? ''} onChange={e => setServiceSubjectDrafts(curr => ({ ...curr, [card.id]: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubjectToCard(card.id); } }} placeholder="Enter a subject name" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                        <button type="button" onClick={() => addSubjectToCard(card.id)} className="shrink-0 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800">+ Add</button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {card.subjects.map((subject: string, sIdx: number) => (
                          <span key={sIdx} className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-teal-900/10">
                            <span>{subject}</span>
                            <button type="button" onClick={() => removeSubjectFromCard(card.id, subject)} className="rounded-full text-white/80 hover:text-white">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleUpdateServiceCard(card.id)} className="rounded-2xl bg-[#0D9488] px-5 py-3 text-sm font-black text-white hover:bg-teal-700">Save Card</button>
                      <button type="button" onClick={() => setEditingServiceCardId('')} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">{card.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {card.subjects.map((subject: string, sIdx: number) => (
                        <span key={sIdx} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{subject}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}

            {newServiceCardOpen && (
              <form className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6" onSubmit={e => { e.preventDefault(); createServiceCard(); }}>
                <h4 className="text-xl font-black text-slate-950">Create New Service Card</h4>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">Title
                    <input required value={newServiceCard.title} onChange={e => setNewServiceCard(curr => ({ ...curr, title: e.target.value }))} placeholder="Title" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">Badge
                    <input required value={newServiceCard.badge} onChange={e => setNewServiceCard(curr => ({ ...curr, badge: e.target.value }))} placeholder="Badge" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-slate-700">Description
                  <textarea required rows={3} value={newServiceCard.description} onChange={e => setNewServiceCard(curr => ({ ...curr, description: e.target.value }))} placeholder="Description" className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                </label>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-700">Subjects</p>
                  <div className="mt-2 flex gap-2">
                    <input value={newServiceSubjectDraft} onChange={e => setNewServiceSubjectDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubjectToNewCard(); } }} placeholder="Enter a subject name" className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-normal text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                    <button type="button" onClick={addSubjectToNewCard} className="shrink-0 rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-black text-white hover:bg-blue-800">+ Add</button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {newServiceCard.subjects.map(subject => (
                      <span key={subject.id} className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3 py-1.5 text-xs font-black text-white shadow-sm shadow-teal-900/10">
                        <span>{subject.name}</span>
                        <button type="button" onClick={() => setNewServiceCard(curr => ({ ...curr, subjects: curr.subjects.filter(s => s.id !== subject.id) }))} className="rounded-full text-white/80 hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="submit" className="rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white hover:bg-blue-800">Create Card</button>
                  <button type="button" onClick={() => { setNewServiceCardOpen(false); setNewServiceCard({ title: '', badge: '', description: '', subjects: [] }); setNewServiceSubjectDraft(''); }} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {landingTab === 'Booking Schedule' && (
        <section className="space-y-5">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-2xl font-black text-slate-950">Booking Schedule Configuration</h3>
          </div>

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-950">Available Seats</h4>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Set to 0 to disable booking and grey out the Book Now button on the landing page.</p>
              </div>
              <div className="flex items-center justify-center gap-3 rounded-full bg-slate-50 p-2 ring-1 ring-slate-200">
                <button type="button" onClick={() => setAvailableSeats(curr => Math.max(0, curr - 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1E40AF] shadow-sm hover:bg-blue-50">−</button>
                <input type="number" min={0} value={availableSeats} onChange={e => setAvailableSeats(Math.max(0, Number(e.target.value)))} className="h-12 w-24 rounded-full border border-slate-200 bg-white text-center text-2xl font-black text-slate-950 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                <button type="button" onClick={() => setAvailableSeats(curr => curr + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-[#1E40AF] shadow-sm hover:bg-blue-50">+</button>
              </div>
            </div>
            <button type="button" disabled={pendingSeats} onClick={handleSaveSeats} className="mt-5 rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-50">
              {pendingSeats ? 'Saving...' : 'Save Seats'}
            </button>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div>
              <h4 className="text-xl font-black text-slate-950">Time Slots</h4>
              <p className="mt-1 text-sm text-slate-500">Each slot has a Day field and a Time field. Both are required.</p>
            </div>
            <div className="mt-5 space-y-3">
              {bookingSlots.map(slot => (
                <div key={slot.id} className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
                  <label className="flex-1 text-sm font-medium text-slate-600">
                    <span className="sr-only">Day</span>
                    <input required value={slot.day} onChange={e => updateBookingSlot(slot.id, { day: e.target.value })} placeholder="e.g. Friday, Saturday" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-800 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                  </label>
                  <span className="hidden text-slate-300 sm:inline">—</span>
                  <label className="flex-1 text-sm font-medium text-slate-600">
                    <span className="sr-only">Time</span>
                    <input required value={slot.time} onChange={e => updateBookingSlot(slot.id, { time: e.target.value })} placeholder="e.g. 4:00 PM to 5:00 PM" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100" />
                  </label>
                  <button type="button" onClick={() => setBookingSlots(curr => curr.filter(s => s.id !== slot.id))} className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl font-black text-red-600 hover:bg-red-100">×</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBookingSlots(curr => [...curr, { id: `slot-${Date.now()}`, day: '', time: '' }])} className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-blue-200 px-4 py-2.5 text-sm font-black text-[#1E40AF] hover:bg-blue-50">
              <Plus size={15} /><span>Add Time Slot</span>
            </button>
            <button type="button" disabled={pendingSchedule} onClick={handleSaveSchedule} className="mt-5 block w-full rounded-2xl bg-[#0D9488] px-5 py-3 text-sm font-black text-white hover:bg-teal-700 disabled:opacity-50">
              {pendingSchedule ? 'Saving...' : 'Save Schedule'}
            </button>
          </section>
        </section>
      )}
    </div>
  );
};
