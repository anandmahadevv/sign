import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function PricingTestingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white selection:bg-white/20 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <Logo className="h-8 w-auto text-white" />
        <Link 
          href="/dashboard"
          className="text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          Back to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-24 pb-16 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 mb-6 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
          <span>Simple, transparent pricing</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Scale your agency,<br /> not your expenses.
        </h1>
        <p className="text-lg text-white/50 max-w-xl mx-auto">
          Start for free and upgrade when you need to unlock custom branding, PDF exports, and unlimited agreements.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
        
        {/* Starter Plan */}
        <div className="flex flex-col rounded-3xl bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04]">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-white mb-2">Starter</h3>
            <p className="text-sm text-white/50 min-h-[40px]">Perfect for freelancers just closing their first few clients.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold tracking-tight text-white">$0</span>
            <span className="text-white/50 ml-2">/ month</span>
          </div>
          <button className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 mb-8">
            Get Started
          </button>
          <ul className="flex flex-col gap-4 text-sm text-white/70 flex-1">
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> 3 Agreements per month
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Basic Invoicing
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Standard HackArena Branding
            </li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="flex flex-col rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/20 p-8 shadow-2xl shadow-white/5 relative transform md:-translate-y-4">
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full flex items-center gap-1.5 shadow-lg">
              <Zap className="h-3 w-3 fill-black" /> Most Popular
            </span>
          </div>
          <div className="mb-6 mt-2">
            <h3 className="text-xl font-medium text-white mb-2">Pro</h3>
            <p className="text-sm text-white/50 min-h-[40px]">For active agencies that need to look professional.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold tracking-tight text-white">$29</span>
            <span className="text-white/50 ml-2">/ month</span>
          </div>
          <button className="w-full rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:scale-[1.02] shadow-lg shadow-white/10 mb-8">
            Upgrade to Pro
          </button>
          <ul className="flex flex-col gap-4 text-sm text-white/90 flex-1">
            <li className="flex items-center gap-3 font-medium text-white">
              <Check className="h-4 w-4 text-[#28c840]" /> Unlimited Agreements
            </li>
            <li className="flex items-center gap-3 font-medium text-white">
              <Check className="h-4 w-4 text-[#28c840]" /> Custom Branding & Logo
            </li>
            <li className="flex items-center gap-3 font-medium text-white">
              <Check className="h-4 w-4 text-[#28c840]" /> PDF Document Exports
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Unlimited Invoices
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Audit Trail & Security
            </li>
          </ul>
        </div>

        {/* Agency Plan */}
        <div className="flex flex-col rounded-3xl bg-white/[0.02] border border-white/5 p-8 transition-all hover:bg-white/[0.04]">
          <div className="mb-6">
            <h3 className="text-xl font-medium text-white mb-2">Scale</h3>
            <p className="text-sm text-white/50 min-h-[40px]">For established teams managing a high volume of leads.</p>
          </div>
          <div className="mb-8">
            <span className="text-5xl font-bold tracking-tight text-white">$99</span>
            <span className="text-white/50 ml-2">/ month</span>
          </div>
          <button className="w-full rounded-xl bg-white/5 border border-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 mb-8">
            Contact Sales
          </button>
          <ul className="flex flex-col gap-4 text-sm text-white/70 flex-1">
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Everything in Pro
            </li>
            <li className="flex items-center gap-3 font-medium text-white">
              <Building2 className="h-4 w-4 text-blue-400" /> CRM & Field Leads
            </li>
            <li className="flex items-center gap-3 font-medium text-white">
              <Check className="h-4 w-4 text-white/40" /> Custom Domain Support
            </li>
            <li className="flex items-center gap-3">
              <Check className="h-4 w-4 text-white/40" /> Multi-User Seats (up to 5)
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
