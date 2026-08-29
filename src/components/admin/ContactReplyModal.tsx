"use client";

import React, { useState, useEffect } from 'react';
import { X, Send, Trash2, Mail, User, MessageSquare, Loader2 } from 'lucide-react';
import { RawRequest } from './RequestsHub';

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: RawRequest | null;
  onSendReply: (id: string, replyMessage: string) => void;
  onDismiss: (id: string) => void;
  isProcessing?: boolean;
}

export const ContactReplyModal: React.FC<ContactReplyModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSendReply,
  onDismiss,
  isProcessing = false,
}) => {
  const [replyText, setReplyText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (contact) {
      setReplyText('');
      setErrorMsg('');
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const handleSend = () => {
    if (!replyText.trim()) {
      setErrorMsg('Please type a reply message before sending.');
      return;
    }
    setErrorMsg('');
    onSendReply(contact.id, replyText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 id="contact-modal-title" className="text-base font-bold text-slate-900">
                Contact Message & Reply
              </h2>
              <p className="text-xs text-slate-500">Read inquiry and send email response</p>
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

        {/* Modal Content - Scrollable */}
        <div className="space-y-4 p-6 overflow-y-auto">
          {/* Sender details */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-3">
              <User size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-400 block">Sender Name</span>
                <span className="text-sm font-bold text-slate-900">{contact.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-400 block">Email Address</span>
                <span className="text-sm font-medium text-slate-800">{contact.email}</span>
              </div>
            </div>
          </div>

          {/* Full Message Display */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Original Message Content
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {contact.message || 'No message content provided.'}
            </div>
          </div>

          {/* Reply Textarea */}
          <div className="pt-2">
            <label htmlFor="reply-textarea" className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
              Your Email Response
            </label>
            <textarea
              id="reply-textarea"
              rows={4}
              value={replyText}
              onChange={(e) => { setReplyText(e.target.value); setErrorMsg(''); }}
              placeholder={`Write your reply to ${contact.name}...`}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            />
            {errorMsg && (
              <p className="mt-1 text-xs font-semibold text-red-600">{errorMsg}</p>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 shrink-0">
          <button
            onClick={() => onDismiss(contact.id)}
            disabled={isProcessing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition disabled:opacity-50"
          >
            <Trash2 size={15} />
            Dismiss Message
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
