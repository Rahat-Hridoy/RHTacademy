"use client";

import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { RequestCard, RequestType, RequestStatus } from './RequestCard';
import { handleRegistration, handleBooking, dismissContact } from '@/app/actions/adminActions';

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
  const [activeFilter, setActiveFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (activeFilter === 'All') return true;
    return req.source.toLowerCase() === activeFilter.toLowerCase();
  });

  // Separate pending (latest) and history
  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');
  const historyRequests = filteredRequests.filter(req => req.status !== 'pending');

  // Pagination for history
  const totalPages = Math.ceil(historyRequests.length / ITEMS_PER_PAGE);
  const paginatedHistory = historyRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAction = async (id: string, type: RequestType, action: 'confirm' | 'refuse') => {
    setProcessingId(id);
    setNotice('');
    try {
      if (type === 'registration') {
        const res = await handleRegistration(id, action);
        if (res.error) throw new Error(res.error);
        setNotice(`Registration ${action === 'confirm' ? 'approved' : 'refused'}.`);
      } else if (type === 'booking') {
        const res = await handleBooking(id, 'contacted');
        if (res.error) throw new Error(res.error);
        setNotice(`Booking marked as contacted.`);
      } else if (type === 'contact') {
        const res = await dismissContact(id);
        if (res.error) throw new Error(res.error);
        setNotice(`Contact message dismissed.`);
      }
    } catch (e: any) {
      setNotice(e.message || 'An error occurred');
    } finally {
      setProcessingId(null);
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
            <button key={filter} onClick={() => { setActiveFilter(filter); setCurrentPage(1); }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? 'bg-blue-800 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300'}`}>
              {filter}
            </button>
          ))}
        </div>
      </header>

      {notice && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800" role="status">
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice('')}>
            <X size={16} />
          </button>
        </div>
      )}

      <section aria-labelledby="latest-heading" className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="latest-heading" className="text-lg font-bold text-slate-950">
            Latest Incoming 
            {pendingRequests.length > 0 && (
              <span className="ml-2 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                {pendingRequests.length} new
              </span>
            )}
          </h2>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-200 border-dashed bg-slate-50 text-slate-500">
            No pending requests for the selected filter.
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
                <div key={req.id} className={`border-l-4 ${borderColors[req.source]}`}>
                  <RequestCard 
                    id={req.id} 
                    type={req.source} 
                    title={req.name} 
                    subtitle={req.source === 'registration' ? 'New student registration' : req.source === 'booking' ? 'Booking request' : 'Contact message'} 
                    timestamp={getTimeAgo(req.created_at)} 
                    status={req.status as RequestStatus} 
                    details={{
                      email: req.email,
                      phone: req.phone,
                      class: req.class,
                      subject: req.subject,
                      message: req.message
                    }} 
                    onConfirm={(id, type) => handleAction(id, type, 'confirm')} 
                    onRefuse={req.source === 'registration' ? (id, type) => handleAction(id, type, 'refuse') : undefined} 
                    isProcessing={processingId === req.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="history-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="history-heading" className="text-lg font-bold">Previous Requests</h2>
            <p className="mt-1 text-sm text-slate-500">A record of your latest conversations.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No history records found.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${row.source === 'registration' ? 'bg-blue-50 text-blue-700' : row.source === 'booking' ? 'bg-teal-50 text-teal-700' : 'bg-orange-50 text-orange-700'}`}>
                        {row.source}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{row.name}</td>
                    <td className="px-5 py-4 text-slate-500">{row.email}</td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(row.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 font-semibold ${row.status === 'refused' ? 'text-red-600' : row.status === 'approved' || row.status === 'contacted' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'refused' ? 'bg-red-500' : row.status === 'approved' || row.status === 'contacted' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
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
    </>
  );
};
