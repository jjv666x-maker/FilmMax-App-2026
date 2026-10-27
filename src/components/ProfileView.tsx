import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Share2,
  Grid,
  Repeat,
  Bookmark,
  Heart,
  Play,
  Plus,
  Camera,
  CheckCircle2,
  Check,
  Settings,
  Edit2,
  X,
  Upload,
  Film,
  Music,
  Tag,
  Trash2,
  Sparkles,
  Eye,
  Clock,
  Video,
  Image as ImageIcon,
  MessageCircle,
  Volume2,
  VolumeX,
  Award,
  Trophy,
  CheckCircle,
  Star,
  Zap,
  Bell,
  Lock,
  Unlock
} from 'lucide-react';
import { ReelItem, UserStory } from '../types';
import { useApp } from '../context/AppContext';
import { TikTokCoverCropModal } from './TikTokCoverCropModal';
import { compressImage } from '../utils/imageCompressor';
import { ReelsVideoEditor } from './reels/ReelsVideoEditor';
import { ReelsPublishPrivacy } from './reels/ReelsPublishPrivacy';
import { ReelsCameraCapture } from './reels/ReelsCameraCapture';
import { AccountMissionsModal, EvolvingVerificationBadge } from './AccountMissionsModal';

interface ProfileViewProps {
  userId?: string;
  isModal?: boolean;
  onClose?: () => void;
}

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80'
];

const PRESET_VIDEOS = [
  {
    title: 'لقطة أكشن حماسية 4K',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'مشهد خيال علمي وفضاء',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'تريلر سينمائي ملحمي',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80'
  }
];

const PRESET_THUMBNAILS = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80'
];

const isVideoMedia = (url?: string, type?: string) => {
  if (type === 'video') return true;
  if (!url) return false;
  if (url.startsWith('data:video') || url.includes('.mp4') || url.includes('.webm') || url.includes('.mov')) return true;
  return false;
};

const extractVideoThumbnail = (videoSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = videoSrc;

      let hasResolved = false;
      const finish = (url: string) => {
        if (!hasResolved) {
          hasResolved = true;
          resolve(url);
        }
      };

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, (video.duration && video.duration > 1) ? 1.0 : 0.5);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 480;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            finish(dataUrl);
            return;
          }
        } catch {}
        finish(PRESET_THUMBNAILS[0]);
      };

      video.onerror = () => {
        finish(PRESET_THUMBNAILS[0]);
      };

      setTimeout(() => {
        finish(PRESET_THUMBNAILS[0]);
      }, 2500);
    } catch {
      resolve(PRESET_THUMBNAILS[0]);
    }
  });
};

const getReelTimestamp = (r: ReelItem): number => {
  if (r.createdAt) return r.createdAt;
  if (typeof r.id === 'string') {
    const match = r.id.match(/\d{10,13}/);
    if (match) return Number(match[0]);
  }
  return 0;
};

// 7 Levels Cinematic System
const LEVEL_THRESHOLDS = [
  { level: 1, title: 'هاوي سينما', maxXP: 200, badgeType: 'verified' as const, badgeColor: 'from-sky-500 to-blue-600', badgeBorder: 'border-sky-400/40', glow: 'shadow-sky-500/30' },
  { level: 2, title: 'مشاهد متميز', maxXP: 500, badgeType: 'star' as const, badgeColor: 'from-slate-200 via-sky-400 to-blue-500', badgeBorder: 'border-sky-400', glow: 'shadow-sky-400/40' },
  { level: 3, title: 'ناقد صاعد', maxXP: 1000, badgeType: 'critic' as const, badgeColor: 'from-amber-600 via-amber-500 to-yellow-600', badgeBorder: 'border-amber-400', glow: 'shadow-amber-500/50' },
  { level: 4, title: 'خبير أفلام 4K', maxXP: 2000, badgeType: 'lens4k' as const, badgeColor: 'from-amber-400 via-rose-500 to-red-600', badgeBorder: 'border-rose-400', glow: 'shadow-red-500/60' },
  { level: 5, title: 'أسطورة الشاشة والنقاد', maxXP: 3500, badgeType: 'luminary' as const, badgeColor: 'from-blue-500 via-indigo-400 to-purple-600', badgeBorder: 'border-indigo-400', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.8)]' },
  { level: 6, title: 'مخرج هوليوودي', maxXP: 5500, badgeType: 'crown' as const, badgeColor: 'from-amber-300 via-amber-400 to-yellow-500', badgeBorder: 'border-amber-300', glow: 'shadow-amber-500/70' },
  { level: 7, title: 'ملك السينما الأسمى 👑', maxXP: 10000, badgeType: 'diamond' as const, badgeColor: 'from-cyan-400 via-amber-300 to-rose-400', badgeBorder: 'border-amber-300', glow: 'shadow-[0_0_22px_rgba(245,158,11,0.9)]' }
];

const NAME_COLOR_PRESETS = [
  { id: 'white', label: 'أبيض', className: 'text-white' },
  { id: 'red', label: 'أحمر', className: 'text-red-500' },
  { id: 'gold', label: 'ذهبي', className: 'text-amber-400' },
  { id: 'cyan', label: 'سماوي', className: 'text-cyan-400' },
  { id: 'purple', label: 'بنفسجي', className: 'text-purple-400' },
  { id: 'emerald', label: 'زمردي', className: 'text-emerald-400' },
  { id: 'gradient-red-gold', label: 'ناري', className: 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent' },
  { id: 'gradient-cyan-purple', label: 'نيون', className: 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent' }
];

// Official Instagram / TikTok / Facebook Blue Verified Rosette Badge with Evolution Support
export const VerifiedBadge: React.FC<{ 
  className?: string; 
  title?: string;
  level?: number;
  badgeType?: 'verified' | 'star' | 'critic' | 'lens4k' | 'luminary' | 'crown' | 'diamond';
  isCurrent?: boolean;
}> = ({ 
  className = "w-5 h-5", 
  title = "شارة التوثيق الرسمية المعتمدة (Verified)",
  level,
  badgeType,
  isCurrent = true
}) => {
  const resolvedType = badgeType || (level ? LEVEL_THRESHOLDS.find(l => l.level === level)?.badgeType : undefined);

  if (resolvedType) {
    return <EvolvingVerificationBadge type={resolvedType} className={className} isCurrent={isCurrent} />;
  }

  return (
    <span className="inline-flex items-center justify-center shrink-0 align-middle" title={title}>
      <svg 
        viewBox="0 0 24 24" 
        className={`${className} fill-current select-none drop-shadow-[0_1px_6px_rgba(0,149,246,0.6)]`}
        aria-label={title}
      >
        <path 
          d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" 
          fill="#0095F6" 
        />
        <path 
          d="M10.54 16.2L6.8 12.46l1.41-1.42 2.33 2.33 5.3-5.3 1.41 1.41-6.71 6.72z" 
          fill="#FFFFFF" 
        />
      </svg>
    </span>
  );
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  userId,
  isModal = false,
  onClose
}) => {
  const { 
    userProfile, 
    updateUserProfile,
    currentUser,
    userData,
    updateUserData,
    reels, 
    addNewReel,
    navigateTo, 
    setIsMoreSidebarOpen,
    showToast,
    theme,
    stories,
    addStory,
    deleteStory
  } = useApp();

  const activeUser = currentUser || userData || userProfile;
  const isOwnProfile = !userId || userId === activeUser.id;
  
  const [profileData, setProfileData] = useState<any>(() => {
    return {
      ...activeUser,
      coverPhoto: activeUser.coverPhoto || PRESET_COVERS[0]
    };
  });

  useEffect(() => {
    if (activeUser) {
      setProfileData((prev: any) => ({
        ...prev,
        ...activeUser,
        coverPhoto: activeUser.coverPhoto || prev.coverPhoto || PRESET_COVERS[0],
        avatar: activeUser.avatar || prev.avatar
      }));
    }
  }, [activeUser]);

  const [userReels, setUserReels] = useState<ReelItem[]>(() => {
    try {
      const saved = localStorage.getItem('filmmax_react_user_reels_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set();
          const filtered = parsed.filter(r => {
            if (!r || !r.id || seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
          });
          filtered.sort((a, b) => getReelTimestamp(b) - getReelTimestamp(a));
          return filtered;
        }
      }
    } catch {}
    return [];
  });

  // Leveling & XP System Persistence
  const [userXP, setUserXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('filmmax_user_xp');
      return saved ? Number(saved) : 350;
    } catch {
      return 350;
    }
  });

  const [missions, setMissions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('filmmax_user_missions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'm1', title: 'شاهد فيلماً أو حلقة لمدة دقيقة', xpReward: 150, completed: false, desc: 'استمتع بمشاهدة أي عمل سينمائي من المكتبة' },
      { id: 'm2', title: 'أضف فيلماً لقائمتك المفضلة', xpReward: 100, completed: false, desc: 'احفظ أعمالك المفضلة في قائمة مشاهدتك الخاصة' },
      { id: 'm3', title: 'انشر مقطع ريلز جديد في حسابك', xpReward: 250, completed: false, desc: 'شارك لحظاتك ومقاطعك مع مجتمع FilmMax' },
      { id: 'm4', title: 'أضف قصة مؤقتة للملف الشخصي', xpReward: 100, completed: false, desc: 'انشر قصة تظهر لمدة 24 ساعة في حسابك' }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'repost' | 'saved' | 'liked'>('grid');
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Advanced TikTok-style Publishing Wizard States
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);
  const [isPublishPrivacyOpen, setIsPublishPrivacyOpen] = useState(false);
  const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState(false);
  const [pendingReelData, setPendingReelData] = useState<any>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  // Calculate current level based on XP
  const currentLevelInfo = LEVEL_THRESHOLDS.find(l => userXP <= l.maxXP) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const prevLevelMax = currentLevelInfo.level === 1 ? 0 : LEVEL_THRESHOLDS[currentLevelInfo.level - 2].maxXP;
  const xpInCurrentLevel = userXP - prevLevelMax;
  const xpNeededForLevel = currentLevelInfo.maxXP - prevLevelMax;
  const levelProgressPct = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));

  // Modals state
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isCoverMuted, setIsCoverMuted] = useState(true);
  const [activeStoryViewer, setActiveStoryViewer] = useState<UserStory | null>(null);

  // Story form state
  const [storyForm, setStoryForm] = useState({
    mediaUrl: PRESET_COVERS[0],
    mediaType: 'image' as 'image' | 'video',
    caption: ''
  });

  // Hidden File Input Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const storyMediaInputRef = useRef<HTMLInputElement>(null);

  // Persistent Auto-Save for Profile Data to LocalStorage (without infinite loop)
  useEffect(() => {
    try {
      if (profileData && profileData.name) {
        localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(profileData));
      }
    } catch {}
  }, [profileData]);

  // Sync incoming updates from SettingsView / AppContext safely
  useEffect(() => {
    if (userProfile && isOwnProfile) {
      setProfileData((prev: any) => {
        if (!prev) return userProfile;
        const isSame =
          prev.name === userProfile.name &&
          prev.avatar === userProfile.avatar &&
          prev.bio === userProfile.bio &&
          prev.nameCustomColor === userProfile.nameCustomColor &&
          prev.nameMedia === userProfile.nameMedia &&
          prev.nameMediaType === userProfile.nameMediaType &&
          prev.nameColorStyle?.id === userProfile.nameColorStyle?.id;
        if (isSame) return prev;
        return {
          ...prev,
          ...userProfile,
          nameMedia: userProfile.nameMedia || localStorage.getItem('filmmax_name_media') || undefined,
          nameMediaType: userProfile.nameMediaType || (localStorage.getItem('filmmax_name_media_type') as any) || undefined,
          nameCustomColor: userProfile.nameCustomColor || localStorage.getItem('filmmax_name_custom_color') || undefined,
          nameColorStyle: userProfile.nameColorStyle || prev.nameColorStyle
        };
      });
    }
  }, [userProfile, isOwnProfile]);

  useEffect(() => {
    const handleStyleUpdate = () => {
      try {
        const media = localStorage.getItem('filmmax_name_media') || undefined;
        const mediaType = (localStorage.getItem('filmmax_name_media_type') as any) || undefined;
        const customColor = localStorage.getItem('filmmax_name_custom_color') || undefined;
        const presetId = localStorage.getItem('filmmax_name_color_preset');
        const preset = NAME_COLOR_PRESETS.find(p => p.id === presetId);

        setProfileData((prev: any) => ({
          ...prev,
          nameMedia: media,
          nameMediaType: mediaType,
          nameCustomColor: customColor,
          nameColorStyle: preset || (customColor ? { id: 'custom', label: 'مخصص', className: '' } : undefined)
        }));
      } catch (err) {
        console.warn('Style sync note:', err);
      }
    };
    window.addEventListener('filmmax_name_style_updated', handleStyleUpdate);
    window.addEventListener('storage', handleStyleUpdate);
    return () => {
      window.removeEventListener('filmmax_name_style_updated', handleStyleUpdate);
      window.removeEventListener('storage', handleStyleUpdate);
    };
  }, []);

  // Persistent Auto-Save for Reels
  useEffect(() => {
    try {
      if (userReels.length > 0) {
        const seen = new Set();
        const unique = userReels.filter(r => {
          if (!r || !r.id || seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });
        localStorage.setItem('filmmax_react_user_reels_v5', JSON.stringify(unique));
      }
    } catch {}
  }, [userReels]);

  // Persistent Auto-Save for XP and Missions
  useEffect(() => {
    try {
      localStorage.setItem('filmmax_user_xp', String(userXP));
    } catch {}
  }, [userXP]);

  useEffect(() => {
    try {
      localStorage.setItem('filmmax_user_missions', JSON.stringify(missions));
    } catch {}
  }, [missions]);

  // Load initial reels with strict deduplication
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (isOwnProfile) {
        let localSavedReels: ReelItem[] = [];
        try {
          const raw = localStorage.getItem('filmmax_react_user_reels_v5');
          if (raw) localSavedReels = JSON.parse(raw);
        } catch {}

        const contextUserReels = reels.filter(r => r.userId === profileData.id || r.isUserCreated);
        
        const combined = [...contextUserReels, ...localSavedReels];
        const seen = new Set();
        const unique = combined.filter(r => {
          if (!r || !r.id || seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        });

        unique.sort((a, b) => getReelTimestamp(b) - getReelTimestamp(a));

        if (isMounted) {
          setUserReels(unique);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [isOwnProfile, profileData.id, reels]);

  // User active stories
  const userActiveStories = stories.filter(s => s.userId === profileData.id);
  const hasActiveStory = userActiveStories.length > 0;

  // Cover Photo Change Handler with Base64 FileReader
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|webm|mov|mkv)$/i);
      if (isVideo) {
        const videoUrl = URL.createObjectURL(file);
        const updated = { ...profileData, coverPhoto: videoUrl, coverType: 'video', coverVideo: videoUrl };
        setProfileData(updated);
        updateUserData({ coverPhoto: videoUrl, coverType: 'video', coverVideo: videoUrl });
        showToast('تم تحديث فيديو الغلاف بنجاح 🎬');
      } else {
        const reader = new FileReader();
        reader.onload = async () => {
          const result = reader.result as string;
          const compressed = await compressImage(result, 1280, 0.82);
          const updated = { ...profileData, coverPhoto: compressed, coverType: 'image', coverVideo: undefined };
          setProfileData(updated);
          updateUserData({ coverPhoto: compressed, coverType: 'image', coverVideo: undefined });
          showToast('تم تحديث صورة الغلاف وحفظها داخل بيانات الحساب دائماً 🖼️');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Avatar Upload Handler with Base64 FileReader
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const compressed = await compressImage(result, 400, 0.85);
        const updated = { ...profileData, avatar: compressed };
        setProfileData(updated);
        updateUserData({ avatar: compressed });
        showToast('تم تحديث الصورة الشخصية وحفظها داخل بيانات الحساب دائماً 📸');
      };
      reader.readAsDataURL(file);
    }
  };

  // Story Media Upload Handler
  const handleStoryMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      if (isVid) {
        const blobUrl = URL.createObjectURL(file);
        setStoryForm(prev => ({ ...prev, mediaUrl: blobUrl, mediaType: 'video' }));
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setStoryForm(prev => ({ ...prev, mediaUrl: reader.result as string, mediaType: 'image' }));
        };
        reader.readAsDataURL(file);
      }
      showToast('تم تجهيز وسائط القصة ✨');
    }
  };

  // addPost function with strict ID uniqueness check and newest-first ordering
  const addPost = (newReel: ReelItem) => {
    setUserReels(prev => {
      const exists = prev.some(r => r.id === newReel.id);
      if (exists) return prev;
      const combined = [newReel, ...prev];
      const seen = new Set();
      const unique = combined.filter(r => {
        if (!r || !r.id || seen.has(r.id)) return false;
        seen.add(r.id);
        return true;
      });
      unique.sort((a, b) => getReelTimestamp(b) - getReelTimestamp(a));
      return unique;
    });
  };

  // Final Publish handler from ReelsPublishPrivacy wizard
  const handleFinalPublish = async (settings: { visibility: string; comments: string; saveToDevice: boolean }) => {
    const newReelId = `reel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const posterUrl = PRESET_THUMBNAILS[Math.floor(Math.random() * PRESET_THUMBNAILS.length)];
    
    const newReelItem: ReelItem = {
      id: newReelId,
      createdAt: Date.now(),
      userId: profileData.id,
      title: pendingReelData?.captionOverlay || 'مقطع سينمائي جديد 🔥 #FilmMax',
      description: 'أفضل اللقطات والمشاهد بجودة 4K الأسطورية',
      category: 'مشاهد أسطورية',
      videoUrl: pendingReelData?.videoUrl || selectedVideoUrl || PRESET_VIDEOS[0].url,
      poster: pendingReelData?.coverPoster || posterUrl,
      thumbnailUrl: pendingReelData?.coverPoster || posterUrl,
      tags: ['FilmMax', 'Reels', '4K'],
      audioTrack: {
        title: pendingReelData?.audioTrack || 'FilmMax Studio - الصوت الأصلي',
        artist: profileData.name
      },
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      isUserCreated: true,
      creator: {
        name: profileData.name,
        username: profileData.username,
        avatar: profileData.avatar,
        badge: 'صانع محتوى'
      }
    };

    addPost(newReelItem);
    await addNewReel(newReelItem);
    setIsPublishPrivacyOpen(false);

    // Complete mission 3 & reward XP
    setMissions(prev => prev.map(m => m.id === 'm3' ? { ...m, completed: true } : m));
    setUserXP(prev => prev + 250);

    showToast('تم نشر مقطع Reel الخاص بك بنجاح وحفظه في حسابك! حصلت على +250 XP 🚀🎬');
  };

  // Submit Story + XP reward
  const handlePublishStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyForm.mediaUrl) {
      showToast('يرجى اختيار صورة أو فيديو للقصة');
      return;
    }
    addStory({
      mediaUrl: storyForm.mediaUrl,
      mediaType: storyForm.mediaType,
      caption: storyForm.caption.trim()
    });
    setIsAddStoryOpen(false);
    setStoryForm({
      mediaUrl: PRESET_COVERS[0],
      mediaType: 'image',
      caption: ''
    });

    setMissions(prev => prev.map(m => m.id === 'm4' ? { ...m, completed: true } : m));
    setUserXP(prev => prev + 100);
    showToast('تم نشر القصة بنجاح! حصلت على +100 XP 🌟');
  };

  // Complete specific mission
  const completeMission = (missionId: string, reward: number) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true } : m));
    setUserXP(prev => prev + reward);
    showToast(`أنجزت المهمة بنجاح! حصلت على +${reward} XP 🏆`);
  };

  const containerClasses = isModal 
    ? "fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-2 overflow-hidden"
    : "w-full max-w-4xl mx-auto pb-20";

  const innerClasses = isModal
    ? "w-full max-w-full sm:max-w-md h-[100dvh] sm:h-[calc(100dvh-20px)] bg-[#0d1117] text-white sm:rounded-3xl border-0 sm:border border-white/10 shadow-2xl flex flex-col relative overflow-hidden"
    : `w-full min-h-screen ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-transparent text-white'} flex flex-col`;

  return (
    <div className={containerClasses} dir="rtl">
      <div className={innerClasses}>
        
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={avatarInputRef} 
          accept="image/*" 
          onChange={handleAvatarUpload} 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={coverInputRef} 
          accept="image/*,video/*" 
          onChange={handleCoverChange} 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={storyMediaInputRef} 
          accept="image/*,video/*" 
          onChange={handleStoryMediaUpload} 
          className="hidden" 
        />

        {/* Top Header Bar */}
        <div className={`flex items-center justify-between px-4 py-3 shrink-0 z-30 ${isModal ? 'bg-black/90 border-b border-white/10' : ''}`}>
          {isModal ? (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="إغلاق"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={() => navigateTo('home')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="العودة للرئيسية"
            >
              <ArrowRight className={`w-5 h-5 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`} />
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white">@{profileData.username || 'mohamed_cinema'}</span>
            <VerifiedBadge className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            {isOwnProfile && (
              <>
                {/* Bell Icon for Missions & Levels Modal */}
                <button
                  onClick={() => setShowMissionsModal(true)}
                  className="p-2 bg-white/5 hover:bg-white/15 rounded-full transition-all active:scale-90 text-amber-400 hover:text-amber-300 border border-white/10 shadow-lg relative cursor-pointer"
                  title="مهام الحساب والمستويات 🔔"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                </button>

                <button
                  onClick={() => setIsMoreSidebarOpen(true)}
                  className="p-2 bg-white/5 hover:bg-white/15 rounded-full transition-all active:scale-90 text-amber-400 hover:text-amber-300 border border-white/10 shadow-lg cursor-pointer"
                  title="الإعدادات والمزيد ⚙️"
                >
                  <Settings className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
                </button>
              </>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: profileData.name, url: window.location.href }).catch(() => {});
                } else {
                  showToast('تم نسخ رابط الملف الشخصي 🔗');
                }
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="مشاركة الحساب"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Profile Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Cover Photo / Video Banner */}
          <div className="relative w-full h-48 sm:h-56 bg-zinc-950 overflow-hidden group">
            {isVideoMedia(profileData.coverVideo || profileData.coverPhoto, profileData.coverType) ? (
              <video
                src={profileData.coverVideo || profileData.coverPhoto}
                autoPlay
                loop
                muted={isCoverMuted}
                playsInline
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105`}
              />
            ) : (
              <img
                src={profileData.coverPhoto || PRESET_COVERS[0]}
                alt="Cover Photo"
                onError={(e) => { e.currentTarget.src = PRESET_COVERS[0]; }}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20 pointer-events-none" />

            {isVideoMedia(profileData.coverVideo || profileData.coverPhoto, profileData.coverType) && (
              <div className="absolute top-3 left-3 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoverMuted(prev => !prev);
                  }}
                  className="p-3 bg-black/70 backdrop-blur-2xl hover:bg-black/90 rounded-full border border-white/30 shadow-2xl transition-all text-white active:scale-90 cursor-pointer flex items-center justify-center"
                  title={isCoverMuted ? "تشغيل صوت الخلفية" : "كتم صوت الخلفية"}
                >
                  {isCoverMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            )}

            {/* Cover Change Button */}
            {isOwnProfile && (
              <div className="absolute bottom-3 left-3 z-40 pointer-events-auto">
                <button 
                  type="button" 
                  onClick={() => setIsCoverModalOpen(true)}
                  className="px-3 py-1.5 bg-black/85 hover:bg-black backdrop-blur-md rounded-xl text-white text-xs font-bold flex items-center gap-1.5 border border-white/30 shadow-2xl transition-all active:scale-95 cursor-pointer pointer-events-auto"
                  title="تعديل الغلاف وقصه"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>تعديل الغلاف</span>
                </button>
              </div>
            )}
          </div>

          {/* Avatar & User Details */}
          <div className="flex flex-col items-center px-4 -mt-16 sm:-mt-20 relative z-10 text-center">
            
            <div className="relative mb-3 group">
              <div 
                onClick={() => {
                  if (hasActiveStory) {
                    setActiveStoryViewer(userActiveStories[0]);
                  } else if (isOwnProfile) {
                    setIsAddStoryOpen(true);
                  }
                }}
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 cursor-pointer transition-all duration-300 relative ${
                  hasActiveStory 
                    ? 'bg-gradient-to-tr from-amber-400 via-[#e50914] via-purple-600 to-cyan-400 animate-pulse shadow-[0_0_30px_rgba(229,9,20,0.9)] scale-105' 
                    : 'bg-gradient-to-tr from-white/20 via-[#e50914]/40 to-white/10'
                }`}
              >
                <img
                  src={profileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                  alt={profileData.name}
                  className="w-full h-full object-cover rounded-full border-4 border-[#0d1117]"
                />
              </div>

              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-[#e50914] hover:bg-[#b80710] text-white rounded-full border-2 border-black shadow-xl transition-all active:scale-90 cursor-pointer"
                  title="تغيير الصورة الشخصية"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Authentic TikTok / Instagram / Facebook Display Name with Attached Blue Verified Badge */}
            {(() => {
              const currentName = (profileData.name || '').trim();
              const isArabicName = /^[\u0600-\u06FF]/.test(currentName);
              
              return (
                <div className="flex flex-col items-center justify-center mt-2 w-full px-4">
                  {/* Container that strictly centers the name + verified badge combo */}
                  <div className="flex items-center justify-center my-1 w-full">
                    {!isEditingName ? (
                      <div 
                        dir={isArabicName ? 'rtl' : 'ltr'} 
                        onClick={() => {
                          if (isOwnProfile) {
                            setIsEditingName(true);
                            setTimeout(() => nameInputRef.current?.focus(), 50);
                          }
                        }}
                        className={`group inline-flex items-center justify-center gap-1.5 max-w-full ${isOwnProfile ? 'cursor-pointer hover:opacity-95' : ''}`}
                        title={isOwnProfile ? "اضغط لتعديل الاسم" : profileData.name}
                      >
                        <span 
                          className={`font-black text-xl sm:text-2xl tracking-tight select-text inline-block break-words ${profileData.nameColorStyle?.className || (profileData.nameCustomColor || profileData.nameMedia ? '' : 'text-white')}`}
                          style={
                            profileData.nameMedia ? {
                              backgroundImage: `url(${profileData.nameMedia})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              color: 'transparent'
                            } : profileData.nameCustomColor ? {
                              color: profileData.nameCustomColor
                            } : undefined
                          }
                        >
                          {profileData.name || 'اسم المستخدم'}
                        </span>
                        
                        <VerifiedBadge level={currentLevelInfo.level} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />

                        {isOwnProfile && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-white rounded-full">
                            <Edit2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div 
                        dir={isArabicName ? 'rtl' : 'ltr'}
                        className="inline-flex items-center justify-center gap-2 bg-zinc-900/90 border border-sky-500/50 rounded-2xl px-3 py-1.5 shadow-[0_0_20px_rgba(0,149,246,0.3)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                      >
                        <input
                          ref={nameInputRef}
                          autoFocus
                          type="text"
                          value={profileData.name || ''}
                          onChange={(e) => setProfileData((prev: any) => ({ ...prev, name: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingName(false);
                              if (profileData.name?.trim()) updateUserProfile({ name: profileData.name.trim() });
                            }
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                          onBlur={() => {
                            setIsEditingName(false);
                            if (profileData.name?.trim()) updateUserProfile({ name: profileData.name.trim() });
                          }}
                          placeholder="اسم المستخدم"
                          style={{ width: `${Math.max(2, (profileData.name || '').length + 1)}ch` }}
                          className={`font-black text-xl sm:text-2xl bg-transparent outline-none border-0 p-0 text-center ${profileData.nameColorStyle?.className || 'text-white'}`}
                        />
                        
                        <VerifiedBadge level={currentLevelInfo.level} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />

                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsEditingName(false);
                            if (profileData.name?.trim()) updateUserProfile({ name: profileData.name.trim() });
                            showToast('تم حفظ الاسم بنجاح ✨');
                          }}
                          className="p-1 bg-[#0095F6] hover:bg-sky-500 text-white rounded-full transition-all active:scale-90 shadow-md flex items-center justify-center shrink-0 cursor-pointer"
                          title="حفظ"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Level Pill Indicator */}
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={() => setShowMissionsModal(true)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 hover:bg-white/10 border ${currentLevelInfo.badgeBorder} text-amber-300 shadow-sm cursor-pointer transition-all active:scale-95`}
                      title="عرض تفاصيل المستوى والمهام"
                    >
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>المستوى {currentLevelInfo.level}: {currentLevelInfo.title}</span>
                    </button>
                  </div>

                </div>
              );
            })()}

            <span className="text-xs sm:text-sm text-gray-400 font-mono mb-2">
              @{profileData.username || 'mohamed_cinema'}
            </span>

            {/* Stats Counter */}
            <div className="flex items-center justify-center gap-8 sm:gap-12 my-3 py-1 px-4 bg-transparent border-0 shadow-none">
              <div className="flex flex-col items-center">
                <span className="text-lg font-black tracking-tight text-white">{userReels.length}</span>
                <span className="text-xs text-gray-400 font-bold">منشورات</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-lg font-black tracking-tight text-white">{profileData.followersCount || '2.4M'}</span>
                <span className="text-xs text-gray-400 font-bold">متابع</span>
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-lg font-black tracking-tight text-white">{profileData.likesCount || '18.5K'}</span>
                <span className="text-xs text-gray-400 font-bold">إعجاب</span>
              </div>
            </div>

            {/* Profile Action Buttons (Publish Reel triggers advanced TikTok-style ReelsVideoEditor) */}
            <div className="flex items-center justify-center gap-2.5 w-full max-w-md my-2">
              <button
                onClick={() => navigateTo('personal')}
                className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-xs sm:text-sm border border-white/15 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-sky-400" />
                <span>إعدادات الحساب</span>
              </button>

              <button
                onClick={() => setIsAddStoryOpen(true)}
                className="py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="إضافة قصة جديدة"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قصة</span>
              </button>

              <button
                onClick={() => setIsCameraCaptureOpen(true)}
                className="py-2.5 px-4 bg-[#e50914] hover:bg-[#b80710] text-white rounded-xl font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="نشر ريلز جديد"
              >
                <Film className="w-4 h-4" />
                <span>نشر ريلز</span>
              </button>
            </div>

            {/* Editable Bio */}
            <textarea
              value={profileData.bio || ''}
              onChange={(e) => setProfileData((prev: any) => ({ ...prev, bio: e.target.value }))}
              placeholder="اكتب نبذة عنك..."
              rows={2}
              className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl mt-2.5 mb-2 font-medium text-center outline-none focus:border-white/30 resize-none"
            />

            {/* Active Stories Tray */}
            {userActiveStories.length > 0 && (
              <div className="w-full max-w-md mt-4 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {userActiveStories.map(story => (
                  <div
                    key={story.id}
                    onClick={() => setActiveStoryViewer(story)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-[#e50914] group-hover:scale-105 transition-transform">
                      {story.mediaType === 'video' ? (
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-black">
                          <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                        </div>
                      ) : (
                        <img
                          src={story.mediaUrl}
                          alt="Story"
                          className="w-full h-full object-cover rounded-full border border-black"
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold max-w-[60px] truncate">
                      {story.caption || 'قصة'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-around border-t border-b border-white/10 mt-6 sticky top-0 bg-[#0d1117]/95 backdrop-blur-xl z-20">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 flex flex-col items-center py-3.5 relative transition-colors ${
                activeTab === 'grid' ? 'text-white' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Grid className="w-5 h-5" />
                <span className="text-xs font-black">الريلز ({userReels.length})</span>
              </div>
              {activeTab === 'grid' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 w-12 h-1 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('repost')}
              className={`flex-1 flex flex-col items-center py-3.5 relative transition-colors ${
                activeTab === 'repost' ? 'text-white' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Repeat className="w-5 h-5" />
                <span className="text-xs font-black">إعادة النشر</span>
              </div>
              {activeTab === 'repost' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 w-12 h-1 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex flex-col items-center py-3.5 relative transition-colors ${
                activeTab === 'saved' ? 'text-white' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Bookmark className="w-5 h-5" />
                <span className="text-xs font-black">المحفوظات</span>
              </div>
              {activeTab === 'saved' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 w-12 h-1 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 flex flex-col items-center py-3.5 relative transition-colors ${
                activeTab === 'liked' ? 'text-white' : 'text-gray-500'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5" />
                <span className="text-xs font-black">المعجب بها</span>
              </div>
              {activeTab === 'liked' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 w-12 h-1 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-2">
            {activeTab === 'grid' && (
              <div>
                {userReels.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {userReels.map((r) => {
                      const posterImg = r.poster || r.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';
                      return (
                        <div
                          key={r.id}
                          onClick={() => navigateTo('reels')}
                          className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-lg border border-white/5"
                        >
                          <img
                            src={posterImg}
                            alt={r.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = PRESET_THUMBNAILS[0];
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-2">
                            <span className="text-[10px] font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full w-fit backdrop-blur-md">
                              {r.category || 'ريلز'}
                            </span>
                            <div>
                              <p className="text-[11px] font-bold text-white line-clamp-1 mb-1">
                                {r.title}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-black text-white/90">
                                <Play className="w-3 h-3 fill-white" />
                                <span>{r.viewsCount || 120}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                      <Film className="w-10 h-10 text-[#e50914]" />
                    </div>
                    <p className="font-black text-base text-white">لم تنشر أي مقاطع ريلز بعد</p>
                    <p className="text-xs text-gray-400 max-w-xs">
                      شارك لقطاتك السينمائية المفضلة أو ارفع فيديوهاتك الخاصة بدقة 4K
                    </p>
                    {isOwnProfile && (
                      <button 
                        onClick={() => setIsVideoEditorOpen(true)}
                        className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#e50914] to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full text-xs font-black shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ابدأ النشر الآن</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'repost' && (
              <div className="py-20 text-center text-gray-500">
                <Repeat className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">لا يوجد منشورات معاد نشرها حالياً</p>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="grid grid-cols-3 gap-1.5">
                {reels.filter(r => r.isSaved).length > 0 ? (
                  reels.filter(r => r.isSaved).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => navigateTo('reels')}
                      className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                    >
                      <img
                        src={r.poster || r.thumbnailUrl}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] font-bold text-white line-clamp-1">{r.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-16 text-center text-gray-500">
                    <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="font-bold text-sm">لم تقم بحفظ أي مقاطع بعد</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="grid grid-cols-3 gap-1.5">
                {reels.filter(r => r.isLiked).length > 0 ? (
                  reels.filter(r => r.isLiked).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => navigateTo('reels')}
                      className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
                    >
                      <img
                        src={r.poster || r.thumbnailUrl}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[11px] font-bold text-white line-clamp-1">{r.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-16 text-center text-gray-500">
                    <Heart className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="font-bold text-sm">لا يوجد مقاطع أعجبتك بعد</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* ================= CINEMATIC MISSIONS & LEVELS MODAL ================= */}
        <AccountMissionsModal
          isOpen={showMissionsModal}
          onClose={() => setShowMissionsModal(false)}
          userXP={userXP}
          missions={missions}
          onCompleteMission={completeMission}
        />

        {/* ================= ADVANCED TIKTOK-STYLE REELS PUBLISH WIZARD ================= */}
        {isCameraCaptureOpen && (
          <ReelsCameraCapture
            isOpen={isCameraCaptureOpen}
            onClose={() => setIsCameraCaptureOpen(false)}
            onCaptured={media => {
              setIsCameraCaptureOpen(false);
              if (media.url) setSelectedVideoUrl(media.url);
              if (media.type === 'reel') {
                setIsVideoEditorOpen(true);
              } else {
                showToast('تم التقاط القصة بنجاح! 📸✨');
              }
            }}
            showToast={showToast}
          />
        )}

        {isVideoEditorOpen && (
          <ReelsVideoEditor
            isOpen={isVideoEditorOpen}
            onClose={() => setIsVideoEditorOpen(false)}
            videoUrl={selectedVideoUrl}
            onNext={data => {
              setPendingReelData(data);
              setIsVideoEditorOpen(false);
              setIsPublishPrivacyOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {isPublishPrivacyOpen && (
          <ReelsPublishPrivacy
            isOpen={isPublishPrivacyOpen}
            onClose={() => setIsPublishPrivacyOpen(false)}
            onPublish={handleFinalPublish}
            showToast={showToast}
          />
        )}

        {/* ================= ADD STORY MODAL ================= */}
        <AnimatePresence>
          {isAddStoryOpen && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#161b22] border border-white/10 rounded-3xl p-6 text-white shadow-2xl relative"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <h3 className="text-base font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>إضافة قصة مؤقتة (تختفي بعد 24 ساعة)</span>
                  </h3>
                  <button onClick={() => setIsAddStoryOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePublishStory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-300 mb-1.5">وسائط القصة (صورة أو فيديو)</label>
                    <button
                      type="button"
                      onClick={() => storyMediaInputRef.current?.click()}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>اختر صورة أو فيديو للقصة...</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-300 mb-1.5">نص أو تعليق اختياري</label>
                    <input
                      type="text"
                      value={storyForm.caption}
                      onChange={(e) => setStoryForm({ ...storyForm, caption: e.target.value })}
                      placeholder="أفضل تجربة سينمائية الليلة 🍿"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsAddStoryOpen(false)}
                      className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow-lg"
                    >
                      نشر القصة
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ================= STORY VIEWER MODAL ================= */}
        <AnimatePresence>
          {activeStoryViewer && (
            <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-2">
              <div className="w-full max-w-md h-[90dvh] bg-black rounded-3xl relative overflow-hidden flex flex-col">
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={profileData.avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-white" />
                    <span className="text-xs font-black text-white">{profileData.name}</span>
                  </div>
                  <button onClick={() => setActiveStoryViewer(null)} className="p-2 bg-black/50 rounded-full text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 relative flex items-center justify-center bg-black">
                  {activeStoryViewer.mediaType === 'video' ? (
                    <video src={activeStoryViewer.mediaUrl} autoPlay loop playsInline className="w-full h-full object-contain" />
                  ) : (
                    <img src={activeStoryViewer.mediaUrl} alt="Story" className="w-full h-full object-contain" />
                  )}
                  {activeStoryViewer.caption && (
                    <div className="absolute bottom-10 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl text-center">
                      <p className="text-xs font-bold text-white">{activeStoryViewer.caption}</p>
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <div className="p-3 bg-black/80 flex justify-center">
                    <button
                      onClick={() => {
                        deleteStory(activeStoryViewer.id);
                        setActiveStoryViewer(null);
                        showToast('تم حذف القصة');
                      }}
                      className="px-4 py-2 bg-red-600/20 text-red-500 rounded-xl text-xs font-black flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>حذف القصة</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* TikTok Cover Crop & Framing Modal */}
        <TikTokCoverCropModal
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
          currentUser={profileData}
          userReels={userReels}
          onSaveCover={(coverData) => {
            const updated = {
              ...profileData,
              coverPhoto: coverData.coverPhoto,
              coverVideo: coverData.coverVideo,
              coverType: coverData.coverType,
              coverPosition: coverData.coverPosition,
              coverOffsetY: coverData.coverOffsetY,
              coverZoom: coverData.coverZoom,
              coverRotation: coverData.coverRotation
            };
            setProfileData(updated);
            updateUserProfile({
              coverPhoto: coverData.coverPhoto,
              coverVideo: coverData.coverVideo,
              coverType: coverData.coverType,
              coverPosition: coverData.coverPosition,
              coverOffsetY: coverData.coverOffsetY,
              coverZoom: coverData.coverZoom,
              coverRotation: coverData.coverRotation
            });
            showToast('تم حفظ وتعديل الغلاف داخل حساب المستخدم بنجاح 🖼️✨');
          }}
        />

      </div>
    </div>
  );
};
