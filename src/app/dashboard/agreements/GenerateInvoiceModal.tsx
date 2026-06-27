'use client';

import React, { useState } from 'react';
import { createInvoice } from '@/app/actions';
import { Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GenerateInvoiceModal({ agreementId, defaultAmount }: { agreementId: string, defaultAmount: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createInvoice(formData);
      setIsOpen(false);
      router.push(`/invoice/${res.id}`);
    } catch (err: any) {
      alert(err.message);
    }
    setIsSubmitting(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium text-white/40 hover:text-white transition-colors"
        title="Generate Invoice"
      >
        <Receipt className="h-3.5 w-3.5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-[#1a1a1c] p-6 shadow-2xl ring-1 ring-white/10 text-left">
        <h2 className="text-xl font-bold text-white mb-4">Generate Invoice</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="agreementId" value={agreementId} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Amount ($)</label>
            <input 
              name="amount" 
              type="number" 
              defaultValue={defaultAmount}
              required
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
            <p className="text-[10px] text-white/40">Defaulted to the Advance Payment or Total Cost</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Issue Date</label>
              <input 
                name="issueDate" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                required
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Due Date</label>
              <input 
                name="dueDate" 
                type="date" 
                defaultValue={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Payment Instructions / Notes</label>
            <textarea 
              name="notes" 
              rows={3}
              defaultValue="Please remit payment via Zelle or wire transfer."
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
