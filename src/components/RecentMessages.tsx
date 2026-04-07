import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

const messages = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    message: 'Can we reschedule our meeting to tomorrow?',
    time: '10m ago',
    unread: true,
    avatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: 2,
    name: 'Michael Chen',
    message: 'The new designs look absolutely fantastic!',
    time: '1h ago',
    unread: true,
    avatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: 3,
    name: 'Emma Watson',
    message: 'Please send over the contract when you have a moment.',
    time: '3h ago',
    unread: false,
    avatar: 'https://picsum.photos/seed/emma/100/100',
  },
];

export function RecentMessages() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">Recent Messages</h2>
          <p className="text-sm text-slate-500">Latest communications</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-center gap-3 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="relative">
              <img 
                src={msg.avatar} 
                alt={msg.name} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              {msg.unread && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className={`text-sm truncate pr-2 ${msg.unread ? 'font-bold text-surface-900' : 'font-semibold text-slate-700'}`}>
                  {msg.name}
                </h4>
                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{msg.time}</span>
              </div>
              <p className={`text-xs truncate ${msg.unread ? 'text-surface-900 font-medium' : 'text-slate-500'}`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors">
        View All Messages
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
