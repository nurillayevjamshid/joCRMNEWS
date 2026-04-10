import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Video, Users, X, Loader2, Trash2, Edit3 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time: string;
  type: string; // 'video' | 'location'
  color: string;
  attendees: number;
  description?: string;
  createdAt?: any;
}

const colorStyles: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600 border-brand-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
};

const dotColors: Record<string, string> = {
  brand: 'bg-brand-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

const colorOptions = [
  { id: 'brand', label: 'Ko\'k', ring: 'ring-brand-500' },
  { id: 'emerald', label: 'Yashil', ring: 'ring-emerald-500' },
  { id: 'purple', label: 'Binafsha', ring: 'ring-purple-500' },
  { id: 'amber', label: 'Sariq', ring: 'ring-amber-500' },
  { id: 'rose', label: 'Qizil', ring: 'ring-rose-500' },
];

const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
const dayNames = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

const emptyForm = {
  title: '',
  date: '',
  time: '',
  type: 'video',
  color: 'brand',
  attendees: 1,
  description: '',
};

export function CalendarView() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('calendarEvents', (data) => {
      setEvents(data as CalendarEvent[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(1);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date().getDate());
  };

  // Tanlangan kun uchun YYYY-MM-DD format
  const selectedDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

  // Tanlangan kundagi tadbirlar
  const selectedDateEvents = events.filter(e => e.date === selectedDateStr);

  // Berilgan kundagi tadbirlarni olish
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: selectedDateStr,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      type: event.type || 'video',
      color: event.color || 'brand',
      attendees: event.attendees || 1,
      description: event.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await dataService.updateData('calendarEvents', editingId, form);
        addToast('success', 'Tadbir muvaffaqiyatli yangilandi!');
      } else {
        await dataService.saveData('calendarEvents', form);
        addToast('success', 'Tadbir muvaffaqiyatli qo\'shildi!');
      }
      setIsModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Tadbirni saqlashda xatolik:", error);
      addToast('error', "Tadbirni saqlashda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatanam bu tadbirni o'chirmoqchimisiz?")) {
      try {
        await dataService.deleteData('calendarEvents', id);
        addToast('success', "Tadbir muvaffaqiyatli o'chirildi");
      } catch (error) {
        console.error("Tadbirni o'chirishda xatolik:", error);
        addToast('error', "Tadbirni o'chirishda xatolik yuz berdi");
      }
    }
  };

  // Formatlash: "2026-04-15" -> "15 Aprel, 2026"
  const formatSelectedDate = () => {
    return `${selectedDay} ${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Taqvim
          </h1>
          <p className="text-slate-500 mt-1">Jadval va yaqinlashayotgan uchrashuvlarni boshqarish.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={goToToday}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Bugun
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tadbir qo'shish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-surface-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square rounded-2xl border border-transparent p-2 opacity-30"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isSelected = day === selectedDay;
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              const dayEvents = getEventsForDay(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-start pt-3 transition-all duration-200
                    ${isSelected 
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30' 
                      : isToday
                        ? 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                        : 'bg-slate-50/50 text-slate-700 border border-slate-100 hover:bg-slate-100 hover:border-slate-200'}
                  `}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>{day}</span>
                  
                  <div className="flex gap-1 mt-auto pb-2">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : dotColors[event.color] || 'bg-slate-300'}`} 
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : 'bg-slate-300'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex flex-col h-full min-h-[500px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-surface-900">Jadval</h2>
              <p className="text-sm text-slate-500">{formatSelectedDate()}</p>
            </div>
            {selectedDateEvents.length > 0 && (
              <span className="bg-brand-50 text-brand-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {selectedDateEvents.length} ta
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className={`p-4 rounded-2xl border ${colorStyles[event.color] || 'bg-slate-50 text-slate-600 border-slate-200'} transition-all hover:shadow-md group relative`}>
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-brand-600 transition-colors shadow-sm"
                        title="Tahrirlash"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-rose-600 transition-colors shadow-sm"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-semibold mb-2 pr-16">{event.title}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs opacity-80 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs opacity-80 font-medium">
                        {event.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                        <span>{event.type === 'video' ? 'Onlayn uchrashuv' : 'Shaxsiy uchrashuv'}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs opacity-80 font-medium pt-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{event.attendees} ishtirokchi</span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="mt-3 text-xs opacity-60 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900">Tadbirlar yo'q</h4>
                <p className="text-xs text-slate-500 mt-1">Bu kunda rejalashtirilgan tadbir mavjud emas</p>
                <button
                  onClick={openAddModal}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 text-sm font-medium rounded-xl hover:bg-brand-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tadbir qo'shish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-surface-900">
                {editingId ? 'Tadbirni tahrirlash' : 'Yangi tadbir qo\'shish'}
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
                <label className="block text-sm font-medium text-slate-700">Tadbir nomi</label>
                <input 
                  required
                  type="text" 
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="masalan: Jamoa yig'ilishi"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Sana</label>
                  <input 
                    required
                    type="date" 
                    value={form.date}
                    onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Vaqt</label>
                  <input 
                    required
                    type="text" 
                    value={form.time}
                    onChange={(e) => setForm({...form, time: e.target.value})}
                    placeholder="10:00 - 11:00"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Tadbir turi</label>
                  <select 
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  >
                    <option value="video">Onlayn uchrashuv</option>
                    <option value="location">Shaxsiy uchrashuv</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Ishtirokchilar</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={form.attendees}
                    onChange={(e) => setForm({...form, attendees: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Rang</label>
                <div className="flex gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm({...form, color: c.id})}
                      className={`w-9 h-9 rounded-full ${dotColors[c.id]} flex items-center justify-center transition-all ${
                        form.color === c.id ? `ring-2 ring-offset-2 ${c.ring} scale-110` : 'hover:scale-105'
                      }`}
                      title={c.label}
                    >
                      {form.color === c.id && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Tavsif</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Tadbir haqida qisqacha..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none resize-none"
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
    </div>
  );
}
