import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ReelItem, Movie } from '../types';
import { mediaOrchestrator } from '../services/mediaSessionOrchestrator';
import { ReelsCommentsSheet } from './reels/ReelsCommentsSheet';
import { ReelsCreatorProfile } from './reels/ReelsCreatorProfile';
import { ReelsEditProfile } from './reels/ReelsEditProfile';
import { ReelsCreateSheet } from './reels/ReelsCreateSheet';
import { ReelsVideoEditor } from './reels/ReelsVideoEditor';
import { ReelsPublishPrivacy } from './reels/ReelsPublishPrivacy';
import { ReelsCameraCapture } from './reels/ReelsCameraCapture';
import { ReelsLiveStream } from './reels/ReelsLiveStream';
import { ReelsVIPHub } from './reels/ReelsVIPHub';
import { ReelsSubscriptions } from './reels/ReelsSubscriptions';
import { TikTokProfileModal } from './TikTokProfileModal';
import { VerifiedBadge } from './ProfileView';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  UserPlus,
  Check,
  Send,
  X,
  Sparkles,
  Flame,
  Plus,
  User,
  Music,
  ExternalLink,
  Film,
  Tv,
  Trash2,
  Upload,
  Eye,
  Search,
  Download,
  Loader2,
  MoreHorizontal,
  Crown,
  Radio,
  ListFilter,
  Layers,
  Shield,
  Clapperboard,
  Sliders,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

// Live channels list for the horizontal story circles
const LIVE_CHANNELS = [
  {
    id: 'live-1',
    name: 'FilmMax Live',
    viewers: '12.4K',
    avatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150',
    title: 'تغطية كواليس تصوير تاج الدم'
  },
  {
    id: 'live-2',
    name: 'سارة أكشن',
    viewers: '5.8K',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    title: 'مراجعة أحدث أفلام الأسبوع'
  },
  {
    id: 'live-3',
    name: 'أحمد سينما',
    viewers: '8.2K',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    title: 'نقاش مباشر حول نهايات الأفلام'
  },
  {
    id: 'live-4',
    name: 'دراما بلس',
    viewers: '3.1K',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    title: 'بث تحليلي لمسلسلات الموسم'
  },
  {
    id: 'live-5',
    name: 'VIP هوليوود',
    viewers: '15.9K',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'مقابلات نجوم هوليوود الحصرية'
  }
];

export const ReelsView: React.FC = () => {
  const {
    reels,
    likeReel,
    saveReel,
    followReelCreator,
    addReelComment,
    likeReelComment,
    addNewReel,
    deleteReel,
    downloadReel,
    userProfile,
    movies,
    navigateTo,
    setActiveMovie,
    showToast,
    loadMoreMovies
  } = useApp();

  const allReels = reels;

  // Active top navigation tab (لك | متابعة)
  const [activeMainTab, setActiveMainTab] = useState<'forYou' | 'following'>('forYou');
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // Horizontal Live Stream Bubbles Strip visibility
  const [showLiveStrip, setShowLiveStrip] = useState<boolean>(false);

  // In-view Quick Search
  const [isReelSearchOpen, setIsReelSearchOpen] = useState<boolean>(false);
  const [reelSearchQuery, setReelSearchQuery] = useState<string>('');

  // Floating Heart Animation
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Modals & Sub-Screens matching the 12 design screens
  const [isVIPHubOpen, setIsVIPHubOpen] = useState<boolean>(false);
  const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState<boolean>(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState<boolean>(false);
  const [isCommentsSheetOpen, setIsCommentsSheetOpen] = useState<boolean>(false);
  const [isCreatorProfileOpen, setIsCreatorProfileOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState<boolean>(false);
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState<boolean>(false);
  const [isPublishPrivacyOpen, setIsPublishPrivacyOpen] = useState<boolean>(false);
  const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false);

  // Pending Editor / Creation payload
  const [pendingReelData, setPendingReelData] = useState<any>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');

  // Video Refs & Buffering watchdog
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const lastTapRef = useRef<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe detection for horizontal gesture (reveal/hide live stream circles)
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Buffering state
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(false);
  const bufferWatchdogRef = useRef<NodeJS.Timeout | null>(null);

  const clearBufferWatchdog = () => {
    if (bufferWatchdogRef.current) {
      clearTimeout(bufferWatchdogRef.current);
      bufferWatchdogRef.current = null;
    }
  };

  const handleVideoWaiting = (index?: number) => {
    if (index !== undefined && index !== activeReelIndex) return;
    setIsVideoBuffering(true);
    clearBufferWatchdog();
    bufferWatchdogRef.current = setTimeout(() => {
      setIsVideoBuffering(false);
    }, 2500);
  };

  const handleVideoReady = (index?: number) => {
    if (index !== undefined && index !== activeReelIndex) return;
    clearBufferWatchdog();
    setIsVideoBuffering(false);
  };

  // Filter reels based on active tab and search query
  const filteredReels = useMemo(() => {
    let list = allReels;
    if (activeMainTab === 'following') {
      const followingList = list.filter(r => r.isFollowing);
      list = followingList.length > 0 ? followingList : list;
    }

    if (reelSearchQuery.trim()) {
      const query = reelSearchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.creator.name.toLowerCase().includes(query) ||
          (r.category && r.category.toLowerCase().includes(query))
      );
    }
    return list;
  }, [allReels, activeMainTab, reelSearchQuery]);

  const currentReel = filteredReels[activeReelIndex] || filteredReels[0] || allReels[0];

  // Central Playback & Audio-Focus Orchestrator Integration
  useEffect(() => {
    mediaOrchestrator.requestFocus("reels", currentReel?.id);
    const unsubscribe = mediaOrchestrator.subscribe((activeDomain) => {
      if (activeDomain !== "reels") {
        setIsPlaying(false);
        videoRefs.current.forEach(v => {
          if (v) v.pause();
        });
      }
    });
    return () => {
      unsubscribe();
      mediaOrchestrator.releaseFocus("reels");
    };
  }, []);

  // Auto-manage play / pause / mute
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeReelIndex) {
        video.muted = isMuted;
        if (isPlaying) {
          video.play().catch(() => {
            handleVideoReady(idx);
          });
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    iframeRefs.current.forEach((iframe, idx) => {
      if (!iframe || !iframe.contentWindow) return;
      if (idx === activeReelIndex) {
        if (isPlaying) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
        if (isMuted) {
          iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
        } else {
          iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
        }
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  }, [activeReelIndex, isPlaying, isMuted, filteredReels]);

  // Handle snap-scroll between reels smoothly
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    if (clientHeight === 0) return;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== activeReelIndex && newIndex >= 0 && newIndex < filteredReels.length) {
      setActiveReelIndex(newIndex);
      setIsPlaying(true);
      setVideoProgress(0);
      setIsVideoBuffering(false);
      clearBufferWatchdog();
    }
  };

  // Keyboard navigation for ultra-smooth browsing (Up/Down arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const height = containerRef.current.clientHeight;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeReelIndex < filteredReels.length - 1) {
          containerRef.current.scrollTo({
            top: (activeReelIndex + 1) * height,
            behavior: 'smooth'
          });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeReelIndex > 0) {
          containerRef.current.scrollTo({
            top: (activeReelIndex - 1) * height,
            behavior: 'smooth'
          });
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, filteredReels.length]);

  // Toggle Play / Pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Touch event handlers for horizontal gesture detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      // If horizontal swipe is more pronounced than vertical swipe
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        // Toggle or show live strip on swipe
        setShowLiveStrip(prev => !prev);
      }
    }
  };

  // Double-tap heart & Single-tap play/pause
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const lastTap = lastTapRef.current;
    const DOUBLE_TAP_DELAY = 280;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
      lastTapRef.current = 0;

      // Heart burst
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        x,
        y
      };
      setFloatingHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 900);

      if (currentReel) {
        likeReel(currentReel.id, true);
        showToast('تم الإعجاب بالمقطع! ❤️🔥');
      }
    } else {
      lastTapRef.current = now;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(() => {
        tapTimerRef.current = null;
        togglePlay();
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.currentTarget;
    if (isVideoBuffering) {
      handleVideoReady();
    }
    if (target.duration) {
      const pct = (target.currentTime / target.duration) * 100;
      setVideoProgress(pct);
    }
  };

  const handleWatchFullMovie = (reel: ReelItem) => {
    const matched =
      (reel.movieId && movies.find(m => m.id === reel.movieId)) ||
      movies.find(m => m.title.toLowerCase().includes(reel.title.toLowerCase())) ||
      movies[0];

    if (matched) {
      setActiveMovie(matched);
      navigateTo('details', matched);
    }
  };

  // Creator profile navigation from click
  const handleOpenCreator = () => {
    setIsCreatorProfileOpen(true);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col select-none font-sans"
    >
      
      {/* ========================================================================= */}
      {/* 1. TOP CLEAN FLOATING HEADER (Uncluttered & Pure like TikTok/Reels) */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-0 right-0 z-40 px-3 sm:px-4 pt-3 pb-3 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex items-center justify-between">
        
        {/* Left Action: Live Broadcast Button with LIVE pulsating badge + Horizontal reveal */}
        <button
          onClick={() => setShowLiveStrip(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md active:scale-95 transition-all text-white text-xs font-bold"
          title="بث مباشر"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[11px] font-black text-white">مباشر</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-300 transition-transform duration-300 ${
              showLiveStrip ? 'rotate-180 text-red-400' : ''
            }`}
          />
        </button>

        {/* Center Tabs: Simple, uncluttered 'لك | متابعة' */}
        <div className="flex items-center gap-6 text-sm font-black tracking-wide">
          {/* Tab: متابعة */}
          <button
            onClick={() => setActiveMainTab('following')}
            className={`transition-all relative py-1 ${
              activeMainTab === 'following' ? 'text-white text-base font-black scale-105' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            متابعة
            {activeMainTab === 'following' && (
              <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
            )}
          </button>

          {/* Tab: لك (For You) */}
          <button
            onClick={() => setActiveMainTab('forYou')}
            className={`transition-all relative py-1 ${
              activeMainTab === 'forYou' ? 'text-white text-base font-black scale-105' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            لك
            {activeMainTab === 'forYou' && (
              <div className="absolute -bottom-1 left-2 right-2 h-0.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
            )}
          </button>
        </div>

        {/* Right Action: Publish Button & Search Button & VIP Quick Access */}
        <div className="flex items-center gap-1.5">
          {/* Quick Publish / Create Reel Button */}
          <button
            onClick={() => setIsCreateSheetOpen(true)}
            className="flex items-center gap-1 bg-[#e50914] hover:bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-red-900/40 active:scale-95 transition-all border border-red-400/30"
            title="نشر مقطع ريلز جديد"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>نشر</span>
          </button>

          <button
            onClick={() => setIsVIPHubOpen(true)}
            className="p-1.5 px-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 text-black text-[10px] font-black flex items-center gap-1 shadow-lg shadow-amber-500/20 active:scale-95"
            title="VIP"
          >
            <Crown className="w-3 h-3 fill-black" />
            <span>VIP</span>
          </button>

          <button
            onClick={() => setIsReelSearchOpen(!isReelSearchOpen)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors active:scale-95 border border-white/10"
            title="بحث"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HORIZONTAL LIVE STREAM CIRCLES STRIP (تظهر وتختفي بسلاسة عند اللمس أو النقر) */}
      {/* ========================================================================= */}
      {showLiveStrip && (
        <div className="absolute top-14 left-0 right-0 z-40 px-3 py-2 bg-black/80 backdrop-blur-xl border-y border-white/10 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <button
              onClick={() => setShowLiveStrip(false)}
              className="text-[10px] text-gray-400 hover:text-white flex items-center gap-0.5"
            >
              <ChevronUp className="w-3 h-3" />
              <span>إخفاء</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] font-black text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>قنوات البث المباشر النشطة</span>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {/* Add Story / My Live */}
            <button
              onClick={() => {
                setShowLiveStrip(false);
                setIsLiveStreamOpen(true);
              }}
              className="flex flex-col items-center gap-1 shrink-0 group active:scale-95"
            >
              <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-2 border-black">
                  <img
                    src={userProfile.avatar}
                    alt="My Live"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 border border-black flex items-center justify-center text-white">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </div>
              <span className="text-[10px] font-black text-red-400">ابدأ بثك</span>
            </button>

            {/* Active Live Broadcast Channels Circles */}
            {LIVE_CHANNELS.map(ch => (
              <button
                key={ch.id}
                onClick={() => {
                  setShowLiveStrip(false);
                  setIsLiveStreamOpen(true);
                }}
                className="flex flex-col items-center gap-1 shrink-0 group active:scale-95"
              >
                <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-600/30 animate-pulse">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-2 border-black">
                    <img
                      src={ch.avatar}
                      alt={ch.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-[8px] font-black text-white px-1.5 py-0.2 rounded-full border border-black uppercase tracking-tighter">
                    LIVE
                  </div>
                </div>
                <div className="flex flex-col items-center text-center max-w-[64px]">
                  <span className="text-[10px] font-bold text-white truncate w-full">
                    {ch.name}
                  </span>
                  <span className="text-[8px] text-gray-400 font-semibold">
                    👁️ {ch.viewers}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating In-View Search Input Overlay */}
      {isReelSearchOpen && (
        <div className="absolute top-14 left-4 right-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
            <Search className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
            <input
              type="text"
              autoFocus
              value={reelSearchQuery}
              onChange={e => setReelSearchQuery(e.target.value)}
              placeholder="ابحث في الريلز، الأفلام، المسلسلات..."
              className="w-full bg-transparent text-xs text-white outline-none placeholder-gray-400 text-right"
            />
            {reelSearchQuery && (
              <button onClick={() => setReelSearchQuery('')} className="p-1 text-gray-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                setIsReelSearchOpen(false);
                setReelSearchQuery('');
              }}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] text-gray-300 font-bold"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN FULLSCREEN VIDEO VIEWPORT WITH ULTRA-SMOOTH TOUCH & SCROLL */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative overscroll-y-contain scroll-smooth"
      >
        {filteredReels.map((reel, idx) => (
          <div
            key={reel.id}
            className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Background Video Player */}
            {reel.youtubeKey ? (
              <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
                <iframe
                  ref={el => {
                    iframeRefs.current[idx] = el;
                  }}
                  src={`https://www.youtube-nocookie.com/embed/${reel.youtubeKey}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&loop=1&playlist=${reel.youtubeKey}`}
                  title={reel.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  onLoad={() => handleVideoReady(idx)}
                  className="w-full h-full object-cover scale-[1.35] pointer-events-none select-none"
                />
              </div>
            ) : (
              <video
                ref={el => {
                  videoRefs.current[idx] = el;
                }}
                src={reel.videoUrl && reel.videoUrl.startsWith('http') ? reel.videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                poster={reel.poster || reel.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'}
                loop
                playsInline
                preload="auto"
                autoPlay={idx === activeReelIndex}
                muted={isMuted}
                onError={(e) => {
                  console.warn('Video load error, switching to reliable stream:', e);
                  setIsVideoBuffering(false);
                  if (videoRefs.current[idx]) {
                    videoRefs.current[idx]!.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                    videoRefs.current[idx]!.play().catch(() => {});
                  }
                }}
                onWaiting={() => {
                  // Only show buffering if it takes more than 400ms
                  clearBufferWatchdog();
                  bufferWatchdogRef.current = setTimeout(() => {
                    if (idx === activeReelIndex) setIsVideoBuffering(true);
                  }, 400);
                }}
                onPlaying={() => handleVideoReady(idx)}
                onCanPlay={() => handleVideoReady(idx)}
                onLoadedData={() => handleVideoReady(idx)}
                onLoadedMetadata={() => handleVideoReady(idx)}
                onTimeUpdate={idx === activeReelIndex ? handleTimeUpdate : undefined}
                className="w-full h-full object-cover bg-black"
              />
            )}

            {/* Gradient Overlays for optimal readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-10" />

            {/* Touch Screen Handler (Double tap heart / single tap pause) */}
            <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleScreenClick} />

            {/* Buffering Spinner */}
            {isVideoBuffering && idx === activeReelIndex && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20 pointer-events-none">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-2 drop-shadow-lg" />
                <span className="text-xs font-black text-white bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  جاري تحميل المقطع...
                </span>
              </div>
            )}

            {/* Floating Hearts Animation */}
            {floatingHearts.map(heart => (
              <div
                key={heart.id}
                style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 animate-ping duration-700"
              >
                <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]" />
              </div>
            ))}

            {/* Play/Pause indicator when paused */}
            {!isPlaying && idx === activeReelIndex && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in fade-in duration-150">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-2xl">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* RIGHT-SIDE ACTION RAIL (Mockup #1) */}
            {/* ========================================================================= */}
            <div className="absolute left-3 sm:left-4 bottom-14 sm:bottom-16 z-30 flex flex-col items-center gap-3.5">
              
              {/* Creator Avatar & Red Follow Badge */}
              <div className="relative mb-1">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenCreator();
                  }}
                  className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-2xl bg-gray-800 transform hover:scale-105 active:scale-95 transition-all"
                  title="الملف الشخصي للمبدع"
                >
                  <img
                    src={reel.creator.avatar || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120'}
                    alt={reel.creator.name}
                    className="w-full h-full object-cover"
                  />
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    followReelCreator(reel.id);
                    showToast(reel.isFollowing ? 'تم إلغاء المتابعة' : 'أنت تتابع المبدع الآن ✅');
                  }}
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white shadow-lg transition-transform active:scale-90 ${
                    reel.isFollowing ? 'bg-emerald-500' : 'bg-red-600'
                  }`}
                  title={reel.isFollowing ? 'متابع' : 'متابعة'}
                >
                  {reel.isFollowing ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 stroke-[3]" />}
                </button>
              </div>

              {/* Heart / Like Button (Mockup #1: 37.7K) */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  likeReel(reel.id);
                }}
                className="flex flex-col items-center gap-0.5 group active:scale-90 transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    reel.isLiked ? 'text-red-500 scale-110 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]' : 'text-white hover:text-white/80'
                  }`}
                >
                  <Heart className={`w-7 h-7 drop-shadow-md ${reel.isLiked ? 'fill-red-500 text-red-500' : 'stroke-[2]'}`} />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  37.7K
                </span>
              </button>

              {/* Comments Button (Mockup #1: 4,102) */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsCommentsSheetOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 group active:scale-90 transition-transform"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white/80 transition-all">
                  <MessageCircle className="w-7 h-7 stroke-[2] drop-shadow-md" />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  4,102
                </span>
              </button>

              {/* Bookmark / Saved Button (Mockup #1: 6,676) */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  saveReel(reel.id);
                  showToast(reel.isSaved ? 'تمت الإزالة من المحفوظات' : 'تم حفظ المقطع في قائمتك ⭐');
                }}
                className="flex flex-col items-center gap-0.5 group active:scale-90 transition-transform"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    reel.isSaved ? 'text-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'text-white hover:text-white/80'
                  }`}
                >
                  <Bookmark className={`w-7 h-7 drop-shadow-md ${reel.isSaved ? 'fill-amber-400 text-amber-400' : 'stroke-[2]'}`} />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  6,676
                </span>
              </button>

              {/* Share Button (Mockup #1: 2,103) */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsShareModalOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 group active:scale-90 transition-transform"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white/80 transition-all">
                  <Share2 className="w-7 h-7 stroke-[2] drop-shadow-md" />
                </div>
                <span className="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  2,103
                </span>
              </button>

              {/* More Options ... */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsOptionsMenuOpen(true);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:text-white/80 transition-all active:scale-90"
                title="خيارات إضافية"
              >
                <MoreHorizontal className="w-6 h-6 stroke-[2]" />
              </button>

              {/* Rotating Audio Vinyl Disc (Mockup #1) */}
              <div
                onClick={e => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                  showToast(isMuted ? 'تم تشغيل الصوت 🔊' : 'تم كتم الصوت 🔇');
                }}
                className="mt-1 relative w-10 h-10 rounded-full bg-gradient-to-tr from-gray-900 via-black to-gray-800 border-2 border-gray-700 p-1 flex items-center justify-center animate-spin duration-[4000ms] shadow-2xl cursor-pointer"
                title="كتم / تشغيل الصوت"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/40">
                  <img
                    src={reel.creator.avatar || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100'}
                    alt="Vinyl"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* BOTTOM INFO OVERLAY (Mockup #1) */}
            {/* ========================================================================= */}
            <div className="absolute right-3 sm:right-5 bottom-14 sm:bottom-16 z-30 max-w-[75%] sm:max-w-[65%] text-right pointer-events-auto flex flex-col items-end gap-1.5">
              
              {/* Creator Name + Blue Checkmark + Follow Button + Time */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold">منذ 3 ساعات</span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    followReelCreator(reel.id);
                    showToast(reel.isFollowing ? 'تم إلغاء المتابعة' : 'أنت تتابع FilmMax Studio الآن ✅');
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black transition-all active:scale-95 ${
                    reel.isFollowing
                      ? 'bg-white/10 text-gray-300 border border-white/20'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow'
                  }`}
                >
                  {reel.isFollowing ? 'متابع' : 'متابعة'}
                </button>

                <div
                  onClick={handleOpenCreator}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="font-black text-sm text-white group-hover:underline">
                    {reel.creator.name || 'FilmMax Studio'}
                  </span>
                  <VerifiedBadge className="w-4 h-4 shrink-0" />
                </div>
              </div>

              {/* Title / Description matching Mockup #1 */}
              <p className="text-xs sm:text-sm font-black text-white leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                🔥 إعلان مسلسل #تاج_الدم | قريباً على FilmMax
              </p>

              {/* Action Tag: مشاهدة تاج_الدم #FilmMax */}
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleWatchFullMovie(reel);
                  }}
                  className="flex items-center gap-1 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-lg border border-red-400/30 active:scale-95 transition-all"
                >
                  <Film className="w-3 h-3" />
                  <span>مشاهدة تاج_الدم #FilmMax</span>
                </button>
              </div>

              {/* Audio Bar matching Mockup #1: FilmMax Studio - الصوت الأصلي */}
              <div className="flex items-center justify-end gap-2 text-[11px] text-gray-300 font-bold drop-shadow mt-0.5">
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-red-500 animate-bounce rounded-full" />
                  <span className="w-0.5 h-2/3 bg-amber-400 animate-bounce rounded-full delay-75" />
                  <span className="w-0.5 h-4/5 bg-red-400 animate-bounce rounded-full delay-150" />
                </div>
                <Music className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>FilmMax Studio - الصوت الأصلي</span>
              </div>
            </div>

            {/* Bottom Video Progress Scrub Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
              <div
                className="h-full bg-red-600 transition-all duration-150"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM NAVIGATION BAR (Mockup #1) */}
      {/* ========================================================================= */}
      <div className="h-14 bg-black border-t border-white/10 flex items-center justify-around px-3 text-white z-40 shrink-0 relative">
        {/* 1. الرئيسية (Home) */}
        <button
          onClick={() => navigateTo('home')}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white active:scale-95 transition-transform"
        >
          <Tv className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        {/* 2. Reels (Active Red) */}
        <button
          onClick={() => {
            if (activeReelIndex !== 0 && containerRef.current) {
              containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              showToast('أنت تشاهد قسم Reels الآن 🎬');
            }
          }}
          className="flex flex-col items-center gap-0.5 text-red-500 active:scale-95 transition-transform"
        >
          <Clapperboard className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-black">Reels</span>
        </button>

        {/* 3. + Create / Publish Button (Mockup #5 trigger) */}
        <button
          onClick={() => setIsCreateSheetOpen(true)}
          className="flex flex-col items-center justify-center -mt-2 group active:scale-90 transition-transform"
          title="نشر مقطع ريلز جديد"
        >
          <div className="w-11 h-7 rounded-lg bg-white relative flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <div className="absolute -left-1 w-3 h-full rounded-l-lg bg-cyan-400 z-0" />
            <div className="absolute -right-1 w-3 h-full rounded-r-lg bg-red-500 z-0" />
            <div className="w-9 h-7 rounded-md bg-black relative z-10 flex items-center justify-center text-white">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          <span className="text-[9px] font-black text-gray-300 mt-0.5 group-hover:text-white">نشر</span>
        </button>

        {/* 4. بث مباشر (Live Stream) */}
        <button
          onClick={() => setIsLiveStreamOpen(true)}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white active:scale-95 transition-transform relative"
        >
          <div className="relative">
            <Radio className="w-5 h-5 stroke-[2]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <span className="text-[10px] font-bold">بث مباشر</span>
        </button>

        {/* 5. الملف الشخصي (Profile) */}
        <button
          onClick={() => setIsCreatorProfileOpen(true)}
          className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-white active:scale-95 transition-transform"
        >
          <User className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] font-bold">الملف الشخصي</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. ALL 12 INTEGRATED SUB-SCREENS AND MODALS */}
      {/* ========================================================================= */}

      {/* Screen 2: Comments Sheet */}
      {isCommentsSheetOpen && (
        <ReelsCommentsSheet
          reel={currentReel}
          onClose={() => setIsCommentsSheetOpen(false)}
          onAddComment={text => {
            addReelComment(currentReel.id, text);
          }}
          onLikeComment={commentId => {
            likeReelComment(currentReel.id, String(commentId));
          }}
          userAvatar={userProfile.avatar}
          showToast={showToast}
        />
      )}

      {/* Screen 3 & 12: Creator Profile & Saved Grid */}
      {isCreatorProfileOpen && (
        <ReelsCreatorProfile
          isOpen={isCreatorProfileOpen}
          userId={currentReel?.userId ? String(currentReel.userId) : undefined}
          onClose={() => setIsCreatorProfileOpen(false)}
          onOpenEditProfile={() => {
            setIsCreatorProfileOpen(false);
            setIsEditProfileOpen(true);
          }}
          onOpenAddStory={() => {
            setIsCreatorProfileOpen(false);
            setIsCameraCaptureOpen(true);
          }}
          onSelectReel={reelId => {
            const idx = filteredReels.findIndex(r => r.id === reelId);
            if (idx !== -1) setActiveReelIndex(idx);
          }}
          reels={reels}
          showToast={showToast}
        />
      )}

      {/* Screen 4: Edit Profile */}
      {isEditProfileOpen && (
        <ReelsEditProfile
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          showToast={showToast}
        />
      )}

      {/* Screen 5: Create Menu Sheet */}
      {isCreateSheetOpen && (
        <ReelsCreateSheet
          isOpen={isCreateSheetOpen}
          onClose={() => setIsCreateSheetOpen(false)}
          onSelectCreateReel={() => {
            setIsCreateSheetOpen(false);
            setIsCameraCaptureOpen(true);
          }}
          onSelectAddStory={() => {
            setIsCreateSheetOpen(false);
            setIsCameraCaptureOpen(true);
          }}
          onSelectLiveStream={() => {
            setIsCreateSheetOpen(false);
            setIsLiveStreamOpen(true);
          }}
          onSelectUploadVideo={() => {
            setIsCreateSheetOpen(false);
            setIsVideoEditorOpen(true);
          }}
          onSelectDrafts={() => {
            setIsCreateSheetOpen(false);
            showToast('لا توجد مسودات محفوظة حالياً 📝');
          }}
        />
      )}

      {/* Screen 6: Video Editor */}
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

      {/* Screen 7: Publish Privacy Settings */}
      {isPublishPrivacyOpen && (
        <ReelsPublishPrivacy
          isOpen={isPublishPrivacyOpen}
          onClose={() => setIsPublishPrivacyOpen(false)}
          onPublish={settings => {
            const newId = `reel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            addNewReel({
              id: newId,
              createdAt: Date.now(),
              title: pendingReelData?.captionOverlay || settings.caption || 'مقطع سينمائي جديد 🔥 #FilmMax',
              description: 'أفضل اللقطات والمشاهد بجودة 4K',
              category: 'مشاهد أسطورية',
              videoUrl: pendingReelData?.videoUrl || selectedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              poster: pendingReelData?.coverPoster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
              audioTrack: {
                title: pendingReelData?.audioTrack || 'الصوت الأصلي',
                artist: userProfile.name
              },
              tags: settings.hashtags || ['FilmMax', 'Reels']
            });
            setIsPublishPrivacyOpen(false);
            setActiveMainTab('forYou');
            setActiveReelIndex(0);
          }}
          showToast={showToast}
        />
      )}

      {/* Screen 8: Camera / Story Capture */}
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
              showToast('تم نشر قصتك بنجاح وتظهر في ملفك الشخصي! 📸✨');
            }
          }}
          showToast={showToast}
        />
      )}

      {/* Screen 9: Live Stream View */}
      {isLiveStreamOpen && (
        <ReelsLiveStream
          isOpen={isLiveStreamOpen}
          onClose={() => setIsLiveStreamOpen(false)}
          showToast={showToast}
        />
      )}

      {/* Screen 10: VIP Hub */}
      {isVIPHubOpen && (
        <ReelsVIPHub
          isOpen={isVIPHubOpen}
          onClose={() => setIsVIPHubOpen(false)}
          onSelectReel={reelId => {
            const idx = filteredReels.findIndex(r => r.id === reelId);
            if (idx !== -1) setActiveReelIndex(idx);
          }}
          showToast={showToast}
        />
      )}

      {/* Screen 11: Subscriptions List */}
      {isSubscriptionsOpen && (
        <ReelsSubscriptions
          isOpen={isSubscriptionsOpen}
          onClose={() => setIsSubscriptionsOpen(false)}
          onSelectCreator={name => {
            setIsSubscriptionsOpen(false);
            setIsCreatorProfileOpen(true);
          }}
          showToast={showToast}
        />
      )}

      {/* Share Sheet */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#181a20] text-white rounded-t-[28px] border-t border-white/10 p-4 shadow-2xl flex flex-col space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
            <h4 className="text-xs font-black text-center text-white">مشاركة المقطع</h4>
            <div className="grid grid-cols-4 gap-2 text-center py-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('تم نسخ الرابط! 🔗');
                  setIsShareModalOpen(false);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center gap-1 active:scale-95"
              >
                <ExternalLink className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">نسخ الرابط</span>
              </button>

              <button
                onClick={() => {
                  downloadReel(currentReel);
                  showToast('جاري حفظ وتنزيل المقطع... 📥');
                  setIsShareModalOpen(false);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center gap-1 active:scale-95"
              >
                <Download className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-bold">تنزيل</span>
              </button>

              <button
                onClick={() => {
                  showToast('تمت إعادة نشر المقطع في حسابك! 🔄');
                  setIsShareModalOpen(false);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-bold">إعادة نشر</span>
              </button>

              <button
                onClick={() => {
                  showToast('شكراً لإبلاغك 🚩');
                  setIsShareModalOpen(false);
                }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl flex flex-col items-center gap-1 active:scale-95"
              >
                <Shield className="w-5 h-5 text-rose-400" />
                <span className="text-[10px] font-bold">إبلاغ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Options Menu Modal */}
      {isOptionsMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setIsOptionsMenuOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#181a20] text-white rounded-t-[28px] border-t border-white/10 p-4 shadow-2xl space-y-2 text-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <button
              onClick={() => {
                downloadReel(currentReel);
                setIsOptionsMenuOpen(false);
              }}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-end gap-2 text-xs font-bold"
            >
              <span>تنزيل المقطع بدقة عالية</span>
              <Download className="w-4 h-4 text-red-500" />
            </button>
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                setIsOptionsMenuOpen(false);
              }}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-end gap-2 text-xs font-bold"
            >
              <span>{isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}</span>
              {isMuted ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={() => {
                showToast('الجودة الحالية: 1080p Full HD ⚡');
                setIsOptionsMenuOpen(false);
              }}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-end gap-2 text-xs font-bold"
            >
              <span>جودة الفيديو (1080p)</span>
              <Settings className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => setIsOptionsMenuOpen(false)}
              className="w-full py-2.5 bg-white/10 text-white rounded-xl text-xs font-black mt-2"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

