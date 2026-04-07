import React, { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Clock } from 'lucide-react';

const initialProjects = [
  {
    id: 1,
    title: 'E-commerce Redesign',
    client: 'Mailchimp',
    status: 'In Progress',
    progress: 65,
    dueDate: 'Oct 24, 2025',
    team: [
      'https://picsum.photos/seed/eleanor/100/100',
      'https://picsum.photos/seed/guy/100/100',
      'https://picsum.photos/seed/jerome/100/100',
    ],
  },
  {
    id: 2,
    title: 'Mobile App Development',
    client: 'Gillette',
    status: 'Planning',
    progress: 15,
    dueDate: 'Nov 12, 2025',
    team: [
      'https://picsum.photos/seed/kathryn/100/100',
      'https://picsum.photos/seed/jacob/100/100',
    ],
  },
  {
    id: 3,
    title: 'Marketing Campaign',
    client: 'Google',
    status: 'Completed',
    progress: 100,
    dueDate: 'Jan 05, 2025',
    team: [
      'https://picsum.photos/seed/kristin/100/100',
      'https://picsum.photos/seed/cody/100/100',
      'https://picsum.photos/seed/eleanor/100/100',
    ],
  },
  {
    id: 4,
    title: 'Brand Identity',
    client: 'Apple',
    status: 'On Hold',
    progress: 45,
    dueDate: 'Feb 18, 2025',
    team: [
      'https://picsum.photos/seed/guy/100/100',
    ],
  },
  {
    id: 5,
    title: 'CRM Integration',
    client: 'Spotify',
    status: 'In Progress',
    progress: 80,
    dueDate: 'Mar 02, 2025',
    team: [
      'https://picsum.photos/seed/jerome/100/100',
      'https://picsum.photos/seed/jacob/100/100',
    ],
  },
  {
    id: 6,
    title: 'SEO Optimization',
    client: 'Microsoft',
    status: 'In Progress',
    progress: 30,
    dueDate: 'Mar 15, 2025',
    team: [
      'https://picsum.photos/seed/cody/100/100',
      'https://picsum.photos/seed/kristin/100/100',
    ],
  }
];

const statusStyles = {
  'In Progress': 'bg-brand-50 text-brand-600',
  'Completed': 'bg-emerald-50 text-emerald-600',
  'Planning': 'bg-purple-50 text-purple-600',
  'On Hold': 'bg-amber-50 text-amber-600',
};

const progressColors = {
  'In Progress': 'bg-brand-500',
  'Completed': 'bg-emerald-500',
  'Planning': 'bg-purple-500',
  'On Hold': 'bg-amber-500',
};

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = initialProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 tracking-tight">
            Projects
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your ongoing projects.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/20 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search projects..." 
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
              <option value="In Progress">In Progress</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 hover:shadow-md hover:shadow-slate-200/30 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                  {project.status}
                </span>
                <button className="p-1.5 text-slate-400 hover:text-surface-900 rounded-lg hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-display font-bold text-surface-900 mb-1">{project.title}</h3>
                <p className="text-sm text-slate-500">Client: <span className="font-medium text-slate-700">{project.client}</span></p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">Progress</span>
                  <span className="font-bold text-surface-900">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${progressColors[project.status as keyof typeof progressColors]}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">{project.dueDate}</span>
                </div>
                
                <div className="flex items-center -space-x-2">
                  {project.team.map((avatar, index) => (
                    <img 
                      key={index}
                      src={avatar} 
                      alt="Team member" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 relative z-0">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 border-dashed">
            No projects found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
