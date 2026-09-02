"use client";

import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { submitBookingRequest } from '@/app/actions/publicActions';

type ScheduleKind = 'SSC' | 'HSC';

interface ScheduleSectionProps {
  scheduleData: {
    available_seat: number;
    available_time: string[];
  };
  serviceCards?: any[];
}

const fallbackSscSubjects = ['Physics', 'Chemistry', 'Biology', 'Math'];
const fallbackHscSubjects = ['Physics', 'Chemistry', 'ICT'];

export const ScheduleSection = ({ scheduleData, serviceCards }: ScheduleSectionProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kind, setKind] = useState<ScheduleKind>('SSC');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Physics']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

  const defaultCards = [
    {
      title: 'SSC',
      badge: 'Secondary',
      description: 'Build unshakeable fundamentals.',
      subjects: fallbackSscSubjects,
    },
    {
      title: 'HSC',
      badge: 'Higher Secondary',
      description: 'Turn complex chapters into momentum.',
      subjects: fallbackHscSubjects,
    }
  ];

  const cardsToRender = serviceCards && serviceCards.length > 0 ? serviceCards : defaultCards;
  const selectedCard = cardsToRender.find(c => c.title === kind) || cardsToRender[0];
  const subjects = selectedCard?.subjects || [];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(current => 
      current.includes(subject) 
        ? current.filter(item => item !== subject) 
        : [...current, subject]
    );
  };

  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg('');
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    formData.append('kind', kind);
    formData.append('subjects', JSON.stringify(selectedSubjects));

    try {
      const result = await submitBookingRequest(formData);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="schedule" className="bg-[#eef4fb] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-[#0D9488]">Choose your path</p>
          <h2 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Book Your Learning Schedule</h2>
          <p className="mt-5 text-lg leading-8 text-[#64748B]">Focused lessons, a clear plan, and an open seat when you are ready to begin.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cardsToRender.map((card, idx) => {
            const isSelected = kind === card.title;
            // Using different color schemes for 1st and 2nd cards as fallback
            const isFirst = idx === 0;
            const bgClass = isFirst 
              ? 'bg-gradient-to-br from-[#1E40AF] to-[#3b82f6] shadow-blue-900/10'
              : 'bg-gradient-to-br from-[#0D766E] to-[#14b8a6] shadow-teal-900/10';
            const ringClass = isFirst ? 'ring-blue-200' : 'ring-teal-200';
            const descColor = isFirst ? 'text-blue-100' : 'text-teal-50';

            return (
              <button 
                key={card.title} 
                onClick={() => setKind(card.title as ScheduleKind)} 
                className={`text-left rounded-3xl ${bgClass} p-8 text-white shadow-xl transition hover:-translate-y-1 ${isSelected ? `ring-4 ${ringClass}` : ''}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl font-black">{card.title}</span>
                  {card.badge && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{card.badge}</span>
                  )}
                </div>
                <p className={`mt-12 ${descColor}`}>{card.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(card.subjects || []).map((subject: string) => (
                    <span key={subject} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm">{subject}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col items-start justify-between gap-5 rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/70 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-[#15803d]">
              <span className={`h-2.5 w-2.5 rounded-full ${scheduleData.available_seat > 0 ? 'bg-[#22c55e]' : 'bg-red-500'}`} /> 
              {scheduleData.available_seat} Seat{scheduleData.available_seat !== 1 && 's'} Available
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">Make this hour yours.</h3>
            <p className="mt-1 text-[#64748B]">New students are welcome this month.</p>
          </div>
          <button 
            disabled={scheduleData.available_seat <= 0}
            onClick={() => {
              setSubmitted(false);
              setModalOpen(true);
            }} 
            className="rounded-xl bg-[#1E40AF] px-8 py-4 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
            Book Now <ArrowRight className="ml-2 inline" size={17} />
          </button>
        </div>
      </div>

      {modalOpen && (
        <section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[#071942]/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 text-[#0F172A] shadow-2xl sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[.18em] text-[#0D9488]">Reserve your seat</p>
                <h2 id="booking-title" className="mt-2 text-3xl font-black tracking-[-.04em]">Book a Schedule</h2>
              </div>
              <button aria-label="Close booking modal" onClick={() => setModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                <X size={22} />
              </button>
            </div>
            
            {submitted ? (
              <div className="mt-8 rounded-2xl bg-[#ecfdf5] p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0D9488] text-white">
                  <Check />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold">Request received</h3>
                <p className="mt-2 text-slate-600">Admin will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-7 grid gap-5">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                    {errorMsg}
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold">
                    Name
                    <input name="name" required placeholder="Your full name" className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none focus:border-[#1E40AF]" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold">
                    Email
                    <input name="email" required type="email" placeholder="you@example.com" className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none focus:border-[#1E40AF]" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold">
                  Phone
                  <input name="phone" required type="tel" placeholder="+880 1XXX XXXXXX" className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none focus:border-[#1E40AF]" />
                </label>
                <fieldset>
                  <div className="mb-3 flex items-center justify-between">
                    <legend className="text-sm font-bold">Subjects</legend>
                    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                      {cardsToRender.map(card => (
                        <button
                          key={card.title}
                          type="button"
                          onClick={() => {
                            setKind(card.title as ScheduleKind);
                            setSelectedSubjects([]);
                          }}
                          className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${kind === card.title ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {card.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject: string) => (
                      <label key={subject} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${selectedSubjects.includes(subject) ? 'border-blue-300 bg-blue-50 text-[#1E40AF]' : 'border-slate-200'}`}>
                        <input type="checkbox" checked={selectedSubjects.includes(subject)} onChange={() => toggleSubject(subject)} className="accent-[#1E40AF]" />
                        {subject}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="grid gap-2 text-sm font-bold">
                  Available Time Slot
                  <select name="class_time" required className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none focus:border-[#1E40AF]">
                    <option value="">Select a time slot</option>
                    {scheduleData.available_time.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" disabled={isPending} className="mt-1 w-full rounded-xl bg-[#0D9488] px-6 py-3.5 font-bold text-white transition hover:bg-[#0faaa0] disabled:opacity-50">
                  {isPending ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            )}
          </div>
        </section>
      )}
    </section>
  );
};
