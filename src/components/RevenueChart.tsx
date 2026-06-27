'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ agreements }: { agreements: any[] }) {
  // Process agreements to calculate monthly revenue
  // We only want 'Signed' agreements
  const signedAgreements = agreements.filter(a => a.status === 'Signed' && a.signed_at);
  
  // Group by month
  const monthlyData: Record<string, number> = {};
  
  // Create last 6 months structure
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
    monthlyData[label] = 0;
  }

  // Populate data
  signedAgreements.forEach(agreement => {
    const d = new Date(agreement.signed_at);
    const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyData[label] !== undefined) {
      monthlyData[label] += Number(agreement.total_cost);
    }
  });

  const data = Object.keys(monthlyData).map(key => ({
    name: key,
    Revenue: monthlyData[key]
  }));

  if (signedAgreements.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center rounded-xl bg-white/[0.02] ring-1 ring-white/5 border border-dashed border-white/10">
        <p className="text-white/50 text-sm">No signed agreements yet to generate revenue chart.</p>
      </div>
    );
  }

  return (
    <div className="h-72 rounded-xl bg-white/[0.02] p-6 ring-1 ring-white/5">
      <h2 className="mb-4 text-sm font-semibold text-white/80">Revenue Over Time</h2>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#28c840" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#28c840" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#28c840' }}
            />
            <Area type="monotone" dataKey="Revenue" stroke="#28c840" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
