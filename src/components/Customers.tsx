import React, { useState } from 'react';
import { Search, Filter, Download, Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const initialCustomers = [
  {
    id: 1,
    name: 'Eleanor Pena',
    email: 'eleanor@mailchimp.com',
    company: 'Mailchimp',
    status: 'Active',
    spent: '$12,500',
    joined: 'Oct 24, 2024',
    avatar: 'https://picsum.photos/seed/eleanor/100/100',
  },
  {
    id: 2,
    name: 'Guy Hawkins',
    email: 'guy@gillette.com',
    company: 'Gillette',
    status: 'Active',
    spent: '$8,200',
    joined: 'Nov 12, 2024',
    avatar: 'https://picsum.photos/seed/guy/100/100',
  },
  {
    id: 3,
    name: 'Jerome Bell',
    email: 'jerome@google.com',
    company: 'Google',
    status: 'Inactive',
    spent: '$45,000',
    joined: 'Jan 05, 2025',
    avatar: 'https://picsum.photos/seed/jerome/100/100',
  },
  {
    id: 4,
    name: 'Kathryn Murphy',
    email: 'kathryn@apple.com',
    company: 'Apple',
    status: 'Active',
    spent: '$3,400',
    joined: 'Feb 18, 2025',
    avatar: 'https://picsum.photos/seed/kathryn/100/100',
  },
  {
    id: 5,
    name: 'Jacob Jones',
    email: 'jacob@spotify.com',
    company: 'Spotify',
    status: 'Active',
    spent: '$18,900',
    joined: 'Mar 02, 2025',
    avatar: 'https://picsum.photos/seed/jacob/100/100',
  },
  {
    id: 6,
    name: 'Kristin Watson',
    email: 'kristin@microsoft.com',
    company: 'Microsoft',
    status: 'Inactive',
    spent: '$2,100',
    joined: 'Mar 15, 2025',
    avatar: 'https://picsum.photos/seed/kristin/100/100',
  },
  {
    id: 7,
    name: 'Cody Fisher',
    email: 'cody@amazon.com',
    company: 'Amazon',
    status: 'Active',
    spent: '$32,000',
    joined: 'Apr 01, 2025',
    avatar: 'https://picsum.photos/seed/cody/100/100',
  }
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter logic
  const filteredCustomers = initialCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Customers
          </h1>
          <p className="text-slate-500 mt-1">Manage your customer base and their details.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search customers..." 
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
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={customer.avatar} 
                          alt={customer.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-sm font-semibold text-surface-900">{customer.name}</div>
                          <div className="text-xs text-slate-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{customer.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        customer.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-surface-900">{customer.spent}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">{customer.joined}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-surface-900">1</span> to <span className="font-medium text-surface-900">{filteredCustomers.length}</span> of <span className="font-medium text-surface-900">{initialCustomers.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-50 text-brand-600 text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50 text-sm font-medium transition-colors">
              2
            </button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-surface-900 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
