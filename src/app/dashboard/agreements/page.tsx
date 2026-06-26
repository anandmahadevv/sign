import React from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deleteAgreement } from '@/app/actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const revalidate = 0; // Disable caching so it always fetches fresh data

export default async function AgreementsPage() {
  const { userId, orgId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const query = supabase.from('agreements').select('*').order('created_at', { ascending: false });
  
  if (orgId) {
    query.eq('org_id', orgId);
  } else {
    query.eq('user_id', userId).is('org_id', null);
  }

  const { data: agreements } = await query;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Agreements</h1>
          <p className="mt-1 text-sm text-white/50">Manage and track all your client contracts.</p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          New Agreement
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2 rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <Search className="h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by client or project..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 ring-1 ring-white/10">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Agreements Table */}
      <div className="overflow-x-auto overflow-y-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/5">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-medium tracking-wider text-white/40">
              <th className="px-6 py-4">CLIENT NAME</th>
              <th className="px-6 py-4">PROJECT TYPE</th>
              <th className="px-6 py-4">VALUE</th>
              <th className="px-6 py-4">DATE CREATED</th>
              <th className="px-6 py-4">STATUS</th>
              <th className="px-6 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {!agreements || agreements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                  No agreements found. Create one to get started!
                </td>
              </tr>
            ) : (
              agreements.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white/90">
                    <Link href={`/sign/${row.id}`} target="_blank" className="hover:underline">
                      {row.client_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-white/60">{row.project_type}</td>
                  <td className="px-6 py-4 text-white/70">${Number(row.total_cost).toLocaleString()}</td>
                  <td className="px-6 py-4 text-white/50">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-white/5 ${
                      row.status === 'Signed' ? 'text-[#28c840]' : 
                      row.status === 'Drafting' ? 'text-white/50' : 
                      'text-[#febc2e]'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full bg-current`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/dashboard/agreements/${row.id}/edit`}
                        className="text-xs font-medium text-white/50 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <form action={deleteAgreement.bind(null, row.id)}>
                        <button type="submit" className="text-xs font-medium text-red-500/70 hover:text-red-500 transition-colors">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
