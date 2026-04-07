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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

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
                  <span className="text-slate-400 font-medium">Coming Soon</span>
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900">Section under construction</h2>
                <p className="text-slate-500 mt-2">We're working hard to bring you this feature.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}


