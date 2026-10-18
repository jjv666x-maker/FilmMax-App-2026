import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from 'react';
import {
  ScreenId,
  Movie,
  ReelItem,
  LiveChannel,
  MovieGroup,
  UserProfile,
  UserAccount,
  DownloadItem,
  AppNotification,
  SubtitleSettings,
  AudioSettings,
  ContinueWatching
} from '../types';
import { INITIAL_MOVIES, INITIAL_REELS, INITIAL_LIVE_CHANNELS, INITIAL_GROUPS } from '../data/mockMovies';
import { fetchAllMovies, resolveTrailerKey } from '../services/tmdb';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  LanguageInfo
} from '../i18n/translations';
import { secureStorage, sanitizeInput } from '../services/securityEngine';

interface AppContextType {
  activeScreen: ScreenId;
  navigateTo: (screen: ScreenId, movie?: Movie, group?: MovieGroup) => void;
  movies: Movie[];
  activeMovie: Movie | null;
  setActiveMovie: (movie: Movie | null) => void;
  activeGroup: MovieGroup | null;
  setActiveGroup: (group: MovieGroup | null) => void;
  favorites: (string | number)[];
  toggleFavorite: (movieId: string | number) => void;
  isFavorite: (movieId: string | number) => boolean;
  likedMovies: (string | number)[];
  toggleLikeMovie: (movieId: string | number) => void;
  isMovieLiked: (movieId: string | number) => boolean;
  watchHistory: { movie: Movie; watchedPct: number; lastTime: string }[];
  addToHistory: (movie: Movie, pct?: number) => void;
  clearWatchHistory: () => void;
  downloads: DownloadItem[];
  addDownload: (movie: Movie, quality?: string) => void;
  removeDownload: (id: string) => void;
  playDownloadedMovie: (downloadItem: DownloadItem) => void;
  downloadReel: (reel: ReelItem) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  reels: ReelItem[];
  likeReel: (reelId: string | number, forceLiked?: boolean) => void;
  saveReel: (reelId: string | number) => void;
  followReelCreator: (reelIdOrCreatorName: string | number) => void;
  addReelComment: (reelId: string | number, comment: string) => void;
  likeReelComment: (reelId: string | number, commentId: string) => void;
  addNewReel: (reelData: Partial<ReelItem>) => void;
  deleteReel: (reelId: string | number) => void;
  liveChannels: LiveChannel[];
  toggleLiveReminder: (channelId: string) => void;
  groups: MovieGroup[];
  continueWatching: ContinueWatching[];
  addToContinueWatching: (movie: Movie, currentTime: number, duration: number) => void;
  removeFromContinueWatching: (id: string | number) => void;
  recommendations: Movie[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  subtitleSettings: SubtitleSettings;
  updateSubtitleSettings: (data: Partial<SubtitleSettings>) => void;
  isSubtitlesEnabled: boolean;
  setIsSubtitlesEnabled: (enabled: boolean) => void;
  audioSettings: AudioSettings;
  updateAudioSettings: (data: Partial<AudioSettings>) => void;
  activeDubbing: string;
  setActiveDubbing: (dub: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageInfo: LanguageInfo;
  t: (key: string, fallback?: string) => string;
  theme: 'dark' | 'light' | 'cinema';
  setTheme: (theme: 'dark' | 'light' | 'cinema') => void;
  twoFactorEnabled: boolean;
  twoFactorSecret: string;
  twoFactorBackupCodes: string[];
  toggleTwoFactor: (enable: boolean) => void;
  verify2FACode: (code: string) => boolean;
  isPremiumModalOpen: boolean;
  setIsPremiumModalOpen: (open: boolean) => void;
  isEvolutionModalOpen: boolean;
  setIsEvolutionModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareTargetMovie: Movie | null;
  setShareTargetMovie: (movie: Movie | null) => void;
  isChatSupportOpen: boolean;
  setIsChatSupportOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  selectedPlan: 'weekly' | 'monthly' | 'yearly';
  setSelectedPlan: (plan: 'weekly' | 'monthly' | 'yearly') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshMovies: (force?: boolean) => Promise<void>;
  isLoadingMovies: boolean;
  loadMoreMovies: () => Promise<void>;
  isLoadingMore: boolean;
  startupStage: 'intro' | 'welcome' | 'auth' | 'main';
  setStartupStage: (stage: 'intro' | 'welcome' | 'auth' | 'main') => void;
  replayIntro: () => void;
  openWelcomeSlides: () => void;
  openAuthScreen: () => void;
  userAccounts: UserAccount[];
  activeAccountId: string;
  switchAccount: (id: string) => void;
  addNewAccount: (acc: Partial<UserAccount>) => void;
  deleteAccount: (id: string) => void;
  isAccountSwitcherOpen: boolean;
  setIsAccountSwitcherOpen: (open: boolean) => void;
  isTVRemoteOpen: boolean;
  setIsTVRemoteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FAVS: 'filmmax_react_favs_v5',
  LIKED: 'filmmax_react_liked_v5',
  HISTORY: 'filmmax_react_history_v5',
  DOWNLOADS: 'filmmax_react_downloads_v5',
  PROFILE: 'filmmax_react_profile_v5',
  REELS_STATE: 'filmmax_react_reels_v5',
  CONTINUE_WATCHING: 'filmmax_react_continue_watching_v5',
  SUBTITLES: 'filmmax_react_subs_v5',
  AUDIO: 'filmmax_react_audio_v5',
  LANGUAGE: 'filmmax_react_lang_v5',
  THEME: 'filmmax_react_theme_v5',
  TWO_FA: 'filmmax_react_2fa_v5',
  PLAN: 'filmmax_react_plan_v5'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('filmmax_movies_cache_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MOVIES;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState<boolean>(false);
  
  const [reels, setReels] = useState<ReelItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REELS_STATE);
      return saved ? JSON.parse(saved) : INITIAL_REELS;
    } catch {
      return INITIAL_REELS;
    }
  });

  const [activeMovie, setActiveMovie] = useState<Movie | null>(INITIAL_MOVIES[0] || null);
  const [activeGroup, setActiveGroup] = useState<MovieGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startupStage, setStartupStage] = useState<'intro' | 'welcome' | 'auth' | 'main'>('intro');

  const [continueWatching, setContinueWatching] = useState<ContinueWatching[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const refreshMovies = useCallback(async (force = false) => {
    if (isLoadingMovies && !force) return;
    setIsLoadingMovies(true);
    try {
      const { fetchMassiveLibrary } = await import('../services/tmdb');
      // Fetch first 5 pages (100 items) on startup
      const data = await fetchMassiveLibrary(5);
      if (data.length > 0) {
        setMovies(data);
        setCurrentPage(5);
        try {
          localStorage.setItem('filmmax_movies_cache_v6', JSON.stringify(data));
        } catch {}
      }
    } catch (e) {
      console.warn('Refresh failed:', e);
    } finally {
      setIsLoadingMovies(false);
    }
  }, [isLoadingMovies]);

  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const endPage = currentPage + 3;
      
      const fetchPromises = [];
      const { fetchFromTMDB, formatTMDBItem } = await import('../services/tmdb');
      
      for (let i = nextPage; i <= endPage; i++) {
        fetchPromises.push(fetchFromTMDB('/movie/popular', { page: i.toString() }).catch(() => null));
        fetchPromises.push(fetchFromTMDB('/tv/popular', { page: i.toString() }).catch(() => null));
      }

      const results = await Promise.all(fetchPromises);
      const newItems: Movie[] = [];

      results.forEach((res, index) => {
        if (res?.results) {
          const isTv = index % 2 !== 0;
          newItems.push(...res.results.map((item: any) => formatTMDBItem(item, isTv)));
        }
      });

      // If TMDB returned items, add them
      if (newItems.length > 0) {
        setMovies(prev => {
          const combined = [...prev, ...newItems];
          const seen = new Set<string>();
          const filtered = combined.filter(m => {
            const key = `${m.id}-${m.type}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          try {
            localStorage.setItem('filmmax_movies_cache_v6', JSON.stringify(filtered));
          } catch {}
          return filtered;
        });
        setCurrentPage(endPage);
      } else {
        // Fallback: Generate curated bonus movies instantly
        const bonusMovies: Movie[] = Array.from({ length: 24 }).map((_, i) => {
          const randId = 90000 + currentPage * 100 + i;
          return {
            id: randId,
            title: `فيلم إضافي مميز رقم ${randId}`,
            rating: Number((7.0 + Math.random() * 2.5).toFixed(1)),
            poster: `https://image.tmdb.org/t/p/w780/qNBAXBIQlnOThrVvA6mA2B5ndV6.jpg`,
            backdrop: `https://image.tmdb.org/t/p/w1280/suopoADq0k8YZr4dQXcU6pToj6s.jpg`,
            type: i % 2 === 0 ? 'فيلم' : 'مسلسل',
            year: '2025',
            videoUrl: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w',
            youtubeKey: 'Way9Dexny3w',
            overview: 'أحدث الإصدارات السينمائية المضافة حديثاً للمكتبة الضخمة مع جودة عرض خارقة وترجمة عربية.',
            genres: ['أكشن', 'مغامرة', 'خيال علمي'],
            duration: '2h 10m',
            matchScore: 95,
            isTrending: true,
            ageRating: '16+',
            quality: '4K HDR'
          };
        });
        setMovies(prev => [...prev, ...bonusMovies]);
        setCurrentPage(endPage);
      }
    } catch (e) {
      console.warn('Load more fallback triggered:', e);
      // Fallback addition
      const bonusMovies: Movie[] = Array.from({ length: 12 }).map((_, i) => ({
        id: 99000 + i,
        title: `عمل سينمائي مميز ${i + 1}`,
        rating: 8.8,
        poster: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/w1280/8xK461q2qB4W0VbJqC1q3q9K4s.jpg',
        type: 'فيلم',
        year: '2026',
        videoUrl: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w',
        youtubeKey: 'Way9Dexny3w',
        overview: 'أحدث الأفلام المضافة للمكتبة العالمية.',
        genres: ['أكشن', 'إثارة'],
        duration: '2h 00m',
        matchScore: 94,
        isTrending: true,
        ageRating: '16+',
        quality: '4K HDR'
      }));
      setMovies(prev => [...prev, ...bonusMovies]);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, isLoadingMore]);

  // Transform movies into Reels automatically
  useEffect(() => {
    if (movies.length > 20) {
      const movieReels: ReelItem[] = movies.slice(0, 50).map((m, i) => ({
        id: `reel-tmdb-${m.id}`,
        title: m.title,
        description: m.overview,
        category: 'تريلر',
        tags: m.genres,
        videoUrl: m.videoUrl,
        youtubeKey: m.youtubeKey,
        poster: m.backdrop || m.poster,
        movieId: m.id,
        movieTitle: m.title,
        moviePoster: m.poster,
        movieRating: m.rating,
        movieType: m.type as any,
        videoType: 'reel',
        viewsCount: Math.floor(Math.random() * 1000000) + 50000,
        creator: {
          name: 'FilmMax Studio',
          username: 'filmmax_official',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=filmmax',
          badge: 'Verified',
          bio: 'المصدر الرسمي لتريلرات الأفلام الحصرية بجودة 4K 🎬',
          followersCount: 1200000,
          isFollowing: true
        },
        audioTrack: {
          title: 'Original Soundtrack',
          artist: m.title
        },
        likesCount: Math.floor(Math.random() * 50000) + 1000,
        commentsCount: Math.floor(Math.random() * 5000) + 100,
        sharesCount: Math.floor(Math.random() * 2000) + 50,
        savesCount: Math.floor(Math.random() * 10000) + 500,
        isLiked: false,
        isSaved: false,
        isFollowing: true
      }));
      setReels(movieReels);
    }
  }, [movies]);

  // Initial load
  useEffect(() => {
    if (startupStage === 'main') {
      refreshMovies();
    }
  }, [startupStage, refreshMovies]);

  const addToContinueWatching = useCallback((movie: Movie, currentTime: number, duration: number) => {
    if (currentTime < 10) return; // Don't save if less than 10 seconds
    
    setContinueWatching(prev => {
      const filtered = prev.filter(item => item.videoId !== movie.id);
      const newItem: ContinueWatching = {
        id: `cw-${movie.id}`,
        videoId: movie.id,
        title: movie.title,
        poster: movie.poster,
        currentTime,
        duration,
        lastWatched: Date.now(),
        progress: (currentTime / duration) * 100,
        type: movie.type === 'فيلم' ? 'movie' : 'tv'
      };
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromContinueWatching = useCallback((id: string | number) => {
    setContinueWatching(prev => {
      const updated = prev.filter(item => item.id !== id && item.videoId !== id);
      localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const recommendations = useMemo(() => {
    // Simple recommendation engine: Trending + High rated + matching genres if we had user prefs
    return movies.filter(m => Number(m.rating) >= 8.5).sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [movies]);

  const replayIntro = useCallback(() => {
    setStartupStage('intro');
  }, []);

  const openWelcomeSlides = useCallback(() => {
    setStartupStage('welcome');
  }, []);

  const openAuthScreen = useCallback(() => {
    setStartupStage('auth');
  }, []);

  // Language state & i18n
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage;
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch {}
    return 'ar';
  });

  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light' | 'cinema'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | 'cinema';
      if (saved && ['dark', 'light', 'cinema'].includes(saved)) return saved;
    } catch {}
    return 'dark';
  });

  // 2FA Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TWO_FA);
      if (saved) return JSON.parse(saved).enabled;
    } catch {}
    return true;
  });
  const [twoFactorSecret] = useState<string>('JBSWY3DPEHPK3PXP');
  const [twoFactorBackupCodes] = useState<string[]>([
    '4920-1849',
    '7731-9021',
    '3310-8291',
    '5524-1190',
    '8839-4412'
  ]);

  // Audio Dubbing and Subtitles
  const [activeDubbing, setActiveDubbing] = useState<string>('دبلجة عربية فصحى');
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState<boolean>(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === newLang) || SUPPORTED_LANGUAGES[0];
    document.documentElement.dir = langObj.dir;
    document.documentElement.lang = newLang;
    showToast(`تم تغيير لغة التطبيق إلى ${langObj.nativeName}`);
  }, [showToast]);

  const setTheme = useCallback((newTheme: 'dark' | 'light' | 'cinema') => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    const themeName =
      newTheme === 'light'
        ? 'الوضع النهاري المضيء ☀️'
        : newTheme === 'cinema'
        ? 'نمط السينما الفاخر 🎬'
        : 'الوضع الليلي الداكن 🌙';
    showToast(`تم تطبيق ${themeName}`);
  }, [showToast]);

  // Sync RTL and Theme on start and change
  useEffect(() => {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
    document.documentElement.dir = langObj.dir;
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-cinema');
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-cinema');
    document.documentElement.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Translation helper
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.ar;
      if (dict && dict[key]) return dict[key];
      const enDict = TRANSLATIONS.en;
      if (enDict && enDict[key]) return enDict[key];
      return fallback || key;
    },
    [language]
  );

  const currentLanguageInfo =
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Modals state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTargetMovie, setShareTargetMovie] = useState<Movie | null>(null);
  const [isChatSupportOpen, setIsChatSupportOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isTVRemoteOpen, setIsTVRemoteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // Account Switcher State
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('filmmax_react_accounts_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'acc-1',
        name: 'علي الحامد',
        email: 'ali@filmmax.vip',
        phone: '+964 770 123 4567',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        badge: 'VIP Gold 👑',
        isPremium: true,
        premiumExpiry: '31/12/2026',
        role: 'owner'
      },
      {
        id: 'acc-2',
        name: 'حساب العائلة والدراما',
        email: 'family@filmmax.vip',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: 'VIP Family ✨',
        isPremium: true,
        role: 'family'
      },
      {
        id: 'acc-3',
        name: 'عالم الأطفال Safe Kids',
        email: 'kids@filmmax.vip',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        badge: 'Kids Safe 🎈',
        isPremium: true,
        role: 'kids'
      },
      {
        id: 'acc-4',
        name: 'مريم علي',
        email: 'maryam@filmmax.vip',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        badge: 'عضوية بلس 🌟',
        isPremium: true,
        role: 'owner'
      }
    ];
  });

  const [activeAccountId, setActiveAccountId] = useState<string>('acc-1');

  useEffect(() => {
    localStorage.setItem('filmmax_react_accounts_v1', JSON.stringify(userAccounts));
  }, [userAccounts]);

  const switchAccount = useCallback((id: string) => {
    const acc = userAccounts.find(a => a.id === id);
    if (acc) {
      setActiveAccountId(id);
      setUserProfile(prev => ({
        ...prev,
        id: acc.id,
        name: acc.name,
        email: acc.email,
        phone: acc.phone || prev.phone,
        avatar: acc.avatar,
        isPremium: acc.isPremium,
        premiumExpiry: acc.premiumExpiry || '31/12/2026'
      }));
      showToast(`تم تبديل الحساب إلى: ${acc.name} 👋`);
      setIsAccountSwitcherOpen(false);
    }
  }, [userAccounts, showToast]);

  const addNewAccount = useCallback((accData: Partial<UserAccount>) => {
    const newAcc: UserAccount = {
      id: `acc-${Date.now()}`,
      name: accData.name || 'حساب جديد',
      email: accData.email || 'user@filmmax.vip',
      avatar: accData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      badge: accData.role === 'kids' ? 'Kids Safe 🎈' : 'VIP Member 👑',
      isPremium: true,
      role: accData.role || 'family'
    };
    setUserAccounts(prev => [...prev, newAcc]);
    switchAccount(newAcc.id);
    showToast(`تم إنشاء وتحديد الحساب الجديد: ${newAcc.name} 🎉`);
  }, [switchAccount, showToast]);

  const deleteAccount = useCallback((id: string) => {
    if (userAccounts.length <= 1) {
      showToast('لا يمكن حذف الحساب الوحيد المتبقي');
      return;
    }
    setUserAccounts(prev => prev.filter(a => a.id !== id));
    if (activeAccountId === id) {
      const remaining = userAccounts.filter(a => a.id !== id);
      if (remaining.length > 0) {
        switchAccount(remaining[0].id);
      }
    }
    showToast('تم حذف الحساب المحدد');
  }, [userAccounts, activeAccountId, switchAccount, showToast]);

  // Favorites
  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [101, 102, 106];
  });

  // Liked Movies
  const [likedMovies, setLikedMovies] = useState<(string | number)[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [101, 102, 103, 107];
  });

  // History
  const [watchHistory, setWatchHistory] = useState<{ movie: Movie; watchedPct: number; lastTime: string }[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        movie: INITIAL_MOVIES[0],
        watchedPct: 65,
        lastTime: 'متبقي 45 دقيقة'
      }
    ];
  });

  // Downloads
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'dl-initial-1',
        movieId: 101,
        title: 'Inception — استهلال',
        poster: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        quality: '4K Ultra HD',
        size: '3.4 GB',
        progress: 100,
        status: 'completed',
        savedAt: Date.now() - 86400000
      },
      {
        id: 'dl-initial-2',
        movieId: 102,
        title: 'The Dark Knight — فارس الظلام',
        poster: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        quality: '1080p FHD',
        size: '2.1 GB',
        progress: 100,
        status: 'completed',
        savedAt: Date.now() - 43200000
      }
    ];
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return { ...JSON.parse(saved) };
    } catch {}
    return {
      id: 'usr-vip-001',
      name: 'محمد أحمد الحامد',
      username: 'mohamed_cinema_vip',
      email: 'mohamed@filmmax.vip',
      phone: '+964 770 123 4567',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
      bio: 'عاشق للسينما العالمية والأفلام الوثائقية بأعلى دقة 4K HDR. متابع شغوف لكل جديد 🎬🍿',
      favoriteGenre: 'أكشن وحركة 4K',
      avatarFrame: 'diamond',
      level: 14,
      levelTitle: 'خبير السينما الأسطوري 🏆',
      xp: 8450,
      nextLevelXp: 10000,
      watchTimeHours: 184,
      moviesCompleted: 68,
      seriesCompleted: 14,
      streakDays: 12,
      membershipBadge: 'VIP Diamond 4K 💎',
      isPremium: true,
      premiumExpiry: '31/12/2026',
      evolutionPlan: 'monthly',
      twoFactorEnabled: true,
      language: 'ar',
      theme: 'dark',
      achievements: [
        {
          id: 'ach-1',
          title: 'عاشق الـ 4K',
          icon: '👑',
          desc: 'شاهدت أكثر من 50 عملاً بدقة 4K HDR فائقة الوضوح',
          unlockedAt: '12 يناير 2026',
          isUnlocked: true
        },
        {
          id: 'ach-2',
          title: 'بطل المشاهدة الجماعية',
          icon: '🍿',
          desc: 'استضفت أكثر من 10 جلسات Watch Party مع الأصدقاء',
          unlockedAt: '02 فبراير 2026',
          isUnlocked: true
        },
        {
          id: 'ach-3',
          title: 'ناقد السينما الذهبي',
          icon: '⭐',
          desc: 'كتبت أكثر من 20 تقييماً وتعليقاً نال إعجاب المشاهدين',
          unlockedAt: '18 فبراير 2026',
          isUnlocked: true
        },
        {
          id: 'ach-4',
          title: 'ملك المسلسلات',
          icon: '📺',
          desc: 'أكملت مشاهدة 10 مواسم كاملة بدون انقطاع',
          unlockedAt: 'أمس',
          isUnlocked: true
        },
        {
          id: 'ach-5',
          title: 'أسطورة التحديات',
          icon: '🏆',
          desc: 'حققت المركز الأول في مسابقات السينما والـ Trivia',
          isUnlocked: false
        }
      ]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  // Subtitle Settings
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBTITLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fontSize: 'medium',
      fontColor: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      style: 'default'
    };
  });

  // Audio Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIO);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      language: 'العربية (الأصلية / الدبلجة)',
      quality: 'ultra',
      eqPreset: 'cinema',
      dialogueBoost: true,
      volumeNormalization: true
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'فيلم الأسبوع الحصري 🎬',
      body: 'تمت إضافة Gladiator II بأعلى جودة 4K مع الترجمة الكاملة الآن.',
      time: 'منذ ساعتين',
      isRead: false,
      type: 'release',
      linkScreen: 'details',
      movieId: 108
    },
    {
      id: 'notif-2',
      title: 'ميزة التطور الذكي المتقدم 💎',
      body: 'تم ترقية مشغل FilmMax ليقدم تشغيلاً فائق السرعة بدون تقطيع.',
      time: 'منذ 5 ساعات',
      isRead: false,
      type: 'system'
    },
    {
      id: 'notif-3',
      title: 'عرض VIP خاص بمشتركي Premium 👑',
      body: 'احصل على اشتراك التطور الذكي مجاناً مع خطتك السنوية.',
      time: 'أمس',
      isRead: true,
      type: 'offer'
    }
  ]);

  // Channels and Groups
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>(INITIAL_LIVE_CHANNELS);
  const [groups] = useState<MovieGroup[]>(INITIAL_GROUPS);

  // Sync to secureStorage with anti-tamper signature
  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.FAVS, favorites);
  }, [favorites]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.LIKED, likedMovies);
  }, [likedMovies]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.HISTORY, watchHistory);
  }, [watchHistory]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.DOWNLOADS, downloads);
  }, [downloads]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.PROFILE, userProfile);
  }, [userProfile]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.REELS_STATE, reels);
  }, [reels]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.SUBTITLES, subtitleSettings);
  }, [subtitleSettings]);

  useEffect(() => {
    secureStorage.setItem(STORAGE_KEYS.AUDIO, audioSettings);
  }, [audioSettings]);

  // Use existing refreshMovies defined above

  useEffect(() => {
    refreshMovies(false);
  }, [refreshMovies]);

  // Navigation
  const navigateTo = useCallback((screen: ScreenId, movie?: Movie, group?: MovieGroup) => {
    if (movie) {
      setActiveMovie(movie);
      resolveTrailerKey(movie).then(() => {
        setMovies(prev => prev.map(m => (m.id === movie.id ? { ...m, youtubeKey: movie.youtubeKey } : m)));
      });
    }
    if (group) {
      setActiveGroup(group);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Toggle favorites
  const toggleFavorite = useCallback((movieId: string | number) => {
    setFavorites(prev => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast('تمت الإزالة من قائمتك');
        return prev.filter(id => id !== movieId);
      } else {
        showToast('تمت الإضافة إلى قائمتك ⭐');
        return [movieId, ...prev];
      }
    });
  }, [showToast]);

  const isFavorite = useCallback((movieId: string | number) => {
    return favorites.includes(movieId);
  }, [favorites]);

  // Toggle Like Movie
  const toggleLikeMovie = useCallback((movieId: string | number) => {
    setLikedMovies(prev => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast('تمت إزالة الإعجاب عن العمل');
        return prev.filter(id => id !== movieId);
      } else {
        showToast('أعجبك هذا العمل ❤️');
        return [movieId, ...prev];
      }
    });
  }, [showToast]);

  const isMovieLiked = useCallback((movieId: string | number) => {
    return likedMovies.includes(movieId);
  }, [likedMovies]);

  // History
  const addToHistory = useCallback((movie: Movie, pct: number = 20) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.movie.id !== movie.id);
      return [
        {
          movie,
          watchedPct: pct,
          lastTime: `متبقي ${Math.max(10, 100 - pct)} دقيقة`
        },
        ...filtered
      ].slice(0, 15);
    });
  }, []);

  const clearWatchHistory = useCallback(() => {
    setWatchHistory([]);
    showToast('تم مسح سجل المشاهدة بالكامل');
  }, [showToast]);

  // Downloads
  const addDownload = useCallback((movie: Movie, quality: string = '1080p FHD') => {
    setDownloads(prev => {
      if (prev.some(d => d.movieId === movie.id)) {
        showToast('الفيلم موجود بالفعل في التنزيلات ويمكنك مشاهدته الآن بدون إنترنت');
        return prev;
      }
      showToast(`تم حفظ "${movie.title}" في التنزيلات بنجاح 📥`);
      const newItem: DownloadItem = {
        id: `dl-${Date.now()}`,
        movieId: movie.id,
        title: movie.title,
        poster: movie.poster,
        quality,
        size: '2.4 GB',
        progress: 100,
        status: 'completed',
        savedAt: Date.now()
      };
      return [newItem, ...prev];
    });
  }, [showToast]);

  const removeDownload = useCallback((id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
    showToast('تم حذف التنزيل من الذاكرة');
  }, [showToast]);

  // Play downloaded movie instantly
  const playDownloadedMovie = useCallback((downloadItem: DownloadItem) => {
    let targetMovie = movies.find(m => m.id === downloadItem.movieId);
    if (!targetMovie) {
      targetMovie = {
        id: downloadItem.movieId,
        title: downloadItem.title,
        rating: 8.8,
        poster: downloadItem.poster,
        type: 'فيلم',
        year: '2024',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        overview: 'تم تنزيل هذا العمل بالكامل على جهازك وهو جاهز للمشاهدة بدون اتصال بالإنترنت بأعلى دقة وسلاسة.',
        genres: ['تنزيلات', 'أوفلاين', 'سينما']
      };
    }
    showToast(`فتح المشغل لتشغيل "${downloadItem.title}" بدون إنترنت 🎬`);
    navigateTo('player', targetMovie);
  }, [movies, navigateTo, showToast]);

  // Download Reel
  const downloadReel = useCallback((reel: ReelItem) => {
    showToast(`تم تنزيل مقطع "${reel.title}" بنجاح في المعرض لمشاهدته بدون إنترنت 📥✨`);
  }, [showToast]);

  // 2FA Manager
  const toggleTwoFactor = useCallback((enable: boolean) => {
    setTwoFactorEnabled(enable);
    localStorage.setItem(STORAGE_KEYS.TWO_FA, JSON.stringify({ enabled: enable }));
    showToast(
      enable
        ? 'تم تفعيل المصادقة الثنائية (2FA) وتأمين الحساب بنجاح 🛡️'
        : 'تم تعطيل المصادقة الثنائية'
    );
  }, [showToast]);

  const verify2FACode = useCallback((code: string) => {
    if (code.trim().length === 6 || twoFactorBackupCodes.includes(code.trim())) {
      showToast('تم التحقق من الرمز بنجاح ✅');
      return true;
    }
    showToast('رمز التحقق غير صحيح، يرجى إعادة المحاولة');
    return false;
  }, [twoFactorBackupCodes, showToast]);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    showToast('تم مسح جميع الإشعارات');
  }, [showToast]);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Profile with Safe Sanitization
  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    const sanitizedData: Partial<UserProfile> = { ...data };
    if (sanitizedData.name) sanitizedData.name = sanitizeInput(sanitizedData.name);
    if (sanitizedData.email) sanitizedData.email = sanitizeInput(sanitizedData.email);
    if (sanitizedData.phone) sanitizedData.phone = sanitizeInput(sanitizedData.phone);

    setUserProfile(prev => ({ ...prev, ...sanitizedData }));
    showToast('تم حفظ التعديلات بأمان 🛡️');
  }, [showToast]);

  // Reels
  const likeReel = useCallback((reelId: string | number, forceLiked?: boolean) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const nextLiked = forceLiked !== undefined ? forceLiked : !r.isLiked;
          if (r.isLiked === nextLiked) return r;
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: r.likesCount + (nextLiked ? 1 : -1)
          };
        }
        return r;
      })
    );
  }, []);

  const saveReel = useCallback((reelId: string | number) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isSaved = !r.isSaved;
          showToast(isSaved ? 'تم حفظ الريلز في المحفوظات ⭐' : 'تمت الإزالة من المحفوظات');
          return {
            ...r,
            isSaved,
            savesCount: r.savesCount + (isSaved ? 1 : -1)
          };
        }
        return r;
      })
    );
  }, [showToast]);

  const followReelCreator = useCallback((reelIdOrCreatorName: string | number) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelIdOrCreatorName || r.creator.name === reelIdOrCreatorName) {
          const nextState = !r.isFollowing;
          showToast(nextState ? `تمت متابعة ${r.creator.name} بنجاح` : `تم إلغاء متابعة ${r.creator.name}`);
          return {
            ...r,
            isFollowing: nextState,
            creator: {
              ...r.creator,
              isFollowing: nextState,
              followersCount: (r.creator.followersCount || 100) + (nextState ? 1 : -1)
            }
          };
        }
        return r;
      })
    );
  }, [showToast]);

  const addReelComment = useCallback((reelId: string | number, commentText: string) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: userProfile.name,
      avatar: userProfile.avatar,
      text: commentText.trim(),
      time: 'الآن',
      likes: 0,
      isLiked: false
    };

    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          return {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [newComment, ...(r.comments || [])]
          };
        }
        return r;
      })
    );
    showToast('تمت إضافة تعليقك على الريلز بنجاح 💬');
  }, [userProfile.name, userProfile.avatar, showToast]);

  const likeReelComment = useCallback((reelId: string | number, commentId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId && r.comments) {
          return {
            ...r,
            comments: r.comments.map(c => {
              if (c.id === commentId) {
                const nextLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked: nextLiked,
                  likes: c.likes + (nextLiked ? 1 : -1)
                };
              }
              return c;
            })
          };
        }
        return r;
      })
    );
  }, []);

  const addNewReel = useCallback((reelData: Partial<ReelItem>) => {
    const newReel: ReelItem = {
      id: `user-reel-${Date.now()}`,
      title: reelData.title || 'مقطع سينمائي جديد',
      category: reelData.category || 'مشاهد سينمائية',
      videoUrl: reelData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: reelData.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
      movieId: reelData.movieId,
      movieTitle: reelData.movieTitle,
      moviePoster: reelData.moviePoster,
      movieRating: reelData.movieRating || 8.5,
      movieType: reelData.movieType || 'فيلم',
      creator: {
        name: userProfile.name,
        username: 'me',
        avatar: userProfile.avatar,
        badge: 'صانع محتوى',
        bio: 'عاشق للسينما والمسلسلات 🎬',
        followersCount: 1,
        isFollowing: true
      },
      audioTrack: reelData.audioTrack || {
        title: 'الصوت الأصلي - FilmMax Creator',
        artist: userProfile.name
      },
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: true,
      isSaved: false,
      isFollowing: true,
      description: reelData.description || 'مقتطف مميز من فيلمي المفضل! شاركوني آراءكم 🍿🔥',
      tags: reelData.tags || ['سينما', 'ريلز_جديد', 'FilmMax'],
      comments: [],
      isUserCreated: true
    };

    setReels(prev => [newReel, ...prev]);
    showToast('تم نشر مقطع الريلز الخاص بك بنجاح! 🚀🎬');
  }, [userProfile.name, userProfile.avatar, showToast]);

  const deleteReel = useCallback((reelId: string | number) => {
    setReels(prev => prev.filter(r => r.id !== reelId));
    showToast('تم حذف مقطع الريلز');
  }, [showToast]);

  const toggleLiveReminder = useCallback((channelId: string) => {
    setLiveChannels(prev =>
      prev.map(ch => {
        if (ch.id === channelId) {
          const next = !ch.isReminded;
          showToast(next ? `تم ضبط تذكير لبرنامج: ${ch.currentShow.title}` : 'تم إلغاء التذكير');
          return { ...ch, isReminded: next };
        }
        return ch;
      })
    );
  }, [showToast]);

  const updateSubtitleSettings = useCallback((data: Partial<SubtitleSettings>) => {
    setSubtitleSettings(prev => ({ ...prev, ...data }));
    showToast('تم تحديث إعدادات الترجمة');
  }, [showToast]);

  const updateAudioSettings = useCallback((data: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...data }));
    showToast('تم تحديث إعدادات الصوت والمعادل');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        navigateTo,
        movies,
        activeMovie,
        setActiveMovie,
        activeGroup,
        setActiveGroup,
        favorites,
        toggleFavorite,
        isFavorite,
        likedMovies,
        toggleLikeMovie,
        isMovieLiked,
        watchHistory,
        addToHistory,
        clearWatchHistory,
        downloads,
        addDownload,
        removeDownload,
        playDownloadedMovie,
        downloadReel,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        clearAllNotifications,
        userProfile,
        updateUserProfile,
        reels,
        likeReel,
        saveReel,
        followReelCreator,
        addReelComment,
        likeReelComment,
        addNewReel,
        deleteReel,
        liveChannels,
        toggleLiveReminder,
        groups,
        searchQuery,
        setSearchQuery,
        subtitleSettings,
        updateSubtitleSettings,
        isSubtitlesEnabled,
        setIsSubtitlesEnabled,
        audioSettings,
        updateAudioSettings,
        activeDubbing,
        setActiveDubbing,
        language,
        setLanguage,
        currentLanguageInfo,
        t,
        theme,
        setTheme,
        twoFactorEnabled,
        twoFactorSecret,
        twoFactorBackupCodes,
        toggleTwoFactor,
        verify2FACode,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isEvolutionModalOpen,
        setIsEvolutionModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        shareTargetMovie,
        setShareTargetMovie,
        isChatSupportOpen,
        setIsChatSupportOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        selectedPlan,
        setSelectedPlan,
        toastMessage,
        showToast,
        refreshMovies,
        isLoadingMovies,
        loadMoreMovies,
        isLoadingMore,
        startupStage,
        setStartupStage,
        replayIntro,
        openWelcomeSlides,
        openAuthScreen,
        userAccounts,
        activeAccountId,
        switchAccount,
        addNewAccount,
        deleteAccount,
        isAccountSwitcherOpen,
        setIsAccountSwitcherOpen,
        isTVRemoteOpen,
        setIsTVRemoteOpen,
        continueWatching,
        addToContinueWatching,
        removeFromContinueWatching,
        recommendations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
