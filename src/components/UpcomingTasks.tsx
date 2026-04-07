import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';

interface Task {
  id: string;
  title: string;
  time: string;
  status: string;
  priority: string;
  createdAt?: any;
}

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('tasks', (data) => {
      setTasks(data.slice(0, 4) as Task[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await dataService.updateData('tasks', task.id, { status: newStatus });
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-surface-900">Upcoming Tasks</h2>
          <p className="text-sm text-slate-500">Your schedule for the next 2 days</p>
        </div>
        <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          Add Task
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => toggleTaskStatus(task)}>
              <div className="mt-0.5">
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-surface-900'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">{task.time}</span>
                  
                  <span className="text-slate-300">•</span>
                  
                  <div className="flex items-center gap-1">
                    <AlertCircle className={`w-3 h-3 ${
                      task.priority === 'high' ? 'text-rose-500' : 
                      task.priority === 'medium' ? 'text-amber-500' : 'text-slate-400'
                    }`} />
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      task.priority === 'high' ? 'text-rose-600' : 
                      task.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm italic">
            No upcoming tasks.
          </div>
        )}
      </div>
    </div>
  );
}
