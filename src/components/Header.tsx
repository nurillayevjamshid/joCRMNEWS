import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { notificationService } from '../services/notificationService';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    };

    loadUnreadCount();

    const unsubscribe = notificationService.subscribeToNotifications(async () => {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-surface-900">Boshqaruv paneli</span>
            <span>/</span>
            <span>Umumiy ko'rinish</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              className="w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-surface-900"
            />
          </div>
          
          {/* Mobile search button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-full text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-2 rounded-full text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-900 transition-colors" />
            )}
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-surface-900 leading-tight">
                {user?.email?.split('@')[0] || 'Foydalanuvchi'}
              </span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center overflow-hidden border border-brand-200">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 ml-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Center */}
        <NotificationCenter 
          isOpen={isNotificationCenterOpen} 
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </header>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden animate-in fade-in duration-200">
          <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Qidirish..."
              autoFocus
              className="flex-1 text-lg font-medium text-surface-900 focus:outline-none bg-transparent placeholder:text-slate-400"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-surface-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500">Qidirish natijalari bu yerda ko'rinadi...</p>
          </div>
        </div>
      )}
    </>
  );
}
