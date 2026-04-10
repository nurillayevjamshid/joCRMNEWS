import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { dataService } from '../services/dataService';

interface ActivityItem {
  id: string;
  type: 'lead' | 'customer' | 'message' | 'task' | 'deal';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

export function DashboardActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        // Fetch all collections to build activity feed
        const [leads, customers, messages, tasks] = await Promise.all([
          dataService.getCollection('leads'),
          dataService.getCollection('customers'),
          dataService.getCollection('messages'),
          dataService.getCollection('tasks')
        ]);

        const activities: ActivityItem[] = [];

        // Add recent leads
        (leads as any[]).slice(0, 2).forEach(lead => {
          activities.push({
            id: `lead-${lead.id}`,
            type: 'lead',
            title: `Yangi lid: ${lead.name}`,
            description: `${lead.company} dan`,
            timestamp: '2 soat oldin',
            icon: <TrendingUp className="w-4 h-4" />,
            color: 'bg-blue-50 text-blue-600'
          });
        });

        // Add recent customers
        (customers as any[]).slice(0, 1).forEach(customer => {
          activities.push({
            id: `customer-${customer.id}`,
            type: 'customer',
            title: `Yangi mijoz: ${customer.name}`,
            description: `${customer.company}`,
            timestamp: '4 soat oldin',
            icon: <User className="w-4 h-4" />,
            color: 'bg-emerald-50 text-emerald-600'
          });
        });

        // Add recent messages
        (messages as any[]).slice(0, 1).forEach(msg => {
          activities.push({
            id: `message-${msg.id}`,
            type: 'message',
            title: `Xabar: ${msg.name}`,
            description: msg.message.substring(0, 50) + '...',
            timestamp: '1 soat oldin',
            icon: <MessageSquare className="w-4 h-4" />,
            color: 'bg-purple-50 text-purple-600'
          });
        });

        // Add completed tasks
        (tasks as any[]).filter((t: any) => t.status === 'completed').slice(0, 1).forEach(task => {
          activities.push({
            id: `task-${task.id}`,
            type: 'task',
            title: `Vazifa bajarildi: ${task.title}`,
            description: `Mas'ul: ${task.assignedTo || 'Belgilanmagan'}`,
            timestamp: '30 daqiqa oldin',
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: 'bg-emerald-50 text-emerald-600'
          });
        });

        // Sort by most recent and limit to 5
        setActivities(activities.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error loading activities:', error);
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">Faollik</h2>
          <p className="text-sm text-slate-500">So'nggi harakatlar</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
          <Activity className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0 mt-0.5`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                  {activity.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {activity.description}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm italic">
            Faollik yo'q.
          </div>
        )}
      </div>

      <button className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors">
        Barcha faolliklar
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
