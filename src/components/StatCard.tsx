import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCounterAnimation } from '../hooks/animations';

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: LucideIcon;
  color: 'brand' | 'emerald' | 'amber' | 'rose';
  delay?: number;
}

const colorStyles = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

const iconColors = {
  brand: 'group-hover:bg-brand-100',
  emerald: 'group-hover:bg-emerald-100',
  amber: 'group-hover:bg-amber-100',
  rose: 'group-hover:bg-rose-100',
};

export function StatCard({ title, value, trend, icon: Icon, color, delay = 0 }: StatCardProps) {
  const isPositive = trend >= 0;

  // Raqamni ajratish: "$124,563" -> 124563
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  const suffix = value.match(/[^0-9]*$/)?.[0] || '';
  const hasComma = value.includes(',');

  const animatedNumber = useCounterAnimation(numericValue, 1800, 0, numericValue > 0);

  const formatNumber = (num: number) => {
    if (hasComma) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <div 
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md hover:shadow-slate-200/30 transition-all duration-300 group hover:-translate-y-1 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles[color]} transition-colors duration-300 ${iconColors[color]}`}>
          <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-transform duration-300 ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-display font-bold text-surface-900 tracking-tight">
          {prefix}{formatNumber(animatedNumber)}{suffix}
        </div>
      </div>
    </div>
  );
}
