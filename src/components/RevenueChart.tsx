import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, target: 2400 },
  { name: 'Feb', revenue: 3000, target: 1398 },
  { name: 'Mar', revenue: 2000, target: 9800 },
  { name: 'Apr', revenue: 2780, target: 3908 },
  { name: 'May', revenue: 1890, target: 4800 },
  { name: 'Jun', revenue: 2390, target: 3800 },
  { name: 'Jul', revenue: 3490, target: 4300 },
  { name: 'Aug', revenue: 4000, target: 2400 },
  { name: 'Sep', revenue: 5000, target: 2400 },
  { name: 'Oct', revenue: 4800, target: 2400 },
  { name: 'Nov', revenue: 6000, target: 2400 },
  { name: 'Dec', revenue: 7200, target: 2400 },
];

export function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">Revenue Overview</h2>
          <p className="text-sm text-slate-500">Monthly revenue compared to target</p>
        </div>
        <select className="bg-slate-50 border border-slate-100 text-sm rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-600 font-medium">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-[300px] w-full flex flex-col">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px'
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
