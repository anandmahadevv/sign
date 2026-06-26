'use client';

import React, { useState } from 'react';
import { createLead } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function CreateLeadPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createLead(formData);
    } catch (err: any) {
      alert(err.message || 'An error occurred while saving the lead.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/leads"
          className="p-2 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Log Field Visit</h1>
          <p className="text-white/60 text-sm mt-1">Quickly punch in data from your shop visit.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        
        <div className="space-y-4">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-white mb-1">
              Shop / Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="shopName"
              id="shopName"
              required
              className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all"
              placeholder="e.g., Central Cafe"
            />
          </div>

          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-white mb-1">
              Client / Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              id="clientName"
              required
              className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all"
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label htmlFor="interestLevel" className="block text-sm font-medium text-white mb-1">
              Interest Level <span className="text-red-500">*</span>
            </label>
            <select
              name="interestLevel"
              id="interestLevel"
              required
              className="w-full rounded-md border border-white/10 bg-[#1a1a1c] px-4 py-3 text-white outline-none focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] transition-all"
            >
              <option value="High">High Interest 🔥</option>
              <option value="Medium">Medium Interest 🤝</option>
              <option value="Low">Low Interest 🧊</option>
              <option value="Not Interested">Not Interested 🚫</option>
            </select>
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
                name="quotedPrice"
                id="quotedPrice"
                min="0"
                step="0.01"
                className="w-full rounded-md border border-white/10 bg-black/50 pl-8 pr-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
              Field Notes (Optional)
            </label>
            <textarea
              name="notes"
              id="notes"
              rows={3}
              className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-[#28c840] focus:ring-1 focus:ring-[#28c840] outline-none transition-all resize-none"
              placeholder="Jot down specific requirements, next steps, or reasons for rejection..."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#28c840] px-4 py-4 text-sm font-bold text-black shadow-sm hover:bg-[#28c840]/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}
