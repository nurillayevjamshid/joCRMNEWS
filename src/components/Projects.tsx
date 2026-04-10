import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Clock, Loader2, X, Trash2, Edit3 } from 'lucide-react';
import { dataService } from '../services/dataService';

interface Project {
  id: string;
  title: string;
  client: string;
  status: string;
  progress: number;
  dueDate: string;
  team: string[];
  createdAt?: any;
}

const statusStyles: Record<string, string> = {
  'Jarayonda': 'bg-brand-50 text-brand-600',
  'Bajarildi': 'bg-emerald-50 text-emerald-600',
  'Rejalashtirilmoqda': 'bg-purple-50 text-purple-600',
  'To\'xtatilgan': 'bg-amber-50 text-amber-600',
  'In Progress': 'bg-brand-50 text-brand-600',
  'Completed': 'bg-emerald-50 text-emerald-600',
  'Planning': 'bg-purple-50 text-purple-600',
  'On Hold': 'bg-amber-50 text-amber-600',
};

const progressColors: Record<string, string> = {
  'Jarayonda': 'bg-brand-500',
  'Bajarildi': 'bg-emerald-500',
  'Rejalashtirilmoqda': 'bg-purple-500',
  'To\'xtatilgan': 'bg-amber-500',
  'In Progress': 'bg-brand-500',
  'Completed': 'bg-emerald-500',
  'Planning': 'bg-purple-500',
  'On Hold': 'bg-amber-500',
};

const statusMap: Record<string, string> = {
  'In Progress': 'Jarayonda',
  'Completed': 'Bajarildi',
  'Planning': 'Rejalashtirilmoqda',
  'On Hold': "To'xtatilgan",
};

const normalizeStatus = (status: string) => statusMap[status] || status;

const emptyForm = {
  title: '',
  client: '',
  status: 'Rejalashtirilmoqda',
  progress: 0,
  dueDate: '',
  team: [] as string[],
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('projects', (data) => {
      setProjects(data as Project[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = projects.filter(project => {
    const titleMatch = (project.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const clientMatch = (project.client?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || clientMatch;
    const normalizedStatus = normalizeStatus(project.status);
    const matchesStatus = statusFilter === 'Barchasi' || normalizedStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || '',
      client: project.client || '',
      status: normalizeStatus(project.status),
      progress: project.progress || 0,
      dueDate: project.dueDate || '',
      team: project.team || [],
    });
    setMenuOpenId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await dataService.updateData('projects', editingId, form);
      } else {
        await dataService.saveData('projects', form);
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Loyihani saqlashda xatolik:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatanam bu loyihani o'chirmoqchimisiz?")) {
      try {
        await dataService.deleteData('projects', id);
        setMenuOpenId(null);
      } catch (error) {
        console.error("Loyihani o'chirishda xatolik:", error);
      }
    }
  };

  const getProgressColor = (status: string) => progressColors[status] || progressColors[normalizeStatus(status)] || 'bg-slate-400';
  const getStatusStyle = (status: string) => statusStyles[status] || statusStyles[normalizeStatus(status)] || 'bg-slate-50 text-slate-600';

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Loyihalar
          </h1>
          <p className="text-slate-500 mt-1">Loyihalarni kuzatish va boshqarish.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi loyiha
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Loyihalarni qidirish..." 
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
              <option value="Jarayonda">Jarayonda</option>
              <option value="Rejalashtirilmoqda">Rejalashtirilmoqda</option>
              <option value="Bajarildi">Bajarildi</option>
              <option value="To'xtatilgan">To'xtatilgan</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[300px]">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Loyihalar yuklanmoqda...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md hover:shadow-slate-200/30 transition-all group shrink-0 relative">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(project.status)}`}>
                  {normalizeStatus(project.status)}
                </span>
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpenId(menuOpenId === project.id ? null : project.id)}
                    className="p-1.5 text-slate-400 hover:text-surface-900 rounded-lg hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {menuOpenId === project.id && (
                    <div className="absolute right-0 top-8 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20 min-w-[140px]">
                      <button
                        onClick={() => openEditModal(project)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        O'chirish
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-surface-900 mb-1">{project.title}</h3>
                <p className="text-sm text-slate-500">Mijoz: <span className="font-medium text-slate-700">{project.client}</span></p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Progress</span>
                  <span className="font-bold text-surface-900">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(project.status)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">{project.dueDate || "Sana yo'q"}</span>
                </div>
                
                <div className="flex items-center -space-x-2">
                  {(project.team || []).slice(0, 3).map((avatar, index) => (
                    <img 
                      key={index}
                      src={avatar} 
                      alt="Jamoa a'zosi" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  {(!project.team || project.team.length === 0) && (
                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 relative z-0">
                      <Plus className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 border-dashed">
            Loyihalar topilmadi.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-surface-900">
                {editingId ? 'Loyihani tahrirlash' : 'Yangi loyiha qo\'shish'}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Loyiha nomi</label>
                <input 
                  required
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="masalan: Veb-sayt qayta ishlab chiqish"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Mijoz</label>
                <input 
                  required
                  type="text" 
                  value={form.client}
                  onChange={(e) => setForm({...form, client: e.target.value})}
                  placeholder="Kompaniya yoki shaxs nomi"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Holat</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  >
                    <option value="Rejalashtirilmoqda">Rejalashtirilmoqda</option>
                    <option value="Jarayonda">Jarayonda</option>
                    <option value="Bajarildi">Bajarildi</option>
                    <option value="To'xtatilgan">To'xtatilgan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Progress ({form.progress}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={form.progress}
                    onChange={(e) => setForm({...form, progress: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Tugash sanasi</label>
                <input 
                  type="date" 
                  value={form.dueDate}
                  onChange={(e) => setForm({...form, dueDate: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {menuOpenId && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
      )}
    </div>
  );
}
