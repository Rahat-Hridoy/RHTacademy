"use client";

import React, { useState } from 'react';
import { CreditCard, Trash2, Plus, Edit2, Building, Smartphone } from 'lucide-react';
import { upsertPaymentMethod, deletePaymentMethod } from '@/app/actions/paymentActions';

export const PaymentMethodsAdmin = ({ methods }: { methods: any[] }) => {
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'bank' | 'mfs'>('mfs');
  const [notice, setNotice] = useState('');
  const [isPending, setIsPending] = useState(false);

  const openForm = (method?: any) => {
    if (method) {
      setEditingMethod(method);
      setFormType(method.type);
    } else {
      setEditingMethod(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMethod(null);
    setNotice('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setNotice('');
    const formData = new FormData(e.currentTarget);
    formData.append('type', formType);
    if (editingMethod?.id) formData.append('id', editingMethod.id);

    const res = await upsertPaymentMethod(formData);
    if (res.error) setNotice(res.error);
    else {
      closeForm();
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    const res = await deletePaymentMethod(id);
    if (res.error) alert(res.error);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Financials</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Payment Methods</h1>
          <p className="mt-2 text-sm text-slate-500">Manage bank and mobile financial service details for students.</p>
        </div>
        <button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 transition">
          <Plus size={18} /> Add New Method
        </button>
      </header>

      {isFormOpen && (
        <div className="mb-8 p-6 rounded-2xl border border-blue-200 bg-blue-50 shadow-sm animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}</h3>
            <div className="flex gap-2">
              <button onClick={() => setFormType('bank')} className={`px-4 py-2 text-sm font-bold rounded-lg ${formType === 'bank' ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>Bank</button>
              <button onClick={() => setFormType('mfs')} className={`px-4 py-2 text-sm font-bold rounded-lg ${formType === 'mfs' ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>MFS</button>
            </div>
          </div>
          
          {notice && <p className="mb-4 text-red-600 text-sm font-semibold">{notice}</p>}
          
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm font-semibold text-slate-700">Bank / Provider Name
              <input name="name" required defaultValue={editingMethod?.name} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" placeholder={formType === 'bank' ? 'e.g., BRAC Bank' : 'e.g., bKash'} />
            </label>
            <label className="text-sm font-semibold text-slate-700">Account Name
              <input name="account_name" required defaultValue={editingMethod?.account_name} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" placeholder="e.g., Md. Rashedul Hasan" />
            </label>
            <label className="text-sm font-semibold text-slate-700">Account Number
              <input name="account_number" required defaultValue={editingMethod?.account_number} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
            </label>
            
            {formType === 'bank' && (
              <>
                <label className="text-sm font-semibold text-slate-700">Branch Name
                  <input name="branch_name" defaultValue={editingMethod?.branch_name} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
                <label className="text-sm font-semibold text-slate-700">Routing Number
                  <input name="routing_number" defaultValue={editingMethod?.routing_number} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
                <label className="text-sm font-semibold text-slate-700">Swift Code (Optional)
                  <input name="swift_code" defaultValue={editingMethod?.swift_code} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" />
                </label>
              </>
            )}

            <div className="sm:col-span-2 flex justify-end gap-3 mt-4 border-t border-slate-200 pt-4">
              <button type="button" onClick={closeForm} className="px-5 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-white">Cancel</button>
              <button type="submit" disabled={isPending} className="px-5 py-2 text-sm font-bold text-white bg-blue-800 rounded-lg hover:bg-blue-900 disabled:opacity-50">
                {isPending ? 'Saving...' : 'Save Method'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Building size={20} className="text-slate-500" /> Bank Transfers</h2>
          <div className="grid gap-4">
            {methods.filter(m => m.type === 'bank').map(method => (
              <div key={method.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{method.name}</h3>
                    <p className="text-slate-500 text-sm">Branch: {method.branch_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openForm(method)} className="p-2 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(method.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">Account Name</span><span className="font-semibold">{method.account_name}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">Account No.</span><span className="font-bold tracking-wider">{method.account_number}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">Routing No.</span><span className="font-semibold">{method.routing_number}</span></div>
                  {method.swift_code && <div className="flex justify-between"><span className="text-slate-500">Swift Code</span><span className="font-semibold">{method.swift_code}</span></div>}
                </div>
              </div>
            ))}
            {methods.filter(m => m.type === 'bank').length === 0 && <p className="text-sm text-slate-500">No bank methods configured.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Smartphone size={20} className="text-slate-500" /> Mobile Financial Services (MFS)</h2>
          <div className="grid gap-4">
            {methods.filter(m => m.type === 'mfs').map(method => (
              <div key={method.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{method.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openForm(method)} className="p-2 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(method.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-slate-500">Account Name</span><span className="font-semibold">{method.account_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Account No.</span><span className="font-bold tracking-wider">{method.account_number}</span></div>
                </div>
              </div>
            ))}
            {methods.filter(m => m.type === 'mfs').length === 0 && <p className="text-sm text-slate-500">No MFS methods configured.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
