import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Check,
  Archive,
  Trash2,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Clock,
  MessageSquare,
  Target,
  User,
} from 'lucide-react';
import { notificationService, Notification, NotificationFilter, NotificationType } from '../services/notificationService';
import { useToast } from '../context/ToastContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'archived'>('all');

  // Filter states
  const [filters, setFilters] = useState<NotificationFilter>({
    archived: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, filters, selectedTab]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      let filterConfig = { ...filters };

      if (selectedTab === 'unread') {
        filterConfig.read = false;
      } else if (selectedTab === 'archived') {
        filterConfig.archived = true;
      } else {
        filterConfig.archived = false;
      }

      const data = await notificationService.getNotifications(filterConfig);
      setNotifications(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      const unread = await notificationService.getUnreadCount();
      setUnreadCount(unread);
    } catch (error) {
      console.error('Bildirishnomalarni yuklashda xatolik:', error);
      addToast('error', 'Bildirishnomalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications();
      addToast('success', 'Bildirishnoma o\'qilgan deb belgilandi');
    } catch (error) {
      console.error('Bildirishnomani belgilashda xatolik:', error);
      addToast('error', 'Xatolik yuz berdi');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
      addToast('success', 'Barcha bildirishnomalar o\'qilgan deb belgilandi');
    } catch (error) {
      console.error('Barcha bildirishnomalarni belgilashda xatolik:', error);
      addToast('error', 'Xatolik yuz berdi');
    }
  };

  const handleArchive = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.archiveNotification(notificationId);
      await loadNotifications();
      addToast('success', 'Bildirishnoma arxivga qo\'shildi');
    } catch (error) {
      console.error('Bildirishnomani arxivga qo\'shishda xatolik:', error);
      addToast('error', 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications();
      addToast('success', 'Bildirishnoma o\'chirildi');
    } catch (error) {
      console.error('Bildirishnomani o\'chirishda xatolik:', error);
      addToast('error', 'Xatolik yuz berdi');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = 'w-5 h-5';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconProps} text-green-600`} />;
      case 'error':
        return <AlertCircle className={`${iconProps} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconProps} text-amber-600`} />;
      case 'task':
        return <Clock className={`${iconProps} text-purple-600`} />;
      case 'message':
        return <MessageSquare className={`${iconProps} text-indigo-600`} />;
      case 'lead':
        return <Target className={`${iconProps} text-orange-600`} />;
      case 'customer':
        return <User className={`${iconProps} text-cyan-600`} />;
      default:
        return <Info className={`${iconProps} text-blue-600`} />;
    }
  };

  const getNotificationBgColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 hover:bg-green-100';
      case 'error':
        return 'bg-red-50 hover:bg-red-100';
      case 'warning':
        return 'bg-amber-50 hover:bg-amber-100';
      case 'task':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'message':
        return 'bg-indigo-50 hover:bg-indigo-100';
      case 'lead':
        return 'bg-orange-50 hover:bg-orange-100';
      case 'customer':
        return 'bg-cyan-50 hover:bg-cyan-100';
      default:
        return 'bg-blue-50 hover:bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Notification Center Panel */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-full duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-brand-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-surface-900">Bildirishnomalar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs and Actions */}
        <div className="px-6 py-4 border-b border-slate-100 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(['all', 'unread', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedTab === tab
                    ? 'bg-brand-100 text-brand-600'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab === 'all' && 'Hammasini'}
                {tab === 'unread' && 'O\'qilmaganlari'}
                {tab === 'archived' && 'Arxiv'}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtr
            </button>
            {selectedTab === 'unread' && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Hammasini o'qilgan qil
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-2">Turi</label>
                <div className="flex flex-wrap gap-2">
                  {(['info', 'success', 'warning', 'error', 'task', 'message', 'lead', 'customer'] as NotificationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const currentTypes = filters.type || [];
                        const newTypes = currentTypes.includes(type)
                          ? currentTypes.filter(t => t !== type)
                          : [...currentTypes, type];
                        setFilters({ ...filters, type: newTypes.length > 0 ? newTypes : undefined });
                      }}
                      className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                        filters.type?.includes(type)
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-2">Ustuvorlik</label>
                <div className="flex flex-wrap gap-2">
                  {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        const currentPriorities = filters.priority || [];
                        const newPriorities = currentPriorities.includes(priority)
                          ? currentPriorities.filter(p => p !== priority)
                          : [...currentPriorities, priority];
                        setFilters({ ...filters, priority: newPriorities.length > 0 ? newPriorities : undefined });
                      }}
                      className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                        filters.priority?.includes(priority)
                          ? 'bg-brand-100 text-brand-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {priority === 'low' && 'Kam'}
                      {priority === 'medium' && 'O\'rta'}
                      {priority === 'high' && 'Yuqori'}
                      {priority === 'urgent' && 'Shoshqoq'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-slate-400">
              <Bell className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Bildirishnomalar yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 transition-colors cursor-pointer group ${
                    notification.read
                      ? 'border-slate-200 bg-white hover:bg-slate-50'
                      : 'border-brand-500 bg-brand-50/30 hover:bg-brand-50'
                  } ${getNotificationBgColor(notification.type)}`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-surface-900 line-clamp-1">
                            {notification.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.description && (
                            <p className="text-xs text-slate-500 mt-1">
                              {notification.description}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${getPriorityColor(notification.priority)}`}>
                          {notification.priority === 'low' && 'Kam'}
                          {notification.priority === 'medium' && 'O\'rta'}
                          {notification.priority === 'high' && 'Yuqori'}
                          {notification.priority === 'urgent' && 'Shoshqoq'}
                        </span>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        O'qilgan
                      </button>
                    )}
                    {!notification.archived && (
                      <button
                        onClick={(e) => handleArchive(notification.id, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Arxiv
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(notification.id, e)}
                      className="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
