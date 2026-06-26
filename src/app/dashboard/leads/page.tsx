import React from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Plus, Store, User, DollarSign, Clock } from 'lucide-react';

export default async function LeadsPage() {
  const { userId, orgId } = await auth();

  let query = supabase
    .from('field_visits')
    .select('*')
    .order('created_at', { ascending: false });

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else if (userId) {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { data: leads, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
  }

  const getInterestBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">High Interest</span>;
      case 'medium':
        return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Medium Interest</span>;
      case 'low':
        return <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">Low Interest</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{level}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Field Leads</h1>
          <p className="text-white/60 text-sm mt-1">Manage and track your daily shop visits.</p>
        </div>
        <Link 
          href="/dashboard/leads/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#28c840] px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#28c840]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Lead
        </Link>
      </div>

      {leads && leads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <Link href={`/dashboard/leads/${lead.id}`} key={lead.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07] transition-colors relative flex flex-col group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Store className="h-4 w-4 text-[#28c840]" />
                  <span className="truncate">{lead.shop_name}</span>
                </div>
                {getInterestBadge(lead.interest_level)}
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <User className="h-4 w-4 text-white/40" />
                  <span>{lead.client_name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <DollarSign className="h-4 w-4 text-white/40" />
                  <span>
                    {lead.quoted_price ? `Quoted: ₹${lead.quoted_price}` : 'No price quoted'}
                  </span>
                </div>

                {lead.notes && (
                  <div className="mt-3 p-3 rounded-md bg-black/20 text-xs text-white/60 italic line-clamp-3">
                    "{lead.notes}"
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <span className="text-[#28c840] opacity-0 group-hover:opacity-100 transition-opacity">View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 p-12 text-center bg-white/5">
          <Store className="mx-auto h-12 w-12 text-white/20 mb-4" />
          <h3 className="text-sm font-semibold text-white">No field leads yet</h3>
          <p className="mt-1 text-sm text-white/50">Get out there and start visiting shops!</p>
          <Link
            href="/dashboard/leads/create"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add First Lead
          </Link>
        </div>
      )}
    </div>
  );
}
