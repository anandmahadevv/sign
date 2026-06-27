import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Logo from '@/components/Logo';
import { FileText } from 'lucide-react';
import DownloadInvoiceButton from './DownloadInvoiceButton';

export const revalidate = 0;

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, agreements(*)')
    .eq('id', id)
    .single();

  if (error || !invoice) {
    notFound();
  }

  // Fetch profile manually using org_id or user_id
  let profile = null;
  if (invoice.org_id) {
    const { data } = await supabase.from('profiles').select('*').eq('owner_id', invoice.org_id).single();
    profile = data;
  } else if (invoice.user_id) {
    const { data } = await supabase.from('profiles').select('*').eq('owner_id', invoice.user_id).single();
    profile = data;
  }

  return renderInvoice({ ...invoice, profiles: profile });
}

function renderInvoice(invoice: any) {
  const agreement = invoice.agreements;
  const profile = invoice.profiles || { agency_name: 'Agency', brand_color: '#111827' };
  const brandColor = profile.brand_color || '#111827';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header 
        className="w-full px-6 py-4 flex items-center justify-between text-white"
        style={{ backgroundColor: brandColor }}
      >
        <div className="flex items-center gap-3">
          {profile.logo_url ? (
            <img src={profile.logo_url} alt="Logo" className="h-8 object-contain" />
          ) : (
            <Logo className="text-white" />
          )}
          <span className="font-bold text-lg tracking-tight">{profile.agency_name}</span>
        </div>
        <DownloadInvoiceButton invoiceName={invoice.invoice_number} />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-12">
        <div id="invoice-content" className="bg-white p-8 md:p-16 rounded-2xl shadow-xl border border-gray-100 text-gray-900">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">INVOICE</h1>
              <p className="text-gray-500 font-medium">#{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                invoice.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                'bg-orange-100 text-orange-700'
              }`}>
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
              <p className="font-bold text-lg">{agreement.client_name}</p>
              <p className="text-gray-600">{agreement.company_name}</p>
              <p className="text-gray-600 mt-2">{agreement.address}</p>
              <p className="text-gray-600 mt-2">{agreement.email}</p>
              <p className="text-gray-600">{agreement.phone}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">From</h3>
              <p className="font-bold text-lg">{profile.agency_name}</p>
              <p className="text-gray-600 mt-4">
                <span className="font-semibold">Issue Date:</span> {new Date(invoice.issue_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Due Date:</span> {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4">Description</th>
                  <th className="py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-6">
                    <p className="font-bold text-gray-900">{agreement.project_name}</p>
                    <p className="text-sm text-gray-500 mt-1">{agreement.project_type}</p>
                  </td>
                  <td className="py-6 text-right font-bold text-gray-900">
                    ${Number(invoice.amount).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end border-t-2 border-gray-900 pt-6">
            <div className="max-w-md">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Instructions</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Due</p>
              <p className="text-4xl font-black text-gray-900">${Number(invoice.amount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
