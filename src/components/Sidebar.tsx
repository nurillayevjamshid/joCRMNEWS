import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  PieChart, 
  Settings as SettingsIcon, 
  LogOut,
  ChevronRight,
  Trello
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Boshqaruv paneli' },
  { id: 'leads', icon: Trello, label: 'Lidlar (Kanban)' },
  { id: 'customers', icon: Users, label: 'Mijozlar' },
  { id: 'projects', icon: Briefcase, label: 'Loyihalar' },
  { id: 'calendar', icon: Calendar, label: 'Taqvim' },
  { id: 'messages', icon: MessageSquare, label: 'Xabarlar', badge: '3' },
  { id: 'analytics', icon: PieChart, label: 'Tahlillar' },
];

export function Sidebar({ isOpen, setIsOpen, activeView, setActiveView }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-100
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-50">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-500/20">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-surface-900">JoCRM</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Menyu</div>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-50 text-brand-600 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-surface-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-surface-900'} transition-colors`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-brand-100 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-8 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Boshqa</div>
          <button 
            onClick={() => {
              setActiveView('settings');
              setIsOpen(false);
            }}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${activeView === 'settings'
                ? 'bg-brand-50 text-brand-600 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-surface-900'}
            `}
          >
            <SettingsIcon className={`w-5 h-5 ${activeView === 'settings' ? 'text-brand-600' : 'text-slate-400 group-hover:text-surface-900'} transition-colors`} />
            <span>Sozlamalar</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center justify-between w-full p-2 rounded-xl group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center overflow-hidden border border-brand-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Foydalanuvchi" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-surface-900">{user?.displayName || user?.email?.split('@')[0] || 'Foydalanuvchi'}</div>
                <div className="text-xs text-slate-500">{user?.email || ''}</div>
              </div>
            </div>
            <button 
              onClick={async () => { await logout(); }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
