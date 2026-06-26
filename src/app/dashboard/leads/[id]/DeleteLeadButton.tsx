'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteLead } from '@/app/actions';

export default function DeleteLeadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this lead? This cannot be undone.')) {
      setLoading(true);
      try {
        await deleteLead(id);
      } catch (error) {
        console.error(error);
        alert('Failed to delete lead.');
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
