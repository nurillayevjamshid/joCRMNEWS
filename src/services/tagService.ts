import { dataService } from './dataService';

/**
 * Tag Service - Manages tags across the CRM system
 * Supports tagging for customers, leads, projects, and tasks
 */

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
  usageCount?: number;
}

export interface TagAssignment {
  entityId: string;
  entityType: 'customer' | 'lead' | 'project' | 'task';
  tags: string[];
}

// Predefined tag colors for consistency
export const TAG_COLORS = [
  'bg-red-50 text-red-600 border-red-200',
  'bg-orange-50 text-orange-600 border-orange-200',
  'bg-amber-50 text-amber-600 border-amber-200',
  'bg-yellow-50 text-yellow-600 border-yellow-200',
  'bg-lime-50 text-lime-600 border-lime-200',
  'bg-green-50 text-green-600 border-green-200',
  'bg-emerald-50 text-emerald-600 border-emerald-200',
  'bg-teal-50 text-teal-600 border-teal-200',
  'bg-cyan-50 text-cyan-600 border-cyan-200',
  'bg-sky-50 text-sky-600 border-sky-200',
  'bg-blue-50 text-blue-600 border-blue-200',
  'bg-indigo-50 text-indigo-600 border-indigo-200',
  'bg-violet-50 text-violet-600 border-violet-200',
  'bg-purple-50 text-purple-600 border-purple-200',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
  'bg-pink-50 text-pink-600 border-pink-200',
  'bg-rose-50 text-rose-600 border-rose-200',
  'bg-slate-50 text-slate-600 border-slate-200',
];

// Predefined tags for quick access
export const PREDEFINED_TAGS = [
  { name: 'VIP', color: 'bg-red-50 text-red-600 border-red-200' },
  { name: 'Yangi', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { name: 'Faol', color: 'bg-green-50 text-green-600 border-green-200' },
  { name: 'Nofaol', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { name: 'Potensial', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { name: 'Asosiy', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { name: 'Qo\'shimcha', color: 'bg-violet-50 text-violet-600 border-violet-200' },
  { name: 'Loyalist', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { name: 'Muammoli', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { name: 'Tez o\'suvchi', color: 'bg-orange-50 text-orange-600 border-orange-200' },
];

export const tagService = {
  /**
   * Create a new tag
   */
  async createTag(name: string, color?: string): Promise<Tag> {
    try {
      const tagId = `tag_${Date.now()}`;
      const tag: Tag = {
        id: tagId,
        name,
        color: color || TAG_COLORS[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      };
      
      await dataService.saveData('tags', tag, tagId);
      return tag;
    } catch (error) {
      console.error('Tegni yaratishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Get all tags
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const tags = await dataService.getCollection('tags');
      return tags as Tag[];
    } catch (error) {
      console.error('Teglarni yuklashda xatolik:', error);
      return [];
    }
  },

  /**
   * Get tag by ID
   */
  async getTag(tagId: string): Promise<Tag | null> {
    try {
      const tag = await dataService.getDocument('tags', tagId);
      return tag as Tag | null;
    } catch (error) {
      console.error('Tegni yuklashda xatolik:', error);
      return null;
    }
  },

  /**
   * Update a tag
   */
  async updateTag(tagId: string, updates: Partial<Tag>): Promise<void> {
    try {
      await dataService.updateData('tags', tagId, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Tegni yangilashda xatolik:', error);
      throw error;
    }
  },

  /**
   * Delete a tag
   */
  async deleteTag(tagId: string): Promise<void> {
    try {
      await dataService.deleteData('tags', tagId);
    } catch (error) {
      console.error('Tegni o\'chirishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Add tags to an entity (customer, lead, project, task)
   */
  async addTagsToEntity(
    entityId: string,
    entityType: 'customer' | 'lead' | 'project' | 'task',
    tagNames: string[]
  ): Promise<void> {
    try {
      const entity = await dataService.getDocument(entityType === 'customer' ? 'customers' : entityType === 'lead' ? 'leads' : entityType === 'project' ? 'projects' : 'tasks', entityId);
      
      if (!entity) {
        throw new Error(`${entityType} topilmadi`);
      }

      const currentTags = entity.tags || [];
      const newTags = Array.from(new Set([...currentTags, ...tagNames]));

      await dataService.updateData(
        entityType === 'customer' ? 'customers' : entityType === 'lead' ? 'leads' : entityType === 'project' ? 'projects' : 'tasks',
        entityId,
        { tags: newTags }
      );
    } catch (error) {
      console.error('Tegni qo\'shishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Remove tags from an entity
   */
  async removeTagsFromEntity(
    entityId: string,
    entityType: 'customer' | 'lead' | 'project' | 'task',
    tagNames: string[]
  ): Promise<void> {
    try {
      const collectionName = entityType === 'customer' ? 'customers' : entityType === 'lead' ? 'leads' : entityType === 'project' ? 'projects' : 'tasks';
      const entity = await dataService.getDocument(collectionName, entityId);
      
      if (!entity) {
        throw new Error(`${entityType} topilmadi`);
      }

      const currentTags = entity.tags || [];
      const updatedTags = currentTags.filter((tag: string) => !tagNames.includes(tag));

      await dataService.updateData(collectionName, entityId, { tags: updatedTags });
    } catch (error) {
      console.error('Tegni o\'chirishda xatolik:', error);
      throw error;
    }
  },

  /**
   * Get all entities with a specific tag
   */
  async getEntitiesByTag(tagName: string, entityType?: 'customer' | 'lead' | 'project' | 'task'): Promise<any[]> {
    try {
      const collections = entityType 
        ? [entityType === 'customer' ? 'customers' : entityType === 'lead' ? 'leads' : entityType === 'project' ? 'projects' : 'tasks']
        : ['customers', 'leads', 'projects', 'tasks'];

      const results: any[] = [];

      for (const collection of collections) {
        const items = await dataService.getCollection(collection);
        const filtered = items.filter((item: any) => item.tags && item.tags.includes(tagName));
        results.push(...filtered);
      }

      return results;
    } catch (error) {
      console.error('Tegga ega entitiylarni yuklashda xatolik:', error);
      return [];
    }
  },

  /**
   * Get tag statistics
   */
  async getTagStatistics(): Promise<Record<string, number>> {
    try {
      const stats: Record<string, number> = {};
      const collections = ['customers', 'leads', 'projects', 'tasks'];

      for (const collection of collections) {
        const items = await dataService.getCollection(collection);
        items.forEach((item: any) => {
          if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach((tag: string) => {
              stats[tag] = (stats[tag] || 0) + 1;
            });
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Teg statistikasini yuklashda xatolik:', error);
      return {};
    }
  },

  /**
   * Search entities by tags (multiple tags with AND/OR logic)
   */
  async searchByTags(
    tags: string[],
    entityType?: 'customer' | 'lead' | 'project' | 'task',
    matchAll: boolean = false
  ): Promise<any[]> {
    try {
      const collections = entityType 
        ? [entityType === 'customer' ? 'customers' : entityType === 'lead' ? 'leads' : entityType === 'project' ? 'projects' : 'tasks']
        : ['customers', 'leads', 'projects', 'tasks'];

      const results: any[] = [];

      for (const collection of collections) {
        const items = await dataService.getCollection(collection);
        const filtered = items.filter((item: any) => {
          if (!item.tags || !Array.isArray(item.tags)) return false;
          
          if (matchAll) {
            return tags.every(tag => item.tags.includes(tag));
          } else {
            return tags.some(tag => item.tags.includes(tag));
          }
        });
        results.push(...filtered);
      }

      return results;
    } catch (error) {
      console.error('Teglar bo\'yicha qidiruvda xatolik:', error);
      return [];
    }
  },
};
