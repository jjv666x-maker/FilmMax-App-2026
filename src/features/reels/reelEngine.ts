import { ReelPost, ReelComment } from '../../shared/types';
import { filmmaxStorage } from '../../services/filmmaxStorage';

const REELS_STORAGE_KEY = 'filmmax_reels_feed';

export const INITIAL_REELS: ReelPost[] = [
  {
    id: 'reel-1',
    userId: 'user-vip-1',
    authorName: 'FilmMax Studio',
    authorUsername: '@filmmax_official',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    authorBadge: 'رسمي VIP',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-futuristic-city-41551-large.mp4',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    description: 'كواليس إطلاق أحدث أفلام الخيال العلمي الحصرية على FilmMax! 🎬🍿 #FilmMax #Cinema #SciFi',
    tags: ['FilmMax', 'Cinema', 'SciFi'],
    likesCount: 14200,
    commentsCount: 382,
    sharesCount: 1040,
    viewsCount: 98500,
    createdAt: Date.now() - 3600000 * 5,
    isLiked: false,
    isSaved: false,
    isFollowing: true,
    musicTitle: 'FilmMax Original Theme',
    audioArtist: 'FilmMax Sound Studio',
    comments: [
      {
        id: 'c-1',
        author: 'أحمد علي',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text: 'جودة الإنتاج خرافية! منتظر الفيلم بفارغ الصبر 🔥',
        createdAt: Date.now() - 1800000,
        likes: 42
      },
      {
        id: 'c-2',
        author: 'سارة خالد',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'الصوتيات والإخراج في مستوى عالمي 👌',
        createdAt: Date.now() - 900000,
        likes: 18
      }
    ]
  },
  {
    id: 'reel-2',
    userId: 'creator-99',
    authorName: 'عالم السينما',
    authorUsername: '@cinema_world',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    authorBadge: 'صانع محتوى',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-leaves-in-a-forest-1188-large.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    description: 'أجمل المَشاهد الطبيعية الملتقطة بعدسات السينما الاحترافية ✨🌲 #تطوير_المحتوى #طبيعة',
    tags: ['طبيعة', 'تصوير', 'سينما'],
    likesCount: 8900,
    commentsCount: 145,
    sharesCount: 320,
    viewsCount: 45000,
    createdAt: Date.now() - 3600000 * 12,
    isLiked: true,
    isSaved: true,
    isFollowing: false,
    musicTitle: 'Peaceful Forest Ambience',
    audioArtist: 'Nature Sounds',
    comments: [
      {
        id: 'c-3',
        author: 'محمد طارق',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        text: 'تصوير احترافي جداً!',
        createdAt: Date.now() - 3600000,
        likes: 12
      }
    ]
  },
  {
    id: 'reel-3',
    userId: 'action-hub',
    authorName: 'عشاق الأكشن',
    authorUsername: '@action_kings',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-along-the-sea-41555-large.mp4',
    poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    description: 'مطاردات السيارات الأكثر إثارة هذا الموسم 🏎️💨 #أكشن #سيارات #FilmMax',
    tags: ['أكشن', 'مطاردة', 'حماس'],
    likesCount: 22400,
    commentsCount: 912,
    sharesCount: 2310,
    viewsCount: 180000,
    createdAt: Date.now() - 3600000 * 24,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    musicTitle: 'High Voltage Speed',
    audioArtist: 'Action Beats',
    comments: []
  }
];

export const loadReelsFromStorage = (): ReelPost[] => {
  try {
    const cached = filmmaxStorage.getItem<ReelPost[]>(REELS_STORAGE_KEY, []);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch (e) {
    console.warn('Failed to read reels from storage, using initial seed', e);
  }
  return INITIAL_REELS;
};

export const saveReelsToStorage = (reels: ReelPost[]): void => {
  try {
    filmmaxStorage.setItem(REELS_STORAGE_KEY, reels);
  } catch (e) {
    console.error('Failed to save reels to storage', e);
  }
};

export const reelEngine = {
  getReels(): ReelPost[] {
    return loadReelsFromStorage();
  },

  toggleLike(reelId: string | number): ReelPost[] {
    const reels = this.getReels();
    const updated = reels.map((reel) => {
      if (String(reel.id) === String(reelId)) {
        const isLiked = !reel.isLiked;
        return {
          ...reel,
          isLiked,
          likesCount: isLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1)
        };
      }
      return reel;
    });
    saveReelsToStorage(updated);
    return updated;
  },

  toggleSave(reelId: string | number): ReelPost[] {
    const reels = this.getReels();
    const updated = reels.map((reel) => {
      if (String(reel.id) === String(reelId)) {
        return {
          ...reel,
          isSaved: !reel.isSaved
        };
      }
      return reel;
    });
    saveReelsToStorage(updated);
    return updated;
  },

  toggleFollow(userId: string | number): ReelPost[] {
    const reels = this.getReels();
    const targetReel = reels.find((r) => String(r.userId) === String(userId));
    if (!targetReel) return reels;

    const newFollowState = !targetReel.isFollowing;
    const updated = reels.map((reel) => {
      if (String(reel.userId) === String(userId)) {
        return {
          ...reel,
          isFollowing: newFollowState
        };
      }
      return reel;
    });
    saveReelsToStorage(updated);
    return updated;
  },

  addComment(reelId: string | number, authorName: string, text: string, avatar?: string): ReelPost[] {
    const reels = this.getReels();
    const updated = reels.map((reel) => {
      if (String(reel.id) === String(reelId)) {
        const newComment: ReelComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          author: authorName || 'مستخدم',
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          text,
          createdAt: Date.now(),
          likes: 0
        };
        const comments = [newComment, ...(reel.comments || [])];
        return {
          ...reel,
          comments,
          commentsCount: comments.length
        };
      }
      return reel;
    });
    saveReelsToStorage(updated);
    return updated;
  },

  incrementShare(reelId: string | number): ReelPost[] {
    const reels = this.getReels();
    const updated = reels.map((reel) => {
      if (String(reel.id) === String(reelId)) {
        return {
          ...reel,
          sharesCount: reel.sharesCount + 1
        };
      }
      return reel;
    });
    saveReelsToStorage(updated);
    return updated;
  },

  publishReel(post: Partial<ReelPost>): ReelPost[] {
    const reels = this.getReels();
    const newReel: ReelPost = {
      id: `reel-${Date.now()}`,
      userId: post.userId || `user-${Date.now()}`,
      authorName: post.authorName || 'صانع محتوى FilmMax',
      authorUsername: post.authorUsername || '@user_filmmax',
      authorAvatar: post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      authorBadge: post.authorBadge || 'عضو VIP',
      videoUrl: post.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-futuristic-city-41551-large.mp4',
      poster: post.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      description: post.description || 'مقطع سينمائي جديد على منصة FilmMax 🎬',
      tags: post.tags || ['FilmMax', 'سينما'],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      createdAt: Date.now(),
      isLiked: false,
      isSaved: false,
      isFollowing: false,
      musicTitle: post.musicTitle || 'FilmMax Audio Track',
      audioArtist: post.audioArtist || 'Original Audio',
      comments: []
    };

    const updated = [newReel, ...reels];
    saveReelsToStorage(updated);
    return updated;
  }
};
