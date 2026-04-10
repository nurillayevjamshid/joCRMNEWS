import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Customers } from './components/Customers';
import { Projects } from './components/Projects';
import { CalendarView } from './components/CalendarView';
import { Messages } from './components/Messages';
import { Analytics } from './components/Analytics';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-surface-50 flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        <main className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
          <Header setSidebarOpen={setSidebarOpen} />
          
          <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'customers' && <Customers />}
            {activeView === 'projects' && <Projects />}
            {activeView === 'calendar' && <CalendarView />}
            {activeView === 'messages' && <Messages />}
            {activeView === 'analytics' && <Analytics />}
            {activeView === 'settings' && <Settings />}
            {activeView !== 'dashboard' && activeView !== 'customers' && activeView !== 'projects' && activeView !== 'calendar' && activeView !== 'messages' && activeView !== 'analytics' && activeView !== 'settings' && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-slate-400 font-medium">Tez kunda</span>
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900">Bo'lim ishlanmoqda</h2>
                <p className="text-slate-500 mt-2">Bu funksiya ustida ish olib borilmoqda.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}


