import { RequestsHub, RawRequest } from '@/components/admin/RequestsHub';
import { createAdminClient } from '@/lib/supabase/server';

export default async function RequestsStream() {
  const supabase = await createAdminClient();

  // Fetch from all 3 tables in parallel with optimized field selection
  const [registrationsRes, bookingsRes, contactsRes] = await Promise.all([
    supabase
      .from('registration_requests')
      .select('id, name, email, phone, class, status, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('booking_requests')
      .select('id, name, email, phone, class_time, selected_subject, service_type, status, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('contact_messages')
      .select('id, name, email, message, status, created_at')
      .order('created_at', { ascending: false })
  ]);

  const registrations = registrationsRes.data;
  const bookings = bookingsRes.data;
  const contacts = contactsRes.data;

  const allRequests: RawRequest[] = [];

  if (registrations) {
    registrations.forEach(r => allRequests.push({
      id: r.id,
      source: 'registration',
      name: r.name,
      email: r.email,
      phone: r.phone,
      class: r.class,
      status: r.status || 'pending',
      created_at: r.created_at
    }));
  }

  if (bookings) {
    bookings.forEach(b => allRequests.push({
      id: b.id,
      source: 'booking',
      name: b.name,
      email: b.email,
      phone: b.phone,
      class: b.class_time, // Class time / slot info
      subject: b.selected_subject,
      service_type: b.service_type,
      status: b.status || 'pending',
      created_at: b.created_at
    }));
  }

  if (contacts) {
    contacts.forEach(c => allRequests.push({
      id: c.id,
      source: 'contact',
      name: c.name,
      email: c.email,
      message: c.message,
      status: c.status || 'pending',
      created_at: c.created_at
    }));
  }

  // Sort by created_at descending
  allRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <RequestsHub requests={allRequests} />;
}
