"use client";

import React from 'react';
import { CheckCircle2, XCircle, Clock, User, Mail, Phone, BookOpen, Eye } from 'lucide-react';

export type RequestType = 'registration' | 'booking' | 'contact';
export type RequestStatus = 'pending' | 'approved' | 'confirmed' | 'refused' | 'contacted' | 'replied' | 'seen' | 'dismissed';

interface RequestCardProps {
  id: string;
  type: RequestType;
  title: string;
  subtitle: string;
  timestamp: string;
  status: RequestStatus;
  details: {
    email?: string;
    phone?: string;
    class?: string;
    subject?: string;
    message?: string;
  };
  onConfirm: (id: string, type: RequestType) => void;
  onRefuse?: (id: string, type: RequestType) => void;
  onSeeDetails?: (id: string, type: RequestType) => void;
  isProcessing?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  id,
  type,
  title,
  subtitle,
  timestamp,
  status,
  details,
  onConfirm,
  onRefuse,
  onSeeDetails,
  isProcessing = false
}) => {
  const getBadgeStyles = () => {
    switch (type) {
      case 'registration': return 'bg-blue-100 text-blue-700';
      case 'booking': return 'bg-teal-100 text-teal-700';
      case 'contact': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return 'bg-emerald-500 text-white';
      case 'contacted':
        return 'bg-teal-600 text-white';
      case 'replied':
        return 'bg-blue-600 text-white';
      case 'seen':
        return 'bg-amber-500 text-white';
      case 'refused':
        return 'bg-red-500 text-white';
      case 'dismissed':
        return 'bg-slate-500 text-white';
      case 'pending':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getConfirmLabel = () => {
    switch (type) {
      case 'registration': return 'Confirm';
      case 'booking': return 'Confirm Slot';
      case 'contact': return 'Dismiss';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getBadgeStyles()}`}>
              {type}
            </span>
            {status === 'pending' && <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />}
          </div>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0 ml-2 ${getStatusStyles()}`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
        {details.phone && (
          <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2 sm:col-span-1">
            <Phone size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{details.phone}</span>
          </div>
        )}
        {details.email && (
          <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2 sm:col-span-1">
            <Mail size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{details.email}</span>
          </div>
        )}
        {details.class && (
          <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2 sm:col-span-1">
            <User size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">Class: {details.class}</span>
          </div>
        )}
        {details.subject && (
          <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2 sm:col-span-1">
            <BookOpen size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{details.subject}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600 text-xs col-span-2">
          <Clock size={14} className="text-slate-400 shrink-0" />
          <span>Requested: {timestamp}</span>
        </div>
        {details.message && (
          <div className="col-span-2 mt-2 p-2 bg-slate-50 rounded-lg text-slate-600 text-xs italic line-clamp-3">
            "{details.message}"
          </div>
        )}
      </div>

      {status === 'pending' && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-auto">
          {(type === 'booking' || type === 'contact') && onSeeDetails && (
            <button
              onClick={() => onSeeDetails(id, type)}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <Eye size={14} />
              See Details
            </button>
          )}

          {type === 'registration' && onRefuse && (
            <button 
              onClick={() => onRefuse(id, type)} 
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-red-200 text-red-600 font-semibold text-xs hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={14} />
              Refuse
            </button>
          )}

          {type === 'registration' && (
            <button 
              onClick={() => onConfirm(id, type)} 
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-800 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 size={14} />
              {getConfirmLabel()}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

