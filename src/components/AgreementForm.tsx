'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgreementSchema, AgreementDataSchema } from '@/lib/schemas';
import { AgreementPDF } from './AgreementPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
const SignatureCanvas = dynamic(() => import('react-signature-canvas'), { ssr: false });
const SignatureCanvasAny = SignatureCanvas as any;

const predefinedTemplates = {
  web_dev: {
    name: 'Web Development',
    projectType: 'Web Development',
    description: "The Agency will design, develop, and deploy a custom software solution tailored to the Client's specifications. This includes full-stack development, database architecture, and frontend user interface design.",
    deliverables: "<ul><li>Fully functional web application</li><li>Secure user authentication system</li><li>Integrated database architecture</li><li>Mobile-responsive user interface</li><li>Final source code transfer upon full payment</li></ul>"
  },
  seo: {
    name: 'SEO Retainer',
    projectType: 'SEO Retainer',
    description: "The Agency will provide ongoing Search Engine Optimization services to improve the Client's organic search rankings, traffic, and overall digital footprint.",
    deliverables: "<ul><li>Comprehensive technical SEO audit</li><li>Monthly keyword research and content strategy</li><li>On-page optimization (Meta tags, H1s, schema)</li><li>High-quality backlink acquisition</li><li>Monthly performance reports and strategy meetings</li></ul>"
  },
  consulting: {
    name: 'Tech Consulting',
    projectType: 'Consulting',
    description: "The Agency will provide expert technical consulting services to the Client to evaluate existing infrastructure, processes, and potential growth avenues.",
    deliverables: "<ul><li>Initial discovery and architecture review</li><li>Documentation of current systems</li><li>Strategic roadmap and recommendations report</li><li>Weekly 1-hour advisory calls</li></ul>"
  }
};

const defaultData: Partial<AgreementDataSchema> = {
  description: predefinedTemplates.web_dev.description,
  deliverables: predefinedTemplates.web_dev.deliverables,
  ownership: 'Client retains full ownership upon final payment.',
  providerName: 'HackArena Representative',
  providerSignature: null,
};

export default function AgreementForm({
  initialData,
  onSave,
  title,
  subtitle,
}: {
  initialData?: any;
  onSave: (data: AgreementDataSchema) => Promise<string | void>;
  title: string;
  subtitle: string;
}) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<AgreementDataSchema>({
    resolver: zodResolver(AgreementSchema),
    defaultValues: initialData || defaultData,
  });

  const data = watch();

  const steps = [
    'Client',
    'Project',
    'Pricing',
    'Legal',
    'Agency Sign',
    'Preview',
  ];

  const stepFields: Record<number, (keyof AgreementDataSchema)[]> = {
    1: ['clientName', 'companyName', 'email', 'phone', 'address'],
    2: ['projectName', 'projectType', 'description', 'deliverables', 'startDate', 'completionDate'],
    3: ['totalCost', 'advancePayment', 'paymentSchedule'],
    4: ['includedFeatures', 'ownership'],
    5: ['providerName', 'providerSignature'],
  };

  const nextStep = async () => {
    const fields = stepFields[step];
    if (fields) {
      const isValid = await trigger(fields);
      if (!isValid) return;
    }
    setStep((s) => Math.min(s + 1, 6));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (formData: AgreementDataSchema) => {
    setIsSaving(true);
    try {
      const result = await onSave(formData);
      if (result && typeof result === 'string') {
        setSavedId(result);
        setStep(7);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save agreement.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <Input label="Client Name" maxLength={100} error={errors.clientName?.message} {...register('clientName')} />
              <Input label="Company Name" maxLength={100} error={errors.companyName?.message} {...register('companyName')} />
              <Input label="Email Address" type="email" maxLength={150} error={errors.email?.message} {...register('email')} />
              <Input 
                label="Phone Number" 
                maxLength={25} 
                error={errors.phone?.message} 
                {...register('phone')} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^[\+0-9\s\-()]*$/.test(val)) {
                    setValue('phone', val);
                  }
                }} 
              />
              <div className="col-span-2">
                <Input label="Address" maxLength={250} error={errors.address?.message} {...register('address')} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Project Information</h2>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-white/50">Load Template:</label>
                <select 
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-white/30"
                  onChange={(e) => {
                    const t = predefinedTemplates[e.target.value as keyof typeof predefinedTemplates];
                    if (t) {
                      setValue('projectType', t.projectType);
                      setValue('description', t.description);
                      setValue('deliverables', t.deliverables);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled className="bg-[#1a1a1c] text-white">Select...</option>
                  {Object.entries(predefinedTemplates).map(([key, t]) => (
                    <option key={key} value={key} className="bg-[#1a1a1c] text-white">{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Project Name" maxLength={100} error={errors.projectName?.message} {...register('projectName')} />
              <Input label="Project Type (e.g., Web App, SEO)" maxLength={100} error={errors.projectType?.message} {...register('projectType')} />
              <div className="col-span-2">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichEditor label="Project Description" value={field.value} onChange={field.onChange} error={errors.description?.message} />
                  )}
                />
              </div>
              <div className="col-span-2">
                <Controller
                  name="deliverables"
                  control={control}
                  render={({ field }) => (
                    <RichEditor label="Deliverables" value={field.value} onChange={field.onChange} error={errors.deliverables?.message} />
                  )}
                />
              </div>
              <Input label="Start Date" type="date" error={errors.startDate?.message} {...register('startDate')} />
              <Input label="Expected Completion" type="date" error={errors.completionDate?.message} {...register('completionDate')} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Pricing & Payments</h2>
            <div className="grid grid-cols-2 gap-5">
              <Input label="Total Cost ($)" type="number" min="0" step="0.01" error={errors.totalCost?.message} {...register('totalCost')} />
              <Input label="Advance Payment ($)" type="number" min="0" step="0.01" error={errors.advancePayment?.message} {...register('advancePayment')} />
              <div className="col-span-2">
                <Input label="Payment Schedule (e.g., 50% upfront, 50% upon completion)" maxLength={250} error={errors.paymentSchedule?.message} {...register('paymentSchedule')} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Scope & Legal Terms</h2>
            <div className="grid grid-cols-1 gap-5">
              <TextArea label="Included Features / Scope" error={errors.includedFeatures?.message} {...register('includedFeatures')} />
              <TextArea label="Code Ownership Terms" error={errors.ownership?.message} {...register('ownership')} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-white">Agency Authorization</h2>
            <p className="text-sm text-white/50">Provide your name and signature to authorize this contract before sending.</p>
            <div className="grid grid-cols-1 gap-5 mt-2">
              <Input label="Your Name (Agency Rep)" maxLength={100} error={errors.providerName?.message} {...register('providerName')} />
              
              <div className="flex flex-col gap-1.5 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/70">Your Signature</label>
                  {data.providerSignature && (
                    <button 
                      onClick={() => setValue('providerSignature', null)}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear Signature
                    </button>
                  )}
                </div>
                
                <Controller
                  name="providerSignature"
                  control={control}
                  render={({ field }) => (
                    <>
                      {field.value ? (
                        <div className={`rounded-xl border ${errors.providerSignature ? 'border-red-500' : 'border-white/10'} bg-white p-4 h-48 flex items-center justify-center`}>
                          <img src={field.value} alt="Agency Signature" className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className={`rounded-xl border ${errors.providerSignature ? 'border-red-500' : 'border-white/10'} bg-white overflow-hidden relative h-48 w-full cursor-crosshair`}>
                          <SignaturePadWrapper onSave={field.onChange} />
                        </div>
                      )}
                      {errors.providerSignature && <p className="text-xs text-red-500">{errors.providerSignature.message}</p>}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Agreement Preview</h2>
              {isMounted && (
                <PDFDownloadLink
                  document={<AgreementPDF data={data} />}
                  fileName={`Draft-Agreement-${data.clientName || 'Client'}.pdf`}
                  className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                >
                  {({ loading }) => (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      {loading ? 'Generating...' : 'Download PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              )}
            </div>
            
            <div id="pdf-preview-content" className="rounded-md bg-white p-8 text-black shadow-sm min-h-[500px]">
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
              <div className="mb-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: data.description || '[Project Description]' }} />
              <div className="mb-4 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: data.deliverables || '[Deliverables]' }} />

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
              onClick={handleSubmit(onSubmit)}
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
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }>(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <input
        ref={ref}
        className={`rounded-md border ${error ? 'border-red-500' : 'border-white/10'} bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:bg-white/10`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';

const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }>(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <textarea
        ref={ref}
        rows={4}
        className={`rounded-md border ${error ? 'border-red-500' : 'border-white/10'} bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-white/30 focus:bg-white/10 resize-none`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
TextArea.displayName = 'TextArea';

function RichEditor({ label, value, onChange, error }: { label: string, value: string, onChange: (val: string) => void, error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <div className={`bg-white text-black rounded-md overflow-hidden min-h-[150px] border ${error ? 'border-red-500' : 'border-transparent'}`}>
        <ReactQuill theme="snow" value={value || ''} onChange={onChange} className="h-full" />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

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
