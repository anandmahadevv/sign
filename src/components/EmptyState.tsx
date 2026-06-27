import React from 'react';
import Link from 'next/link';
import { Sparkles, FileSignature } from 'lucide-react';

export default function EmptyState({ 
  title = "No agreements found", 
  description = "Get started by creating your first client agreement.", 
  actionLink = "/dashboard/create", 
  actionLabel = "Generate Agreement" 
}: { 
  title?: string; 
  description?: string; 
  actionLink?: string; 
  actionLabel?: string; 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white/[0.02] ring-1 ring-white/5 border border-dashed border-white/10 w-full min-h-[300px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
        <FileSignature className="h-10 w-10 text-white/40" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 max-w-md mb-8">{description}</p>
      
      <Link
        href={actionLink}
        className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gray-200 hover:scale-105"
      >
        <Sparkles className="h-4 w-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
