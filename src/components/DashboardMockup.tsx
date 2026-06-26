'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  RotateCw,
  Share,
  Plus,
  Copy,
  Grid,
  Compass,
  Layers,
  ListTodo,
  Sparkles,
} from 'lucide-react';
import Logo from './Logo';

export default function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState('auto');

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && innerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidth = 896; // Fixed design width
        const newScale = Math.min(containerWidth / targetWidth, 1);
        setScale(newScale);
        setHeight(`${innerRef.current.offsetHeight * newScale}px`);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    // Use ResizeObserver for more robust tracking
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="animate-hero-rise relative z-0 mx-auto -mb-10 w-[92%] max-w-4xl shrink-0 sm:-mb-20 sm:w-[84%] lg:-mb-32 lg:w-[72%] [animation-delay:620ms]"
      style={{ height: height === 'auto' ? '600px' : height }}
    >
      <div
        ref={innerRef}
        className="absolute left-0 top-0 w-[896px] origin-top-left overflow-hidden rounded-t-2xl bg-[#1a1a1c] text-left shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#242427] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]"></span>
            <div className="ml-4 flex items-center gap-3">
              <PanelLeft className="h-3.5 w-3.5 text-white/40" />
              <ChevronLeft className="h-3.5 w-3.5 text-white/40" />
              <ChevronRight className="h-3.5 w-3.5 text-white/25" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-md bg-[#1a1a1c] px-6 py-1 text-[10px] text-white/60">
              <Monitor className="h-3 w-3" />
              hackarena.ai
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCw className="h-3.5 w-3.5 text-white/40" />
            <Share className="h-3.5 w-3.5 text-white/40" />
            <Plus className="h-3.5 w-3.5 text-white/40" />
            <Copy className="h-3.5 w-3.5 text-white/40" />
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex min-h-[550px]">
          {/* Sidebar */}
          <div className="flex w-[22%] flex-col border-r border-white/5 bg-[#1e1e21] px-3 py-3.5">
            <div className="flex items-center justify-between px-1">
              <Logo className="h-4 w-4 text-white/70" />
              <Grid className="h-3.5 w-3.5 text-white/30" />
            </div>

            <div className="mt-6 flex items-center gap-2 px-1">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-[#e8553f] text-[8px] font-bold text-white">
                H
              </div>
              <span className="text-[10px] font-medium text-white/80">HackArena</span>
            </div>

            <div className="mt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5">
                <ListTodo className="h-3.5 w-3.5 text-white/60" />
                <span className="text-[10px] text-white/80">Agreements</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md transition-colors">
                <Compass className="h-3.5 w-3.5 text-white/60" />
                <span className="text-[10px] text-white/60">Templates</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-md transition-colors">
                <Layers className="h-3.5 w-3.5 text-white/60" />
                <span className="text-[10px] text-white/60">Clients</span>
              </div>
            </div>

            <div className="mt-8 px-2 text-[8px] font-semibold tracking-wider text-white/30">
              RECENT DRAFTS
            </div>
            <div className="mt-2 flex flex-col gap-2 px-2">
              {[
                'Nexus Corp App',
                'Starlight UI/UX',
                'Quantum Backend',
                'Nova Landing Page',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/70"></span>
                  <span className="text-[10px] text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#1a1a1c] p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8553f] text-lg font-bold text-white">
                  H
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white">HackArena</h2>
                  <p className="text-[10px] text-white/45">Agency OS Portal</p>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15">
                <Sparkles className="h-3.5 w-3.5 text-white/70" />
                Generate Agreement
              </button>
            </div>

            {/* Stats grid */}
            <div className="mt-8 grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5">
              <div className="flex flex-col gap-1 p-4">
                <span className="text-xl font-medium text-white">142</span>
                <span className="text-[8px] tracking-wider text-white/35">
                  AGREEMENTS / Generated
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <span className="text-xl font-medium text-white">34</span>
                <span className="text-[8px] tracking-wider text-white/35">
                  CLIENTS / Active
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <span className="text-xl font-medium text-white">12</span>
                <span className="text-[8px] tracking-wider text-white/35">
                  DRAFTS / Pending
                </span>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <span className="text-xl font-medium text-white">$142.5k</span>
                <span className="text-[8px] tracking-wider text-white/35">
                  REVENUE / Secured
                </span>
              </div>
            </div>

            {/* Subject cards */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {['Web Development', 'Mobile App', 'SEO & Marketing'].map((subject, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/[0.03] p-4 ring-1 ring-white/5"
                >
                  <h3 className="text-xs font-medium text-white/80">{subject}</h3>
                  <p className="mt-1 text-[10px] text-white/40">3 Active Projects</p>
                </div>
              ))}
            </div>

            {/* Drafting inbox */}
            <div className="mt-6 overflow-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-medium tracking-wider text-white/30">
                    <th className="px-4 py-3">CLIENT NAME</th>
                    <th className="px-4 py-3">PROJECT TYPE</th>
                    <th className="px-4 py-3">VALUE</th>
                    <th className="px-4 py-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { c: 'Nexus Corp', t: 'Full-Stack App', v: '$24,000', s: 'Signed', sc: 'text-[#28c840]/80' },
                    { c: 'Starlight Inc', t: 'UI/UX Redesign', v: '$8,500', s: 'Drafting', sc: 'text-[#febc2e]/80' },
                    { c: 'Quantum LLC', t: 'Backend API', v: '$12,000', s: 'Pending', sc: 'text-[#febc2e]/80' },
                    { c: 'Nova Tech', t: 'Landing Page', v: '$3,200', s: 'Signed', sc: 'text-[#28c840]/80' },
                    { c: 'Orbit Media', t: 'SEO Audit', v: '$1,500', s: 'Drafting', sc: 'text-[#febc2e]/80' },
                  ].map((row, i) => (
                    <tr key={i} className="text-[11px]">
                      <td className="px-4 py-3 font-medium text-white/80">{row.c}</td>
                      <td className="px-4 py-3 text-white/50">{row.t}</td>
                      <td className="px-4 py-3 text-white/60">{row.v}</td>
                      <td className={`px-4 py-3 font-medium ${row.sc}`}>{row.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
