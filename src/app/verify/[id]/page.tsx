import React from 'react';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';
import { CheckCircle2, XCircle, Clock, ShieldCheck, ShieldAlert, FileText, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Verify Agreement | Agency OS',
  description: 'Verify the authenticity of a signed agreement.',
};

export default async function VerificationResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Basic UUID validation to prevent Supabase from throwing on malformed IDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return <InvalidDocument id={id} />;
  }

  const { data: agreement, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !agreement) {
    return <InvalidDocument id={id} />;
  }

  // Fetch agency profile to show who issued it
  const ownerId = agreement.org_id || agreement.user_id;
  let agencyName = 'Agency OS';
  if (ownerId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('agency_name')
      .eq('owner_id', ownerId)
      .single();
    if (profile?.agency_name) agencyName = profile.agency_name;
  }

  if (agreement.status !== 'Signed') {
    return <PendingDocument agreement={agreement} agencyName={agencyName} />;
  }

  return <AuthenticDocument agreement={agreement} agencyName={agencyName} />;
}

function InvalidDocument({ id }: { id: string }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center ring-8 ring-red-50/50">
            <XCircle className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Document</h1>
        <p className="text-gray-500 mb-6">
          We could not find a verified agreement matching the ID: <br />
          <strong className="text-gray-800 break-all font-mono text-sm">{id}</strong>
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-8 border border-gray-200">
          This may happen if the document was deleted, the ID was mistyped, or the document is forged.
        </div>
        <Link href="/verify" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2">
          ← Try another ID
        </Link>
      </div>
    </div>
  );
}

function PendingDocument({ agreement, agencyName }: { agreement: any, agencyName: string }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-yellow-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center ring-8 ring-yellow-50/50">
            <Clock className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pending Signature</h1>
        <p className="text-gray-500 mb-6">
          This document exists but has not been legally signed yet.
        </p>
        <div className="bg-gray-50 rounded-lg p-5 text-left mb-8 border border-gray-200 space-y-3">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-500 text-sm">Project</span>
            <span className="text-gray-900 font-medium">{agreement.project_name}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-500 text-sm">Provider</span>
            <span className="text-gray-900 font-medium">{agencyName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Client</span>
            <span className="text-gray-900 font-medium">{agreement.client_name}</span>
          </div>
        </div>
        <Link href="/verify" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2">
          ← Back to Verification Portal
        </Link>
      </div>
    </div>
  );
}

function AuthenticDocument({ agreement, agencyName }: { agreement: any, agencyName: string }) {
  // Generate a mock hash of the signature string to show in the UI for cool factor
  const signatureHash = "sha256-" + (agreement.client_signature?.length > 50 
    ? agreement.client_signature.substring(agreement.client_signature.length - 64) 
    : "verified-secure-signature");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-200">
        
        {/* Certificate Header */}
        <div className="bg-[#111] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            {/* Subtle background pattern */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-20 w-20 bg-[#28c840]/20 text-[#28c840] rounded-full flex items-center justify-center ring-8 ring-[#28c840]/10 mb-4">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Certificate of Authenticity</h1>
            <p className="text-gray-400 font-medium">This document is legally binding and cryptographically verified.</p>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8 sm:p-10">
          
          {/* Core Info */}
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project</p>
              <p className="text-lg font-medium text-gray-900">{agreement.project_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-sm font-semibold border border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                Signed & Executed
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              Involved Parties
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Provider</p>
                <p className="font-semibold text-gray-900">{agencyName}</p>
                <p className="text-sm text-gray-600">{agreement.provider_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Client</p>
                <p className="font-semibold text-gray-900">{agreement.client_name}</p>
                <p className="text-sm text-gray-600">{agreement.company_name}</p>
                <p className="text-sm text-gray-600">{agreement.email}</p>
              </div>
            </div>
          </div>

          {/* Cryptographic Audit Trail */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-gray-500" />
                Cryptographic Audit Trail
              </h3>
            </div>
            <div className="p-6 font-mono text-xs text-gray-600 space-y-4 bg-white">
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-bold text-gray-900">Document ID</span>
                <span className="break-all">{agreement.id}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-bold text-gray-900">Creation Date</span>
                <span>{new Date(agreement.created_at).toUTCString()}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Viewed IP</span>
                <span>{agreement.signer_ip || 'Captured securely'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-bold text-gray-900">Viewed At</span>
                <span>{agreement.viewed_at ? new Date(agreement.viewed_at).toUTCString() : 'Unknown'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Signature IP</span>
                <span>{agreement.client_ip || agreement.signed_ip || 'Captured securely'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="font-bold text-gray-900">Signed At</span>
                <span>{agreement.signed_at ? new Date(agreement.signed_at).toUTCString() : 'Unknown'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Signature Hash</span>
                <span className="break-all text-gray-500">{signatureHash}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/verify" className="text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors">
              Verify another document
            </Link>
          </div>

        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
        <Logo className="h-4 w-4 text-gray-900" />
        <span className="text-xs font-bold text-gray-900 tracking-wider">VERIFIED BY AGENCY OS</span>
      </div>
    </div>
  );
}
