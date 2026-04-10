import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface Order {
  id: string;
  customerId: string;
  orderId: string;
  date: any;
  amount: string;
  status: 'pending' | 'completed' | 'cancelled';
  items?: string;
  createdAt?: any;
}

interface ClientOrdersProps {
  customerId: string;
}

export function ClientOrders({ customerId }: ClientOrdersProps) {
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'pending' as const,
    items: '',
  });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('clientOrders', (data) => {
      const filteredOrders = (data as Order[])
        .filter(order => order.customerId === customerId)
        .sort((a, b) => {
          const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      setOrders(filteredOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId]);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.orderId.trim() || !newOrder.amount.trim()) {
      addToast('error', 'Buyurtma ID va miqdor to\'ldirilishi kerak');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.saveData('clientOrders', {
        customerId,
        orderId: newOrder.orderId,
        date: new Date(newOrder.date),
        amount: newOrder.amount,
        status: newOrder.status,
        items: newOrder.items,
      });
      addToast('success', 'Buyurtma qo\'shildi');
      setIsAddModalOpen(false);
      setNewOrder({
        orderId: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        status: 'pending',
        items: '',
      });
    } catch (error) {
      console.error('Buyurtma qo\'shishda xatolik:', error);
      addToast('error', 'Buyurtma qo\'shishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Haqiqatanam bu buyurtmani o\'chirmoqchimisiz?')) {
      try {
        await dataService.deleteData('clientOrders', id);
        addToast('success', 'Buyurtma o\'chirildi');
      } catch (error) {
        console.error('Buyurtmani o\'chirishda xatolik:', error);
        addToast('error', 'Buyurtmani o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Tugatilgan',
      pending: 'Kutilmoqda',
      cancelled: 'Bekor qilindi',
    };
    return labels[status] || status;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-surface-900 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-brand-600" />
          Buyurtmalar
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Qo'shish
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Buyurtmalar yuklanmoqda...</p>
          </div>
        ) : orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Buyurtma ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sana</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Miqdor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tovarlar</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-surface-900">{order.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{formatDate(order.date)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-surface-900">{order.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 truncate">{order.items || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-500 text-sm">Hali buyurtma yo'q</p>
          </div>
        )}
      </div>

      {/* Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-surface-900">Buyurtma qo'shish</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-surface-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Buyurtma ID</label>
                <input
                  type="text"
                  value={newOrder.orderId}
                  onChange={(e) => setNewOrder({ ...newOrder, orderId: e.target.value })}
                  placeholder="Buyurtma ID kiriting..."
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sana</label>
                <input
                  type="date"
                  value={newOrder.date}
                  onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Miqdor</label>
                <input
                  type="text"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                  placeholder="Masalan: $1,200"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Holat</label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="completed">Tugatilgan</option>
                  <option value="cancelled">Bekor qilindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tovarlar (ixtiyoriy)</label>
                <textarea
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                  placeholder="Tovarlar ro'yxatini kiriting..."
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  rows={2}
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
