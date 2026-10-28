import { LiveChannel } from '../../shared/types';
import { secureStorage } from '../../core/storage/secureStorage';

export const LIVE_CACHE_KEY = 'filmmax_live_v1';

export const liveService = {
  getLiveChannels: async (): Promise<LiveChannel[]> => {
    const cached = secureStorage.getItem<LiveChannel[]>(LIVE_CACHE_KEY, []);
    if (cached.length > 0) return cached;

    try {
      const response = await fetch('/api/live');
      if (!response.ok) return [];

      const json = await response.json();
      const items = Array.isArray(json) ? json : [];
      secureStorage.setItem(LIVE_CACHE_KEY, items);
      return items;
    } catch {
      return [];
    }
  }
};
