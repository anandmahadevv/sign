import React from 'react';
import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import AgreementForm, { AgreementData } from '@/components/AgreementForm';
import { updateAgreement } from '@/app/actions';
import { auth } from '@clerk/nextjs/server';

export default async function EditAgreement({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { userId, orgId } = await auth();
  if (!userId) redirect('/sign-in');

  const query = supabase.from('agreements').select('*').eq('id', id);
  if (orgId) {
    query.eq('org_id', orgId);
  } else {
    query.eq('user_id', userId).is('org_id', null);
  }

  const { data: agreement, error } = await query.single();

  if (error || !agreement) {
    notFound();
  }

  const initialData: AgreementData = {
    clientName: agreement.client_name,
    companyName: agreement.company_name,
    email: agreement.email,
    phone: agreement.phone,
    address: agreement.address,
    projectName: agreement.project_name,
    projectType: agreement.project_type,
    description: agreement.description,
    deliverables: agreement.deliverables,
    startDate: agreement.start_date,
    completionDate: agreement.completion_date,
    totalCost: agreement.total_cost.toString(),
    advancePayment: agreement.advance_payment.toString(),
    paymentSchedule: agreement.payment_schedule,
    includedFeatures: agreement.included_features,
    ownership: agreement.ownership,
    providerName: agreement.provider_name || 'HackArena Representative',
    providerSignature: agreement.provider_signature || null,
  };

  const handleSave = async (data: AgreementData) => {
    'use server';
    await updateAgreement(id, {
      client_name: data.clientName,
      company_name: data.companyName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      project_name: data.projectName,
      project_type: data.projectType,
      description: data.description,
      deliverables: data.deliverables,
      start_date: data.startDate,
      completion_date: data.completionDate,
      total_cost: parseFloat(data.totalCost) || 0,
      advance_payment: parseFloat(data.advancePayment) || 0,
      payment_schedule: data.paymentSchedule,
      included_features: data.includedFeatures,
      ownership: data.ownership,
      provider_name: data.providerName,
      provider_signature: data.providerSignature,
    });
    return id;
  };

  return (
    <AgreementForm
      title="Edit Agreement"
      subtitle="Update the details of this contract."
      initialData={initialData}
      onSave={handleSave}
    />
  );
}
