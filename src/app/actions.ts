'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { sendInvoiceEmail, sendAgreementEmail, sendAgreementSignedEmail } from '@/lib/email';

export async function deleteAgreement(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  if (!id) throw new Error('No ID provided');

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

export async function updateProfile(data: { agency_name: string; brand_color?: string; logo_url?: string }) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  
  const ownerId = orgId || userId;

  const { error } = await supabase.from('profiles').upsert({
    owner_id: ownerId,
    agency_name: data.agency_name,
    ...(data.brand_color ? { brand_color: data.brand_color } : {}),
    ...(data.logo_url ? { logo_url: data.logo_url } : {}),
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
  const phone = formData.get('phone') as string;
  const interestLevel = formData.get('interestLevel') as string;
  const quotedPrice = parseFloat(formData.get('quotedPrice') as string) || 0;
  const notes = formData.get('notes') as string;

  const { error } = await supabase.from('field_visits').insert({
    shop_name: shopName,
    client_name: clientName,
    phone: phone || null,
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
  return { success: true };
}

export async function updateLead(id: string, formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const shopName = formData.get('shopName') as string;
  const clientName = formData.get('clientName') as string;
  const phone = formData.get('phone') as string;
  const interestLevel = formData.get('interestLevel') as string;
  const quotedPrice = parseFloat(formData.get('quotedPrice') as string) || 0;
  const notes = formData.get('notes') as string;

  let query = supabase.from('field_visits').update({
    shop_name: shopName,
    client_name: clientName,
    phone: phone || null,
    interest_level: interestLevel,
    quoted_price: quotedPrice,
    notes: notes,
  }).eq('id', id);

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to update lead: ' + error.message);
  }

  revalidatePath('/dashboard/leads');
  revalidatePath(`/dashboard/leads/${id}`);
  return { success: true };
}

export async function deleteLead(id: string) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  let query = supabase.from('field_visits').delete().eq('id', id);
  if (orgId) {
    query = query.eq('org_id', orgId);
  } else {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to delete lead: ' + error.message);
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

export async function createInvoice(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const agreementId = formData.get('agreementId') as string;
  const invoiceNumber = formData.get('invoiceNumber') as string;
  const amount = parseFloat(formData.get('amount') as string) || 0;
  const issueDate = formData.get('issueDate') as string;
  const dueDate = formData.get('dueDate') as string;
  const notes = formData.get('notes') as string;

  const actualInvoiceNumber = invoiceNumber || `INV-${Math.floor(Math.random() * 10000)}`;
  const actualIssueDate = issueDate || new Date().toISOString().split('T')[0];
  const actualDueDate = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase.from('invoices').insert({
    agreement_id: agreementId,
    invoice_number: actualInvoiceNumber,
    amount,
    issue_date: actualIssueDate,
    due_date: actualDueDate,
    notes: notes || '',
    user_id: userId,
    org_id: orgId || null,
  }).select('id').single();

  if (error) {
    throw new Error('Failed to create invoice: ' + error.message);
  }

  try {
    const { data: agreement } = await supabase
      .from('agreements')
      .select('email, client_name, project_name')
      .eq('id', agreementId)
      .single();

    if (agreement) {
      const user = await currentUser();
      const agencyEmail = user?.emailAddresses[0]?.emailAddress || 'noreply@agencyos.com';
      // In production, you would set NEXT_PUBLIC_APP_URL in Vercel/environment
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://sign.hackarena.dev' : 'http://localhost:3000');
      const link = `${appUrl}/invoice/${data.id}`;

      await sendInvoiceEmail({
        clientEmail: agreement.email,
        clientName: agreement.client_name,
        agencyEmail,
        projectName: agreement.project_name,
        invoiceNumber: actualInvoiceNumber,
        amount,
        dueDate: actualDueDate,
        link,
      });
    }
  } catch (emailError) {
    console.error("Failed to send invoice email:", emailError);
    // Don't throw the error so the invoice creation still succeeds even if email fails
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/agreements');
  return { success: true, id: data.id };
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  let query = supabase.from('invoices').update({ status }).eq('id', id);

  if (orgId) {
    query = query.eq('org_id', orgId);
  } else {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to update invoice status: ' + error.message);
  }

  revalidatePath('/dashboard/invoices');
  revalidatePath(`/invoice/${id}`);
  return { success: true };
}

export async function deleteInvoice(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const id = formData.get('id') as string;
  if (!id) throw new Error('No ID provided');

  let query = supabase.from('invoices').delete().eq('id', id);
  if (orgId) {
    query = query.eq('org_id', orgId);
  } else {
    query = query.eq('user_id', userId).is('org_id', null);
  }

  const { error } = await query;
  if (error) {
    throw new Error('Failed to delete invoice: ' + error.message);
  }

  revalidatePath('/dashboard/invoices');
  return { success: true };
}

export async function sendAgreementEmailAction(agreementId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { data: agreement, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('id', agreementId)
    .single();

  if (error || !agreement) {
    throw new Error('Agreement not found');
  }

  const user = await currentUser();
  const agencyEmail = user?.emailAddresses[0]?.emailAddress || 'noreply@agencyos.com';
  
  // In production, you would set NEXT_PUBLIC_APP_URL in Vercel/environment
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://sign.hackarena.dev' : 'http://localhost:3000');
  const link = `${appUrl}/sign/${agreementId}`;

  await sendAgreementEmail({
    clientEmail: agreement.email,
    clientName: agreement.client_name,
    agencyEmail,
    projectName: agreement.project_name,
    link,
  });

  return { success: true };
}

export async function notifyAgreementSignedAction(agreementId: string) {
  const { data: agreement, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('id', agreementId)
    .single();

  if (error || !agreement || !agreement.user_id) {
    console.error('Agreement not found or missing owner', error);
    return;
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(agreement.user_id);
    const agencyEmail = user.emailAddresses[0]?.emailAddress;
    
    if (agencyEmail) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://sign.hackarena.dev' : 'http://localhost:3000');
      const link = `${appUrl}/sign/${agreementId}`; 
      
      await sendAgreementSignedEmail({
        agencyEmail,
        clientName: agreement.client_name,
        projectName: agreement.project_name,
        link
      });
    }
  } catch (err) {
    console.error("Failed to fetch user or send notification", err);
  }
}
