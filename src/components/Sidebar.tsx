'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Grid,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agreements', href: '/dashboard/agreements', icon: FileText },
    { name: 'Create Agreement', href: '/dashboard/create', icon: PlusCircle },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/5 bg-[#1e1e21] px-4 py-5 text-white">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
        <Logo className="h-6 w-6 text-white" />
        <span className="text-lg font-bold tracking-tight">HackArena</span>
      </Link>

      {/* Workspace Badge */}
      <div className="mt-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8553f] text-sm font-bold text-white shadow-sm">
          H
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none text-white/90">HackArena</span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-white/40">Agency Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
