import React, { useState, useEffect, useCallback } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult,
  DragStart,
  DragUpdate 
} from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Building2, 
  DollarSign,
  Search,
  Filter,
  GripVertical,
  ChevronRight,
  X
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
  tags?: string[];
}

interface Column {
  id: string;
  title: string;
  leads: Lead[];
}

const STAGES = [
  { id: 'New', title: 'Yangi', emoji: '🔵', color: 'blue' },
  { id: 'In Progress', title: 'Jarayonda', emoji: '🟡', color: 'amber' },
  { id: 'Won', title: 'Yutildi', emoji: '🟢', color: 'emerald' },
  { id: 'Lost', title: "Yo'qotildi", emoji: '🔴', color: 'rose' }
];

const columnStyles: Record<string, { bg: string; border: string; accent: string; dot: string; headerBg: string }> = {
  'New': { 
    bg: 'bg-blue-50/30', 
    border: 'border-blue-100', 
    accent: 'text-blue-600', 
    dot: 'bg-blue-500',
    headerBg: 'bg-blue-50'
  },
  'In Progress': { 
    bg: 'bg-amber-50/30', 
    border: 'border-amber-100', 
    accent: 'text-amber-600', 
    dot: 'bg-amber-500',
    headerBg: 'bg-amber-50'
  },
  'Won': { 
    bg: 'bg-emerald-50/30', 
    border: 'border-emerald-100', 
    accent: 'text-emerald-600', 
    dot: 'bg-emerald-500',
    headerBg: 'bg-emerald-50'
  },
  'Lost': { 
    bg: 'bg-rose-50/30', 
    border: 'border-rose-100', 
    accent: 'text-rose-600', 
    dot: 'bg-rose-500',
    headerBg: 'bg-rose-50'
  },
};

const tagColors: Record<string, string> = {
  'VIP': 'bg-amber-50 text-amber-700 border-amber-200',
  'Yangi': 'bg-blue-50 text-blue-700 border-blue-200',
  'Katta': 'bg-purple-50 text-purple-700 border-purple-200',
  'Taklif': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function LeadsKanban() {
  const [columns, setColumns] = useState<Record<string, Column>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const { addToast } = useToast();

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

  const onDragStart = useCallback((start: DragStart) => {
    setDraggingLeadId(start.draggableId);
    document.body.style.cursor = 'grabbing';
  }, []);

  const onDragUpdate = useCallback((update: DragUpdate) => {
    if (update.destination) {
      setDragOverColumnId(update.destination.droppableId);
    } else {
      setDragOverColumnId(null);
    }
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Reset states
    setDraggingLeadId(null);
    setDragOverColumnId(null);
    document.body.style.cursor = '';

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    const newColumns = { ...columns };
    
    // Same column reorder
    if (startColumn === finishColumn) {
      const newLeads = Array.from(startColumn.leads);
      const [removed] = newLeads.splice(source.index, 1);
      newLeads.splice(destination.index, 0, removed);
      
      newColumns[startColumn.id] = { ...startColumn, leads: newLeads };
      setColumns(newColumns);
      return;
    }

    // Moving between columns
    const startLeads = Array.from(startColumn.leads) as Lead[];
    const [movedLead] = startLeads.splice(source.index, 1);
    
    const finishLeads = Array.from(finishColumn.leads) as Lead[];
    const updatedLead = { ...movedLead, status: finishColumn.id };
    finishLeads.splice(destination.index, 0, updatedLead);

    newColumns[startColumn.id] = { ...startColumn, leads: startLeads };
    newColumns[finishColumn.id] = { ...finishColumn, leads: finishLeads };
    
    setColumns(newColumns);

    try {
      await dataService.updateData('leads', draggableId, { status: finishColumn.id });
      const destStage = STAGES.find(s => s.id === finishColumn.id);
      addToast('success', `Lid "${destStage?.title || finishColumn.id}" ga ko'chirildi`);
    } catch (error) {
      console.error('Error updating lead status:', error);
      addToast('error', 'Lid holatini yangilashda xatolik yuz berdi');
    }
  };

  // Quick-move: lead ni bir bosishda keyingi bosqichga o'tkazish
  const moveLeadToNextStage = async (lead: Lead) => {
    const currentIdx = STAGES.findIndex(s => s.id === lead.status);
    if (currentIdx >= STAGES.length - 1) return;
    
    const nextStage = STAGES[currentIdx + 1];
    
    // Optimistic update
    const newColumns = { ...columns };
    const currentCol = newColumns[lead.status];
    const nextCol = newColumns[nextStage.id];
    
    if (!currentCol || !nextCol) return;
    
    newColumns[lead.status] = {
      ...currentCol,
      leads: currentCol.leads.filter(l => l.id !== lead.id)
    };
    newColumns[nextStage.id] = {
      ...nextCol,
      leads: [...nextCol.leads, { ...lead, status: nextStage.id }]
    };
    
    setColumns(newColumns);
    
    try {
      await dataService.updateData('leads', lead.id, { status: nextStage.id });
      addToast('success', `"${lead.name}" ${nextStage.title} ga ko'chirildi`);
    } catch (error) {
      console.error('Error:', error);
      addToast('error', 'Xatolik yuz berdi');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="skeleton h-8 w-48 rounded-lg mb-2" />
            <div className="skeleton h-4 w-72 rounded-md" />
          </div>
        </div>
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80">
              <div className="skeleton h-8 w-32 rounded-lg mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="skeleton h-36 w-80 rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">Lidlar</h1>
          <p className="text-slate-500 mt-1">Sotuv voronkasi bo'ylab lidlarni boshqaring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Qidirish..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full sm:w-56"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors press-scale">
            <Filter className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 active:scale-[0.97] transition-all shadow-sm shadow-brand-500/20 font-medium text-sm press-scale">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Yangi lid</span>
          </button>
        </div>
      </div>

      {/* Quick-move hint */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-500">
        <GripVertical className="w-4 h-4 text-slate-400" />
        <span>Kartochkani sudrab boshqa ustunga o'tkazing</span>
        <span className="text-slate-300">•</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span>Tugmasi bilan tez o'tkazish</span>
      </div>

      <DragDropContext 
        onDragStart={onDragStart} 
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide flex-1">
          {STAGES.map((stage) => {
            const column = columns[stage.id];
            if (!column) return null;
            const styles = columnStyles[stage.id];
            const isDragOver = dragOverColumnId === stage.id;
            const isDragging = draggingLeadId !== null;

            const filteredLeads = column.leads.filter(lead => 
              (lead.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
              (lead.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            );

            const totalAmount = filteredLeads.reduce((sum, l) => sum + (parseInt(l.amount?.replace(/[^0-9]/g, '') || '0')), 0);

            return (
              <div key={stage.id} className="flex-shrink-0 w-72 sm:w-80 flex flex-col">
                {/* Column Header */}
                <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border border-b-0 ${styles.border} ${styles.headerBg} transition-all duration-300 ${isDragOver ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${styles.dot} ${isDragOver ? 'scale-150 transition-transform' : 'transition-transform'}`} />
                    <h3 className="font-bold text-surface-900 text-sm">{stage.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.bg} ${styles.accent}`}>
                      {filteredLeads.length}
                    </span>
                  </div>
                  {totalAmount > 0 && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      ${totalAmount.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage.id}>
                  {(provided: any, snapshot: any) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`
                        flex flex-col gap-3 flex-1 p-2 rounded-b-2xl border border-t-0 transition-all duration-300 min-h-[200px]
                        ${styles.border}
                        ${snapshot.isDraggingOver 
                          ? `${styles.bg} ring-2 ring-inset ring-brand-400/40` 
                          : isDragging && !snapshot.isDraggingOver
                            ? 'bg-slate-50/30'
                            : 'bg-slate-50/20'
                        }
                      `}
                    >
                      {filteredLeads.map((lead, index) => {
                        const isBeingDragged = draggingLeadId === lead.id;
                        const leadStageIdx = STAGES.findIndex(s => s.id === lead.status);
                        const canMoveNext = leadStageIdx < STAGES.length - 1;

                        return (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  bg-white p-4 rounded-2xl border shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing group relative
                                  ${snapshot.isDragging 
                                    ? 'shadow-xl ring-2 ring-brand-500/30 scale-[1.03] rotate-[1deg] z-50 border-brand-200' 
                                    : isBeingDragged 
                                      ? 'opacity-30 border-slate-200'
                                      : 'border-slate-100 hover:shadow-md hover:border-slate-200'
                                  }
                                `}
                                style={{
                                  ...provided.draggableProps.style,
                                  transition: snapshot.isDragging 
                                    ? 'box-shadow 0.2s ease, transform 0.15s ease' 
                                    : 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                                }}
                              >
                                {/* Quick-move button */}
                                {canMoveNext && !snapshot.isDragging && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); moveLeadToNextStage(lead); }}
                                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-brand-600 hover:bg-brand-50 opacity-0 group-hover:opacity-100 transition-all press-scale z-10"
                                    title={`${STAGES[leadStageIdx + 1]?.title} ga o'tkazish`}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                )}

                                <div className="flex items-start gap-3">
                                  {/* Grip indicator */}
                                  <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-40 transition-opacity">
                                    <GripVertical className="w-4 h-4 text-slate-400" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    {/* Avatar + Name */}
                                    <div className="flex items-center gap-3 mb-3">
                                      <img 
                                        src={lead.avatar} 
                                        alt={lead.name} 
                                        className="w-9 h-9 rounded-full object-cover border border-slate-100 flex-shrink-0"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-surface-900 truncate group-hover:text-brand-600 transition-colors">
                                          {lead.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                          <Building2 className="w-3 h-3 flex-shrink-0" />
                                          <span className="truncate">{lead.company}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg mb-3">
                                      <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                      <span className="truncate">{lead.email}</span>
                                    </div>

                                    {/* Amount + Tags */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1 text-brand-600 font-bold text-sm">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <span>{lead.amount}</span>
                                      </div>
                                      {lead.tags && lead.tags.length > 0 && (
                                        <div className="flex gap-1">
                                          {lead.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${tagColors[tag] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                              {tag}
                                            </span>
                                          ))}
                                          {lead.tags.length > 2 && (
                                            <span className="text-[9px] font-medium text-slate-400">+{lead.tags.length - 2}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}

                      {/* Empty column hint */}
                      {filteredLeads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                            <Plus className="w-5 h-5 text-slate-300" />
                          </div>
                          <p className="text-xs text-slate-500">Lidlar yo'q</p>
                          <p className="text-[10px] text-slate-400 mt-1">Sudrab bu yerga tashlang</p>
                        </div>
                      )}

                      {/* Drag-over placeholder */}
                      {snapshot.isDraggingOver && filteredLeads.length === 0 && (
                        <div className="border-2 border-dashed border-brand-300 rounded-2xl p-8 flex items-center justify-center bg-brand-50/20">
                          <p className="text-sm font-medium text-brand-500">Qo'yish uchun tashlang</p>
                        </div>
                      )}
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
