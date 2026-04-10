import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Filter } from 'lucide-react';
import { tagService, PREDEFINED_TAGS } from '../services/tagService';
import { useToast } from '../context/ToastContext';

interface TagsFilterProps {
  onFilterChange: (selectedTags: string[], matchAll: boolean) => void;
  entityType?: 'customer' | 'lead' | 'project' | 'task';
}

export function TagsFilter({ onFilterChange, entityType }: TagsFilterProps) {
  const { addToast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [matchAll, setMatchAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    onFilterChange(selectedTags, matchAll);
  }, [selectedTags, matchAll]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const stats = await tagService.getTagStatistics();
      const tags = Object.keys(stats).sort();
      setAllTags(tags);
    } catch (error) {
      console.error('Teglarni yuklashda xatolik:', error);
      addToast('error', 'Teglarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedTags = PREDEFINED_TAGS.map((t) => t.name).filter(
    (tag) => !selectedTags.includes(tag) && allTags.includes(tag)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-bold text-surface-900">Teglar bo'yicha filtr</h3>
          {selectedTags.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-brand-100 text-brand-600 text-xs font-semibold rounded-full">
              {selectedTags.length}
            </span>
          )}
        </div>
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <Plus className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-4">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div>
              <div className="text-sm font-medium text-slate-700 mb-3">Tanlangan teglar</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-sm font-medium border border-brand-200 hover:bg-brand-100 transition-colors group"
                  >
                    {tag}
                    <button
                      onClick={() => handleToggleTag(tag)}
                      className="text-brand-400 hover:text-brand-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match Logic */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Filtr mantiqasi</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!matchAll}
                  onChange={() => setMatchAll(false)}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm text-slate-600">Istalgan teg (OR)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={matchAll}
                  onChange={() => setMatchAll(true)}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm text-slate-600">Barcha teglar (AND)</span>
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {matchAll
                ? 'Faqat barcha tanlangan teglarni o\'z ichiga olgan entitiylar ko\'rsatiladi'
                : 'Istalgan tanlangan tegni o\'z ichiga olgan entitiylar ko\'rsatiladi'}
            </p>
          </div>

          {/* Search */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Teg qidirish</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Teg nomini kiriting..."
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Suggested Tags */}
              {suggestedTags.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-3">Tavsiya etilgan teglar</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Tags */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-3">
                  Barcha teglar ({filteredTags.length})
                </div>
                {filteredTags.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Teg topilmadi</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-brand-50 text-brand-600 border-brand-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              {selectedTags.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
