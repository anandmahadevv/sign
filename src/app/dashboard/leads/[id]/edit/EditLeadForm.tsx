'use client';

import React, { useState } from 'react';
import { updateLead } from '@/app/actions';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadSchema, LeadData } from '@/lib/schemas';

export default function EditLeadForm({ lead }: { lead: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadData>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      shopName: lead.shop_name || '',
      clientName: lead.client_name || '',
      phone: lead.phone || '',
      interestLevel: lead.interest_level || 'High',
      quotedPrice: lead.quoted_price || '',
      notes: lead.notes || '',
    },
  });

  const onSubmit = async (data: LeadData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('shopName', data.shopName);
    formData.append('clientName', data.clientName);
    if (data.phone) formData.append('phone', data.phone);
    formData.append('interestLevel', data.interestLevel);
    if (data.quotedPrice) formData.append('quotedPrice', data.quotedPrice.toString());
    if (data.notes) formData.append('notes', data.notes);

    try {
      await updateLead(lead.id, formData);
      router.push(`/dashboard/leads/${lead.id}`);
    } catch (err: any) {
      alert(err.message || 'An error occurred while updating the lead.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="shopName" className="block text-sm font-medium text-white mb-1">
            Shop / Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="shopName"
            maxLength={100}
            className={`w-full rounded-md border ${errors.shopName ? 'border-red-500' : 'border-white/10'} bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all`}
            {...register('shopName')}
          />
          {errors.shopName && <p className="mt-1 text-xs text-red-500">{errors.shopName.message}</p>}
        </div>

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-white mb-1">
            Client / Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            maxLength={100}
            className={`w-full rounded-md border ${errors.clientName ? 'border-red-500' : 'border-white/10'} bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all`}
            {...register('clientName')}
          />
          {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            maxLength={25}
            className={`w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-white/10'} bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all`}
            {...register('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="interestLevel" className="block text-sm font-medium text-white mb-1">
            Interest Level <span className="text-red-500">*</span>
          </label>
          <select
            id="interestLevel"
            className={`w-full rounded-md border ${errors.interestLevel ? 'border-red-500' : 'border-white/10'} bg-[#1a1a1c] px-4 py-3 text-white outline-none focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] transition-all`}
            {...register('interestLevel')}
          >
            <option value="High">High Interest 🔥</option>
            <option value="Medium">Medium Interest 🤝</option>
            <option value="Low">Low Interest 🧊</option>
            <option value="Not Interested">Not Interested 🚫</option>
          </select>
          {errors.interestLevel && <p className="mt-1 text-xs text-red-500">{errors.interestLevel.message}</p>}
        </div>

        <div>
          <label htmlFor="quotedPrice" className="block text-sm font-medium text-white mb-1">
            Quoted Price (Optional)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-white/40">₹</span>
            </div>
            <input
              type="number"
              id="quotedPrice"
              min="0"
              step="0.01"
              className={`w-full rounded-md border ${errors.quotedPrice ? 'border-red-500' : 'border-white/10'} bg-black/50 pl-8 pr-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all`}
              {...register('quotedPrice')}
            />
          </div>
          {errors.quotedPrice && <p className="mt-1 text-xs text-red-500">{errors.quotedPrice.message}</p>}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
            Field Notes (Optional)
          </label>
          <textarea
            id="notes"
            rows={4}
            maxLength={1000}
            className={`w-full rounded-md border ${errors.notes ? 'border-red-500' : 'border-white/10'} bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all resize-none`}
            {...register('notes')}
          />
          {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-md bg-[#28c840] px-4 py-4 text-sm font-bold text-black shadow-sm hover:bg-[#28c840]/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
