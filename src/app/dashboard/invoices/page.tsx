import React from 'react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import { Plus } from 'lucide-react';
import InvoiceStatusForm from './InvoiceStatusForm';

export const revalidate = 0;

export default async function InvoicesPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect('/sign-in');

  let query = supabase
    .from('invoices')
    .select('*, agreements(client_name, company_name, project_name)')
    .order('created_at', { ascending: false });

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { data: invoices, error } = await query;

  if (error) {
    console.error('Error fetching invoices:', error);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Invoices</h1>
          <p className="mt-1 text-sm text-white/50">
            Track and manage your manual invoices.
          </p>
        </div>
        <Link
          href="/dashboard/agreements"
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Generate from Agreement
        </Link>
      </div>

      {/* Invoices Table */}
      {!invoices || invoices.length === 0 ? (
        <EmptyState 
          title="No invoices found" 
          description="Generate your first invoice from the Agreements tab."
          actionLink="/dashboard/agreements"
          actionLabel="View Agreements"
        />
      ) : (
        <div className="overflow-x-auto overflow-y-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/5">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-medium tracking-wider text-white/40">
                <th className="px-6 py-4">INVOICE NO.</th>
                <th className="px-6 py-4">CLIENT</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">ISSUED</th>
                <th className="px-6 py-4">DUE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {invoices.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white/90">
                    {row.invoice_number}
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {row.agreements?.client_name || row.agreements?.company_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-white/70">${Number(row.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-white/50">{new Date(row.issue_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white/50">{new Date(row.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-white/5 ${
                      row.status === 'Paid' ? 'text-[#28c840]' : 
                      row.status === 'Cancelled' ? 'text-red-400' : 
                      'text-orange-400'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full bg-current`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/invoice/${row.id}`} target="_blank" className="text-xs font-medium text-white/40 hover:text-white transition-colors">
                        View
                      </Link>
                      <InvoiceStatusForm id={row.id} currentStatus={row.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
