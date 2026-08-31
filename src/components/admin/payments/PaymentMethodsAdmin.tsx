"use client";

import React, { useState } from 'react';
import { CreditCard, Trash2, Plus, Edit2, Building, Smartphone } from 'lucide-react';
import { upsertPaymentMethod, deletePaymentMethod } from '@/app/actions/paymentActions';

const bankOptions = [
  { name: 'BRAC Bank', icon: '/payment-logos/Brac.webp' },
  { name: 'Dutch Bangla Bank', icon: '/payment-logos/Dutch-bangla.svg' },
  { name: 'Islami Bank', icon: '/payment-logos/islami.png' },
  { name: 'Pubali Bank', icon: '/payment-logos/pubali.png' },
  { name: 'Trust Bank', icon: '/payment-logos/trust.png' },
  { name: 'UCB Bank', icon: '/payment-logos/ucb.png' },
].sort((a, b) => a.name.localeCompare(b.name));

const mfsOptions = [
  { name: 'bKash', icon: '/payment-logos/BKash.svg' },
  { name: 'Nagad', icon: '/payment-logos/Nagad.svg' },
  { name: 'Rocket', icon: '/payment-logos/Rocket.svg' },
  { name: 'TapTap', icon: '/payment-logos/taptap.png' },
].sort((a, b) => a.name.localeCompare(b.name));

const SafeImage = ({ src, alt, type, className }: { src: string, alt: string, type: 'bank' | 'mfs', className?: string }) => {
  const [error, setError] = useState(false);

  const defaultBank = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%231e40af' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 21h18'/><path d='M3 10h18'/><path d='M5 6l7-3 7 3'/><path d='M4 10v11'/><path d='M20 10v11'/><path d='M8 14v3'/><path d='M12 14v3'/><path d='M16 14v3'/></svg>";
  const defaultMfs = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23047857' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect width='14' height='20' x='5' y='2' rx='2' ry='2'/><path d='M12 18h.01'/></svg>";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={error ? (type === 'bank' ? defaultBank : defaultMfs) : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};


export const PaymentMethodsAdmin = ({ methods }: { methods: any[] }) => {
  const [editingMethod, setEditingMethod] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'bank' | 'mfs'>('mfs');
  const [notice, setNotice] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const openForm = (method?: any) => {
    if (method) {
      setEditingMethod(method);
      setFormType(method.type);
      setSelectedProvider(method.name);
    } else {
      setEditingMethod(null);
      setSelectedProvider('');
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMethod(null);
    setNotice('');
    setSelectedProvider('');
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

  const currentOptions = formType === 'bank' ? bankOptions : mfsOptions;
  const selectedOptionData = currentOptions.find(o => o.name === selectedProvider) ||
    // Fallback for custom names in the DB not in our list
    (selectedProvider && !currentOptions.some(o => o.name === selectedProvider)
      ? { name: selectedProvider, icon: editingMethod?.icon || '' }
      : null);

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
              <button
                onClick={() => { setFormType('bank'); setSelectedProvider(''); }}
                className={`px-4 py-2 text-sm font-bold rounded-lg ${formType === 'bank' ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
              >Bank</button>
              <button
                onClick={() => { setFormType('mfs'); setSelectedProvider(''); }}
                className={`px-4 py-2 text-sm font-bold rounded-lg ${formType === 'mfs' ? 'bg-blue-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
              >MFS</button>
            </div>
          </div>

          {notice && <p className="mb-4 text-red-600 text-sm font-semibold">{notice}</p>}

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">

            <div className="sm:col-span-2 flex gap-4 items-start">
              <div className="flex-1">
                <label className="text-sm font-semibold text-slate-700">Bank / Provider Name</label>
                <select
                  name="name"
                  required
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select a {formType === 'bank' ? 'Bank' : 'Provider'}</option>
                  {currentOptions.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.name}</option>
                  ))}
                  {/* Show current selected if it's not in the standard list */}
                  {selectedProvider && !currentOptions.some(o => o.name === selectedProvider) && (
                    <option value={selectedProvider}>{selectedProvider}</option>
                  )}
                </select>
                {selectedOptionData?.icon && <input type="hidden" name="icon" value={selectedOptionData.icon} />}
              </div>

              {selectedOptionData?.icon && (
                <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white shadow-sm mt-6">
                  <SafeImage src={selectedOptionData.icon} alt={selectedOptionData.name} type={formType} className="max-w-full max-h-full object-contain p-1" />
                </div>
              )}
            </div>

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
                      <h3 className="font-bold text-lg">{method.name}</h3>
                      <p className="text-slate-500 text-sm">Branch: {method.branch_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openForm(method)} className="p-2 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(method.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
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
            {methods.filter(m => m.type === 'bank').length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <Building size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No bank methods configured.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Smartphone size={20} className="text-slate-500" /> Mobile Financial Services (MFS)</h2>
          <div className="grid gap-4">
            {methods.filter(m => m.type === 'mfs').map(method => (
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
                    <h3 className="font-bold text-lg">{method.name}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openForm(method)} className="p-2 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(method.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="space-y-2 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 mt-auto">
                  <div className="flex justify-between border-b border-slate-200 pb-1"><span className="text-slate-500">Account Name</span><span className="font-semibold text-slate-800">{method.account_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Account No.</span><span className="font-bold tracking-wider text-slate-900">{method.account_number}</span></div>
                </div>
              </div>
            ))}
            {methods.filter(m => m.type === 'mfs').length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <Smartphone size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No MFS methods configured.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

