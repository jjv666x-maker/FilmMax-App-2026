import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { Movie, UserProfile, UserAccount } from '../types';
import { filmmaxStorage } from '../services/filmmaxStorage';
import {
  buildPlatformState,
  defaultPlatformState,
  PlatformState
} from '../services/platformStateModel';
import {
  buildCatalogSections,
  loadCatalogCache,
  saveCatalogCache
} from '../services/catalogService';
import {
  getActiveProfile,
  getUserAccounts,
  setActiveProfile,
  setUserAccounts
} from '../services/profileService';
import {
  getContinueWatchingList,
  saveProgress,
  resumeProgressFromServer
} from '../services/watchProgressService';
import { buildHomeFeed } from '../services/homeFeedService';

interface AppPlatformContextValue {
  platform: PlatformState;
  movies: Movie[];
  activeProfile: UserProfile | null;
  accounts: UserAccount[];
  homeFeed: any[];
  setSession: (session: any) => void;
  setSelectedProfile: (profileId: string) => void;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  saveMovieProgress: (movie: Movie, currentTime: number, duration: number) => void;
  reloadHomeFeed: () => void;
}

const AppPlatformContext = createContext<AppPlatformContextValue | null>(null);

export const AppPlatformProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [platform, setPlatform] = useState<PlatformState>(() => {
    const stored = filmmaxStorage.getItem<PlatformState | null>(
      'filmmax_platform_state_v1',
      defaultPlatformState
    );
    return buildPlatformState(stored || defaultPlatformState);
  });

  const [movies, setMovies] = useState<Movie[]>(() => {
    const cached = loadCatalogCache();
    return cached.length > 0 ? cached : [];
  });

  const [activeProfile, setActiveProfileState] = useState<UserProfile | null>(() => {
    return getActiveProfile();
  });

  const [accounts, setAccountsState] = useState<UserAccount[]>(() => {
    return getUserAccounts();
  });

  const [homeFeed, setHomeFeed] = useState<any[]>([]);

  useEffect(() => {
    filmmaxStorage.setItem('filmmax_platform_state_v1', platform);
  }, [platform]);

  useEffect(() => {
    if (movies.length > 0) {
      saveCatalogCache(movies);
    }
  }, [movies]);

  useEffect(() => {
    const sections = buildHomeFeed({
      movies,
      continueWatching: platform.continueWatching as any[],
      recommendations: platform.recommendations,
      liveItems: [],
      limit: 12
    });

    setHomeFeed(sections);
  }, [movies, platform.continueWatching, platform.recommendations]);

  const setSession = (session: any) => {
    setPlatform(prev => ({
      ...prev,
      session: {
        userId: session.userId || 'guest',
        token: session.token || 'guest-token',
        profileId: session.profileId || 'profile-default',
        isAuthenticated: Boolean(session.isAuthenticated ?? true),
        lastSeen: Date.now()
      }
    }));
  };

  const setSelectedProfile = (profileId: string) => {
    setPlatform(prev => ({
      ...prev,
      selectedProfileId: profileId
    }));
  };

  const saveMovieProgress = (movie: Movie, currentTime: number, duration: number) => {
    const current = {
      id: `cw-${movie.id}`,
      videoId: movie.id,
      title: movie.title,
      poster: movie.poster,
      currentTime,
      duration,
      lastWatched: Date.now(),
      progress: duration > 0 ? (currentTime / duration) * 100 : 0,
      type: (movie.type === 'مسلسل' || movie.type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv'
    };

    saveProgress(platform.session?.userId || 'guest-user', current);

    setPlatform(prev => ({
      ...prev,
      continueWatching: [current, ...prev.continueWatching.filter(item => String(item.videoId) !== String(movie.id))].slice(0, 15)
    }));
  };

  const reloadHomeFeed = () => {
    const sections = buildHomeFeed({
      movies,
      continueWatching: platform.continueWatching as any[],
      recommendations: platform.recommendations,
      liveItems: [],
      limit: 12
    });

    setHomeFeed(sections);
  };

  const value = useMemo<AppPlatformContextValue>(() => ({
    platform,
    movies,
    activeProfile,
    accounts,
    homeFeed,
    setSession,
    setSelectedProfile,
    setMovies,
    saveMovieProgress,
    reloadHomeFeed
  }), [platform, movies, activeProfile, accounts, homeFeed]);

  return (
    <AppPlatformContext.Provider value={value}>
      {children}
    </AppPlatformContext.Provider>
  );
};

export const useAppPlatform = (): AppPlatformContextValue => {
  const context = useContext(AppPlatformContext);
  if (!context) {
    throw new Error('useAppPlatform must be used within AppPlatformProvider');
  }
  return context;
};
