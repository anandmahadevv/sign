import React from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import EditLeadForm from './EditLeadForm';

export default async function EditLeadPage({ params }: { params: { id: string } }) {
  const { userId, orgId } = await auth();

  let query = supabase
    .from('field_visits')
    .select('*')
    .eq('id', params.id);

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else if (userId) {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { data: lead, error } = await query.single();

  if (error || !lead) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/dashboard/leads/${lead.id}`}
          className="p-2 rounded-md hover:bg-white/5 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Edit Field Visit</h1>
          <p className="text-white/60 text-sm mt-1">Update information for {lead.shop_name}.</p>
        </div>
      </div>

      <EditLeadForm lead={lead} />
    </div>
  );
}
