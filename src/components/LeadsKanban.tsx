import React, { useState, useEffect } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Building2, 
  DollarSign,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  amount: string;
  avatar: string;
}

interface Column {
  id: string;
  title: string;
  leads: Lead[];
}

const STAGES = [
  { id: 'New', title: 'Yangi' },
  { id: 'In Progress', title: 'Jarayonda' },
  { id: 'Won', title: 'Yutildi' },
  { id: 'Lost', title: 'Yo\'qotildi' }
];

const statusStyles: Record<string, string> = {
  'New': 'bg-blue-500',
  'In Progress': 'bg-amber-500',
  'Won': 'bg-emerald-500',
  'Lost': 'bg-rose-500',
};

export function LeadsKanban() {
  const [columns, setColumns] = useState<Record<string, Column>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('leads', (data: any[]) => {
      const leads = data as Lead[];
      
      const initialColumns: Record<string, Column> = {};
      STAGES.forEach(stage => {
        initialColumns[stage.id] = {
          id: stage.id,
          title: stage.title,
          leads: leads.filter(lead => lead.status === stage.id)
        };
      });
      
      setColumns(initialColumns);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    // Optimistic UI Update
    const newColumns = { ...columns };
    
    if (startColumn === finishColumn) {
      const newLeads = Array.from(startColumn.leads);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);
      
      newColumns[startColumn.id] = {
        ...startColumn,
        leads: newLeads
      };
      setColumns(newColumns);
      return;
    }

    // Moving from one column to another
    const startLeads = Array.from(startColumn.leads);
    const [movedLead] = startLeads.splice(source.index, 1);
    
    const finishLeads = Array.from(finishColumn.leads);
    const updatedLead = { ...movedLead, status: finishColumn.id };
    finishLeads.splice(destination.index, 0, updatedLead);

    newColumns[startColumn.id] = { ...startColumn, leads: startLeads };
    newColumns[finishColumn.id] = { ...finishColumn, leads: finishLeads };
    
    setColumns(newColumns);

    try {
      await dataService.updateData('leads', draggableId, { status: finishColumn.id });
      showToast('Lid holati yangilandi', 'success');
    } catch (error) {
      console.error('Error updating lead status:', error);
      showToast('Xatolik yuz berdi', 'error');
      // Revert would happen on next subscription update anyway, 
      // but for production we might want more robust revert logic.
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Lidlar (Kanban)</h1>
          <p className="text-slate-500">Sotuv voronkasi bo'ylab lidlarni boshqaring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Qidirish..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all shadow-sm shadow-brand-500/20 font-medium text-sm">
            <Plus className="w-4 h-4" />
            <span>Yangi lid</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {STAGES.map((stage) => {
            const column = columns[stage.id];
            if (!column) return null;

            const filteredLeads = column.leads.filter(lead => 
              lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lead.company.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return (
              <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusStyles[stage.id]}`} />
                    <h3 className="font-bold text-surface-900">{stage.title}</h3>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {filteredLeads.length}
                    </span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-surface-900 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-col gap-3 min-h-[500px] p-2 rounded-2xl transition-colors ${
                        snapshot.isDraggingOver ? 'bg-slate-100/50' : 'bg-transparent'
                      }`}
                    >
                      {filteredLeads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group ${
                                snapshot.isDragging ? 'shadow-xl ring-2 ring-brand-500/20 rotate-2' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={lead.avatar} 
                                    alt={lead.name} 
                                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <h4 className="text-sm font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                                      {lead.name}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                      <Building2 className="w-3 h-3" />
                                      <span>{lead.company}</span>
                                    </div>
                                  </div>
                                </div>
                                <button className="p-1 text-slate-300 hover:text-surface-900 opacity-0 group-hover:opacity-100 transition-all">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{lead.email}</span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-1 text-brand-600 font-bold">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{lead.amount}</span>
                                  </div>
                                  <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                      +1
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
