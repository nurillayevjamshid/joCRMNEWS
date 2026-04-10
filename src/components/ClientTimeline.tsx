import React, { useState, useEffect } from 'react';
import { Loader2, Clock, MessageSquare, Phone, Mail, Calendar, ShoppingCart } from 'lucide-react';
import { dataService } from '../services/dataService';

interface TimelineItem {
  id: string;
  type: 'note' | 'history' | 'order';
  title: string;
  description: string;
  date: any;
  metadata?: any;
}

interface ClientTimelineProps {
  customerId: string;
}

export function ClientTimeline({ customerId }: ClientTimelineProps) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        setLoading(true);
        const timelineItems: TimelineItem[] = [];

        // Load notes
        const notesData = await dataService.getCollection('clientNotes');
        const notes = (notesData as any[]).filter(note => note.customerId === customerId);
        notes.forEach(note => {
          timelineItems.push({
            id: `note-${note.id}`,
            type: 'note',
            title: 'Eslatma',
            description: note.content,
            date: note.createdAt,
          });
        });

        // Load history
        const historyData = await dataService.getCollection('clientHistory');
        const history = (historyData as any[]).filter(event => event.customerId === customerId);
        history.forEach(event => {
          timelineItems.push({
            id: `history-${event.id}`,
            type: 'history',
            title: getHistoryTypeLabel(event.type),
            description: event.description,
            date: event.date,
            metadata: { eventType: event.type },
          });
        });

        // Load orders
        const ordersData = await dataService.getCollection('clientOrders');
        const orders = (ordersData as any[]).filter(order => order.customerId === customerId);
        orders.forEach(order => {
          timelineItems.push({
            id: `order-${order.id}`,
            type: 'order',
            title: `Buyurtma #${order.orderId}`,
            description: `${order.amount} - ${getOrderStatusLabel(order.status)}`,
            date: order.date,
            metadata: { amount: order.amount, status: order.status },
          });
        });

        // Sort by date descending
        timelineItems.sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setItems(timelineItems);
      } catch (error) {
        console.error('Timeline ma\'lumotlarini yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineData();
  }, [customerId]);

  const getHistoryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      call: 'Qo\'ng\'iroq',
      email: 'Email',
      meeting: 'Uchrashtuv',
      other: 'Boshqa',
    };
    return labels[type] || type;
  };

  const getOrderStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Tugatilgan',
      pending: 'Kutilmoqda',
      cancelled: 'Bekor qilindi',
    };
    return labels[status] || status;
  };

  const getTimelineIcon = (type: string, metadata?: any) => {
    if (type === 'note') {
      return <MessageSquare className="w-4 h-4 text-purple-500" />;
    } else if (type === 'history') {
      const eventType = metadata?.eventType;
      if (eventType === 'call') return <Phone className="w-4 h-4 text-blue-500" />;
      if (eventType === 'email') return <Mail className="w-4 h-4 text-indigo-500" />;
      if (eventType === 'meeting') return <Calendar className="w-4 h-4 text-emerald-500" />;
      return <Clock className="w-4 h-4 text-slate-500" />;
    } else if (type === 'order') {
      return <ShoppingCart className="w-4 h-4 text-orange-500" />;
    }
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  const getTimelineColor = (type: string, metadata?: any) => {
    if (type === 'note') return 'bg-purple-50';
    if (type === 'history') {
      const eventType = metadata?.eventType;
      if (eventType === 'call') return 'bg-blue-50';
      if (eventType === 'email') return 'bg-indigo-50';
      if (eventType === 'meeting') return 'bg-emerald-50';
      return 'bg-slate-50';
    }
    if (type === 'order') return 'bg-orange-50';
    return 'bg-slate-50';
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
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-display font-bold text-surface-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-600" />
          Vaqt chizig'i
        </h2>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Vaqt chizig'i yuklanmoqda...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${getTimelineColor(item.type, item.metadata)} flex items-center justify-center`}>
                    {getTimelineIcon(item.type, item.metadata)}
                  </div>
                  {index < items.length - 1 && (
                    <div className="w-0.5 h-16 bg-slate-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-500 text-sm">Hali ma\'lumot yo\'q</p>
          </div>
        )}
      </div>
    </div>
  );
}
