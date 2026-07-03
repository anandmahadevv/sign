'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import AgreementForm, { AgreementData } from '@/components/AgreementForm';
import { sendAgreementEmailAction } from '@/app/actions';

export default function CreateAgreement() {
  const router = useRouter();
  const { userId, orgId } = useAuth();

  const handleSave = async (data: AgreementData) => {
    try {
      if (!userId) throw new Error("User not authenticated");
      const { supabase } = await import('@/lib/supabase');
      const { error, data: inserted } = await supabase.from('agreements').insert({
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
        user_id: userId,
        org_id: orgId || null,
        status: 'Pending',
      }).select().single();

      if (error) throw error;
      
      try {
        await sendAgreementEmailAction(inserted.id);
      } catch (emailError) {
        console.error("Failed to send agreement email:", emailError);
      }

      return inserted.id;
    } catch (error: any) {
      alert('Error saving agreement: ' + error.message);
    }
  };

  return (
    <AgreementForm
      title="Generate Agreement"
      subtitle="Follow the steps to generate a professional contract."
      onSave={handleSave}
    />
  );
}
