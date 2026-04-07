import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const leads = [
  {
    id: 1,
    name: 'Eleanor Pena',
    company: 'Mailchimp',
    email: 'eleanor@mailchimp.com',
    status: 'New',
    amount: '$12,500',
    avatar: 'https://picsum.photos/seed/eleanor/100/100',
  },
  {
    id: 2,
    name: 'Guy Hawkins',
    company: 'Gillette',
    email: 'guy@gillette.com',
    status: 'In Progress',
    amount: '$8,200',
    avatar: 'https://picsum.photos/seed/guy/100/100',
  },
  {
    id: 3,
    name: 'Jerome Bell',
    company: 'Google',
    email: 'jerome@google.com',
    status: 'Won',
    amount: '$45,000',
    avatar: 'https://picsum.photos/seed/jerome/100/100',
  },
  {
    id: 4,
    name: 'Kathryn Murphy',
    company: 'Apple',
    email: 'kathryn@apple.com',
    status: 'Lost',
    amount: '$3,400',
    avatar: 'https://picsum.photos/seed/kathryn/100/100',
  },
];

const statusStyles = {
  'New': 'bg-blue-50 text-blue-600',
  'In Progress': 'bg-amber-50 text-amber-600',
  'Won': 'bg-emerald-50 text-emerald-600',
  'Lost': 'bg-rose-50 text-rose-600',
};

export function RecentLeads() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 col-span-1 lg:col-span-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">Recent Leads</h2>
          <p className="text-sm text-slate-500">Latest potential customers</p>
        </div>
        <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {leads.map((lead) => (
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
                <div className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${statusStyles[lead.status as keyof typeof statusStyles]}`}>
                  {lead.status}
                </div>
              </div>
              <button className="p-1.5 sm:p-2 text-slate-400 hover:text-surface-900 sm:opacity-0 group-hover:opacity-100 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
