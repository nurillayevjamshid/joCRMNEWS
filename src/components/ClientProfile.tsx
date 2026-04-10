import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';
import { ClientCard } from './ClientCard';
import { ClientNotes } from './ClientNotes';
import { ClientHistory } from './ClientHistory';
import { ClientOrders } from './ClientOrders';
import { ClientTags } from './ClientTags';
import { ClientTimeline } from './ClientTimeline';

interface ClientProfileProps {
  customerId: string;
  onBack?: () => void;
}

interface Customer {
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
  tags?: string[];
  createdAt?: any;
}

export function ClientProfile({ customerId, onBack }: ClientProfileProps) {
  const { addToast } = useToast();
  const [client, setClient] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await dataService.getDocument('customers', customerId);
        if (data) {
          setClient(data as Customer);
        } else {
          addToast('error', 'Mijoz topilmadi');
        }
      } catch (error) {
        console.error('Mijozni yuklashda xatolik:', error);
        addToast('error', 'Mijozni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [customerId, addToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Profil yuklanmoqda...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-slate-400 font-medium">404</span>
        </div>
        <h2 className="text-xl font-display font-bold text-surface-900">Mijoz topilmadi</h2>
        <p className="text-slate-500 mt-2">Ushbu mijoz mavjud emas.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl transition-colors font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Orqaga
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Orqaga
          </button>
        )}
        <div className="flex-1" />
      </div>

      {/* Client Card */}
      <div className="mb-8">
        <ClientCard client={client} onClose={onBack} />
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Umumiy ma'lumot
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
            activeTab === 'timeline'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Vaqt chizig'i
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Notes and History */}
          <div className="lg:col-span-2 space-y-8">
            <ClientNotes customerId={customerId} />
            <ClientHistory customerId={customerId} />
            <ClientOrders customerId={customerId} />
          </div>

          {/* Right column - Tags */}
          <div>
            <ClientTags customerId={customerId} />
          </div>
        </div>
      ) : (
        <div>
          <ClientTimeline customerId={customerId} />
        </div>
      )}
    </div>
  );
}
