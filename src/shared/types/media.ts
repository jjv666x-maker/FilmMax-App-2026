export type MediaType = 'movie' | 'series' | 'reel' | 'live';

export interface MediaItem {
  id: string | number;
  title: string;
  type: MediaType;
  poster: string;
  backdrop?: string;
  overview?: string;
  genres: string[];
  rating?: number;
  year?: string | number;
  duration?: string;
  videoUrl?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  matchScore?: number;
  releaseDate?: string;
  quality?: string;
  language?: string;
}

export interface ContinueWatching {
  id: string | number;
  videoId: string | number;
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
  progress: number;
  lastWatched: number;
  type: 'movie' | 'series' | 'reel';
}

export interface LiveChannel {
  id: string | number;
  title: string;
  poster: string;
  liveUrl?: string;
  status: 'live' | 'upcoming';
  viewers?: number;
}

export interface ReelComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: number;
  likes: number;
}

export interface ReelPost {
  id: string | number;
  userId: string | number;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge?: string;
  videoUrl: string;
  poster?: string;
  description: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  musicTitle?: string;
  audioArtist?: string;
  comments?: ReelComment[];
  profileBackground?: string;
}

export interface ProfileBackground {
  mode: 'image' | 'video' | 'color';
  value: string;
  position?: 'center' | 'top' | 'bottom';
  zoom?: number;
  offsetY?: number;
  rotation?: number;
}
