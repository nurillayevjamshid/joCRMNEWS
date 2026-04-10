import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Clock, Phone, Mail, Calendar } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface HistoryEvent {
  id: string;
  customerId: string;
  type: 'call' | 'email' | 'meeting' | 'other';
  description: string;
  date: any;
  createdAt?: any;
  userId?: string;
}

interface ClientHistoryProps {
  customerId: string;
}

export function ClientHistory({ customerId }: ClientHistoryProps) {
  const { addToast } = useToast();
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'call' as const,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('clientHistory', (data) => {
      const filteredEvents = (data as HistoryEvent[])
        .filter(event => event.customerId === customerId)
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      setEvents(filteredEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.description.trim()) {
      addToast('error', 'Tavsif bo\'sh bo\'lishi mumkin emas');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.saveData('clientHistory', {
        customerId,
        type: newEvent.type,
        description: newEvent.description,
        date: new Date(newEvent.date),
      });
      addToast('success', 'Tarix qo\'shildi');
      setIsAddModalOpen(false);
      setNewEvent({
        type: 'call',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Tarix qo\'shishda xatolik:', error);
      addToast('error', 'Tarix qo\'shishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Haqiqatanam bu tarixni o\'chirmoqchimisiz?')) {
      try {
        await dataService.deleteData('clientHistory', id);
        addToast('success', 'Tarix o\'chirildi');
      } catch (error) {
        console.error('Tarixni o\'chirishda xatolik:', error);
        addToast('error', 'Tarixni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      call: 'Qo\'ng\'iroq',
      email: 'Email',
      meeting: 'Uchrashtuv',
      other: 'Boshqa',
    };
    return labels[type] || type;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-surface-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-600" />
          Tarix
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Qo'shish
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Tarix yuklanmoqda...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="flex gap-4 pb-4 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {getEventIcon(event.type)}
                  </div>
                  {index < events.length - 1 && (
                    <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {getEventTypeLabel(event.type)}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{event.description}</div>
                      <div className="text-xs text-slate-400 mt-2">{formatDate(event.date)}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-500 text-sm">Hali tarix yo'q</p>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-surface-900">Tarix qo'shish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-surface-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Turi</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                >
                  <option value="call">Qo'ng'iroq</option>
                  <option value="email">Email</option>
                  <option value="meeting">Uchrashtuv</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sana</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tavsif</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Tavsif kiriting..."
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : (
                    'Saqlash'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
