import { MediaItem } from '../../shared/types';
import { secureStorage } from '../../core/storage/secureStorage';

export const REELS_CACHE_KEY = 'filmmax_reels_v1';

export const reelsService = {
  getReels: async (): Promise<MediaItem[]> => {
    const cached = secureStorage.getItem<MediaItem[]>(REELS_CACHE_KEY, []);
    if (cached.length > 0) return cached;

    try {
      const response = await fetch('/api/reels');
      if (!response.ok) return [];

      const json = await response.json();
      const items = Array.isArray(json) ? json : [];
      secureStorage.setItem(REELS_CACHE_KEY, items);
      return items;
    } catch {
      return [];
    }
  }
};
