"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { RequestCard, RequestType, RequestStatus } from './RequestCard';
import { BookingDetailsModal } from './BookingDetailsModal';
import { ContactReplyModal } from './ContactReplyModal';
import { 
  handleRegistration, 
  handleBooking, 
  markContactSeen, 
  handleContactReply, 
  dismissContact 
} from '@/app/actions/adminActions';

// Type definitions matching DB schema
export type RawRequest = {
  id: string;
  source: RequestType;
  name: string;
  email: string;
  phone?: string;
  class?: string;
  subject?: string;
  message?: string;
  status: string;
  created_at: string;
};

interface RequestsHubProps {
  requests: RawRequest[];
}

const filterOptions = ['All', 'Registration', 'Booking', 'Contact'];
const ITEMS_PER_PAGE = 5;

export const RequestsHub = ({ requests }: RequestsHubProps) => {
  const [requestList, setRequestList] = useState<RawRequest[]>(requests);
  const [activeFilter, setActiveFilter] = useState('All');
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<RawRequest | null>(null);
  const [selectedContact, setSelectedContact] = useState<RawRequest | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Synchronize when server data updates
  useEffect(() => {
    setRequestList(requests);
  }, [requests]);

  // Filter requests
  const filteredRequests = requestList.filter(req => {
    if (activeFilter === 'All') return true;
    return req.source.toLowerCase() === activeFilter.toLowerCase();
  });

  // Separate pending (latest incoming) and processed (history)
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const historyRequests = filteredRequests.filter(req => req.status !== 'pending');

  // Pagination for history
  const totalPages = Math.max(1, Math.ceil(historyRequests.length / ITEMS_PER_PAGE));
  const paginatedHistory = historyRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper for optimistic status update
  const updateStatusOptimistically = (id: string, newStatus: string) => {
    setRequestList(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  // Revert status on error
  const revertStatus = (id: string, originalStatus: string) => {
    setRequestList(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: originalStatus };
      }
      return req;
    }));
  };

  // Handle Registration Confirm/Refuse
  const handleRegistrationAction = async (id: string, action: 'confirm' | 'refuse') => {
    const target = requestList.find(r => r.id === id);
    if (!target) return;

    const originalStatus = target.status;
    const optimisticStatus = action === 'confirm' ? 'approved' : 'refused';

    // 1. Instantly move card to history via optimistic update
    updateStatusOptimistically(id, optimisticStatus);
    setProcessingId(id);
    setNotice(null);

    // 2. Execute Server Action
    const res = await handleRegistration(id, action);
    setProcessingId(null);

    if (res.error) {
      // Revert if error
      revertStatus(id, originalStatus);
      setNotice({ message: res.error, type: 'error' });
    } else {
      setNotice({ 
        message: `Registration request for ${target.name} ${action === 'confirm' ? 'approved' : 'refused'} successfully.`, 
        type: 'success' 
      });
    }
  };

  // Handle Booking Confirm/Refuse inside modal or card
  const handleBookingAction = async (id: string, action: 'confirm' | 'refuse') => {
    const target = requestList.find(r => r.id === id);
    if (!target) return;

    const originalStatus = target.status;
    const optimisticStatus = action === 'confirm' ? 'confirmed' : 'refused';

    // 1. Instantly update UI and close modal
    updateStatusOptimistically(id, optimisticStatus);
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
    setProcessingId(id);
    setNotice(null);

    // 2. Execute Server Action
    const res = await handleBooking(id, action);
    setProcessingId(null);

    if (res.error) {
      revertStatus(id, originalStatus);
      setNotice({ message: res.error, type: 'error' });
    } else {
      setNotice({ 
        message: `Booking request for ${target.name} marked as ${optimisticStatus}.`, 
        type: 'success' 
      });
    }
  };

  // Open Contact details modal
  const handleOpenContactModal = (req: RawRequest) => {
    setSelectedContact(req);
    setIsContactModalOpen(true);
    // Mark as seen in background
    markContactSeen(req.id);
  };

  // Handle Contact Reply
  const handleContactReplySubmit = async (id: string, replyMessage: string) => {
    const target = requestList.find(r => r.id === id);
    if (!target) return;

    const originalStatus = target.status;
    const optimisticStatus = 'replied';

    // 1. Instantly update UI & close modal
    updateStatusOptimistically(id, optimisticStatus);
    setIsContactModalOpen(false);
    setSelectedContact(null);
    setProcessingId(id);
    setNotice(null);

    // 2. Execute Server Action
    const res = await handleContactReply(id, replyMessage);
    setProcessingId(null);

    if (res.error) {
      revertStatus(id, originalStatus);
      setNotice({ message: res.error, type: 'error' });
    } else {
      setNotice({ 
        message: `Reply email sent to ${target.email} successfully.`, 
        type: 'success' 
      });
    }
  };

  // Handle Contact Dismiss
  const handleContactDismissSubmit = async (id: string) => {
    const target = requestList.find(r => r.id === id);
    if (!target) return;

    const originalStatus = target.status;
    const optimisticStatus = 'dismissed';

    updateStatusOptimistically(id, optimisticStatus);
    setIsContactModalOpen(false);
    setSelectedContact(null);
    setProcessingId(id);
    setNotice(null);

    const res = await dismissContact(id);
    setProcessingId(null);

    if (res.error) {
      revertStatus(id, originalStatus);
      setNotice({ message: res.error, type: 'error' });
    } else {
      setNotice({ 
        message: `Contact message from ${target.name} dismissed.`, 
        type: 'success' 
      });
    }
  };

  // Open Details Modal based on request type
  const handleSeeDetails = (id: string, type: RequestType) => {
    const req = requestList.find(r => r.id === id);
    if (!req) return;

    if (type === 'booking') {
      setSelectedBooking(req);
      setIsBookingModalOpen(true);
    } else if (type === 'contact') {
      handleOpenContactModal(req);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getTimeAgo = (isoString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 60000);
    if (diff < 60) return `${diff} minutes ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Administration / incoming</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Requests Hub</h1>
          <p className="mt-2 text-sm text-slate-500">Review new enquiries and keep your academy moving.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter requests">
          {filterOptions.map(filter => (
            <button 
              key={filter} 
              onClick={() => { setActiveFilter(filter); setCurrentPage(1); }} 
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {notice && (
        <div 
          className={`mb-5 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            notice.type === 'success' 
              ? 'border-teal-200 bg-teal-50 text-teal-800' 
              : 'border-red-200 bg-red-50 text-red-800'
          }`} 
          role="status"
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 size={18} className="text-teal-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-600 shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button aria-label="Dismiss notification" onClick={() => setNotice(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Latest Incoming Section */}
      <section aria-labelledby="latest-heading" className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="latest-heading" className="text-lg font-bold text-slate-950 flex items-center">
            Latest Incoming 
            {pendingRequests.length > 0 && (
              <span className="ml-2.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 ring-1 ring-red-200">
                {pendingRequests.length} new
              </span>
            )}
          </h2>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 border-dashed bg-slate-50 text-slate-500">
            No pending requests for the selected filter. All caught up!
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-3">
            {pendingRequests.map(req => {
              const borderColors = {
                registration: 'border-blue-600',
                booking: 'border-emerald-500',
                contact: 'border-orange-400'
              };
              
              return (
                <div key={req.id} className={`border-l-4 ${borderColors[req.source]} rounded-2xl`}>
                  <RequestCard 
                    id={req.id} 
                    type={req.source} 
                    title={req.name} 
                    subtitle={
                      req.source === 'registration' 
                        ? 'New student registration' 
                        : req.source === 'booking' 
                        ? 'Booking request' 
                        : 'Contact message'
                    } 
                    timestamp={getTimeAgo(req.created_at)} 
                    status={req.status as RequestStatus} 
                    details={{
                      email: req.email,
                      phone: req.phone,
                      class: req.class,
                      subject: req.subject,
                      message: req.message
                    }} 
                    onConfirm={(id, type) => {
                      if (type === 'registration') handleRegistrationAction(id, 'confirm');
                      else handleSeeDetails(id, type);
                    }} 
                    onRefuse={
                      req.source === 'registration' 
                        ? (id) => handleRegistrationAction(id, 'refuse') 
                        : undefined
                    }
                    onSeeDetails={handleSeeDetails}
                    isProcessing={processingId === req.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* History / Past Requests Section */}
      <section aria-labelledby="history-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="history-heading" className="text-lg font-bold text-slate-900">History / Past Requests</h2>
            <p className="mt-1 text-sm text-slate-500">A permanent audit log of all processed student requests.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
            {historyRequests.length} Total Records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No processed history records found yet.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map(row => {
                  const getStatusBadge = (st: string) => {
                    switch (st) {
                      case 'approved':
                      case 'confirmed':
                        return { label: st.toUpperCase(), color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
                      case 'contacted':
                        return { label: 'CONTACTED', color: 'bg-teal-50 text-teal-700 border-teal-200' };
                      case 'replied':
                        return { label: 'REPLIED', color: 'bg-blue-50 text-blue-700 border-blue-200' };
                      case 'refused':
                        return { label: 'REFUSED', color: 'bg-red-50 text-red-700 border-red-200' };
                      case 'dismissed':
                        return { label: 'DISMISSED', color: 'bg-slate-100 text-slate-600 border-slate-200' };
                      default:
                        return { label: st.toUpperCase(), color: 'bg-slate-100 text-slate-600 border-slate-200' };
                    }
                  };

                  const badge = getStatusBadge(row.status);

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
                          row.source === 'registration' ? 'bg-blue-50 text-blue-700' : row.source === 'booking' ? 'bg-teal-50 text-teal-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {row.source}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td>
                      <td className="px-5 py-4 text-slate-500">{row.email}</td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(row.created_at)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, historyRequests.length)} of {historyRequests.length} requests
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button className="rounded-md bg-blue-800 px-3 py-1.5 text-sm font-bold text-white">
                {currentPage}
              </button>
              
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        )}
      </section>

      {/* Modals */}
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setSelectedBooking(null); }}
        booking={selectedBooking}
        onConfirm={(id) => handleBookingAction(id, 'confirm')}
        onRefuse={(id) => handleBookingAction(id, 'refuse')}
        isProcessing={processingId !== null}
      />

      <ContactReplyModal
        isOpen={isContactModalOpen}
        onClose={() => { setIsContactModalOpen(false); setSelectedContact(null); }}
        contact={selectedContact}
        onSendReply={handleContactReplySubmit}
        onDismiss={handleContactDismissSubmit}
        isProcessing={processingId !== null}
      />
    </>
  );
};

