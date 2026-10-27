export type ScreenId =
  | 'home'
  | 'reels'
  | 'live'
  | 'favorites'
  | 'groups'
  | 'search'
  | 'player'
  | 'details'
  | 'settings'
  | 'account'
  | 'subscription'
  | 'quality'
  | 'notifications'
  | 'privacy'
  | 'help'
  | 'about'
  | 'downloads'
  | 'subtitles'
  | 'audio'
  | 'security'
  | 'parent'
  | 'personal'
  | 'share'
  | 'watchparty'
  | 'trivia'
  | 'kids'
  | 'tvmode';

export interface Episode {
  id: string | number;
  number: number;
  title: string;
  duration: string;
  thumbnail?: string;
  videoUrl: string;
  youtubeKey?: string;
  overview?: string;
  releaseDate?: string;
  videoType?: 'episode' | 'trailer' | 'clip' | 'short';
  source?: 'youtube' | 'direct' | 'vimeo' | 'pexels' | 'pixabay';
}

export interface Movie {
  id: string | number;
  title: string;
  rating: number | string;
  poster: string;
  backdrop?: string;
  type: 'movie' | 'tv' | 'فيلم' | 'مسلسل' | 'أنمي';
  year: string;
  videoUrl: string;
  youtubeKey?: string;
  overview: string;
  genres: string[];
  duration?: string;
  matchScore?: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  ageRating?: string;
  quality?: '4K HDR' | '4K Ultra HD' | '4K IMAX' | 'FHD' | 'HD';
  cast?: Array<{ name: string; role: string; photo?: string }>;
  episodes?: Episode[];
  selectedEpisode?: number;
  videoType?: 'movie' | 'trailer' | 'clip' | 'short' | 'reel';
  source?: 'youtube' | 'direct' | 'vimeo' | 'pexels' | 'pixabay';
  views?: number;
  likes?: number;
  isFree?: boolean;
}

export interface ReelComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface ReelItem {
  id: string | number;
  createdAt?: number;
  title: string;
  category: string;
  videoUrl: string;
  youtubeKey?: string;
  sources?: string[];
  poster?: string;
  movieId?: string | number;
  movieTitle?: string;
  moviePoster?: string;
  movieRating?: number | string;
  movieType?: 'فيلم' | 'مسلسل';
  videoType?: 'reel' | 'short' | 'clip' | 'trailer';
  source?: 'youtube' | 'direct' | 'vimeo' | 'pexels' | 'pixabay';
  creator: {
    name: string;
    username?: string;
    avatar?: string;
    badge?: string;
    bio?: string;
    followersCount?: number;
    isFollowing?: boolean;
  };
  audioTrack?: {
    title: string;
    artist: string;
  };
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  description: string;
  tags: string[];
  comments?: ReelComment[];
  isUserCreated?: boolean;
  userId?: string | number;
  thumbnailUrl?: string;
}

export interface LiveChannel {
  id: string;
  name: string;
  category: string;
  logo?: string;
  streamUrl: string;
  youtubeKey?: string;
  poster?: string;
  sources?: string[];
  currentShow: {
    title: string;
    time: string;
    progress: number;
    description: string;
  };
  nextShow: {
    title: string;
    time: string;
  };
  isReminded?: boolean;
}

export interface MovieGroup {
  id: string;
  name: string;
  icon: string;
  movieIds: (string | number)[];
  description?: string;
  color?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  badge: string;
  isPremium: boolean;
  premiumExpiry?: string;
  role: 'owner' | 'family' | 'kids' | 'guest';
  pinCode?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  username?: string;
  email: string;
  role?: string;
  phone: string;
  avatar: string;
  coverPhoto?: string;
  coverType?: 'image' | 'video';
  coverVideo?: string;
  coverPosition?: 'object-center' | 'object-top' | 'object-bottom';
  coverOffsetY?: number;
  coverZoom?: number;
  coverRotation?: number;
  bio?: string;
  favoriteGenre?: string;
  favoriteGenres?: string[];
  selectedGenreIds?: string[];
  password?: string;
  avatarFrame?: 'gold' | 'neon' | 'fire' | 'diamond' | 'none';
  level?: number;
  levelTitle?: string;
  xp?: number;
  nextLevelXp?: number;
  watchTimeHours?: number;
  moviesCompleted?: number;
  seriesCompleted?: number;
  streakDays?: number;
  membershipBadge?: string;
  isPremium: boolean;
  premiumExpiry: string;
  evolutionPlan?: 'none' | 'weekly' | 'monthly' | 'yearly';
  twoFactorEnabled: boolean;
  language: 'ar' | 'en' | 'fr' | 'tr' | 'ku' | 'fa' | 'es' | 'de';
  theme: 'dark' | 'light' | 'cinema';
  achievements?: Array<{
    id: string;
    title: string;
    icon: string;
    desc: string;
    unlockedAt?: string;
    isUnlocked: boolean;
  }>;
  nameColorStyle?: { id: string; label: string; className?: string; color?: string };
  nameCustomColor?: string;
  nameMedia?: string;
  nameMediaType?: 'image' | 'video';
}

export interface DownloadItem {
  id: string;
  movieId: string | number;
  title: string;
  poster: string;
  quality: string;
  size: string;
  progress: number;
  status: 'downloading' | 'completed' | 'queued' | 'paused';
  savedAt: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: 'release' | 'system' | 'offer' | 'reminder';
  linkScreen?: ScreenId;
  movieId?: string | number;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
  rating?: number;
  likes: number;
  isLiked?: boolean;
}

export interface SubtitleSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  fontColor: string;
  backgroundColor: string;
  style: 'default' | 'cinema' | 'outline';
}

export interface AudioSettings {
  language: string;
  quality: 'high' | 'ultra' | 'lossless';
  eqPreset: 'default' | 'bass' | 'dialogue' | 'cinema' | 'custom';
  dialogueBoost: boolean;
  volumeNormalization: boolean;
}

export interface WatchPartyParticipant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  reaction?: string;
}

export interface WatchPartyMessage {
  id: string;
  senderName: string;
  avatar: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface WatchPartyRoom {
  id: string;
  code: string;
  name: string;
  movie: Movie;
  hostName: string;
  participants: WatchPartyParticipant[];
  messages: WatchPartyMessage[];
  isPlaying: boolean;
  currentTime: number;
}

export interface TriviaQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  image?: string;
}

export interface TVCastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'smarttv' | 'firetv';
  location: string;
  isConnected: boolean;
}

export interface ContinueWatching {
  id: string | number;
  videoId: string | number;
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
  lastWatched: number;
  progress: number;
  type: 'movie' | 'tv' | 'episode';
}

export interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: number;
  duration?: number;
}

