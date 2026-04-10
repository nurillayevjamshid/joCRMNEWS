import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, ChevronLeft, ChevronRight, X, Loader2, Mail, Building2, Trash2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';
import { SkeletonCustomerRow } from './Skeleton';
import { EmptyCustomers, EmptySearch } from './EmptyState';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  spent: string;
  joined: string;
  avatar: string;
  createdAt?: any;
}

export function Customers() {
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: '',
    status: 'Faol',
    spent: '$0',
    joined: new Date().toLocaleDateString('uz-UZ', { month: 'short', day: '2-digit', year: 'numeric' }),
    avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
  });

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('customers', (data) => {
      setCustomers(data as Customer[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dataService.saveData('customers', newCustomer);
      console.log('[Mijoz qo\'shildi]', result);
      addToast('success', 'Mijoz muvaffaqiyatli qo\'shildi!');
      setIsAddModalOpen(false);
      setNewCustomer({
        name: '',
        email: '',
        company: '',
        status: 'Faol',
        spent: '$0',
        joined: new Date().toLocaleDateString('uz-UZ', { month: 'short', day: '2-digit', year: 'numeric' }),
        avatar: `https://picsum.photos/seed/${Date.now()}/100/100`,
      });
    } catch (error) {
      console.error("Mijoz qo'shishda xatolik:", error);
      addToast('error', "Mijoz qo'shishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    setDeletingId(id);
    try {
      await dataService.deleteData('customers', id);
      addToast('success', 'Mijoz muvaffaqiyatli o\'chirildi');
    } catch (error) {
      console.error("Mijozni o'chirishda xatolik:", error);
      addToast('error', "Mijozni o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
    }
  };

  const normalizeStatus = (status: string) => {
    if (status === 'Active' || status === 'Faol') return 'Faol';
    if (status === 'Inactive' || status === 'Nofaol') return 'Nofaol';
    return status;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = (customer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (customer.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Barchasi' || normalizeStatus(customer.status) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Mijozlar
          </h1>
          <p className="text-slate-500 mt-1">Mijozlar bazasini boshqarish.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 active:scale-[0.97] transition-all shadow-sm shadow-brand-500/20 w-full sm:w-auto press-scale"
        >
          <Plus className="w-4 h-4" />
          Mijoz qo'shish
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Mijozlarni qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer transition-all"
              >
                <option value="Barchasi">Barcha holat</option>
                <option value="Faol">Faol</option>
                <option value="Nofaol">Nofaol</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors press-scale">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Eksport</span>
            </button>
          </div>
        </div>

        {/* Mobile: Card view / Desktop: Table view */}
        <div className="min-h-[400px]">
          {loading ? (
            /* ── Skeleton loading ───────────────────── */
            <>
              {/* Mobile skeleton cards */}
              <div className="sm:hidden p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="skeleton w-10 h-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="skeleton h-4 rounded-md w-28" />
                        <div className="skeleton h-3 rounded-md w-36" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="skeleton h-5 rounded-full w-16" />
                      <div className="skeleton h-5 rounded-md w-20" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop skeleton rows */}
              <div className="hidden sm:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Mijoz</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kompaniya</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Holat</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami sarflagan</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Qo'shilgan</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonCustomerRow key={i} />)}
                  </tbody>
                </table>
              </div>
            </>
          ) : filteredCustomers.length > 0 ? (
            <>
              {/* ── Mobile: Card view ────────────────── */}
              <div className="sm:hidden p-4 space-y-3">
                {filteredCustomers.map((customer, index) => (
                  <div 
                    key={customer.id} 
                    className="bg-white p-4 rounded-2xl border border-slate-100 hover:shadow-sm transition-all animate-stagger"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar} 
                          alt={customer.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-sm font-semibold text-surface-900">{customer.name}</div>
                          <div className="text-xs text-slate-500">{customer.email}</div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        normalizeStatus(customer.status) === 'Faol'
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {normalizeStatus(customer.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {customer.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {customer.spent}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400">{customer.joined}</span>
                      <button 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        disabled={deletingId === customer.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {deletingId === customer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop: Table view ─────────────── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Mijoz</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Kompaniya</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Holat</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami sarflagan</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Qo'shilgan</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((customer, index) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-slate-50/80 transition-colors group animate-stagger"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={customer.avatar} 
                              alt={customer.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="text-sm font-semibold text-surface-900">{customer.name}</div>
                              <div className="text-xs text-slate-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-700">{customer.company}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            normalizeStatus(customer.status) === 'Faol'
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {normalizeStatus(customer.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-surface-900">{customer.spent}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-500">{customer.joined}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleDeleteCustomer(customer.id)}
                              disabled={deletingId === customer.id}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                            >
                              {deletingId === customer.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                            <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* ── Empty state ──────────────────────── */
            <div className="py-4">
              {searchTerm ? (
                <EmptySearch query={searchTerm} />
              ) : (
                <EmptyCustomers onAdd={() => setIsAddModalOpen(true)} />
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredCustomers.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              <span className="font-medium text-surface-900">{filteredCustomers.length}</span> ta natija ko'rsatilmoqda
            </div>
            <div className="flex items-center gap-2">
              <button disabled className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 text-sm font-medium">
                1
              </button>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-surface-900">Yangi mijoz qo'shish</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">To'liq ism</label>
                  <input 
                    required
                    type="text" 
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    placeholder="masalan: Alisher Usmonov"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email manzil</label>
                  <input 
                    required
                    type="email" 
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="alisher@example.com"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kompaniya</label>
                  <input 
                    required
                    type="text" 
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                    placeholder="Kompaniya nomi"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Holat</label>
                  <select 
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  >
                    <option value="Faol">Faol</option>
                    <option value="Nofaol">Nofaol</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors press-scale"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 active:scale-[0.97] transition-all shadow-sm shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 press-scale"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
