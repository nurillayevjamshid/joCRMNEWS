import { dataService } from './dataService';

/**
 * Notification Service - Manages notifications in the CRM system
 * Supports different notification types, filtering, and real-time updates
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'task' | 'message' | 'lead' | 'customer';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  description?: string;
  icon?: string;
  read: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  actionUrl?: string;
  createdAt: any;
  updatedAt: any;
  expiresAt?: any;
}

export interface NotificationFilter {
  type?: NotificationType[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  category?: string[];
  read?: boolean;
  archived?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export const NOTIFICATION_TYPES: Record<NotificationType, { icon: string; color: string; bg: string }> = {
  info: { icon: 'ℹ️', color: 'text-blue-600', bg: 'bg-blue-50' },
  success: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
  warning: { icon: '⚠️', color: 'text-amber-600', bg: 'bg-amber-50' },
  error: { icon: '✕', color: 'text-red-600', bg: 'bg-red-50' },
  task: { icon: '✓', color: 'text-purple-600', bg: 'bg-purple-50' },
  message: { icon: '💬', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  lead: { icon: '🎯', color: 'text-orange-600', bg: 'bg-orange-50' },
  customer: { icon: '👤', color: 'text-cyan-600', bg: 'bg-cyan-50' },
};

export const notificationService = {
  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    try {
      const notificationId = `notif_${Date.now()}`;
      const newNotification: Notification = {
        ...notification,
        id: notificationId,
        read: false,
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await dataService.saveData('notifications', newNotification, notificationId);
      return newNotification;
    } catch (error) {
      console.error('Bildirishnomani yaratishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Get all notifications
   */
  async getAllNotifications(): Promise<Notification[]> {
    try {
      const notifications = await dataService.getCollection('notifications');
      return notifications as Notification[];
    } catch (error) {
      console.error('Bildirishnomalarni yuklashda xatolik:', error);
      return [];
    }
  },

  /**
   * Get notifications with filters
   */
  async getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    try {
      let notifications = await dataService.getCollection('notifications');

      if (!filter) {
        return notifications as Notification[];
      }

      notifications = notifications.filter((notif: any) => {
        // Filter by type
        if (filter.type && !filter.type.includes(notif.type)) {
          return false;
        }

        // Filter by priority
        if (filter.priority && !filter.priority.includes(notif.priority)) {
          return false;
        }

        // Filter by category
        if (filter.category && !filter.category.includes(notif.category)) {
          return false;
        }

        // Filter by read status
        if (filter.read !== undefined && notif.read !== filter.read) {
          return false;
        }

        // Filter by archived status
        if (filter.archived !== undefined && notif.archived !== filter.archived) {
          return false;
        }

        // Filter by date range
        if (filter.startDate || filter.endDate) {
          const notifDate = new Date(notif.createdAt);
          if (filter.startDate && notifDate < filter.startDate) {
            return false;
          }
          if (filter.endDate && notifDate > filter.endDate) {
            return false;
          }
        }

        return true;
      });

      return notifications as Notification[];
    } catch (error) {
      console.error('Bildirishnomalarni filtrlashda xatolik:', error);
      return [];
    }
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await dataService.getCollection('notifications');
      return notifications.filter((n: any) => !n.read && !n.archived).length;
    } catch (error) {
      console.error('O\'qilmagan bildirishnomalarni hisoblashda xatolik:', error);
      return 0;
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await dataService.updateData('notifications', notificationId, {
        read: true,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Bildirishnomani o\'qilgan deb belgilashda xatolik:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await dataService.getCollection('notifications');
      const unreadNotifications = notifications.filter((n: any) => !n.read);

      for (const notif of unreadNotifications) {
        await dataService.updateData('notifications', notif.id, {
          read: true,
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Barcha bildirishnomalarni o\'qilgan deb belgilashda xatolik:', error);
      throw error;
    }
  },

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string): Promise<void> {
    try {
      await dataService.updateData('notifications', notificationId, {
        archived: true,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Bildirishnomani arxivga qo\'shishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await dataService.deleteData('notifications', notificationId);
    } catch (error) {
      console.error('Bildirishnomani o\'chirishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Get notifications by category
   */
  async getNotificationsByCategory(category: string): Promise<Notification[]> {
    try {
      const notifications = await dataService.getCollection('notifications');
      return notifications.filter((n: any) => n.category === category) as Notification[];
    } catch (error) {
      console.error('Kategoriya bo\'yicha bildirishnomalarni yuklashda xatolik:', error);
      return [];
    }
  },

  /**
   * Get high priority notifications
   */
  async getHighPriorityNotifications(): Promise<Notification[]> {
    try {
      const notifications = await dataService.getCollection('notifications');
      return notifications.filter((n: any) => 
        (n.priority === 'high' || n.priority === 'urgent') && !n.archived
      ) as Notification[];
    } catch (error) {
      console.error('Yuqori ustuvorlikdagi bildirishnomalarni yuklashda xatolik:', error);
      return [];
    }
  },

  /**
   * Subscribe to notifications in real-time
   */
  subscribeToNotifications(callback: (notifications: Notification[]) => void) {
    return dataService.subscribeToCollection('notifications', (data) => {
      callback(data as Notification[]);
    });
  },

  /**
   * Create notification for task assignment
   */
  async notifyTaskAssignment(taskId: string, taskTitle: string, assignee: string): Promise<void> {
    try {
      await this.createNotification({
        type: 'task',
        title: 'Yangi vazifa tayinlandi',
        message: `${taskTitle} sizga tayinlandi`,
        category: 'task',
        priority: 'high',
        relatedEntityId: taskId,
        relatedEntityType: 'task',
        description: `Vazifa: ${taskTitle}`,
      });
    } catch (error) {
      console.error('Vazifa bildirishnomasi yaratishda xatolik:', error);
    }
  },

  /**
   * Create notification for new lead
   */
  async notifyNewLead(leadId: string, leadName: string, company: string): Promise<void> {
    try {
      await this.createNotification({
        type: 'lead',
        title: 'Yangi lid qo\'shildi',
        message: `${leadName} (${company}) yangi lid sifatida qo\'shildi`,
        category: 'lead',
        priority: 'medium',
        relatedEntityId: leadId,
        relatedEntityType: 'lead',
        description: `Lid: ${leadName} from ${company}`,
      });
    } catch (error) {
      console.error('Lid bildirishnomasi yaratishda xatolik:', error);
    }
  },

  /**
   * Create notification for customer update
   */
  async notifyCustomerUpdate(customerId: string, customerName: string, updateType: string): Promise<void> {
    try {
      await this.createNotification({
        type: 'customer',
        title: 'Mijoz yangilandi',
        message: `${customerName} - ${updateType}`,
        category: 'customer',
        priority: 'medium',
        relatedEntityId: customerId,
        relatedEntityType: 'customer',
        description: `Mijoz: ${customerName} - ${updateType}`,
      });
    } catch (error) {
      console.error('Mijoz bildirishnomasi yaratishda xatolik:', error);
    }
  },

  /**
   * Create notification for overdue task
   */
  async notifyOverdueTask(taskId: string, taskTitle: string, daysOverdue: number): Promise<void> {
    try {
      await this.createNotification({
        type: 'warning',
        title: 'Muddati o\'tgan vazifa',
        message: `"${taskTitle}" ${daysOverdue} kun muddati o\'tib ketdi`,
        category: 'task',
        priority: 'urgent',
        relatedEntityId: taskId,
        relatedEntityType: 'task',
        description: `Muddati o\'tgan vazifa: ${taskTitle}`,
      });
    } catch (error) {
      console.error('Muddati o\'tgan vazifa bildirishnomasi yaratishda xatolik:', error);
    }
  },

  /**
   * Clear old notifications (older than X days)
   */
  async clearOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const notifications = await dataService.getCollection('notifications');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      let deletedCount = 0;
      for (const notif of notifications) {
        const notifDate = new Date(notif.createdAt);
        if (notifDate < cutoffDate && notif.archived) {
          await dataService.deleteData('notifications', notif.id);
          deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Eski bildirishnomalarni o\'chirishda xatolik:', error);
      return 0;
    }
  },
};
