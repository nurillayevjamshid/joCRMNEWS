import React from 'react';
import { RevenueChart } from './RevenueChart';
import { RecentLeads } from './RecentLeads';
import { UpcomingTasks } from './UpcomingTasks';
import { RecentMessages } from './RecentMessages';
import { DashboardStats } from './DashboardStats';
import { DashboardActivity } from './DashboardActivity';
import { DashboardAlerts } from './DashboardAlerts';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
          Xush kelibsiz, {user?.displayName || user?.email?.split('@')[0] || 'Foydalanuvchi'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Bugungi biznes holatingiz haqida ma'lumot.</p>
      </div>

      {/* Real KPI Stats */}
      <div className="mb-6">
        <DashboardStats />
      </div>

      {/* Revenue Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-surface-900">Ogohlantirishlar</h2>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <DashboardAlerts />
          </div>
        </div>
      </div>

      {/* Activity, Tasks, and Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <UpcomingTasks />
        <DashboardActivity />
        <RecentLeads />
      </div>

      {/* Recent Messages */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <RecentMessages />
      </div>
    </div>
  );
}
