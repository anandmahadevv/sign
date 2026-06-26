'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';

export type AgreementData = {
  // Client Details
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  // Project Details
  projectName: string;
  projectType: string;
  description: string;
  deliverables: string;
  startDate: string;
  completionDate: string;
  // Pricing
  totalCost: string;
  advancePayment: string;
  paymentSchedule: string;
  // Scope & Legal
  includedFeatures: string;
  ownership: string;
  // Agency Signature
  providerName: string;
  providerSignature: string | null;
};

const defaultData: AgreementData = {
  clientName: '',
  companyName: '',
  email: '',
  phone: '',
  address: '',
  projectName: '',
  projectType: '',
  description: "The Agency will design, develop, and deploy a custom software solution tailored to the Client's specifications. This includes full-stack development, database architecture, and frontend user interface design.",
  deliverables: '1. Fully functional web application\n2. Secure user authentication system\n3. Integrated database architecture\n4. Mobile-responsive user interface\n5. Final source code transfer upon full payment',
  startDate: '',
  completionDate: '',
  totalCost: '',
  advancePayment: '',
  paymentSchedule: '',
  includedFeatures: '',
  ownership: 'Client retains full ownership upon final payment.',
  providerName: 'Anand Tri',
  providerSignature: null,
};

export default function AgreementForm({
  initialData,
  onSave,
  title,
  subtitle,
}: {
  initialData?: AgreementData;
  onSave: (data: AgreementData) => Promise<string | void>;
  title: string;
  subtitle: string;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AgreementData>(initialData || defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const updateData = (fields: Partial<AgreementData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const steps = [
    'Client',
    'Project',
    'Pricing',
    'Legal',
    'Agency Sign',
    'Preview',
  ];

  return (
    <div className="flex max-w-4xl flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
      </div>

      {/* Progress Bar */}
      {step < 6 && (
        <div className="flex items-center justify-between">
          {steps.map((label, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step > index + 1
                    ? 'bg-[#28c840] text-black'
                    : step === index + 1
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wider ${
                  step === index + 1 ? 'text-white' : 'text-white/40'
                }`}
              >
                {label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Form Area */}
      <div className="rounded-xl bg-white/[0.02] p-8 ring-1 ring-white/5">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Client Information</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Client Name" value={data.clientName} onChange={(e) => updateData({ clientName: e.target.value })} />
              <Input label="Company Name" value={data.companyName} onChange={(e) => updateData({ companyName: e.target.value })} />
              <Input label="Email Address" type="email" value={data.email} onChange={(e) => updateData({ email: e.target.value })} />
              <Input label="Phone Number" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} />
              <div className="col-span-2">
                <Input label="Address" value={data.address} onChange={(e) => updateData({ address: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Project Information</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Project Name" value={data.projectName} onChange={(e) => updateData({ projectName: e.target.value })} />
              <Input label="Project Type (e.g., Web App, SEO)" value={data.projectType} onChange={(e) => updateData({ projectType: e.target.value })} />
              <div className="col-span-2">
                <TextArea label="Project Description" value={data.description} onChange={(e) => updateData({ description: e.target.value })} />
              </div>
              <div className="col-span-2">
                <TextArea label="Deliverables" value={data.deliverables} onChange={(e) => updateData({ deliverables: e.target.value })} />
              </div>
              <Input label="Start Date" type="date" value={data.startDate} onChange={(e) => updateData({ startDate: e.target.value })} />
              <Input label="Expected Completion" type="date" value={data.completionDate} onChange={(e) => updateData({ completionDate: e.target.value })} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Pricing & Payments</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Total Cost ($)" type="number" value={data.totalCost} onChange={(e) => updateData({ totalCost: e.target.value })} />
              <Input label="Advance Payment ($)" type="number" value={data.advancePayment} onChange={(e) => updateData({ advancePayment: e.target.value })} />
              <div className="col-span-2">
                <Input label="Payment Schedule (e.g., 50% upfront, 50% upon completion)" value={data.paymentSchedule} onChange={(e) => updateData({ paymentSchedule: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Scope & Legal Terms</h2>
            <div className="grid grid-cols-1 gap-5">
              <TextArea label="Included Features / Scope" value={data.includedFeatures} onChange={(e) => updateData({ includedFeatures: e.target.value })} />
              <TextArea label="Code Ownership Terms" value={data.ownership} onChange={(e) => updateData({ ownership: e.target.value })} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Agency Authorization</h2>
            <p className="text-sm text-white/50">Provide your name and signature to authorize this contract before sending.</p>
            <div className="grid grid-cols-1 gap-5 mt-2">
              <Input label="Your Name (Agency Rep)" value={data.providerName} onChange={(e) => updateData({ providerName: e.target.value })} />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/70">Your Signature</label>
                  {data.providerSignature && (
                    <button 
                      onClick={() => updateData({ providerSignature: null })}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear Signature
                    </button>
                  )}
                </div>
                
                {data.providerSignature ? (
                  <div className="rounded-xl border border-white/10 bg-white p-4 h-48 flex items-center justify-center">
                    <img src={data.providerSignature} alt="Agency Signature" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-white overflow-hidden relative h-48 w-full cursor-crosshair">
                    {/* We can use react-signature-canvas here, dynamically loaded to avoid SSR issues */}
                    <SignaturePadWrapper onSave={(sig) => updateData({ providerSignature: sig })} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Agreement Preview</h2>
              <button className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20">
                <FileText className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </div>
            
            <div className="rounded-md bg-white p-8 text-black shadow-sm min-h-[500px]">
              <h1 className="text-2xl font-bold text-center border-b pb-4 mb-6">CLIENT AGREEMENT</h1>
              
              <div className="flex justify-between mb-8 text-sm">
                <div>
                  <p className="font-bold">Provider:</p>
                  <p>HackArena</p>
                  <p>Agency OS Portal</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Client:</p>
                  <p>{data.clientName || '[Client Name]'}</p>
                  <p>{data.companyName || '[Company Name]'}</p>
                  <p>{data.address || '[Address]'}</p>
                </div>
              </div>

              <h3 className="font-bold mb-2">1. Project Overview</h3>
              <p className="mb-4 text-sm text-gray-700">This agreement outlines the terms for the <strong>{data.projectName || '[Project Name]'}</strong> ({data.projectType || 'Project Type'}).</p>
              
              <h3 className="font-bold mb-2">2. Description & Deliverables</h3>
              <p className="mb-2 text-sm text-gray-700">{data.description || '[Project Description]'}</p>
              <p className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">{data.deliverables || '[Deliverables]'}</p>

              <h3 className="font-bold mb-2">3. Timeline</h3>
              <p className="mb-4 text-sm text-gray-700">Project commences on <strong>{data.startDate || '[Start Date]'}</strong> and is expected to conclude on <strong>{data.completionDate || '[End Date]'}</strong>.</p>

              <h3 className="font-bold mb-2">4. Payment Terms</h3>
              <p className="mb-2 text-sm text-gray-700">Total Project Cost: <strong>${data.totalCost || '0.00'}</strong></p>
              <p className="mb-2 text-sm text-gray-700">Advance Payment: <strong>${data.advancePayment || '0.00'}</strong></p>
              <p className="mb-4 text-sm text-gray-700">Schedule: {data.paymentSchedule || '[Payment Schedule]'}</p>

              <h3 className="font-bold mb-2">5. Legal & Ownership</h3>
              <p className="mb-8 text-sm text-gray-700">{data.ownership}</p>

              <div className="mt-16 flex justify-between">
                <div className="w-1/2 pr-8">
                  <div className="border-b border-black mb-2 pb-2 h-16 flex items-end">
                    {data.providerSignature ? (
                       <img src={data.providerSignature} alt="Agency Signature" className="max-h-14 max-w-full object-contain" />
                    ) : (
                       <span className="text-gray-300 italic">Signature</span>
                    )}
                  </div>
                  <p className="text-sm font-bold">{data.providerName || 'HackArena Representative'}</p>
                  <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="w-1/2 pl-8">
                  <div className="border-b border-black mb-2 pb-8 h-16"></div>
                  <p className="text-sm font-bold">{data.clientName || 'Client'} Signature</p>
                  <p className="text-xs text-gray-500">Date: _______________</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 7 && savedId && (
          <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#28c840]/20 text-[#28c840]">
              <Check className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Agreement Generated!</h2>
              <p className="mt-2 text-sm text-white/50">Your agreement has been saved securely.</p>
            </div>
            
            <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col gap-3 mt-4">
              <label className="text-xs font-medium text-white/70 text-left">Client Sharing Link</label>
              <div className="flex items-center gap-2">
                <input 
                  readOnly
                  value={`${window.location.origin}/sign/${savedId}`}
                  className="flex-1 rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white/90 outline-none"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/sign/${savedId}`);
                    alert('Copied to clipboard!');
                  }}
                  className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
               onClick={() => window.location.href = '/dashboard/agreements'}
               className="mt-8 rounded-md bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
            >
              Go to Agreements
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step < 7 && (
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1 || isSaving}
            className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
            >
              Continue to {steps[step]}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={async () => {
                setIsSaving(true);
                try {
                  const result = await onSave(data);
                  if (result && typeof result === 'string') {
                    setSavedId(result);
                    setStep(7);
                  }
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-md bg-[#28c840] px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#28c840]/90 shadow-[0_0_20px_rgba(40,200,64,0.3)] disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Finalize & Save'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable UI Components for the form
function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <input
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
        {...props}
      />
    </div>
  );
}

function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <textarea
        rows={4}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:bg-white/10 resize-none"
        {...props}
      />
    </div>
  );
}

// Dynamically import the signature canvas since it relies on browser window
import dynamic from 'next/dynamic';
import { useRef } from 'react';
const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false });
const SignatureCanvasAny = SignatureCanvas as any;

function SignaturePadWrapper({ onSave }: { onSave: (sig: string) => void }) {
  const sigCanvas = useRef<any>(null);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <span className="text-2xl font-bold text-gray-500">Sign Here</span>
      </div>
      <SignatureCanvasAny
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ className: 'absolute inset-0 w-full h-full cursor-crosshair' }}
        onEnd={() => {
          if (sigCanvas.current) {
            onSave(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
          }
        }}
      />
    </div>
  );
}
