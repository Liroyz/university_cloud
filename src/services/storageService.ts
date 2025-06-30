import { api } from './api';

export interface StorageInfo {
  used: number; // в байтах
  total: number; // в байтах
  used_percentage: number;
}

export interface CacheInfo {
  size: number; // в байтах
  items_count: number;
}

class StorageService {
  // Получить информацию о хранилище пользователя
  async getStorageInfo(): Promise<StorageInfo> {
    try {
      const response = await api.get<StorageInfo>('/storage/info/');
      return response.data;
    } catch (error) {
      console.error('Error getting storage info:', error);
      // Возвращаем дефолтные значения в случае ошибки
      return {
        used: 0,
        total: 10 * 1024 * 1024 * 1024, // 10 GB в байтах
        used_percentage: 0
      };
    }
  }

  // Получить информацию о кэше
  async getCacheInfo(): Promise<CacheInfo> {
    try {
      const response = await api.get<CacheInfo>('/storage/cache/info/');
      return response.data;
    } catch (error) {
      console.error('Error getting cache info:', error);
      // Возвращаем дефолтные значения в случае ошибки
      return {
        size: 0,
        items_count: 0
      };
    }
  }

  // Очистить кэш
  async clearCache(): Promise<void> {
    try {
      await api.post('/storage/cache/clear/');
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Не выбрасываем ошибку, просто логируем
      // В реальном приложении здесь можно добавить fallback логику
    }
  }

  // Очистить localStorage кэш (клиентская сторона)
  clearLocalCache(): void {
    try {
      // Очищаем все данные, кроме аутентификации
      const keysToKeep = ['auth_token', 'refresh_token', 'user_data'];
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Очищаем sessionStorage
      sessionStorage.clear();
      
      console.log('Local cache cleared successfully');
    } catch (error) {
      console.error('Error clearing local cache:', error);
      throw new Error('Ошибка при очистке локального кэша');
    }
  }

  // Форматировать размер файла
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Б';
    
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Получить процент использования
  getUsagePercentage(used: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  }
}

export const storageService = new StorageService(); 