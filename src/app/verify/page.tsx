'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

export default function VerifyPortalPage() {
  const [documentId, setDocumentId] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId.trim()) return;
    router.push(`/verify/${documentId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center ring-8 ring-blue-50/50">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify a Document</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Enter the Document ID found at the bottom of the agreement PDF or online view to verify its authenticity.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative text-left">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Document ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm font-mono"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#111] hover:bg-[#333] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111]"
          >
            Verify Authenticity
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 opacity-50">
          <Logo className="h-4 w-4 text-gray-900" />
          <span className="text-xs font-bold text-gray-900 tracking-wider">AGENCY OS</span>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
