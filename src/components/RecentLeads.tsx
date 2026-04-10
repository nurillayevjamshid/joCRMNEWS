import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  amount: string;
  avatar: string;
}

const statusStyles: Record<string, string> = {
  'Yangi': 'bg-blue-50 text-blue-600',
  'Jarayonda': 'bg-amber-50 text-amber-600',
  'Yutildi': 'bg-emerald-50 text-emerald-600',
  'Yo\'qotildi': 'bg-rose-50 text-rose-600',
  'New': 'bg-blue-50 text-blue-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  'Won': 'bg-emerald-50 text-emerald-600',
  'Lost': 'bg-rose-50 text-rose-600',
};

const statusMap: Record<string, string> = {
  'New': 'Yangi',
  'In Progress': 'Jarayonda',
  'Won': 'Yutildi',
  'Lost': 'Yo\'qotildi',
};

export function RecentLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('leads', (data) => {
      setLeads(data.slice(0, 4) as Lead[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusLabel = (status: string) => statusMap[status] || status;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 col-span-1 lg:col-span-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">So'nggi lidlar</h2>
          <p className="text-sm text-slate-500">Eng so'nggi potentsial mijozlar</p>
        </div>
        <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          Barchasi
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : leads.length > 0 ? (
          leads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-3">
                <img 
                  src={lead.avatar} 
                  alt={lead.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-semibold text-surface-900">{lead.name}</h4>
                  <p className="text-xs text-slate-500">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-surface-900">{lead.amount}</div>
                  <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${statusStyles[lead.status] || 'bg-slate-50 text-slate-600'}`}>
                    {getStatusLabel(lead.status)}
                  </div>
                </div>
                <button className="p-1.5 sm:p-2 text-slate-400 hover:text-surface-900 sm:opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm italic">
            Lidlar yo'q.
          </div>
        )}
      </div>
    </div>
  );
}
