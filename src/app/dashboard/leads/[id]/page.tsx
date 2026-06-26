import React from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Store, User, Phone, DollarSign, Clock, FileText, Pencil, Trash2 } from 'lucide-react';
import DeleteLeadButton from './DeleteLeadButton';

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { userId, orgId } = await auth();

  let query = supabase
    .from('field_visits')
    .select('*')
    .eq('id', resolvedParams.id);

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else if (userId) {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { data: lead, error } = await query.single();

  if (error || !lead) {
    notFound();
  }

  const getInterestBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">High Interest 🔥</span>;
      case 'medium':
        return <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Medium Interest 🤝</span>;
      case 'low':
        return <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">Low Interest 🧊</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{level} 🚫</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/leads"
            className="p-2 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{lead.shop_name}</h1>
            <p className="text-white/60 text-sm mt-1">Lead Details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/leads/${lead.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/20 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <DeleteLeadButton id={lead.id} />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#28c840]/20 flex items-center justify-center shrink-0">
              <Store className="h-8 w-8 text-[#28c840]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{lead.shop_name}</h2>
              <div className="flex items-center gap-2 text-white/60 mt-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Added on {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <div>
            {getInterestBadge(lead.interest_level)}
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-[#28c840] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-white/60">Contact Name</p>
                    <p className="text-base text-white font-medium">{lead.client_name}</p>
                  </div>
                </div>
                {lead.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#28c840] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-white/60">Phone Number</p>
                      <a href={`tel:${lead.phone}`} className="text-base text-white font-medium hover:text-[#28c840] transition-colors">{lead.phone}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Financials</h3>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-[#28c840] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white/60">Quoted Price</p>
                  <p className="text-base text-white font-medium">
                    {lead.quoted_price ? `₹${lead.quoted_price}` : 'No price quoted yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Field Notes</h3>
            <div className="bg-black/30 rounded-lg p-5 border border-white/5 h-[calc(100%-2rem)] min-h-[150px]">
              {lead.notes ? (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                  <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{lead.notes}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/40 text-sm italic">
                  <FileText className="h-8 w-8 mb-2 opacity-50" />
                  No field notes recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
