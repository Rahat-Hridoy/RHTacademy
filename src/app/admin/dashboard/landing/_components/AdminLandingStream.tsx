import { LandingControls } from '@/components/admin/landing/LandingControls';
import { createAdminClient } from '@/lib/supabase/server';

export default async function AdminLandingStream() {
  const supabase = await createAdminClient();

  const [
    aboutMeRes,
    serviceCardsRes,
    bookingSettingsRes,
    bookingTimeSlotsRes
  ] = await Promise.all([
    supabase.from('about_me').select('*').limit(1),
    supabase.from('service_cards').select('*').order('created_at', { ascending: true }),
    supabase.from('booking_settings').select('*').limit(1),
    supabase.from('booking_time_slots').select('*').order('created_at', { ascending: true })
  ]);

  return (
    <LandingControls 
      aboutMe={aboutMeRes.data || []}
      serviceCards={serviceCardsRes.data || []}
      bookingSettings={bookingSettingsRes.data || []}
      bookingTimeSlots={bookingTimeSlotsRes.data || []}
    />
  );
}
