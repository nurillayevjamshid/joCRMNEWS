import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Settings() {
  const [activeTab, setActiveTab] = useState('appearance');
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const accentColors = [
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { id: 'rose', name: 'Rose', color: 'bg-rose-500', ring: 'ring-rose-500' },
    { id: 'amber', name: 'Amber', color: 'bg-amber-500', ring: 'ring-amber-500' },
    { id: 'blue', name: 'Blue', color: 'bg-blue-500', ring: 'ring-blue-500' },
    { id: 'violet', name: 'Violet', color: 'bg-violet-500', ring: 'ring-violet-500' },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-100 p-6">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-brand-600 shadow-sm border border-slate-100 font-medium'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-surface-900'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 sm:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Profile Information</h3>
                <div className="flex items-center gap-6 mb-6">
                  <img 
                    src="https://picsum.photos/seed/avatar1/100/100" 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-surface-900 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                    <input type="text" defaultValue="Morgan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input type="email" defaultValue="alex.morgan@auracrm.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Role</label>
                    <input type="text" defaultValue="Sales Director" disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily summary emails.' },
                  { title: 'Push Notifications', desc: 'Get notified instantly on your device.' },
                  { title: 'SMS Alerts', desc: 'Receive text messages for urgent alerts.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-surface-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
                  </div>
                  <div className="pt-2">
                    <button className="px-6 py-2.5 bg-surface-900 text-white text-sm font-medium rounded-xl hover:bg-surface-800 transition-colors shadow-sm">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                  <div>
                    <h4 className="text-sm font-semibold text-surface-900">Authenticator App</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Use an app like Google Authenticator to secure your account.</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-surface-900 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-50/30' : 'border-transparent hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className="w-full h-20 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="h-4 bg-slate-100 border-b border-slate-200"></div>
                      <div className="flex-1 p-2 flex gap-2">
                        <div className="w-4 h-full bg-slate-100 rounded"></div>
                        <div className="flex-1 h-full bg-slate-50 rounded"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'light' ? 'text-brand-700' : 'text-slate-600'}`}>Light</span>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-brand-500 bg-brand-50/30' : 'border-transparent hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className="w-full h-20 bg-slate-900 rounded-lg border border-slate-700 shadow-sm flex flex-col overflow-hidden">
                      <div className="h-4 bg-slate-800 border-b border-slate-700"></div>
                      <div className="flex-1 p-2 flex gap-2">
                        <div className="w-4 h-full bg-slate-800 rounded"></div>
                        <div className="flex-1 h-full bg-slate-800/50 rounded"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-brand-700' : 'text-slate-600'}`}>Dark</span>
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-brand-500 bg-brand-50/30' : 'border-transparent hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className="w-full h-20 bg-gradient-to-br from-white to-slate-900 rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="h-4 bg-slate-200 border-b border-slate-300"></div>
                      <div className="flex-1 p-2 flex gap-2">
                        <div className="w-4 h-full bg-slate-200 rounded"></div>
                        <div className="flex-1 h-full bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${theme === 'system' ? 'text-brand-700' : 'text-slate-600'}`}>System</span>
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-display font-bold text-surface-900 mb-4">Accent Color</h3>
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((accent) => (
                    <button
                      key={accent.name}
                      onClick={() => setAccentColor(accent.id)}
                      className={`w-10 h-10 rounded-full ${accent.color} flex items-center justify-center transition-all ${
                        accentColor === accent.id ? `ring-2 ring-offset-2 ${accent.ring}` : 'hover:scale-110'
                      }`}
                      title={accent.name}
                    >
                      {accentColor === accent.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
