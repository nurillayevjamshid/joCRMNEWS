import React from 'react';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { RecentLeads } from './RecentLeads';
import { UpcomingTasks } from './UpcomingTasks';
import { RecentMessages } from './RecentMessages';
import { Users, DollarSign, Activity, Target } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
          Welcome back, Alex! 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your business today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard 
          title="Total Revenue" 
          value="$124,563" 
          trend={12.5} 
          icon={DollarSign} 
          color="brand" 
        />
        <StatCard 
          title="Active Customers" 
          value="1,429" 
          trend={5.2} 
          icon={Users} 
          color="emerald" 
        />
        <StatCard 
          title="Conversion Rate" 
          value="14.2%" 
          trend={-2.4} 
          icon={Activity} 
          color="rose" 
        />
        <StatCard 
          title="Sales Target" 
          value="82%" 
          trend={8.1} 
          icon={Target} 
          color="amber" 
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <RevenueChart />
        <RecentLeads />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UpcomingTasks />
        <RecentMessages />
      </div>
    </div>
  );
}
