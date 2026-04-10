import React from 'react';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  variant?: 'default' | 'small' | 'large';
  removable?: boolean;
  className?: string;
}

const TAG_COLORS: Record<string, string> = {
  'VIP': 'bg-red-50 text-red-600 border-red-200',
  'Yangi': 'bg-blue-50 text-blue-600 border-blue-200',
  'Faol': 'bg-green-50 text-green-600 border-green-200',
  'Nofaol': 'bg-slate-50 text-slate-600 border-slate-200',
  'Potensial': 'bg-amber-50 text-amber-600 border-amber-200',
  'Asosiy': 'bg-indigo-50 text-indigo-600 border-indigo-200',
  'Qo\'shimcha': 'bg-violet-50 text-violet-600 border-violet-200',
  'Loyalist': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Muammoli': 'bg-rose-50 text-rose-600 border-rose-200',
  'Tez o\'suvchi': 'bg-orange-50 text-orange-600 border-orange-200',
};

// Hash function to assign consistent colors to unknown tags
function getColorForTag(tag: string): string {
  if (TAG_COLORS[tag]) {
    return TAG_COLORS[tag];
  }

  const colors = Object.values(TAG_COLORS);
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return colors[Math.abs(hash) % colors.length];
}

export function TagBadge({
  tag,
  onRemove,
  variant = 'default',
  removable = false,
  className = '',
}: TagBadgeProps) {
  const colorClass = getColorForTag(tag);

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeClasses[variant]} ${colorClass} rounded-full font-medium border hover:opacity-80 transition-opacity group ${className}`}
    >
      {tag}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="text-current opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100 p-0.5 rounded hover:bg-black/10"
        >
          <X className={variant === 'small' ? 'w-3 h-3' : variant === 'large' ? 'w-5 h-5' : 'w-3.5 h-3.5'} />
        </button>
      )}
    </div>
  );
}

interface TagBadgesProps {
  tags: string[];
  onRemove?: (tag: string) => void;
  variant?: 'default' | 'small' | 'large';
  removable?: boolean;
  maxDisplay?: number;
  className?: string;
}

export function TagBadges({
  tags,
  onRemove,
  variant = 'default',
  removable = false,
  maxDisplay,
  className = '',
}: TagBadgesProps) {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags;
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag) => (
        <TagBadge
          key={tag}
          tag={tag}
          variant={variant}
          removable={removable}
          onRemove={() => onRemove?.(tag)}
        />
      ))}
      {remainingCount > 0 && (
        <div className={`inline-flex items-center ${variant === 'small' ? 'px-2 py-0.5 text-xs' : variant === 'large' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'} bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200`}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
