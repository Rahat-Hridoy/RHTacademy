import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#081a48] px-6 py-8 text-blue-200 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm sm:flex-row">
        <p className="flex items-center gap-3 text-lg font-black text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0D9488]">R</span> 
          RHTacademy
        </p>
        <nav className="flex gap-6">
          <a href="#home" className="transition hover:text-white">Home</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#schedule" className="transition hover:text-white">Book Schedule</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>
        <p>© {new Date().getFullYear()} RHTacademy</p>
      </div>
    </footer>
  );
};
