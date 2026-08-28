import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Bell,
  Share2,
  MoreHorizontal,
  Check,
  UserPlus,
  MessageCircle,
  ChevronDown,
  Grid,
  Repeat,
  Bookmark,
  Heart,
  Play,
  Sparkles,
  Search,
  Plus,
  Copy,
  Send,
  Lock,
  Film,
  Camera,
  QrCode,
  ShieldAlert,
  Sliders,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ReelItem } from '../types';

interface TikTokProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    isVerified?: boolean;
    followingCount: number | string;
    followersCount: number | string;
    likesCount: number | string;
    isFollowing?: boolean;
    isOwnProfile?: boolean;
    badge?: string;
  };
  reels: ReelItem[];
  onSelectReel: (reelId: string | number) => void;
  onFollowToggle?: () => void;
  onOpenAddReel?: () => void;
  onOpenAddStory?: () => void;
  onOpenStory?: () => void;
  showToast?: (msg: string) => void;
}

export const TikTokProfileModal: React.FC<TikTokProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  reels,
  onSelectReel,
  onFollowToggle,
  onOpenAddReel,
  onOpenAddStory,
  onOpenStory,
  showToast
}) => {
  if (!isOpen) return null;

  // Active Main Tab inside Profile (0: Videos Grid, 1: Reposts, 2: Saved/Private, 3: Liked)
  const [activeTab, setActiveTab] = useState<'grid' | 'repost' | 'saved' | 'liked'>('grid');

  // Category Pills / Playlists Selection
  const [activePlaylist, setActivePlaylist] = useState<string>('الكل');

  // Toggles for Drawers & Modals matching TikTok video
  const [isFollowing, setIsFollowing] = useState<boolean>(profile.isFollowing ?? true);
  const [showSuggestedAccounts, setShowSuggestedAccounts] = useState<boolean>(false);
  const [showFollowersDrawer, setShowFollowersDrawer] = useState<boolean>(false);
  const [followersActiveTab, setFollowersActiveTab] = useState<'following' | 'followers' | 'suggested'>('followers');
  const [followersSearchQuery, setFollowersSearchQuery] = useState<string>('');
  
  const [showLikesModal, setShowLikesModal] = useState<boolean>(false);
  const [showShareSheet, setShowShareSheet] = useState<boolean>(false);
  const [showDirectChat, setShowDirectChat] = useState<boolean>(false);
  const [chatMessageInput, setChatMessageInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'creator'; text: string; time: string }>>([
    { sender: 'creator', text: 'أهلاً بك! يمكنك إرسال استفسارك أو طلبك وستقوم الإدارة بالرد فوراً 🍿', time: '10:00 ص' }
  ]);
  const [showNotificationPref, setShowNotificationPref] = useState<boolean>(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);

  // Suggested accounts mock list
  const [suggestedList, setSuggestedList] = useState([
    { id: 1, name: 'Movies Time TV 🍿', handle: '@moviestimetv', followers: '3995 متابع', avatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=100', isFollowing: false },
    { id: 2, name: '5 Movies & Kids 🎬', handle: '@5movies_kids', followers: '2154 متابع', avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100', isFollowing: false },
    { id: 3, name: 'Cinema World 🌟', handle: '@cinemaworld', followers: '12.8k متابع', avatar: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100', isFollowing: false }
  ]);

  // Followers / Following mock list
  const [followersList, setFollowersList] = useState([
    { id: 101, name: 'MOHAMMAD 🇵🇸', handle: '@hammodh_21r', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', isFollowing: true },
    { id: 102, name: 'MBC FM 📻', handle: '@mbcfmofficial', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', isFollowing: true },
    { id: 103, name: 'MBC PODCASTS 🎙️', handle: '@mbcpodcasts', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', isFollowing: true },
    { id: 104, name: 'BWM3 GTR 🏎️', handle: '@rowaida.barka', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', isFollowing: false },
    { id: 105, name: 'MBC LOUD FM 🎵', handle: '@mbcloudfm', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', isFollowing: true },
    { id: 106, name: 'Panorama FM 🎧', handle: '@panoramafm', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', isFollowing: false }
  ]);

  const handleToggleFollowCreator = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    if (onFollowToggle) onFollowToggle();
    if (showToast) {
      showToast(nextState ? `بدأت بمتابعة ${profile.name} ✅` : `تم إلغاء متابعة ${profile.name}`);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessageInput.trim()) return;
    const userMsg = chatMessageInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'الآن' }]);
    setChatMessageInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'creator', text: 'تم استلام رسالتك بنجاح! شكراً لمتابعتك لـ ' + profile.name, time: 'الآن' }
      ]);
    }, 1000);
  };

  // Playlists / Categories
  const playlists = [
    { id: 'all', title: 'الكل 🎬' },
    { id: 'trending', title: 'ريا والنجوم ✨' },
    { id: 'celebrity', title: 'أخبار المشاهير 🌟' },
    { id: 'quotes', title: 'أقوال المشاهير 💬' },
    { id: 'quiz', title: 'خمّن معنا ❓' }
  ];

  // Filter videos for profile
  const userVideos = profile.isOwnProfile
    ? reels
    : reels.filter(r => r.creator.name.toLowerCase() === profile.name.toLowerCase() || (r as any).isOfficial || !profile.name.includes('User'));

  // If list is small, show reels slice
  const displayVideos = userVideos.length > 0 ? userVideos : reels.slice(0, 9);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-2 select-none overflow-hidden animate-in fade-in duration-200">
      {/* Outer Mobile Frame container strictly matching TikTok layout */}
      <div className="w-full max-w-full sm:max-w-md h-[100dvh] sm:h-[calc(100dvh-20px)] bg-black text-white sm:rounded-3xl border-0 sm:border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BAR */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10 shrink-0 z-30">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
            title="رجوع"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          {/* Centered Username with Blue Checkmark */}
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => setShowOptionsMenu(true)}>
            <span className="font-extrabold text-sm text-white tracking-wide">{profile.username || '@' + profile.name}</span>
            {profile.isVerified !== false && (
              <CheckCircle2 className="w-4 h-4 fill-sky-500 text-black" />
            )}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Right Header Icons: Bell, Share, Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotificationPref(true)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowShareSheet(true)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="مشاركة الملف الشخصي"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowOptionsMenu(true)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              title="خيارات"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE PROFILE CONTENT */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          
          {/* 2. AVATAR & NAME */}
          <div className="flex flex-col items-center pt-4 pb-2 px-4 text-center">
            {/* Round Avatar */}
            <div className="relative mb-2">
              <div
                onClick={() => {
                  if (onOpenStory) onOpenStory();
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-[#e50914] to-pink-500 shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full border-2 border-black"
                />
              </div>
              {profile.badge && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-black shadow">
                  {profile.badge}
                </span>
              )}
            </div>

            {/* Display Name with Verified Badge */}
            <h2 className="text-lg font-black text-white flex items-center justify-center gap-1.5 mt-1">
              <span>{profile.name}</span>
              {profile.isVerified !== false && (
                <CheckCircle2 className="w-4 h-4 fill-sky-500 text-black inline-block" />
              )}
            </h2>
            <span className="text-xs text-gray-400 font-mono mb-3">@{profile.username || 'mbc2tv'}</span>

            {/* 3. STATS COUNTER ROW (Clickable!) */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 my-1 py-1 w-full max-w-xs">
              {/* Following Counter */}
              <button
                onClick={() => {
                  setFollowersActiveTab('following');
                  setShowFollowersDrawer(true);
                }}
                className="flex flex-col items-center active:scale-95 transition-transform"
              >
                <span className="text-base font-black text-white tracking-tight">{profile.followingCount || '20'}</span>
                <span className="text-[11px] text-gray-400 font-bold">أتابعه</span>
              </button>

              <div className="h-5 w-[1px] bg-white/15" />

              {/* Followers Counter */}
              <button
                onClick={() => {
                  setFollowersActiveTab('followers');
                  setShowFollowersDrawer(true);
                }}
                className="flex flex-col items-center active:scale-95 transition-transform"
              >
                <span className="text-base font-black text-white tracking-tight">{profile.followersCount || '1.5M'}</span>
                <span className="text-[11px] text-gray-400 font-bold">متابعين</span>
              </button>

              <div className="h-5 w-[1px] bg-white/15" />

              {/* Likes Counter */}
              <button
                onClick={() => setShowLikesModal(true)}
                className="flex flex-col items-center active:scale-95 transition-transform"
              >
                <span className="text-base font-black text-white tracking-tight">{profile.likesCount || '7.3M'}</span>
                <span className="text-[11px] text-gray-400 font-bold">تسجيلات الإعجاب</span>
              </button>
            </div>

            {/* 4. ACTION BUTTONS ROW */}
            <div className="flex items-center justify-center gap-2 w-full max-w-xs my-3">
              {profile.isOwnProfile ? (
                <>
                  <button
                    onClick={onOpenAddReel}
                    className="flex-1 py-2.5 bg-[#e50914] hover:bg-[#ff1f2d] text-white rounded-xl font-extrabold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>نشر ريلز جديد</span>
                  </button>
                  <button
                    onClick={onOpenAddStory}
                    className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <Camera className="w-4 h-4" />
                    <span>قصة</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Follow / Following Button */}
                  <button
                    onClick={handleToggleFollowCreator}
                    className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg ${
                      isFollowing
                        ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                        : 'bg-gradient-to-r from-[#fe2c55] to-[#ff0050] text-white shadow-[#fe2c55]/30'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>متابَع</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>متابعة</span>
                      </>
                    )}
                  </button>

                  {/* Message Direct Chat Button */}
                  <button
                    onClick={() => setShowDirectChat(true)}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs border border-white/15 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 rotate-45" />
                    <span>مراسلة</span>
                  </button>

                  {/* Toggle Suggested Accounts Button */}
                  <button
                    onClick={() => setShowSuggestedAccounts(!showSuggestedAccounts)}
                    className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                      showSuggestedAccounts
                        ? 'bg-white text-black border-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                    title="حسابات مقترحة"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSuggestedAccounts ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}
            </div>

            {/* 5. SUGGESTED ACCOUNTS CAROUSEL (If Toggled) */}
            {showSuggestedAccounts && (
              <div className="w-full bg-white/5 rounded-2xl p-3 my-2 border border-white/10 text-right animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-300">حسابات مقترحة</span>
                  <button
                    onClick={() => {
                      setFollowersActiveTab('suggested');
                      setShowFollowersDrawer(true);
                    }}
                    className="text-[10px] text-red-400 font-bold hover:underline"
                  >
                    عرض الكل
                  </button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
                  {suggestedList.map(s => (
                    <div
                      key={s.id}
                      className="min-w-[120px] bg-black/60 border border-white/10 rounded-xl p-2.5 flex flex-col items-center text-center shadow-md relative"
                    >
                      <button
                        onClick={() => setSuggestedList(prev => prev.filter(item => item.id !== s.id))}
                        className="absolute top-1 left-1 text-gray-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover mb-1.5 border border-white/20" />
                      <h4 className="text-[11px] font-bold text-white truncate w-full">{s.name}</h4>
                      <span className="text-[9px] text-gray-400 mb-2">{s.followers}</span>
                      <button
                        onClick={() => {
                          setSuggestedList(prev =>
                            prev.map(item => (item.id === s.id ? { ...item, isFollowing: !item.isFollowing } : item))
                          );
                        }}
                        className={`w-full py-1 rounded-lg text-[10px] font-bold transition-all ${
                          s.isFollowing
                            ? 'bg-white/10 text-white'
                            : 'bg-[#fe2c55] text-white'
                        }`}
                      >
                        {s.isFollowing ? 'متابَع' : 'متابعة'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. BIO DESCRIPTION */}
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mt-1 px-2 font-sans">
              {profile.bio || 'بوابتك لمشاهدة أقوى الأفلام السينمائية وأضخم عروض هوليوود في مكان واحد 🍿✨'}
            </p>

            {/* 7. PLAYLISTS / HIGHLIGHTS CAROUSEL PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto w-full py-3 my-1 custom-scrollbar text-xs">
              {playlists.map(pl => (
                <button
                  key={pl.id}
                  onClick={() => setActivePlaylist(pl.title)}
                  className={`px-3 py-1.5 rounded-full font-extrabold whitespace-nowrap transition-all border shrink-0 text-[11px] ${
                    activePlaylist === pl.title
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                  }`}
                >
                  {pl.title}
                </button>
              ))}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* 8. TIKTOK TAB NAVIGATION BAR */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-around border-t border-b border-white/10 bg-black/50 py-2.5 text-xs font-bold">
            {/* Tab 1: Grid (المقاطع المنشورة) */}
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 flex justify-center py-1 relative transition-colors ${
                activeTab === 'grid' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="المقاطع المنشورة"
            >
              <Grid className="w-5 h-5" />
              {activeTab === 'grid' && (
                <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>

            {/* Tab 2: Repost (إعادات النشر) */}
            <button
              onClick={() => setActiveTab('repost')}
              className={`flex-1 flex justify-center py-1 relative transition-colors ${
                activeTab === 'repost' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="إعادات النشر"
            >
              <Repeat className="w-5 h-5" />
              {activeTab === 'repost' && (
                <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>

            {/* Tab 3: Saved / Lock (المحفوظات) */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex justify-center py-1 relative transition-colors ${
                activeTab === 'saved' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="المحفوظات"
            >
              <Bookmark className="w-5 h-5" />
              {activeTab === 'saved' && (
                <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>

            {/* Tab 4: Liked (المعجب بها) */}
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 flex justify-center py-1 relative transition-colors ${
                activeTab === 'liked' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              title="تسجيلات الإعجاب"
            >
              <Heart className="w-5 h-5" />
              {activeTab === 'liked' && (
                <div className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 9. TIKTOK 3-COLUMN VIDEO GRID */}
          {/* ========================================================================= */}
          <div className="p-0.5 sm:p-1">
            {activeTab === 'grid' && (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {displayVideos.map((r, idx) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectReel(r.id);
                      onClose();
                    }}
                    className="relative aspect-[3/4] bg-gray-900 overflow-hidden cursor-pointer group active:opacity-80 transition-opacity"
                  >
                    <img
                      src={r.poster}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* PINNED BADGE (مثبّت) on first 3 videos */}
                    {idx < 3 && (
                      <div className="absolute top-1 right-1 bg-[#fe2c55] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-md border border-white/20">
                        مثبّت
                      </div>
                    )}

                    {/* Views Overlay Counter at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex items-end justify-between">
                      <div className="flex items-center gap-1 text-[10px] font-black text-white drop-shadow">
                        <Play className="w-3 h-3 fill-white text-white" />
                        <span>
                          {idx === 0
                            ? '425.6 ألف'
                            : idx === 1
                            ? '163.5 ألف'
                            : idx === 2
                            ? '119.3 ألف'
                            : r.likesCount > 1000
                            ? `${(r.likesCount / 100).toFixed(1)} ألف`
                            : `${r.likesCount * 12}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'repost' && (
              <div className="py-12 text-center text-gray-500 text-xs">
                <Repeat className="w-8 h-8 mx-auto mb-2 opacity-40 text-white" />
                <p>لا توجد مقاطع معاد نشرها حتى الآن</p>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {reels
                  .filter(r => r.isSaved)
                  .map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onSelectReel(r.id);
                        onClose();
                      }}
                      className="relative aspect-[3/4] bg-gray-900 overflow-hidden cursor-pointer group"
                    >
                      <img src={r.poster} alt={r.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 bg-black/60 px-1 rounded text-[9px] text-white">
                        محفوظ
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {reels
                  .filter(r => r.isLiked)
                  .map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        onSelectReel(r.id);
                        onClose();
                      }}
                      className="relative aspect-[3/4] bg-gray-900 overflow-hidden cursor-pointer group"
                    >
                      <img src={r.poster} alt={r.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 right-1 flex items-center gap-0.5 text-[9px] text-white font-bold bg-black/60 px-1 rounded">
                        <Heart className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                        <span>{r.likesCount}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* POPUP 1: FOLLOWERS / FOLLOWING LIST DRAWER (قائمة المتابعين) */}
        {/* ========================================================================= */}
        {showFollowersDrawer && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <button onClick={() => setShowFollowersDrawer(false)} className="p-1">
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
              <span className="font-extrabold text-sm text-white">{profile.username || profile.name}</span>
              <div className="w-5" />
            </div>

            {/* Followers Subtabs */}
            <div className="flex items-center justify-around border-b border-white/10 py-2 text-xs font-bold text-gray-400">
              <button
                onClick={() => setFollowersActiveTab('following')}
                className={`pb-1 px-2 ${followersActiveTab === 'following' ? 'text-white border-b-2 border-white' : ''}`}
              >
                أتابعه ({profile.followingCount || '20'})
              </button>
              <button
                onClick={() => setFollowersActiveTab('followers')}
                className={`pb-1 px-2 ${followersActiveTab === 'followers' ? 'text-white border-b-2 border-white' : ''}`}
              >
                متابعون ({profile.followersCount || '1.5M'})
              </button>
              <button
                onClick={() => setFollowersActiveTab('suggested')}
                className={`pb-1 px-2 ${followersActiveTab === 'suggested' ? 'text-white border-b-2 border-white' : ''}`}
              >
                مقترح
              </button>
            </div>

            {/* Search Input inside Followers Drawer */}
            <div className="p-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 text-xs text-white">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={followersSearchQuery}
                  onChange={e => setFollowersSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white placeholder-gray-400 text-xs"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 custom-scrollbar divide-y divide-white/5">
              {followersList
                .filter(u => u.name.toLowerCase().includes(followersSearchQuery.toLowerCase()))
                .map(u => (
                  <div key={u.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-full object-cover border border-white/20" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{u.name}</h4>
                        <span className="text-[10px] text-gray-400">{u.handle}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFollowersList(prev =>
                          prev.map(item => (item.id === u.id ? { ...item, isFollowing: !item.isFollowing } : item))
                        );
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        u.isFollowing
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-[#fe2c55] text-white'
                      }`}
                    >
                      {u.isFollowing ? 'أتابعه' : 'متابعة'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POPUP 2: TOTAL LIKES INFO MODAL (إجمالي تسجيلات الإعجاب) */}
        {/* ========================================================================= */}
        {showLikesModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95">
            <div className="w-full max-w-xs bg-[#1e1e24] border border-white/10 rounded-2xl p-5 text-center shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-3 text-pink-500 animate-pulse">
                <Heart className="w-8 h-8 fill-pink-500" />
              </div>
              <h3 className="text-sm font-black text-white mb-2">إجمالي تسجيلات الإعجاب</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                حصل <span className="font-bold text-white">{profile.username || profile.name}</span> على{' '}
                <span className="font-extrabold text-pink-400">{profile.likesCount || '7.3M'}</span> تسجيل إعجاب لكل الفيديوهات المنشورة.
              </p>
              <button
                onClick={() => setShowLikesModal(false)}
                className="w-full py-2.5 bg-[#fe2c55] hover:bg-[#ff0050] text-white font-extrabold text-xs rounded-xl shadow-lg active:scale-95 transition-all"
              >
                موافق
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POPUP 3: TIKTOK SHARE SHEET (مشاركة الملف الشخصي) */}
        {/* ========================================================================= */}
        {showShareSheet && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end animate-in slide-in-from-bottom">
            <div className="w-full bg-[#18181f] border-t border-white/10 rounded-t-3xl p-4 text-right shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-black text-white">إرسال إلى</span>
                <button onClick={() => setShowShareSheet(false)} className="p-1 text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Share Options List */}
              <div className="grid grid-cols-4 gap-4 py-4 text-center">
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      if (showToast) showToast('تم نسخ رابط الملف الشخصي! 📋');
                    }
                    setShowShareSheet(false);
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Copy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold">نسخ الرابط</span>
                </button>

                <button
                  onClick={() => {
                    if (showToast) showToast('تمت المشاركة عبر WhatsApp 💬');
                    setShowShareSheet(false);
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold">WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    if (showToast) showToast('جاري إنشاء رمز QR للملف الشخصي...');
                    setShowShareSheet(false);
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 border border-purple-500/30">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold">رمز QR</span>
                </button>

                <button
                  onClick={() => {
                    if (showToast) showToast('تم إرسال بلاغ للإدارة للتأكد');
                    setShowShareSheet(false);
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-red-600/30 flex items-center justify-center text-red-400 border border-red-500/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-gray-300 font-bold">إبلاغ</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POPUP 4: DIRECT CHAT DRAWER (مراسلة خاصة) */}
        {/* ========================================================================= */}
        {showDirectChat && (
          <div className="absolute inset-0 z-50 bg-[#121217] flex flex-col animate-in slide-in-from-bottom">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/60">
              <button onClick={() => setShowDirectChat(false)} className="p-1 text-gray-400 hover:text-white">
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm text-white">{profile.name}</span>
                {profile.isVerified !== false && <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-black" />}
              </div>
              <button onClick={() => setShowOptionsMenu(true)} className="p-1 text-gray-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div className="text-center py-4 border-b border-white/10">
                <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white/20" />
                <h3 className="text-sm font-black text-white">{profile.name}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {profile.followersCount} متابعين • 20 أتابعه
                </p>
                <p className="text-[10px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 inline-block mt-2">
                  إرسال طلب رسالة خاصة إلى {profile.name}
                </p>
              </div>

              {chatMessages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#fe2c55] text-white rounded-br-none'
                        : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-3 border-t border-white/10 bg-black/80 flex items-center gap-2">
              <input
                type="text"
                placeholder={`إرسال رسالة إلى ${profile.name}...`}
                value={chatMessageInput}
                onChange={e => setChatMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-[#fe2c55]"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-[#fe2c55] hover:bg-[#ff0050] text-white rounded-xl active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
