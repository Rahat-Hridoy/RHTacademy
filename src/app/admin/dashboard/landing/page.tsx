import { LandingControls } from '@/components/admin/landing/LandingControls';
import { createClient } from '@/lib/supabase/server';

export default async function LandingControlsPage() {
  const supabase = await createClient();

  const { data: aboutMe } = await supabase.from('about_me').select('*').limit(1);
  const { data: bookingCards } = await supabase.from('booking_cards').select('*').limit(1);
  const { data: schedules } = await supabase.from('schedule_booking').select('*').order('id', { ascending: true });

  return (
    <LandingControls 
      aboutMe={aboutMe || []}
      bookingCards={bookingCards || []}
      schedules={schedules || []}
    />
  );
}
