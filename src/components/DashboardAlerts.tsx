import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  TrendingDown, 
  Users, 
  MessageCircle,
  X,
  Loader2
} from 'lucide-react';
import { dataService } from '../services/dataService';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  dismissible: boolean;
}

export function DashboardAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generateAlerts = async () => {
      try {
        const [leads, customers, tasks] = await Promise.all([
          dataService.getCollection('leads'),
          dataService.getCollection('customers'),
          dataService.getCollection('tasks')
        ]);

        const newAlerts: Alert[] = [];

        // Alert: Lost leads
        const lostLeads = (leads as any[]).filter(l => l.status === 'Lost').length;
        if (lostLeads > 0) {
          newAlerts.push({
            id: 'lost-leads',
            type: 'warning',
            title: 'Yo\'qotilgan lidlar',
            message: `${lostLeads} ta lidni qayta ko'rib chiqish kerak`,
            icon: <TrendingDown className="w-4 h-4" />,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            dismissible: true
          });
        }

        // Alert: Overdue tasks
        const overdueTasks = (tasks as any[]).filter(t => {
          const deadline = new Date(t.deadline);
          return deadline < new Date() && t.status !== 'completed';
        }).length;

        if (overdueTasks > 0) {
          newAlerts.push({
            id: 'overdue-tasks',
            type: 'error',
            title: 'Muddati o\'tgan vazifalar',
            message: `${overdueTasks} ta vazifaning muddati o\'tib ketdi`,
            icon: <Clock className="w-4 h-4" />,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            dismissible: true
          });
        }

        // Alert: Low active customers
        const activeCustomers = (customers as any[]).filter(c => c.status === 'Active' || c.status === 'Faol').length;
        if (activeCustomers < 5) {
          newAlerts.push({
            id: 'low-customers',
            type: 'info',
            title: 'Kam faol mijozlar',
            message: `Hozir faqat ${activeCustomers} ta faol mijoz bor`,
            icon: <Users className="w-4 h-4" />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            dismissible: true
          });
        }

        // Alert: New leads waiting
        const newLeads = (leads as any[]).filter(l => l.status === 'New').length;
        if (newLeads > 0) {
          newAlerts.push({
            id: 'new-leads',
            type: 'success',
            title: 'Yangi lidlar kutilmoqda',
            message: `${newLeads} ta yangi lid tahlil qilishni kutilmoqda`,
            icon: <MessageCircle className="w-4 h-4" />,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            dismissible: true
          });
        }

        setAlerts(newAlerts);
        setLoading(false);
      } catch (error) {
        console.error('Error generating alerts:', error);
        setLoading(false);
      }
    };

    generateAlerts();
  }, []);

  const dismissAlert = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const visibleAlerts = alerts.filter(alert => !dismissedIds.has(alert.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (visibleAlerts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm italic">Ogohlantirishlar yo'q</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map(alert => (
        <div 
          key={alert.id}
          className={`p-4 rounded-2xl border border-current border-opacity-20 ${alert.bgColor} flex items-start gap-3 group`}
        >
          <div className={`${alert.color} flex-shrink-0 mt-0.5`}>
            {alert.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-semibold ${alert.color}`}>
              {alert.title}
            </h3>
            <p className={`text-xs mt-1 ${alert.color} opacity-75`}>
              {alert.message}
            </p>
          </div>
          {alert.dismissible && (
            <button
              onClick={() => dismissAlert(alert.id)}
              className={`${alert.color} opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-50 rounded-lg`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
