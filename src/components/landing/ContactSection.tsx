"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { submitContactMessage } from '@/app/actions/publicActions';

export const ContactSection = () => {
  const [isPending, setIsPending] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setStatusMsg({ text: '', type: '' });

    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await submitContactMessage(formData);
      if (result.error) {
        setStatusMsg({ text: result.error, type: 'error' });
      } else {
        setStatusMsg({ text: 'Message sent successfully!', type: 'success' });
        (event.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setStatusMsg({ text: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section id="contact" className="bg-[#0f2868] px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-teal-300">Let’s connect</p>
          <h2 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Questions? Start here.</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-blue-100">
            Tell us what you are working toward. We will help you find the right next step.
          </p>
          <div className="mt-10 space-y-5 text-blue-50">
            <p className="flex items-center gap-4"><Mail className="text-teal-300" size={20} /><span>hello@rhtacademy.com</span></p>
            <p className="flex items-center gap-4"><Phone className="text-teal-300" size={20} /><span>+880 1712 345 678</span></p>
            <p className="flex items-center gap-4"><MapPin className="text-teal-300" size={20} /><span>Dhaka, Bangladesh</span></p>
          </div>
        </div>
        
        <form onSubmit={handleContactSubmit} className="rounded-3xl bg-white p-6 text-[#0F172A] shadow-2xl sm:p-9">
          {statusMsg.text && (
            <div className={`mb-4 p-3 text-sm rounded-xl border ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {statusMsg.text}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              Name
              <input name="name" required className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none transition focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100" placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Email
              <input name="email" required type="email" className="rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none transition focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100" placeholder="you@example.com" />
            </label>
          </div>
          <label className="mt-5 grid gap-2 text-sm font-bold">
            Message
            <textarea name="message" required rows={5} className="resize-none rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3 font-normal outline-none transition focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100" placeholder="How can we help?" />
          </label>
          <button type="submit" disabled={isPending} className="mt-5 rounded-xl bg-[#0D9488] px-6 py-3.5 font-bold text-white transition hover:bg-[#0faaa0] disabled:opacity-50">
            {isPending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};
