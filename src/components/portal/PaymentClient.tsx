'use client';

import React, { useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronUp, CircleAlert, Landmark, Smartphone, Building } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  class_type: string;
  completed: boolean;
}

interface PaymentCycle {
  id: string;
  cycle_number: number;
  payment_status: string;
  total_classes_count: number;
  cycle_class_limit: number;
  paid_at: string | null;
  alert_active: boolean;
  created_at: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'mfs';
  name: string;
  icon: string | null;
  account_name: string;
  account_number: string;
  branch_name: string | null;
  routing_number: string | null;
  swift_code: string | null;
}

interface PaymentClientProps {
  cycles: PaymentCycle[];
  attendance: AttendanceRecord[];
  paymentMethods: PaymentMethod[];
}

const INITIAL_VISIBLE = 3;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

export const PaymentClient = ({ cycles, attendance, paymentMethods }: PaymentClientProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCycles = showAll ? cycles : cycles.slice(0, INITIAL_VISIBLE);

  // Build a date → attended lookup
  const attendedDates = new Set(attendance.map((a) => a.date));

  const getStatusClass = (status: string) => {
    if (status === 'completed') return 'border-l-green-500 border-green-100';
    if (status === 'due') return 'border-l-red-500 border-red-50';
    return 'border-l-slate-300';
  };

  const getBadgeClass = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'due') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-500';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Completed';
    if (status === 'due') return 'Due';
    return 'In Progress';
  };

  const bankMethods = paymentMethods.filter(m => m.type === 'bank');
  const mfsMethodsList = paymentMethods.filter(m => m.type === 'mfs');

  const SafeImage = ({ src, alt, type, className }: { src: string, alt: string, type: 'bank' | 'mfs', className?: string }) => {
    const [error, setError] = useState(false);
  
    const defaultBank = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%231e40af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 21h18'/><path d='M3 10h18'/><path d='M5 6l7-3 7 3'/><path d='M4 10v11'/><path d='M20 10v11'/><path d='M8 14v3'/><path d='M12 14v3'/><path d='M16 14v3'/></svg>";
    const defaultMfs = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect width='14' height='20' x='5' y='2' rx='2' ry='2'/><path d='M12 18h.01'/></svg>";
  
    return (
      <img
        src={error ? (type === 'bank' ? defaultBank : defaultMfs) : src}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div className="space-y-8">
      {/* Payment Cycles */}
      <section aria-labelledby="payment-overview-title" className="space-y-5">
        <div>
          <h2 id="payment-overview-title" className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
            Payment Overview
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Your class payment cycles based on attendance
          </p>
        </div>

        {cycles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <CalendarDays className="mx-auto text-gray-300" size={58} />
            <h3 className="mt-5 text-lg font-semibold text-gray-900">No payment cycles yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Your payment cycles will appear here once your attendance is recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleCycles.map((cycle) => {
              // Find class dates that fall within this cycle's attended records
              // We show attended dates from the attendance table for simplicity
              const statusClass = getStatusClass(cycle.payment_status);

              return (
                <article
                  key={cycle.id}
                  className={`rounded-xl border border-l-[4px] bg-white p-5 shadow-sm ${statusClass}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-gray-900">
                      Cycle #{cycle.cycle_number}
                    </h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(cycle.payment_status)}`}>
                      {getStatusLabel(cycle.payment_status)}
                    </span>
                  </div>

                  {/* Class dates attended */}
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Attended Classes
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {attendance.length === 0 ? (
                        <span className="text-sm text-slate-400">No class records yet</span>
                      ) : (
                        attendance.slice(0, cycle.cycle_class_limit).map((a) => (
                          <span key={a.date} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {formatShortDate(a.date)}
                          </span>
                        ))
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {cycle.total_classes_count} of {cycle.cycle_class_limit} classes completed
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {cycle.payment_status === 'completed' && cycle.paid_at && (
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                          <Check size={16} />
                          Paid on: {formatDate(cycle.paid_at)}
                        </p>
                      )}
                      {cycle.payment_status === 'due' && (
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-red-500">
                          <CircleAlert size={16} />
                          Payment due. Please contact admin.
                        </p>
                      )}
                      {cycle.payment_status === 'in_progress' && (
                        <p className="text-sm font-medium text-gray-400">Cycle in progress…</p>
                      )}
                    </div>
                    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                      Cycle {cycle.cycle_number}
                    </span>
                  </div>
                </article>
              );
            })}

            {cycles.length > INITIAL_VISIBLE && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {showAll ? <><ChevronUp size={16} /> Show less</> : <><ChevronDown size={16} /> See more ({cycles.length - INITIAL_VISIBLE} more)</>}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Payment Details */}
      {paymentMethods.length > 0 && (
        <section aria-labelledby="payment-details-title" className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <h2 id="payment-details-title" className="text-xl font-semibold text-slate-900">
              Payment Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Make your payment using the following methods
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bank Transfers Column */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900"><Building size={20} className="text-slate-500" /> Bank Transfers</h3>
              <div className="grid gap-4">
                {bankMethods.map(method => (
                  <div key={method.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {method.icon ? (
                          <div className="w-12 h-12 rounded-lg border border-slate-100 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            <SafeImage src={method.icon} alt={method.name} type="bank" className="max-w-full max-h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Building size={20} className="text-slate-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{method.name}</h4>
                          <p className="text-slate-500 text-sm">Branch: {method.branch_name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                      <div className="flex justify-between border-b border-slate-200 pb-1"><span className="text-slate-500">Account Name</span><span className="font-semibold text-slate-800">{method.account_name}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-1"><span className="text-slate-500">Account No.</span><span className="font-bold tracking-wider text-slate-900">{method.account_number}</span></div>
                      <div className="flex justify-between border-b border-slate-200 pb-1"><span className="text-slate-500">Routing No.</span><span className="font-semibold text-slate-800">{method.routing_number || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Swift Code</span><span className="font-semibold text-slate-800">{method.swift_code || '-'}</span></div>
                    </div>
                  </div>
                ))}
                {bankMethods.length === 0 && (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <Building size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No bank methods available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* MFS Column */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900"><Smartphone size={20} className="text-slate-500" /> Mobile Financial Services (MFS)</h3>
              <div className="grid gap-4">
                {mfsMethodsList.map(method => (
                  <div key={method.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {method.icon ? (
                          <div className="w-12 h-12 rounded-lg border border-slate-100 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            <SafeImage src={method.icon} alt={method.name} type="mfs" className="max-w-full max-h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Smartphone size={20} className="text-slate-400" />
                          </div>
                        )}
                        <h4 className="font-bold text-lg text-slate-900">{method.name}</h4>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 mt-auto">
                      <div className="flex justify-between border-b border-slate-200 pb-1"><span className="text-slate-500">Account Name</span><span className="font-semibold text-slate-800">{method.account_name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Account No.</span><span className="font-bold tracking-wider text-slate-900">{method.account_number}</span></div>
                    </div>
                  </div>
                ))}
                {mfsMethodsList.length === 0 && (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <Smartphone size={24} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">No MFS methods available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* No payment config set yet */}
      {paymentMethods.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <Landmark className="mx-auto text-slate-300" size={36} />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Payment details have not been configured yet. Please contact your teacher.
          </p>
        </div>
      )}
    </div>
  );
};
