'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, FileText, Settings, Plus, Menu, X, Users } from 'lucide-react';
import Logo from '@/components/Logo';
import { UserButton, Show, SignInButton, ClerkLoading, ClerkLoaded, OrganizationSwitcher } from '@clerk/nextjs';

export default function DashboardSidebar({ profile, userName, roleName }: { profile: any, userName: string, roleName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#1a1a1c]">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-white" />
          <span className="text-lg font-bold tracking-tight text-white">Sign <span className="font-medium text-white/50 text-xs">by {profile.agency_name}</span></span>
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#1a1a1c] flex flex-col justify-between
        transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div>
          {/* Brand (Desktop Only) */}
          <Link href="/" className="hidden md:flex h-16 items-center gap-2 px-6 border-b border-white/5 hover:bg-white/5 transition-colors">
            <Logo className="h-6 w-6 text-white" />
            <span className="text-lg font-bold tracking-tight text-white">Sign <span className="font-medium text-white/50 text-xs">by {profile.agency_name}</span></span>
          </Link>

          {/* Workspace Switcher */}
          <div className="p-4 border-b border-white/5">
            <OrganizationSwitcher 
              appearance={{
                variables: {
                  colorText: "white"
                },
                elements: {
                  organizationSwitcherTrigger: "w-full flex justify-between items-center !text-white hover:!text-white/80 transition-colors bg-white/5 rounded-md px-3 py-2 border border-white/10",
                  organizationPreviewTextContainer: "truncate text-sm flex-1 text-left !text-white",
                  organizationPreviewMainIdentifier: "!text-white font-medium",
                  organizationSwitcherTriggerIcon: "!text-white/50 shrink-0 ml-2",
                }
              }}
              hidePersonal={false}
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Home className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/agreements"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <FileText className="h-4 w-4" />
              Agreements
            </Link>
            <Link
              href="/dashboard/leads"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Users className="h-4 w-4" />
              Field Leads
            </Link>
            <Link
              href="/dashboard/create"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#28c840] transition-colors hover:bg-[#28c840]/10"
            >
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 flex flex-col gap-1">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          
          <div className="mt-4 flex items-center gap-3 rounded-md px-3 py-2 border border-white/10 bg-white/5 min-h-[56px]">
            <ClerkLoading>
              <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-20 rounded-md bg-white/10 animate-pulse"></div>
                <div className="h-2 w-16 rounded-md bg-white/5 animate-pulse"></div>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Show when="signed-in">
                <div className="flex items-center gap-3 w-full overflow-hidden">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 shrink-0",
                        userButtonPopoverCard: "bg-[#242427] border-white/10 shadow-2xl",
                      }
                    }}
                  />
                  <div className="flex-1 flex flex-col min-w-0 justify-center pl-1">
                    <span className="text-sm font-medium truncate text-white leading-tight">{userName}</span>
                    <span className="text-xs text-white/70 truncate mt-0.5">{roleName}</span>
                  </div>
                </div>
              </Show>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium hover:text-white text-white/70">Sign In</button>
                </SignInButton>
              </Show>
            </ClerkLoaded>
          </div>
        </div>
      </aside>
    </>
  );
}
