import React from 'react';
import { Quote } from 'lucide-react';

interface AboutMeProps {
  name?: string;
  degree?: string;
  institute?: string;
  description?: string;
  about_me_photo?: string;
}

export const AboutSection = ({ data }: { data?: AboutMeProps }) => {
  const {
    name = "Md. Rashedul Hasan",
    degree = "M.Sc. in Physics",
    institute = "University of Dhaka",
    description,
    about_me_photo
  } = data || {};

  const bioParagraphs = description
    ? description.split('\n').filter(p => p.trim() !== '')
    : [
        'I am Md. Rashedul Hasan, a certified educator with a deep love for making science feel clear, connected, and genuinely enjoyable.',
        'Over the past 8 years, I have helped SSC and HSC learners move from uncertainty to confidence through focused, one-to-one academic coaching.',
        'My approach blends strong fundamentals with exam-smart practice. We slow down for the hard ideas, then build the speed and structure needed in the exam hall.',
        'Every schedule is shaped around the student: their goals, their pace, and the small wins that make ambitious progress feel possible.'
      ];

  return (
    <section id="about" className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:px-16 lg:py-32">
      <div className="flex flex-col items-center lg:items-start">
        <div className="avatar-ring flex h-64 w-64 items-center justify-center rounded-full overflow-hidden border-4 border-[#dbeafe]">
          {about_me_photo ? (
            <img src={about_me_photo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-[#dbeafe] text-7xl font-black tracking-[-.08em] text-[#1E40AF]">
              {name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="mt-7 text-2xl font-extrabold">{name}</h2>
        <p className="mt-2 text-[#64748B]">{degree}</p>
        <p className="text-sm font-semibold text-[#1E40AF]">{institute}</p>
        <div className="mt-6 flex gap-2">
          <span className="rounded-full bg-[#e0f2f1] px-3 py-1.5 text-xs font-bold text-[#0D766E]">Certified educator</span>
          <span className="rounded-full bg-[#dbeafe] px-3 py-1.5 text-xs font-bold text-[#1E40AF]">Science mentor</span>
        </div>
      </div>
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-[#0D9488]">A thoughtful way forward</p>
        <h2 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">About Me</h2>
        <div className="mt-8 grid gap-4 text-[17px] leading-8 text-[#475569]">
          {bioParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        <blockquote className="mt-9 flex gap-4 border-l-4 border-[#0D9488] bg-white px-6 py-5 shadow-sm">
          <Quote className="shrink-0 text-[#0D9488]" size={23} />
          <p className="font-semibold italic text-[#1e3a8a]">
            “The goal is not just a better grade — it is a learner who knows how to think.”
          </p>
        </blockquote>
      </div>
    </section>
  );
};
