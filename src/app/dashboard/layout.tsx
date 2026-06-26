import React from 'react';
import Link from 'next/link';
import { Home, FileText, Settings, Plus } from 'lucide-react';
import Logo from '@/components/Logo';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User';
  const roleName = orgRole === 'org:admin' ? 'Admin' : (orgRole === 'org:member' ? 'Member' : 'Personal Account');

  const ownerId = orgId || userId;

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_name')
    .eq('owner_id', ownerId)
    .single();

  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#1a1a1c] font-sans text-white overflow-hidden">
      <DashboardSidebar profile={profile} userName={userName} roleName={roleName} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#1a1a1c] p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
