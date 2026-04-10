import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Customers } from './components/Customers';
import { Projects } from './components/Projects';
import { CalendarView } from './components/CalendarView';
import { Messages } from './components/Messages';
import { Analytics } from './components/Analytics';
import { ClientProfile } from './components/ClientProfile';
import { LeadsKanban } from './components/LeadsKanban';
import { Tasks } from './components/Tasks';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Loader2 } from 'lucide-react';

function MainContent({ activeView }: { activeView: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentView, setCurrentView] = useState(activeView);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (activeView !== currentView) {
      setIsAnimating(true);
      setIsVisible(false);
      // Eski sahifani yo'qotish
      const timeout = setTimeout(() => {
        setCurrentView(activeView);
        setIsAnimating(false);
        // Yangi sahifani ko'rsatish
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(true);
    }
  }, [activeView, currentView]);

  const renderView = () => {
    // Handle clientProfile:{id} format
    if (currentView.startsWith('clientProfile:')) {
      const customerId = currentView.split(':')[1];
      return (
        <ClientProfile
          customerId={customerId}
          onBack={() => setCurrentView('customers')}
        />
      );
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <LeadsKanban />;
      case 'customers': return <Customers onSelectCustomer={(id) => setCurrentView(`clientProfile:${id}`)} />;
      case 'projects': return <Projects />;
      case 'tasks': return <Tasks />;
      case 'calendar': return <CalendarView />;
      case 'messages': return <Messages />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-slate-400 font-medium">Tez kunda</span>
            </div>
            <h2 className="text-xl font-display font-bold text-surface-900">Bo'lim ishlanmoqda</h2>
            <p className="text-slate-500 mt-2">Bu funksiya ustida ish olib borilmoqda.</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="transition-all duration-300 ease-out"
      style={{
        opacity: isAnimating ? 0 : isVisible ? 1 : 0,
        transform: isAnimating ? 'translateY(8px)' : isVisible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {renderView()}
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 animate-pulse">
            <span className="text-white font-bold text-2xl">Jo</span>
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
            <span className="text-sm text-slate-500">Yuklanmoqda...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
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
              <MainContent activeView={activeView} />
            </div>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
