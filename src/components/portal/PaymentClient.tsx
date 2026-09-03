'use client';

import React, { useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronUp, CircleAlert, Landmark, Smartphone } from 'lucide-react';

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

interface PaymentConfig {
  bank_account_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  branch: string | null;
  swift_code: string | null;
  routing: string | null;
  bkash_number: string | null;
  nagad_number: string | null;
  rocket_number: string | null;
  taptap_number: string | null;
}

interface PaymentClientProps {
  cycles: PaymentCycle[];
  attendance: AttendanceRecord[];
  paymentConfig: PaymentConfig | null;
}

const INITIAL_VISIBLE = 3;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

export const PaymentClient = ({ cycles, attendance, paymentConfig }: PaymentClientProps) => {
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

  const mfsMethods = [
    { id: 'bkash', name: 'bKash', number: paymentConfig?.bkash_number, tone: 'border-pink-100 bg-pink-50/50', iconTone: 'bg-pink-500 text-white' },
    { id: 'nagad', name: 'Nagad', number: paymentConfig?.nagad_number, tone: 'border-orange-100 bg-orange-50/50', iconTone: 'bg-orange-500 text-white' },
    { id: 'rocket', name: 'Rocket', number: paymentConfig?.rocket_number, tone: 'border-purple-100 bg-purple-50/50', iconTone: 'bg-purple-600 text-white' },
    { id: 'taptap', name: 'Taptap', number: paymentConfig?.taptap_number, tone: 'border-blue-100 bg-blue-50/50', iconTone: 'bg-blue-600 text-white' },
  ].filter((m) => m.number);

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
      {paymentConfig && (
        <section aria-labelledby="payment-details-title" className="space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <h2 id="payment-details-title" className="text-xl font-semibold text-slate-900">
              Payment Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Make your payment using the following methods
            </p>
          </div>

          {/* Bank Transfer */}
          {paymentConfig.bank_account_name && (
            <article className="rounded-xl border border-slate-200 border-l-[4px] border-l-blue-600 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Landmark size={21} />
                </span>
                <h3 className="text-base font-semibold text-slate-900">Bank Transfer</h3>
              </div>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Account Name', value: paymentConfig.bank_account_name },
                  { label: 'Bank Name', value: paymentConfig.bank_name },
                  { label: 'Account Number', value: paymentConfig.account_number },
                  { label: 'Branch', value: paymentConfig.branch },
                  { label: 'Swift Code', value: paymentConfig.swift_code },
                  { label: 'Routing', value: paymentConfig.routing },
                ].filter((f) => f.value).map((field) => (
                  <div key={field.label} className="space-y-1">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</dt>
                    <dd className="text-sm font-semibold text-slate-900">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          )}

          {/* MFS */}
          {mfsMethods.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {mfsMethods.map((method) => (
                <article key={method.id} className={`rounded-xl border p-4 shadow-sm ${method.tone}`}>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${method.iconTone}`}>
                      <Smartphone size={18} />
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{method.name}</h3>
                      <p className="mt-0.5 text-sm font-medium text-slate-500">{method.number}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* No payment config set yet */}
      {!paymentConfig && (
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
