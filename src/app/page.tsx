import React from 'react';
import { FloatingNavbar } from '@/components/landing/FloatingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { ScheduleSection } from '@/components/landing/ScheduleSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();

  // Use admin client for about_me so it bypasses RLS and always returns data
  const adminSupabase = await createAdminClient();
  const { data: aboutMeData } = await adminSupabase
    .from('about_me')
    .select('*')
    .limit(1)
    .single();

  // Fetch Schedule Booking data
  const { data: scheduleData } = await supabase
    .from('schedule_booking')
    .select('available_seat, available_time')
    .limit(1)
    .single();

  // Fetch Service Cards data
  const { data: serviceCardsData } = await supabase
    .from('service_cards')
    .select('*')
    .order('id', { ascending: true });

  const scheduleProps = {
    available_seat: scheduleData?.available_seat ?? 1,
    available_time: scheduleData?.available_time ?? ['Saturday · 10:00 AM – 12:00 PM', 'Sunday · 4:00 PM – 6:00 PM']
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB] text-[#0F172A]">
      <FloatingNavbar />
      <HeroSection />
      <AboutSection data={aboutMeData} />
      <ScheduleSection scheduleData={scheduleProps} serviceCards={serviceCardsData ?? undefined} />
      <ContactSection />
      <Footer />
    </main>
  );
}
