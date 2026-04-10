# Tags & Notifications System Guide

This document describes the comprehensive Tags and Notifications system added to the joCRMNEWS CRM application.

## Overview

The system provides two main features:

1. **Tags System** - Organize and categorize entities (customers, leads, projects, tasks) with flexible tagging
2. **Notification System** - Real-time notifications with filtering, prioritization, and archiving

## Tags System

### Features

- **Entity Tagging**: Assign tags to customers, leads, projects, and tasks
- **Predefined Tags**: Quick access to common tags (VIP, Yangi, Faol, etc.)
- **Custom Tags**: Create unlimited custom tags
- **Tag Colors**: Automatic color assignment for visual distinction
- **Tag Filtering**: Filter entities by single or multiple tags
- **Tag Statistics**: Track tag usage across the system

### Architecture

#### Services

**`src/services/tagService.ts`** - Core tag management service

```typescript
// Main functions:
- createTag(name, color?) - Create a new tag
- getAllTags() - Get all tags
- getTag(tagId) - Get specific tag
- updateTag(tagId, updates) - Update tag properties
- deleteTag(tagId) - Delete a tag
- addTagsToEntity(entityId, entityType, tagNames) - Add tags to entity
- removeTagsFromEntity(entityId, entityType, tagNames) - Remove tags from entity
- getEntitiesByTag(tagName, entityType?) - Get all entities with a tag
- getTagStatistics() - Get usage statistics
- searchByTags(tags, entityType?, matchAll?) - Search with multiple tags
```

#### Components

**`src/components/TagBadge.tsx`** - Reusable tag display component

```typescript
// Props:
- tag: string - Tag name
- onRemove?: () => void - Remove callback
- variant?: 'small' | 'default' | 'large' - Size variant
- removable?: boolean - Show remove button
- className?: string - Additional CSS classes

// TagBadges component for multiple tags:
- tags: string[] - Array of tag names
- maxDisplay?: number - Max tags to show (rest as +N)
```

**`src/components/TagsFilter.tsx`** - Advanced tag filtering component

```typescript
// Props:
- onFilterChange: (tags, matchAll) => void - Filter change callback
- entityType?: 'customer' | 'lead' | 'project' | 'task' - Entity type

// Features:
- Expandable filter panel
- Tag search
- Suggested tags
- AND/OR logic toggle
- Filter statistics
```

**`src/components/ClientTags.tsx`** - Tag management for individual entities

- Add/remove tags
- Predefined tag suggestions
- Real-time updates

### Usage Examples

#### Adding Tags to a Customer

```typescript
import { tagService } from '../services/tagService';

// Add single tag
await tagService.addTagsToEntity('customer_123', 'customer', ['VIP']);

// Add multiple tags
await tagService.addTagsToEntity('customer_123', 'customer', ['VIP', 'Faol', 'Loyalist']);
```

#### Filtering Customers by Tags

```typescript
import { tagService } from '../services/tagService';

// Get customers with ANY of the tags (OR logic)
const customers = await tagService.searchByTags(['VIP', 'Loyalist'], 'customer', false);

// Get customers with ALL tags (AND logic)
const vipActive = await tagService.searchByTags(['VIP', 'Faol'], 'customer', true);
```

#### Getting Tag Statistics

```typescript
const stats = await tagService.getTagStatistics();
// Returns: { 'VIP': 15, 'Faol': 42, 'Yangi': 8, ... }
```

### Integration Points

1. **Customers Page** (`src/components/Customers.tsx`)
   - Added `TagsFilter` component
   - Display tags in customer table
   - Filter by tags with AND/OR logic

2. **Client Profile** (`src/components/ClientProfile.tsx`)
   - Existing `ClientTags` component for tag management
   - Real-time tag updates

3. **Other Pages**
   - Can be integrated into Leads, Projects, Tasks pages similarly

## Notification System

### Features

- **Multi-Type Notifications**: info, success, warning, error, task, message, lead, customer
- **Priority Levels**: low, medium, high, urgent
- **Real-Time Updates**: Firebase Firestore integration
- **Notification Center**: Dedicated UI panel
- **Advanced Filtering**: Filter by type, priority, category, date range
- **Archiving & Deletion**: Manage notification lifecycle
- **Unread Count**: Track unread notifications
- **Categorization**: Organize notifications by category

### Architecture

#### Services

**`src/services/notificationService.ts`** - Core notification management service

```typescript
// Main functions:
- createNotification(notification) - Create new notification
- getAllNotifications() - Get all notifications
- getNotifications(filter?) - Get with optional filters
- getUnreadCount() - Count unread notifications
- markAsRead(notificationId) - Mark single as read
- markAllAsRead() - Mark all as read
- archiveNotification(notificationId) - Archive notification
- deleteNotification(notificationId) - Delete notification
- getNotificationsByCategory(category) - Get by category
- getHighPriorityNotifications() - Get urgent/high priority
- subscribeToNotifications(callback) - Real-time subscription
- notifyTaskAssignment(taskId, title, assignee) - Task notification
- notifyNewLead(leadId, name, company) - Lead notification
- notifyCustomerUpdate(customerId, name, updateType) - Customer notification
- notifyOverdueTask(taskId, title, daysOverdue) - Overdue task notification
- clearOldNotifications(daysOld) - Cleanup old notifications
```

#### Components

**`src/components/NotificationCenter.tsx`** - Main notification UI

```typescript
// Features:
- Notification list with real-time updates
- Three tabs: All, Unread, Archived
- Advanced filtering by type, priority, category
- Mark as read/unread
- Archive/delete actions
- Unread count badge
- Priority color coding
- Responsive design
```

**`src/components/Header.tsx`** - Integration point

- Bell icon with unread count badge
- Click to open notification center
- Real-time unread count updates

### Usage Examples

#### Creating Notifications

```typescript
import { notificationService } from '../services/notificationService';

// Simple notification
await notificationService.createNotification({
  type: 'success',
  title: 'Operatsiya muvaffaqiyatli',
  message: 'Mijoz qo\'shildi',
  category: 'customer',
  priority: 'medium',
});

// Task assignment notification
await notificationService.notifyTaskAssignment(
  'task_123',
  'Proyekt tahlili',
  'Ali Vali'
);

// Overdue task notification
await notificationService.notifyOverdueTask(
  'task_456',
  'Qo\'ng\'iroq qilish',
  3 // days overdue
);
```

#### Filtering Notifications

```typescript
// Get unread notifications
const unread = await notificationService.getNotifications({
  read: false,
  archived: false,
});

// Get high priority notifications
const urgent = await notificationService.getHighPriorityNotifications();

// Get notifications in date range
const recent = await notificationService.getNotifications({
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
  endDate: new Date(),
});

// Get task notifications only
const taskNotifs = await notificationService.getNotifications({
  type: ['task'],
});
```

#### Real-Time Subscription

```typescript
// Subscribe to notification changes
const unsubscribe = notificationService.subscribeToNotifications((notifications) => {
  console.log('Notifications updated:', notifications);
  // Update UI
});

// Cleanup
unsubscribe();
```

### Integration Points

1. **Header** (`src/components/Header.tsx`)
   - Notification bell icon
   - Unread count badge
   - Opens notification center on click

2. **Notification Center** (`src/components/NotificationCenter.tsx`)
   - Full notification management UI
   - Filtering and sorting
   - Mark as read/archive/delete

3. **Automatic Notifications**
   - Can be triggered from any page when:
     - New lead is created
     - Customer is updated
     - Task is assigned
     - Task becomes overdue

## Database Schema

### Firestore Collections

#### `tags` Collection

```typescript
{
  id: string,
  name: string,
  color: string,
  description?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  usageCount?: number,
}
```

#### `notifications` Collection

```typescript
{
  id: string,
  type: NotificationType,
  title: string,
  message: string,
  description?: string,
  icon?: string,
  read: boolean,
  archived: boolean,
  priority: 'low' | 'medium' | 'high' | 'urgent',
  category: string,
  relatedEntityId?: string,
  relatedEntityType?: string,
  actionUrl?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  expiresAt?: Timestamp,
}
```

#### Entity Collections (customers, leads, projects, tasks)

Added field:
```typescript
tags?: string[] // Array of tag names
```

## UI Consistency

### Design Patterns

1. **Tag Display**
   - Rounded pill shape with border
   - Color-coded by tag
   - Hover effects for interactivity
   - Optional remove button

2. **Notification Display**
   - Left border color by type
   - Icon for visual identification
   - Priority badge
   - Timestamp
   - Action buttons on hover

3. **Filtering**
   - Expandable panels
   - Clear visual feedback
   - Search functionality
   - Quick preset buttons

### Color Scheme

**Tags**: 18 predefined colors from Tailwind palette
- Red, Orange, Amber, Yellow, Lime, Green, Emerald, Teal, Cyan, Sky, Blue, Indigo, Violet, Purple, Fuchsia, Pink, Rose, Slate

**Notifications**:
- Success: Green
- Error: Red
- Warning: Amber
- Info: Blue
- Task: Purple
- Message: Indigo
- Lead: Orange
- Customer: Cyan

## Best Practices

### Tags

1. **Naming**
   - Use clear, descriptive names
   - Keep names short (1-3 words)
   - Use consistent capitalization

2. **Organization**
   - Create tags for different dimensions (status, type, priority)
   - Avoid redundant tags
   - Regularly review and clean up unused tags

3. **Filtering**
   - Use AND logic when you need strict filtering
   - Use OR logic for broader searches
   - Combine with other filters for precision

### Notifications

1. **Creation**
   - Use appropriate priority levels
   - Include relevant context in message
   - Link to related entities when possible

2. **Management**
   - Regularly archive old notifications
   - Use categories for organization
   - Set expiration dates for time-sensitive notifications

3. **User Experience**
   - Don't spam with low-priority notifications
   - Group related notifications
   - Provide clear action paths

## Performance Considerations

1. **Tag Operations**
   - Tag statistics are computed on-demand
   - Consider caching for large datasets
   - Batch operations when possible

2. **Notifications**
   - Real-time subscription uses Firestore listeners
   - Implement pagination for large notification lists
   - Archive old notifications regularly

3. **Filtering**
   - Client-side filtering for better UX
   - Consider server-side filtering for large datasets
   - Use indexes for complex queries

## Future Enhancements

1. **Tags**
   - Tag hierarchies (parent/child tags)
   - Tag templates for different entity types
   - Bulk tag operations
   - Tag analytics dashboard

2. **Notifications**
   - Email notifications
   - SMS notifications
   - Notification scheduling
   - Notification templates
   - User notification preferences
   - Notification rules/automation

3. **Integration**
   - Slack integration
   - Teams integration
   - Calendar sync for task notifications
   - Webhook support

## Troubleshooting

### Tags Not Appearing

1. Check that tags are properly saved to Firestore
2. Verify entity has `tags` array field
3. Clear browser cache and reload

### Notifications Not Showing

1. Check Firestore `notifications` collection exists
2. Verify notification creation is not throwing errors
3. Check browser console for errors
4. Verify real-time subscription is active

### Performance Issues

1. Reduce number of real-time subscriptions
2. Implement pagination for large lists
3. Archive old notifications
4. Use indexes on frequently filtered fields

## Support

For issues or questions, refer to the main README.md or contact the development team.
