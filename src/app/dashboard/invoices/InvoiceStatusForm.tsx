'use client';

import React, { useTransition } from 'react';
import { updateInvoiceStatus, deleteInvoice } from '@/app/actions';

export default function InvoiceStatusForm({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(() => {
      updateInvoiceStatus(id, newStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isPending}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-white/30 disabled:opacity-50"
      >
        <option value="Unpaid" className="bg-[#1a1a1c]">Unpaid</option>
        <option value="Paid" className="bg-[#1a1a1c]">Paid</option>
        <option value="Cancelled" className="bg-[#1a1a1c]">Cancelled</option>
      </select>
      
      <form action={deleteInvoice}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="text-xs font-medium text-red-400/70 hover:text-red-400 transition-colors">
          Delete
        </button>
      </form>
    </div>
  );
}
