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

export async function createLead(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const shopName = formData.get('shopName') as string;
  const clientName = formData.get('clientName') as string;
  const interestLevel = formData.get('interestLevel') as string;
  const quotedPrice = parseFloat(formData.get('quotedPrice') as string) || 0;
  const notes = formData.get('notes') as string;

  const { error } = await supabase.from('field_visits').insert({
    shop_name: shopName,
    client_name: clientName,
    interest_level: interestLevel,
    quoted_price: quotedPrice,
    notes: notes,
    user_id: userId,
    org_id: orgId || null,
  });

  if (error) {
    throw new Error('Failed to create lead: ' + error.message);
  }

  revalidatePath('/dashboard/leads');
  redirect('/dashboard/leads');
}
