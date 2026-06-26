'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-gray-900">
          <Logo className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-bold tracking-tight text-lg sm:text-xl">Sign <span className="font-medium text-gray-600 text-sm">by HackArena</span></span>
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
      </div>

      {/* CTA & Hamburger */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="hidden sm:inline-block rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-gray-800 transition-colors sm:px-5"
        >
          Go to Dashboard
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-900 hover:bg-gray-900/10 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/80 px-5 py-3 backdrop-blur-xl ring-1 ring-gray-200 animate-fade-up md:hidden">
          <div className="flex flex-col">
            <Link
              href="/dashboard"
              className="mt-4 rounded-full bg-gray-900 py-2.5 text-center text-[15px] font-medium text-white hover:bg-gray-800"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
