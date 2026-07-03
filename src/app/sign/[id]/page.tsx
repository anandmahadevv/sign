'use client';

import React, { useEffect, useState, use } from 'react';
import Logo from '@/components/Logo';
import SignaturePad from '@/components/SignaturePad';
import { supabase } from '@/lib/supabase';
import { Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { notifyAgreementSignedAction } from '@/app/actions';

export default function SignAgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [agreement, setAgreement] = useState<any>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [agencyName, setAgencyName] = useState<string>('HackArena');
  const [brandColor, setBrandColor] = useState<string>('#111827');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    async function fetchAgreement() {
      const { data, error } = await supabase
        .from('agreements')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();
      
      if (!error && data) {
        setAgreement(data);
        if (data.client_signature) {
          setSignature(data.client_signature);
        }

        const ownerId = data.org_id || data.user_id;

        if (ownerId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('agency_name, brand_color, logo_url')
            .eq('owner_id', ownerId)
            .single();
          if (profile) {
            if (profile.agency_name) setAgencyName(profile.agency_name);
            if (profile.brand_color) setBrandColor(profile.brand_color);
            if (profile.logo_url) setLogoUrl(profile.logo_url);
          }
        }
        
        // Log viewed_at and IP if not already viewed
        if (!data.viewed_at) {
          let viewerIp = 'Unknown IP';
          try {
            const res = await fetch('https://api.ipify.org?format=json');
            const ipData = await res.json();
            viewerIp = ipData.ip;
          } catch (e) {
            console.warn("Could not fetch IP", e);
          }
          await supabase.from('agreements').update({ viewed_at: new Date().toISOString(), signer_ip: viewerIp, status: 'Viewed' }).eq('id', resolvedParams.id);
        }
      }
      setLoading(false);
    }
    fetchAgreement();
  }, [resolvedParams.id]);

  const handleSign = async (sig: string) => {
    let clientIp = 'Unknown IP';
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      clientIp = data.ip;
    } catch (e) {
      console.warn("Could not fetch IP", e);
    }

    const signedAt = new Date().toISOString();

      // Save to Supabase
      const { error } = await supabase
        .from('agreements')
        .update({ 
          client_signature: sig, 
          client_ip: clientIp, // legacy col
          signed_ip: clientIp,
          status: 'Signed',
          signed_at: signedAt
        })
        .eq('id', resolvedParams.id);

    if (!error) {
      setSignature(sig);
      setAgreement({ ...agreement, client_ip: clientIp, signed_at: signedAt });
      
      // Notify agency in the background
      notifyAgreementSignedAction(resolvedParams.id).catch(err => console.error("Notification error:", err));
      
      alert('Agreement signed successfully!');
    } else {
      alert('Error saving signature: ' + error.message);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    const element = document.getElementById('pdf-content');
    if (!element) {
      setIsGeneratingPDF(false);
      return;
    }

    try {
      // Capture the element using html-to-image
      const imgData = await htmlToImage.toPng(element, { pixelRatio: 2 });

      // Create PDF using standard A4 millimeters
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate height based on the image aspect ratio
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const pdfHeight = (img.height * pdfWidth) / img.width;

      let position = 0;
      let heightLeft = pdfHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Agreement-${agreement.client_name.replace(/\s+/g, '-')}.pdf`);
    } catch (err: any) {
      console.error('Failed to generate PDF', err);
      alert('Failed to generate PDF: ' + (err.message || err.toString()));
    }
    
    setIsGeneratingPDF(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900 bg-gray-100">Loading agreement...</div>;
  }

  if (!agreement) {
    return <div className="min-h-screen flex items-center justify-center text-gray-900 bg-gray-100">Agreement not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      
      {/* Client View Header */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={`${agencyName} logo`} className="h-8 object-contain" />
          ) : (
            <Logo className="h-6 w-6 text-gray-900" />
          )}
          <span className="text-xl font-bold tracking-tight">Sign <span className="font-medium text-gray-600 text-sm">by {agencyName}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
          <div className={`text-sm font-medium px-3 py-1.5 rounded-full ${
            signature ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'
          }`}>
            {signature ? 'Signed & Finalized' : 'Pending Signature'}
          </div>
        </div>
      </div>

      {/* Contract Document */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-200">
        <div id="pdf-content" className="bg-white pb-10">
          {/* Document Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-center tracking-tight text-gray-900">CLIENT AGREEMENT</h1>
          </div>

          {/* Document Body */}
          <div className="px-8 mt-10">
          
          <div className="flex justify-between mb-10 text-sm">
            <div>
              <p className="font-bold text-gray-900">Provider:</p>
              <p className="text-gray-700">{agencyName}</p>
              <p className="text-gray-700">{agreement.provider_name || 'Representative'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">Client:</p>
              <p className="text-gray-700">{agreement.client_name}</p>
              <p className="text-gray-700">{agreement.company_name}</p>
              <p className="text-gray-700">{agreement.address}</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">1. Project Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This agreement outlines the terms for the <strong>{agreement.project_name}</strong> ({agreement.project_type}).
              </p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">2. Description & Deliverables</h3>
              <div className="text-sm text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: agreement.description }} />
              <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: agreement.deliverables }} />
            </section>

            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">3. Timeline</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Project commences on <strong>{agreement.start_date}</strong> and is expected to conclude on <strong>{agreement.completion_date}</strong>.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">4. Payment Terms</h3>
              <p className="text-sm text-gray-700 mb-1">Total Project Cost: <strong>${Number(agreement.total_cost).toLocaleString()}</strong></p>
              <p className="text-sm text-gray-700 mb-1">Advance Payment: <strong>${Number(agreement.advance_payment).toLocaleString()}</strong></p>
              <p className="text-sm text-gray-700 leading-relaxed">Schedule: {agreement.payment_schedule}</p>
            </section>

            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">5. Legal & Ownership</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{agreement.ownership}</p>
            </section>
          </div>

          {/* Signatures Section */}
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">Authorization & Signatures</h3>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Provider Signature */}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-4">{agreement.provider_name || 'HackArena Representative'}</p>
                <div className="h-40 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center p-2">
                  {agreement.provider_signature ? (
                    <img src={agreement.provider_signature} alt="Provider Signature" className="max-h-full" />
                  ) : (
                    <span className="font-[cursive] text-4xl text-gray-400 opacity-50">Signed</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Authorized on {new Date(agreement.created_at).toLocaleDateString()}</p>
              </div>

              {/* Client Signature Area */}
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-4">Client Authorization</p>
                
                {!signature ? (
                  <SignaturePad onSign={handleSign} brandColor={brandColor} />
                ) : (
                  <div className="h-40 bg-green-50 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center p-2">
                    <img src={signature} alt="Client Signature" className="max-h-full" />
                  </div>
                )}
                {signature && <p className="text-xs text-gray-500 mt-2">Signed securely on {agreement.signed_at ? new Date(agreement.signed_at).toLocaleDateString() : new Date().toLocaleDateString()}</p>}
              </div>
            </div>
          </div>

          {/* Audit Trail Section */}
          {signature && (
            <div className="mt-12 border-t border-gray-200 pt-8">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="font-bold text-xs uppercase tracking-widest">Document Audit Trail</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 font-mono text-xs text-gray-600 space-y-2 border border-gray-200 shadow-inner">
                <p><span className="font-bold text-gray-900">Document ID:</span> {agreement.id}</p>
                <p><span className="font-bold text-gray-900">Provider:</span> {agencyName}</p>
                <p><span className="font-bold text-gray-900">Signed By:</span> {agreement.client_name} ({agreement.email})</p>
                <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">View Event</p>
                    <p>IP: {agreement.signer_ip || 'Captured securely'}</p>
                    <p>Time: {agreement.viewed_at ? new Date(agreement.viewed_at).toUTCString() : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Sign Event</p>
                    <p>IP: {agreement.client_ip || agreement.signed_ip || 'Captured securely'}</p>
                    <p>Time: {agreement.signed_at ? new Date(agreement.signed_at).toUTCString() : new Date().toUTCString()}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="break-all"><span className="font-bold text-gray-900">Signature Hash:</span> sha256-{signature.length > 50 ? signature.substring(signature.length - 64) : signature}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
      
    </div>
  );
}
