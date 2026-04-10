import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, Download, TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SkeletonStatCard } from './Skeleton';

const revenueData = [
  { name: 'Yan', revenue: 4000, expenses: 2400 },
  { name: 'Fev', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Iyn', revenue: 2390, expenses: 3800 },
  { name: 'Iyl', revenue: 3490, expenses: 4300 },
  { name: 'Avg', revenue: 4000, expenses: 2400 },
  { name: 'Sen', revenue: 5000, expenses: 3000 },
  { name: 'Okt', revenue: 6500, expenses: 4200 },
  { name: 'Noy', revenue: 7800, expenses: 5000 },
  { name: 'Dek', revenue: 9000, expenses: 6000 },
];

const trafficData = [
  { name: 'Organik qidiruv', value: 400 },
  { name: 'To\'g\'ridan-to\'g\'ri', value: 300 },
  { name: 'Ijtimoiy tarmoqlar', value: 300 },
  { name: 'Havola orqali', value: 200 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6'];

const activityData = [
  { name: 'Dush', active: 120, new: 40 },
  { name: 'Sesh', active: 132, new: 50 },
  { name: 'Chor', active: 101, new: 30 },
  { name: 'Pay', active: 143, new: 60 },
  { name: 'Jum', active: 190, new: 80 },
  { name: 'Shan', active: 230, new: 110 },
  { name: 'Yak', active: 210, new: 90 },
];

export function Analytics() {
  const [timeRange, setTimeRange] = useState('Bu yil');

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Tahlillar
          </h1>
          <p className="text-slate-500 mt-1">Biznes ko'rsatkichlari va natijalar.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer shadow-sm shadow-slate-200/20"
            >
              <option>Bugun</option>
              <option>So'nggi 7 kun</option>
              <option>Bu oy</option>
              <option>Bu yil</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm shadow-slate-200/20">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Hisobotni yuklash</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {[
          { title: 'Jami daromad', value: '$124,563.00', trend: '+14.5%', isPositive: true, icon: DollarSign, color: 'brand' },
          { title: 'Faol foydalanuvchilar', value: '45,231', trend: '+22.1%', isPositive: true, icon: Users, color: 'emerald' },
          { title: 'Konversiya darajasi', value: '3.24%', trend: '-1.4%', isPositive: false, icon: Activity, color: 'rose' },
          { title: 'Rad etish darajasi', value: '42.3%', trend: '-5.2%', isPositive: true, icon: TrendingUp, color: 'amber' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md transition-all animate-stagger" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${
                stat.color === 'brand' ? 'bg-brand-50 text-brand-600' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold px-2 sm:px-2.5 py-1 rounded-full ${
                stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-xs sm:text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-display font-bold text-surface-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900">Daromad va xarajatlar</h2>
              <p className="text-sm text-slate-500">Tanlangan davr uchun moliyaviy ko'rsatkichlar</p>
            </div>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full flex flex-col">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20">
          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-surface-900">Trafik manbalari</h2>
            <p className="text-sm text-slate-500">Foydalanuvchilar qayerdan keladi</p>
          </div>
          <div className="h-[200px] sm:h-[250px] w-full flex items-center justify-center flex-col">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {trafficData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">{item.name}</span>
                  <span className="text-sm font-bold text-surface-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900">Haftalik foydalanuvchi faolligi</h2>
              <p className="text-sm text-slate-500">Faol va yangi foydalanuvchilar</p>
            </div>
          </div>
          <div className="h-[250px] sm:h-[300px] w-full flex flex-col">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="active" name="Faol foydalanuvchilar" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" name="Yangi foydalanuvchilar" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
