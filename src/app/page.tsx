'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import DashboardMockup from '@/components/DashboardMockup';

export default function Home() {
  return (
    <main
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260611_133301_d5f2a94a-b22e-4e4a-a6b6-eacdddf1f5b0.png&w=1280&q=85")',
      }}
    >
      {/* Grass Overlay */}
      <img
        src="https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1781191264/grass_eam204.png"
        alt="Grass overlay"
        className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
      />

      <Navbar />

      {/* Spacer between Navbar and Content */}
      <div className="flex-1 min-h-8 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center px-5 text-center sm:px-8">
        <h1 className="text-[40px] font-normal leading-[1.05] tracking-tight text-gray-900 min-[400px]:text-[44px] sm:text-5xl lg:text-6xl xl:text-[70px]">
          <span className="block animate-fade-up">Stop Paying Just to</span>
          <span className="block animate-fade-up [animation-delay:100ms]">Send a Contract.</span>
        </h1>

        {/* Search / Email Bar */}
        <form
          className="mt-5 w-full max-w-xl animate-fade-up [animation-delay:220ms] sm:mt-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-3 rounded-full bg-white/60 py-1.5 pl-5 pr-1.5 backdrop-blur-md ring-1 ring-gray-200">
            <input
              type="text"
              placeholder="Enter your agency name"
              className="flex-1 bg-transparent py-2 text-sm text-gray-900 placeholder-gray-500 outline-none sm:text-base"
            />
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-transform hover:scale-105 active:scale-95 sm:h-10 sm:w-10"
            >
              <ArrowUp className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>
        </form>

        {/* Description */}
        <p className="mt-4 max-w-xl animate-fade-up text-sm leading-relaxed text-gray-600 [animation-delay:340ms] sm:mt-5 sm:text-base lg:text-lg">
          The 100% free Agency OS for freelancers and dev shops.{' '}
          <br className="hidden sm:block" />Generate agreements, collect signatures, and send invoices in 3 clicks.
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 animate-fade-up [animation-delay:460ms] sm:mt-5">
          <Link href="/dashboard" className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg">
            Start for Free
          </Link>
          <button className="rounded-full px-6 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition-colors hover:bg-gray-100">
            Talk to sales
          </button>
        </div>
        <p className="mt-4 text-xs font-medium text-gray-500 animate-fade-up [animation-delay:500ms]">
          Used by agencies, freelancers, and software companies.
        </p>
      </div>

      {/* Spacer between Content and Dashboard */}
      <div className="flex-1 min-h-10 sm:min-h-12 lg:min-h-16 shrink-0" />

      {/* Dashboard Mockup */}
      <DashboardMockup />
    </main>
  );
}

