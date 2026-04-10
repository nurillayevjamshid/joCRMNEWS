import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, Edit2, X } from 'lucide-react';

interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
    company: string;
    status: string;
    spent: string;
    joined: string;
    avatar: string;
    phone?: string;
    address?: string;
    industry?: string;
  };
  onEdit?: () => void;
  onClose?: () => void;
}

export function ClientCard({ client, onEdit, onClose }: ClientCardProps) {
  const getStatusColor = (status: string) => {
    const normalized = status === 'Active' || status === 'Faol' ? 'Faol' : 'Nofaol';
    return normalized === 'Faol'
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      {/* Header with background gradient */}
      <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-600 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Client info section */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
          <div className="flex items-end gap-4">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900">{client.name}</h1>
              <p className="text-slate-500 text-sm">{client.company}</p>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl transition-colors font-medium text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Tahrirlash
            </button>
          )}
        </div>

        {/* Status and basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(client.status)}`}>
                {client.status === 'Active' || client.status === 'Faol' ? 'Faol' : 'Nofaol'}
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {client.address && (
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{client.address}</span>
              </div>
            )}
            {client.industry && (
              <div className="flex items-center gap-3 text-slate-600">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{client.industry}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Qo'shilgan: {client.joined}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Jami sarflagan</div>
            <div className="text-lg font-bold text-surface-900">{client.spent}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Holat</div>
            <div className="text-lg font-bold text-surface-900">
              {client.status === 'Active' || client.status === 'Faol' ? 'Faol' : 'Nofaol'}
            </div>
          </div>
          <div className="text-center sm:col-span-1">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Qo'shilgan</div>
            <div className="text-lg font-bold text-surface-900">{client.joined}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
