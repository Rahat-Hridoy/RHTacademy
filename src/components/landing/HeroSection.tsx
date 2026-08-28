import React from 'react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-gradient-to-br from-[#1E40AF] via-[#2747b9] to-[#312e81] px-6 pb-24 pt-36 text-white sm:px-10 lg:min-h-[720px] lg:px-16 lg:pt-48">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tracking-wide text-blue-50">
            <Sparkles size={15} /> <span>Personalized academic coaching</span>
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.06em] sm:text-7xl">
            Expert Academic Coaching<span className="text-teal-300">.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100 sm:text-xl">
            RHTacademy – Personalized SSC &amp; HSC guidance from a certified educator.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#schedule" className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-3.5 font-bold text-white shadow-xl shadow-teal-950/20 transition hover:-translate-y-0.5 hover:bg-[#0faaa0]">
              Book a Schedule <ArrowRight size={18} />
            </a>
            <a href="#about" className="rounded-xl border border-white/35 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
              Learn More
            </a>
          </div>
          <div className="mt-14 flex items-center gap-8 border-t border-white/15 pt-6 text-sm text-blue-100">
            <span><strong className="block text-2xl text-white">8+</strong>Years teaching</span>
            <span><strong className="block text-2xl text-white">500+</strong>Students guided</span>
            <span><strong className="block text-2xl text-white">1:1</strong>Focused support</span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl" aria-label="Illustration of a teacher presenting a science lesson" role="img">
          <div className="academic-illustration relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl shadow-indigo-950/30 backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-4 text-xs font-bold uppercase tracking-[.2em] text-blue-100">
              <span>Today’s lesson</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" /> In session
              </span>
            </div>
            <svg viewBox="0 0 520 350" className="mt-5 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="48" y="38" width="300" height="190" rx="10" fill="#102B72" stroke="#8BB4FF" strokeWidth="3" />
              <path d="M78 184h240M78 184V74h240v110" stroke="#4677D5" strokeWidth="2" />
              <path d="M111 134c21-47 34 36 55-9 23-50 34 52 55-7 17-46 30 30 55-19" stroke="#63D7CB" strokeWidth="5" strokeLinecap="round" />
              <path d="M86 92h56M86 105h34" stroke="#D7E6FF" strokeWidth="4" strokeLinecap="round" />
              <circle cx="397" cy="80" r="17" fill="#F9D4B6" />
              <path d="M377 144c2-30 9-46 24-46 21 0 34 16 37 46" fill="#F59E0B" />
              <path d="M380 116l-34 37M435 119l24 35M387 140l-4 70M423 140l13 70" stroke="#F9D4B6" strokeWidth="12" strokeLinecap="round" />
              <path d="M377 74c3-24 39-28 47 3-13-5-25-8-47-3Z" fill="#1E293B" />
              <rect x="68" y="250" width="130" height="37" rx="5" fill="#C58B5A" />
              <path d="M83 250v-23M178 250v-23" stroke="#8D5D3D" strokeWidth="6" />
              <path d="M87 237h88" stroke="#F5D0A9" strokeWidth="5" />
              <path d="M238 268h91l-11-27h-68l-12 27Z" fill="#F6C453" />
              <path d="M251 241h65" stroke="#FFF0AF" strokeWidth="5" />
              <path d="M356 211l9-13 9 13-9 13-9-13ZM459 174l6-9 6 9-6 9-6-9Z" fill="#FDE68A" />
              <circle cx="459" cy="55" r="4" fill="#5EEAD4" />
              <circle cx="427" cy="27" r="3" fill="#93C5FD" />
            </svg>
            <div className="flex items-center gap-3 border-t border-white/15 pt-4">
              <div className="rounded-lg bg-teal-300/15 p-2 text-teal-200">
                <BookOpen size={18} />
              </div>
              <p className="text-sm text-blue-100">
                <strong className="block text-white">Concepts that click</strong>
                Learn with clarity, not cramming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
