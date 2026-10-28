import { MediaItem } from '../../shared/types';
import { secureStorage } from '../../core/storage/secureStorage';

export const CATALOG_CACHE_KEY = 'filmmax_catalog_v1';

export const normalizeCatalogItem = (
  item: Partial<MediaItem> | null | undefined
): MediaItem => ({
  id: item?.id ?? `item-${Date.now()}`,
  title: item?.title || 'عنوان غير متاح',
  type: item?.type || 'movie',
  poster:
    item?.poster ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
  backdrop: item?.backdrop,
  overview: item?.overview || 'وصف غير متاح',
  genres: Array.isArray(item?.genres) && item!.genres.length > 0 ? item!.genres : ['مميز'],
  rating: item?.rating ?? 8.5,
  year: item?.year ?? '2026',
  duration: item?.duration || '2h 00m',
  videoUrl: item?.videoUrl || 'https://example.com/video',
  isFeatured: item?.isFeatured ?? true,
  isTrending: item?.isTrending ?? true,
  matchScore: item?.matchScore ?? 88,
  quality: item?.quality || '4K'
});

export const catalogService = {
  getCatalog: async (): Promise<MediaItem[]> => {
    const cached = secureStorage.getItem<MediaItem[]>(CATALOG_CACHE_KEY, []);
    if (cached.length > 0) return cached;

    try {
      const response = await fetch('/api/catalog');
      if (!response.ok) return [];

      const result = await response.json();
      const items = Array.isArray(result) ? result.map(normalizeCatalogItem) : [];

      secureStorage.setItem(CATALOG_CACHE_KEY, items);
      return items;
    } catch {
      return [];
    }
  },

  saveCatalog: (items: MediaItem[]) => {
    secureStorage.setItem(CATALOG_CACHE_KEY, items);
  }
};
