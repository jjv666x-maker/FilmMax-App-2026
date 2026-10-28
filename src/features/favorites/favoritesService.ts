import { secureStorage } from '../../core/storage/secureStorage';

export const FAVORITES_KEY = 'filmmax_favorites_v1';

export const favoritesService = {
  getFavorites: (): Array<string | number> => {
    return secureStorage.getItem<Array<string | number>>(FAVORITES_KEY, []);
  },

  toggleFavorite: (id: string | number): Array<string | number> => {
    const current = favoritesService.getFavorites();
    const exists = current.includes(id);
    const next = exists
      ? current.filter((item) => item !== id)
      : [...current, id];

    secureStorage.setItem(FAVORITES_KEY, next);
    return next;
  }
};
