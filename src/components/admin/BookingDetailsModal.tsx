"use client";

import React from 'react';
import { X, CheckCircle2, XCircle, User, Mail, Phone, BookOpen, Clock, Calendar } from 'lucide-react';
import { RawRequest } from './RequestsHub';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: RawRequest | null;
  onConfirm: (id: string) => void;
  onRefuse: (id: string) => void;
  isProcessing?: boolean;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirm,
  onRefuse,
  isProcessing = false,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <Calendar size={18} />
            </div>
            <div>
              <h2 id="booking-modal-title" className="text-base font-bold text-slate-900">
                Booking Request Details
              </h2>
              <p className="text-xs text-slate-500">Review student schedule booking details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <User size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-400 block">Student Name</span>
                <span className="text-sm font-bold text-slate-900">{booking.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-medium text-slate-400 block">Email Address</span>
                  <span className="text-sm text-slate-800 font-medium truncate block">{booking.email}</span>
                </div>
              </div>

              {booking.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-slate-400 block">Phone Number</span>
                    <span className="text-sm text-slate-800 font-medium">{booking.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4 space-y-3">
            {booking.subject && (
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-teal-700 block uppercase tracking-wider">Selected Subjects</span>
                  <span className="text-sm font-bold text-slate-900">{booking.subject}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1 border-t border-teal-100/60">
              <Clock size={16} className="text-teal-600 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-teal-700 block uppercase tracking-wider">Requested Class Time / Slot</span>
                <span className="text-sm font-bold text-teal-900">{booking.class || 'Standard Slot'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Requested on: {new Date(booking.created_at).toLocaleString()}</span>
            <span className="font-semibold capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Status: {booking.status}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
          >
            Close
          </button>
          
          <button
            onClick={() => onRefuse(booking.id)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition disabled:opacity-50"
          >
            <XCircle size={16} />
            Refuse Booking
          </button>

          <button
            onClick={() => onConfirm(booking.id)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 shadow-sm transition disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};
