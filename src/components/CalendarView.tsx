import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Video, Users } from 'lucide-react';

const mockEvents = [
  { id: 1, date: 12, title: 'Haftalik jamoa yig\'ilishi', time: '10:00 - 11:00', type: 'video', color: 'brand', attendees: 5 },
  { id: 2, date: 15, title: 'Mijoz taqdimoti: Apple', time: '14:00 - 15:30', type: 'location', color: 'emerald', attendees: 3 },
  { id: 3, date: 15, title: 'Dizayn ko\'rib chiqish', time: '16:00 - 17:00', type: 'video', color: 'purple', attendees: 4 },
  { id: 4, date: 18, title: '3-chorak marketing strategiyasi', time: '09:00 - 11:00', type: 'video', color: 'amber', attendees: 6 },
  { id: 5, date: 22, title: 'Mailchimp CEO bilan tushlik', time: '12:30 - 14:00', type: 'location', color: 'rose', attendees: 2 },
  { id: 6, date: 25, title: 'Mahsulot chiqarishga tayyorgarlik', time: '11:00 - 13:00', type: 'video', color: 'brand', attendees: 8 },
];

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

const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
const dayNames = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

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

  const selectedDateEvents = mockEvents.filter(e => e.date === selectedDay);

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
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button className="px-4 py-1.5 text-sm font-medium bg-slate-100 text-surface-900 rounded-lg">Oy</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-surface-900 rounded-lg transition-colors">Hafta</button>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tadbir qo'shish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              const dayEvents = mockEvents.filter(e => e.date === day);

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

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex flex-col h-full min-h-[500px]">
          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-surface-900">Jadval</h2>
            <p className="text-sm text-slate-500">
              {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className={`p-4 rounded-2xl border ${colorStyles[event.color] || 'bg-slate-50 text-slate-600 border-slate-200'} transition-all hover:shadow-md`}>
                    <h4 className="font-semibold mb-2">{event.title}</h4>
                    
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
                    
                    <div className="mt-4 flex -space-x-2">
                      {Array.from({ length: Math.min(event.attendees, 4) }).map((_, i) => (
                        <img 
                          key={i}
                          src={`https://picsum.photos/seed/${event.id}${i}/100/100`} 
                          alt="Ishtirokchi" 
                          className="w-7 h-7 rounded-full border-2 border-white/50 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {event.attendees > 4 && (
                        <div className="w-7 h-7 rounded-full bg-black/10 border-2 border-white/50 flex items-center justify-center text-[9px] font-bold">
                          +{event.attendees - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900">Tadbirlar yo'q</h4>
                <p className="text-xs text-slate-500 mt-1">Bo'sh vaqtingiz bilan dam oling!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
