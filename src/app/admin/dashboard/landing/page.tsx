import { LandingControls } from '@/components/admin/landing/LandingControls';
import { createAdminClient } from '@/lib/supabase/server';

export default async function LandingControlsPage() {
  const supabase = await createAdminClient();

  const { data: aboutMe } = await supabase.from('about_me').select('*').limit(1);
  const { data: serviceCards } = await supabase.from('service_cards').select('*').order('created_at', { ascending: true });
  const { data: bookingSettings } = await supabase.from('booking_settings').select('*').limit(1);
  const { data: bookingTimeSlots } = await supabase.from('booking_time_slots').select('*').order('created_at', { ascending: true });

  return (
    <LandingControls 
      aboutMe={aboutMe || []}
      serviceCards={serviceCards || []}
      bookingSettings={bookingSettings || []}
      bookingTimeSlots={bookingTimeSlots || []}
    />
  );
}
