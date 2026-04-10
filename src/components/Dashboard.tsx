import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { RecentLeads } from './RecentLeads';
import { UpcomingTasks } from './UpcomingTasks';
import { RecentMessages } from './RecentMessages';
import { Users, DollarSign, Activity, Target } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { SkeletonStatCard, SkeletonDashboard } from './Skeleton';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeCustomers: 0,
    totalRevenue: '$124,563',
    conversionRate: '14.2%',
    salesTarget: '82%'
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeCustomers = dataService.subscribeToCollection('customers', (data) => {
      setStats(prev => ({ ...prev, activeCustomers: data.length }));
      setStatsLoading(false);
    });

    return () => {
      unsubscribeCustomers();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
          Xush kelibsiz, {user?.displayName || user?.email?.split('@')[0] || 'Foydalanuvchi'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Bugungi biznes holatingiz haqida ma'lumot.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard 
              title="Jami daromad" 
              value={stats.totalRevenue} 
              trend={12.5} 
              icon={DollarSign} 
              color="brand" 
            />
            <StatCard 
              title="Faol mijozlar" 
              value={stats.activeCustomers.toLocaleString()} 
              trend={5.2} 
              icon={Users} 
              color="emerald" 
            />
            <StatCard 
              title="Konversiya darajasi" 
              value={stats.conversionRate} 
              trend={-2.4} 
              icon={Activity} 
              color="rose" 
            />
            <StatCard 
              title="Sotuv maqsadi" 
              value={stats.salesTarget} 
              trend={8.1} 
              icon={Target} 
              color="amber" 
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <RevenueChart />
        <RecentLeads />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UpcomingTasks />
        <RecentMessages />
      </div>
    </div>
  );
}
