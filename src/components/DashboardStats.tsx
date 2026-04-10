import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  DollarSign,
  Users,
  Zap,
  Target,
  Loader2
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { kpiService, KPIData } from '../services/kpiService';

interface StatItem {
  id: string;
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [leads, customers, messages] = await Promise.all([
          dataService.getCollection('leads'),
          dataService.getCollection('customers'),
          dataService.getCollection('messages')
        ]);

        const kpis = kpiService.calculateKPIs(leads as any[], customers as any[], messages as any[]);
        setKpiData(kpis);

        const statItems: StatItem[] = [
          {
            id: 'revenue',
            label: 'Jami daromad',
            value: kpiService.formatCurrency(kpis.totalRevenue),
            trend: 12.5,
            icon: <DollarSign className="w-5 h-5" />,
            color: 'brand'
          },
          {
            id: 'customers',
            label: 'Faol mijozlar',
            value: kpis.activeCustomers.toString(),
            trend: 5.2,
            icon: <Users className="w-5 h-5" />,
            color: 'emerald'
          },
          {
            id: 'conversion',
            label: 'Konversiya darajasi',
            value: kpiService.formatPercentage(kpis.conversionRate),
            trend: -2.4,
            icon: <Zap className="w-5 h-5" />,
            color: 'rose'
          },
          {
            id: 'target',
            label: 'Sotuv maqsadi',
            value: kpiService.formatPercentage(kpis.salesTarget),
            trend: 8.1,
            icon: <Target className="w-5 h-5" />,
            color: 'amber'
          }
        ];

        setStats(statItems);
        setLoading(false);
      } catch (error) {
        console.error('Error loading stats:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-rose-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-emerald-600';
    if (trend < 0) return 'text-rose-600';
    return 'text-slate-600';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map(stat => (
        <div 
          key={stat.id}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md hover:shadow-slate-200/30 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getTrendColor(stat.trend)} bg-opacity-10`}>
              {getTrendIcon(stat.trend)}
              <span>{Math.abs(stat.trend)}%</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
          <h3 className="text-2xl font-display font-bold text-surface-900">
            {stat.value}
          </h3>

          {stat.id === 'revenue' && kpiData && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Yutilgan bitimlar:</span>
                <span className="font-semibold text-surface-900">{kpiData.wonDeals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">O'rtacha qiymat:</span>
                <span className="font-semibold text-surface-900">{kpiService.formatCurrency(kpiData.avgDealValue)}</span>
              </div>
            </div>
          )}

          {stat.id === 'customers' && kpiData && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Saqlanish darajasi:</span>
                <span className="font-semibold text-surface-900">{kpiService.formatPercentage(kpiData.customerRetention)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Yangi lidlar:</span>
                <span className="font-semibold text-surface-900">{kpiData.newLeads}</span>
              </div>
            </div>
          )}

          {stat.id === 'conversion' && kpiData && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Yo'qotilgan:</span>
                <span className="font-semibold text-rose-600">{kpiData.lostDeals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Javob vaqti:</span>
                <span className="font-semibold text-surface-900">{Math.round(kpiData.responseTime)}h</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
