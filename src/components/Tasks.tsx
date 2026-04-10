import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Clock, Loader2, X, Trash2, Edit3, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  assignedTo: string;
  followUp: boolean;
  relatedTo?: {
    type: 'customer' | 'project';
    id: string;
    name: string;
  };
  createdAt?: any;
  updatedAt?: any;
}

const priorityMap: Record<string, string> = {
  'high': 'Yuqori',
  'medium': "O'rtacha",
  'low': 'Past',
};

const priorityColors: Record<string, string> = {
  'high': 'bg-rose-50 text-rose-600',
  'medium': 'bg-amber-50 text-amber-600',
  'low': 'bg-slate-50 text-slate-600',
};

const statusMap: Record<string, string> = {
  'pending': 'Bajarilmoqda',
  'completed': 'Bajarildi',
};

const normalizeStatus = (status: string) => statusMap[status] || status;

const emptyForm = {
  title: '',
  description: '',
  deadline: '',
  time: '09:00',
  priority: 'medium' as const,
  status: 'pending' as const,
  assignedTo: '',
  followUp: false,
  relatedTo: undefined,
};

export function Tasks() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Barchasi');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('tasks', (data) => {
      setTasks(data as Task[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const titleMatch = (task.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const descriptionMatch = (task.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const assigneeMatch = (task.assignedTo?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descriptionMatch || assigneeMatch;

    const matchesPriority = priorityFilter === 'Barchasi' || priorityMap[task.priority] === priorityFilter;
    const matchesStatus = statusFilter === 'Barchasi' || normalizeStatus(task.status) === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingId(task.id);
    setForm({
      title: task.title || '',
      description: task.description || '',
      deadline: task.deadline || '',
      time: task.time || '09:00',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      assignedTo: task.assignedTo || '',
      followUp: task.followUp || false,
      relatedTo: task.relatedTo,
    });
    setMenuOpenId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast('error', 'Vazifa nomi majburiy');
      return;
    }
    if (!form.deadline) {
      addToast('error', 'Muddat majburiy');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await dataService.updateData('tasks', editingId, form);
        addToast('success', 'Vazifa muvaffaqiyatli yangilandi!');
      } else {
        await dataService.saveData('tasks', form);
        addToast('success', 'Vazifa muvaffaqiyatli qo\'shildi!');
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Vazifani saqlashda xatolik:", error);
      addToast('error', "Vazifani saqlashda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatanam bu vazifani o'chirmoqchimisiz?")) {
      try {
        await dataService.deleteData('tasks', id);
        setMenuOpenId(null);
        addToast('success', "Vazifa muvaffaqiyatli o'chirildi");
      } catch (error) {
        console.error("Vazifani o'chirishda xatolik:", error);
        addToast('error', "Vazifani o'chirishda xatolik yuz berdi");
      }
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await dataService.updateData('tasks', task.id, { status: newStatus });
      addToast('success', newStatus === 'completed' ? 'Vazifa bajarildi!' : 'Vazifa qayta ochildi');
    } catch (error) {
      console.error("Vazifa holatini o'zgartirishda xatolik:", error);
      addToast('error', "Holatni o'zgartirishda xatolik yuz berdi");
    }
  };

  const getPriorityColor = (priority: string) => priorityColors[priority] || 'bg-slate-50 text-slate-600';

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Vazifalar
          </h1>
          <p className="text-slate-500 mt-1">Vazifalarni boshqarish va kuzatish.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi vazifa
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Vazifalarni qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer transition-all"
            >
              <option value="Barchasi">Barcha muhimlik</option>
              <option value="Yuqori">Yuqori</option>
              <option value="O'rtacha">O'rtacha</option>
              <option value="Past">Past</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none cursor-pointer transition-all"
            >
              <option value="Barchasi">Barcha holat</option>
              <option value="Bajarilmoqda">Bajarilmoqda</option>
              <option value="Bajarildi">Bajarildi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Vazifalar yuklanmoqda...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md hover:shadow-slate-200/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task)}
                    className="mt-1 flex-shrink-0 transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-brand-500" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3 className={`font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-surface-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{task.deadline} {task.time}</span>
                      </div>

                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                        {priorityMap[task.priority]}
                      </span>

                      {task.followUp && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600">
                          Qayta bog'lanish
                        </span>
                      )}

                      {task.assignedTo && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setMenuOpenId(menuOpenId === task.id ? null : task.id)}
                    className="p-1.5 text-slate-400 hover:text-surface-900 rounded-lg hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {menuOpenId === task.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20 min-w-[140px]">
                      <button
                        onClick={() => openEditModal(task)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        O'chirish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-400 font-medium">📋</span>
            </div>
            <p className="text-sm italic">Vazifalar yo'q.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-surface-900">
                {editingId ? 'Vazifani tahrirlash' : 'Yangi vazifa'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-surface-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-2">Vazifa nomi *</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Vazifa nomini kiriting..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-2">Tavsif</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Vazifa tavsifini kiriting..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Muddat *</label>
                  <input 
                    type="date" 
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Vaqt</label>
                  <input 
                    type="time" 
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Muhimlik</label>
                  <select 
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="low">Past</option>
                    <option value="medium">O'rtacha</option>
                    <option value="high">Yuqori</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-2">Holat</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="pending">Bajarilmoqda</option>
                    <option value="completed">Bajarildi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-2">Mas'ul shaxs</label>
                <input 
                  type="text" 
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  placeholder="Mas'ul shaxsni kiriting..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input 
                  type="checkbox" 
                  id="followUp"
                  checked={form.followUp}
                  onChange={(e) => setForm({ ...form, followUp: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <label htmlFor="followUp" className="text-sm font-medium text-surface-900 cursor-pointer">
                  Bu qayta bog'lanish vazifasi
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : editingId ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
