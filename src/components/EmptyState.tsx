import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-slate-100">
        <Icon className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-lg font-display font-bold text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ── Pre-built empty states for common views ──────────────────── */

import { Users, Briefcase, Calendar, MessageSquare, BarChart3, Search } from 'lucide-react';

export function EmptyCustomers({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Mijozlar yo'q"
      description="Hali birorta mijoz qo'shilmagan. Yangi mijoz qo'shib, bazangizni boshlang."
      action={{ label: "Mijoz qo'shish", onClick: onAdd }}
    />
  );
}

export function EmptyProjects({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Briefcase}
      title="Loyihalar yo'q"
      description="Hali birorta loyiha yo'q. Yangi loyiha yarating va jamoangiz bilan boshlang."
      action={{ label: "Yangi loyiha", onClick: onAdd }}
    />
  );
}

export function EmptyCalendar({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="Tadbirlar yo'q"
      description="Bu kunda rejalashtirilgan tadbir mavjud emas. Yangi tadbir qo'shing."
      action={{ label: "Tadbir qo'shish", onClick: onAdd }}
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="Xabarlar yo'q"
      description="Hali hech qanday xabar yo'q. Suhbatni boshlash uchun kontakt tanlang."
    />
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Natija topilmadi"
      description={`"${query}" bo'yicha hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.`}
    />
  );
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      icon={BarChart3}
      title="Ma'lumotlar yetarli emas"
      description="Tahlil ko'rsatkichlari uchun yetarli ma'lumot mavjud emas. Ma'lumotlar to'plangandan so'ng bu yerda ko'rinadi."
    />
  );
}
