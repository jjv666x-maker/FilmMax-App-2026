import { create } from 'zustand';
import { MediaItem, UserProfile, UserAccount, ContinueWatching } from '../shared/types';
import { catalogService } from '../features/catalog/catalogService';
import { getActiveProfile, getUserAccounts } from '../features/profiles/profileService';
import { getContinueWatchingList } from '../features/watch/watchProgressService';
import { favoritesService } from '../features/favorites/favoritesService';
import { buildTasteProfile, enrichWithRecommendationScores } from '../features/catalog/recommendationEngine';

interface AppStoreState {
  movies: MediaItem[];
  activeProfile: UserProfile | null;
  accounts: UserAccount[];
  continueWatching: ContinueWatching[];
  favorites: Array<string | number>;
  recommendations: MediaItem[];
  isLoading: boolean;
  loadInitialData: () => Promise<void>;
}

export const useAppStore = create<AppStoreState>((set) => ({
  movies: [],
  activeProfile: null,
  accounts: [],
  continueWatching: [],
  favorites: [],
  recommendations: [],
  isLoading: false,

  loadInitialData: async () => {
    set({ isLoading: true });

    const [catalog, profile, accounts, progress, favorites] = await Promise.all([
      catalogService.getCatalog(),
      Promise.resolve(getActiveProfile()),
      Promise.resolve(getUserAccounts()),
      Promise.resolve(getContinueWatchingList('guest-user')),
      Promise.resolve(favoritesService.getFavorites())
    ]);

    const tasteProfile = buildTasteProfile(catalog);
    const enriched = enrichWithRecommendationScores(catalog, tasteProfile);

    set({
      movies: catalog,
      activeProfile: profile,
      accounts,
      continueWatching: progress,
      favorites,
      recommendations: enriched.slice(0, 12),
      isLoading: false
    });
  }
}));
