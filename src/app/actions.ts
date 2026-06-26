'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function deleteAgreement(id: string) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const query = supabase.from('agreements').delete().eq('id', id);
  if (orgId) {
    query.eq('org_id', orgId);
  } else {
    query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to delete agreement: ' + error.message);
  }
  revalidatePath('/dashboard/agreements');
  revalidatePath('/dashboard');
}

export async function updateAgreement(id: string, data: any) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const query = supabase.from('agreements').update(data).eq('id', id);
  if (orgId) {
    query.eq('org_id', orgId);
  } else {
    query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to update agreement: ' + error.message);
  }
  revalidatePath('/dashboard/agreements');
  revalidatePath('/dashboard');
}

export async function updateProfile(data: { agency_name: string }) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  const ownerId = orgId || userId;

  const { error } = await supabase.from('profiles').upsert({
    owner_id: ownerId,
    agency_name: data.agency_name,
  });

  if (error) {
    throw new Error('Failed to update profile: ' + error.message);
  }
  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard');
}

export async function completeOnboarding(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const ownerId = orgId || userId;
  const agencyName = formData.get('agencyName') as string;

  const { error } = await supabase.from('profiles').upsert({
    owner_id: ownerId,
    agency_name: agencyName,
  });

  if (error) {
    throw new Error('Failed to complete onboarding: ' + error.message);
  }
  
  redirect('/dashboard');
}
