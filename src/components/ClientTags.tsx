import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2, Tag } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

interface ClientTagsProps {
  customerId: string;
}

const PREDEFINED_TAGS = [
  'VIP',
  'Yangi',
  'Faol',
  'Nofaol',
  'Potensial',
  'Asosiy',
  'Qo\'shimcha',
  'Loyalist',
  'Muammoli',
  'Tez o\'suvchi',
];

export function ClientTags({ customerId }: ClientTagsProps) {
  const { addToast } = useToast();
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const customer = await dataService.getDocument('customers', customerId);
        setTags(customer?.tags || []);
      } catch (error) {
        console.error('Teglarni yuklashda xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, [customerId]);

  const handleAddTag = async (tagToAdd: string) => {
    if (!tagToAdd.trim()) {
      addToast('error', 'Teg bo\'sh bo\'lishi mumkin emas');
      return;
    }

    if (tags.includes(tagToAdd)) {
      addToast('error', 'Bu teg allaqachon mavjud');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedTags = [...tags, tagToAdd];
      await dataService.updateData('customers', customerId, { tags: updatedTags });
      setTags(updatedTags);
      addToast('success', 'Teg qo\'shildi');
      setNewTag('');
    } catch (error) {
      console.error('Tegni qo\'shishda xatolik:', error);
      addToast('error', 'Tegni qo\'shishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    setIsSubmitting(true);
    try {
      const updatedTags = tags.filter(tag => tag !== tagToRemove);
      await dataService.updateData('customers', customerId, { tags: updatedTags });
      setTags(updatedTags);
      addToast('success', 'Teg o\'chirildi');
    } catch (error) {
      console.error('Tegni o\'chirishda xatolik:', error);
      addToast('error', 'Tegni o\'chirishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-display font-bold text-surface-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-600" />
          Teglar
        </h2>
      </div>

      <div className="p-6">
        {/* Current tags */}
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-700 mb-3">Mavjud teglar</div>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-medium border border-brand-200 hover:bg-brand-100 transition-colors group"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    disabled={isSubmitting}
                    className="text-brand-400 hover:text-brand-700 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">Hali teg yo'q</p>
            )}
          </div>
        </div>

        {/* Add new tag */}
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-700 mb-3">Yangi teg qo'shish</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(newTag);
                }
              }}
              placeholder="Teg nomini kiriting..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              disabled={isSubmitting}
            />
            <button
              onClick={() => handleAddTag(newTag)}
              disabled={isSubmitting || !newTag.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Qo'shish
            </button>
          </div>
        </div>

        {/* Predefined tags */}
        <div>
          <div className="text-sm font-medium text-slate-700 mb-3">Tavsiya etilgan teglar</div>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                disabled={isSubmitting || tags.includes(tag)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
