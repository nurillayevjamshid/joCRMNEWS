import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface Note {
  id: string;
  customerId: string;
  content: string;
  createdAt: any;
  updatedAt?: any;
  userId?: string;
}

interface ClientNotesProps {
  customerId: string;
}

export function ClientNotes({ customerId }: ClientNotesProps) {
  const { addToast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = dataService.subscribeToCollection('clientNotes', (data) => {
      const filteredNotes = (data as Note[]).filter(note => note.customerId === customerId);
      setNotes(filteredNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) {
      addToast('error', 'Eslatma bo\'sh bo\'lishi mumkin emas');
      return;
    }

    setIsSubmitting(true);
    try {
      await dataService.saveData('clientNotes', {
        customerId,
        content: newNoteContent,
      });
      addToast('success', 'Eslatma muvaffaqiyatli qo\'shildi');
      setNewNoteContent('');
    } catch (error) {
      console.error('Eslatma qo\'shishda xatolik:', error);
      addToast('error', 'Eslatma qo\'shishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Haqiqatanam bu eslatmani o\'chirmoqchimisiz?')) {
      try {
        await dataService.deleteData('clientNotes', id);
        addToast('success', 'Eslatma muvaffaqiyatli o\'chirildi');
      } catch (error) {
        console.error('Eslatmani o\'chirishda xatolik:', error);
        addToast('error', 'Eslatmani o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-display font-bold text-surface-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          Eslatmalar
        </h2>
      </div>

      <div className="p-6">
        {/* Add note form */}
        <form onSubmit={handleAddNote} className="mb-6">
          <div className="flex flex-col gap-3">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Yangi eslatma qo'shing..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newNoteContent.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-brand-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Eslatma qo'shish
                </>
              )}
            </button>
          </div>
        </form>

        {/* Notes list */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
              <p className="text-slate-500 text-sm">Eslatmalar yuklanmoqda...</p>
            </div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-all group"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <p className="text-sm text-slate-600 flex-1">{note.content}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-400">{formatDate(note.createdAt)}</div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 text-sm">Hali eslatma yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
