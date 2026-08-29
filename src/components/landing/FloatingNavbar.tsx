"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import Link from 'next/link';

export const FloatingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Book Schedule', href: '#schedule' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-300 rounded-2xl border border-white/20 shadow-lg ${isScrolled ? 'backdrop-blur-md bg-white/70 py-3' : 'bg-white/90 py-4'}`}>
      <div className="px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="font-bold text-xl text-blue-900 tracking-tight hidden sm:block">
            RHTacademy
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-800 font-medium transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth">
            <button className="hidden sm:flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md active:scale-95">
              <LogIn size={18} />
              <span>Student Login</span>
            </button>
          </Link>
          
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-2">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-slate-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-blue-50" onClick={() => setIsMobileMenuOpen(false)}>
              {link.name}
            </a>
          ))}
          <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="flex items-center justify-center gap-2 bg-blue-800 text-white px-5 py-3 rounded-xl font-semibold w-full">
              <LogIn size={18} />
              <span>Student Login</span>
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};
