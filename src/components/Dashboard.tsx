import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { RecentLeads } from './RecentLeads';
import { UpcomingTasks } from './UpcomingTasks';
import { RecentMessages } from './RecentMessages';
import { Users, DollarSign, Activity, Target } from 'lucide-react';
import { dataService } from '../services/dataService';

export function Dashboard() {
  const [stats, setStats] = useState({
    activeCustomers: 0,
    totalRevenue: '$124,563', // Still static for now
    conversionRate: '14.2%',
    salesTarget: '82%'
  });

  useEffect(() => {
    // Subscribe to customers to get count
    const unsubscribeCustomers = dataService.subscribeToCollection('customers', (data) => {
      setStats(prev => ({ ...prev, activeCustomers: data.length }));
    });

    return () => {
      unsubscribeCustomers();
    };
  }, []);

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
          value={stats.totalRevenue} 
          trend={12.5} 
          icon={DollarSign} 
          color="brand" 
        />
        <StatCard 
          title="Active Customers" 
          value={stats.activeCustomers.toLocaleString()} 
          trend={5.2} 
          icon={Users} 
          color="emerald" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={stats.conversionRate} 
          trend={-2.4} 
          icon={Activity} 
          color="rose" 
        />
        <StatCard 
          title="Sales Target" 
          value={stats.salesTarget} 
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
