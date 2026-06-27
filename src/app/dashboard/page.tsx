import React from 'react';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RevenueChart from '@/components/RevenueChart';
import EmptyState from '@/components/EmptyState';

export const revalidate = 0; // Disable caching

export default async function DashboardOverview() {
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

  const totalAgreements = agreements?.length || 0;
  const signedContracts = agreements?.filter(a => a.status === 'Signed').length || 0;
  const pendingPayments = agreements?.filter(a => a.status === 'Signed').reduce((sum, a) => sum + (Number(a.total_cost) - Number(a.advance_payment)), 0) || 0;
  const revenueSecured = agreements?.filter(a => a.status === 'Signed').reduce((sum, a) => sum + Number(a.total_cost), 0) || 0;

  const recentAgreements = agreements?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-white/50">Welcome back to your Agency OS.</p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <Sparkles className="h-4 w-4 text-white/70" />
          Generate Agreement
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 rounded-xl bg-white/[0.02] ring-1 ring-white/5">
        <div className="flex flex-col gap-1 p-6">
          <span className="text-3xl font-bold text-white">{totalAgreements}</span>
          <span className="text-[10px] font-semibold tracking-wider text-white/60">
            AGREEMENTS SENT
          </span>
        </div>
        <div className="flex flex-col gap-1 p-6">
          <span className="text-3xl font-bold text-white">{signedContracts}</span>
          <span className="text-[10px] font-semibold tracking-wider text-white/60">
            SIGNED CONTRACTS
          </span>
        </div>
        <div className="flex flex-col gap-1 p-6">
          <span className="text-3xl font-bold text-white">${pendingPayments.toLocaleString()}</span>
          <span className="text-[10px] font-semibold tracking-wider text-white/60">
            PENDING PAYMENTS
          </span>
        </div>
        <div className="flex flex-col gap-1 p-6">
          <span className="text-3xl font-bold text-[#28c840]">${revenueSecured.toLocaleString()}</span>
          <span className="text-[10px] font-semibold tracking-wider text-white/60">
            REVENUE SECURED
          </span>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart agreements={agreements || []} />

      {/* Recent Agreements Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Agreements</h2>
          <Link href="/dashboard/agreements" className="text-sm text-white/50 hover:text-white transition-colors">
            View All
          </Link>
        </div>
        
        {recentAgreements.length === 0 ? (
          <EmptyState 
            title="No recent agreements" 
            description="Create your first client agreement to start generating revenue." 
          />
        ) : (
          <div className="overflow-x-auto overflow-y-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/5">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-medium tracking-wider text-white/40">
                  <th className="px-6 py-4">CLIENT NAME</th>
                  <th className="px-6 py-4">PROJECT TYPE</th>
                  <th className="px-6 py-4">VALUE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentAgreements.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium text-white/90">
                      <Link href={`/sign/${row.id}`} target="_blank" className="hover:underline">
                        {row.client_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white/60">{row.project_type}</td>
                    <td className="px-6 py-4 text-white/70">${Number(row.total_cost).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-white/5 ${
                        row.status === 'Signed' ? 'text-[#28c840]' : 
                        row.status === 'Sent' ? 'text-blue-400' : 
                        row.status === 'Viewed' ? 'text-orange-400' : 
                        row.status === 'Expired' ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full bg-current`}></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/sign/${row.id}`} target="_blank" className="text-xs font-medium text-[#28c840]/70 hover:text-[#28c840] transition-colors">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
