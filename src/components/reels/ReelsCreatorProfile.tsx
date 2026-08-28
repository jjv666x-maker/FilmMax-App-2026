import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  MoreHorizontal,
  Camera,
  QrCode,
  Pencil,
  Plus,
  Play,
  Heart,
  Star,
  ListFilter,
  ExternalLink,
  MapPin,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { ReelItem } from '../../types';

interface ReelsCreatorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditProfile: () => void;
  onOpenAddStory: () => void;
  onSelectReel: (reelId: string | number) => void;
  reels: ReelItem[];
  showToast: (msg: string) => void;
}

export const ReelsCreatorProfile: React.FC<ReelsCreatorProfileProps> = ({
  isOpen,
  onClose,
  onOpenEditProfile,
  onOpenAddStory,
  onSelectReel,
  reels,
  showToast
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'reels' | 'posts' | 'saved' | 'reposts'>('reels');
  const [activeFilterChip, setActiveFilterChip] = useState<string>('none');

  // Video items for the grid matching Image 2 EXACTLY
  const gridVideos = [
    {
      id: 'g1',
      title: 'تاج الدم - مشهد ملحمي',
      views: '125K',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: 'g2',
      title: 'أم التنانين - تحليل الشخصية',
      views: '98K',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    {
      id: 'g3',
      title: 'سيف الليل تحت ضوء القمر',
      views: '76K',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
    },
    {
      id: 'g4',
      title: 'كواليس المشاهد السينمائية',
      views: '64K',
      poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      id: 'g5',
      title: 'إضاءة النيون والظلال',
      views: '52K',
      poster: 'https://images.unsplash.com/photo-1518676599625-5832b4a19980?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: 'g6',
      title: 'أفضل 5 مسلسلات تاريخية',
      views: '48K',
      poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-20px)] sm:rounded-[36px] bg-[#0c0d12] text-white border-0 sm:border border-white/10 shadow-2xl flex flex-col relative overflow-hidden font-sans">
        
        {/* ========================================================================= */}
        {/* TOP STATUS BAR & HEADER (Matching Image 2 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="relative z-30 shrink-0">
          {/* Top Status Bar: 9:41 & Icons */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-white text-xs font-bold">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Bar: Left Arrow, Right Bell & More */}
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('تم تفعيل التنبيهات لهذا الحساب 🔔')}
                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              >
                <Bell className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                onClick={() => showToast('خيارات الملف الشخصي')}
                className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              >
                <MoreHorizontal className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCROLLABLE PROFILE CONTENT (Matching Image 2 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Cover & Avatar Banner Area */}
          <div className="relative flex flex-col items-center">
            
            {/* Background City Lights / Night Cover Image */}
            <div
              className="w-full h-36 bg-cover bg-center relative"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0c0d12]" />
            </div>

            {/* Circular Avatar overlapping cover & body */}
            <div className="relative -mt-16 mb-2.5 z-10">
              <div className="w-24 h-24 rounded-full border-[3px] border-[#0c0d12] overflow-hidden bg-gray-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                  alt="Ahmed Mo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Camera Icon Badge */}
              <button
                onClick={onOpenEditProfile}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white text-black rounded-full border-2 border-[#0c0d12] flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                title="تغيير الصورة"
              >
                <Camera className="w-3.5 h-3.5 fill-black text-black" />
              </button>
            </div>

            {/* Name + VIP Badge + Blue Checkmark (Image 2) */}
            <div className="flex items-center gap-2 mb-1 z-10">
              <span className="w-4 h-4 rounded-full bg-[#0095f6] text-white text-[9px] font-black flex items-center justify-center">
                ✓
              </span>
              <span className="bg-[#e50914] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow">
                VIP
              </span>
              <h2 className="text-xl font-black text-white tracking-wide">Ahmed Mo</h2>
            </div>

            {/* Username + QR Code icon */}
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold mb-4 z-10">
              <button
                onClick={() => showToast('رمز QR الخاص بالحساب جاهز للمسح 📱')}
                className="text-gray-400 hover:text-white"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
              <span>@ahmed.mo</span>
            </div>

            {/* Stats Row (3 Columns: منشورات 342 | متابعون 12.4K | متابع 128) */}
            <div className="w-full px-8 grid grid-cols-3 gap-2 text-center mb-5 z-10">
              <div>
                <div className="text-base font-black text-white">342</div>
                <div className="text-xs text-gray-400 font-bold">منشورات</div>
              </div>
              <div>
                <div className="text-base font-black text-white">12.4K</div>
                <div className="text-xs text-gray-400 font-bold">متابعون</div>
              </div>
              <div>
                <div className="text-base font-black text-white">128</div>
                <div className="text-xs text-gray-400 font-bold">متابع</div>
              </div>
            </div>

            {/* Action Buttons Row (Image 2: '+ إضافة قصة' on Right, 'تعديل الملف الشخصي' on Left) */}
            <div className="w-full px-5 grid grid-cols-2 gap-2.5 mb-4 z-10">
              {/* Red Add Story Button */}
              <button
                onClick={onOpenAddStory}
                className="flex items-center justify-center gap-1.5 bg-[#e50914] hover:bg-red-600 text-white py-2.5 px-4 rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>إضافة قصة</span>
              </button>

              {/* Dark Charcoal Edit Profile Button */}
              <button
                onClick={onOpenEditProfile}
                className="flex items-center justify-center gap-1.5 bg-[#1f222b] hover:bg-[#282c37] text-white py-2.5 px-4 rounded-xl font-bold text-xs border border-white/10 active:scale-95 transition-all"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-300" />
                <span>تعديل الملف الشخصي</span>
              </button>
            </div>

            {/* Bio Details matching Image 2 EXACTLY */}
            <div className="w-full px-6 text-center space-y-1 text-xs text-gray-200 z-10 font-bold leading-relaxed mb-4">
              <p>صانع محتوى سينمائي 🍿</p>
              <p>🎬 أخبار - مراجعات - كواليس</p>
              <p className="flex items-center justify-center gap-1 text-gray-300 pt-0.5">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Cairo, Egypt</span>
              </p>
              <p className="flex items-center justify-center gap-1 text-[#0095f6] pt-0.5">
                <ExternalLink className="w-3 h-3" />
                <span className="hover:underline cursor-pointer">youtube.com/filmmax</span>
              </p>
            </div>

            {/* Sub-Category Chips (Image 2: المفضلة ♡ | تقييماتي ★ | قوائم ☰) */}
            <div className="w-full px-4 flex items-center justify-center gap-2 mb-4 z-10">
              {/* المفضلة */}
              <button
                onClick={() => {
                  setActiveFilterChip('fav');
                  showToast('عرض المفضلة ♡');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  activeFilterChip === 'fav'
                    ? 'bg-red-500/20 border-red-500 text-white'
                    : 'bg-[#181a22] border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>المفضلة</span>
              </button>

              {/* تقييماتي */}
              <button
                onClick={() => {
                  setActiveFilterChip('ratings');
                  showToast('عرض تقييماتي ★');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  activeFilterChip === 'ratings'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-[#181a22] border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>تقييماتي</span>
              </button>

              {/* قوائم */}
              <button
                onClick={() => {
                  setActiveFilterChip('lists');
                  showToast('عرض القوائم المخصصة ☰');
                }}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  activeFilterChip === 'lists'
                    ? 'bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-[#181a22] border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>قوائم</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB SWITCHER: Reels | المنشورات | المحفوظات | إعادة النشر (Image 2) */}
          {/* ========================================================================= */}
          <div className="flex items-center justify-around border-t border-b border-white/10 bg-[#0c0d12] px-2 py-1 sticky top-0 z-20">
            {/* 1. Reels */}
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex-1 py-2 text-xs font-black transition-all relative ${
                activeTab === 'reels' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Reels
              {activeTab === 'reels' && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#e50914] rounded-full" />
              )}
            </button>

            {/* 2. المنشورات */}
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-2 text-xs font-black transition-all relative ${
                activeTab === 'posts' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              المنشورات
              {activeTab === 'posts' && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#e50914] rounded-full" />
              )}
            </button>

            {/* 3. المحفوظات */}
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 text-xs font-black transition-all relative ${
                activeTab === 'saved' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              المحفوظات
              {activeTab === 'saved' && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#e50914] rounded-full" />
              )}
            </button>

            {/* 4. إعادة النشر */}
            <button
              onClick={() => setActiveTab('reposts')}
              className={`flex-1 py-2 text-xs font-black transition-all relative ${
                activeTab === 'reposts' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              إعادة النشر
              {activeTab === 'reposts' && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#e50914] rounded-full" />
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 3-COLUMN VIDEO GRID MATCHING IMAGE 2 EXACTLY */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black">
            {gridVideos.map(video => (
              <div
                key={video.id}
                onClick={() => {
                  onSelectReel(video.id);
                  onClose();
                }}
                className="relative aspect-[9/16] bg-gray-900 overflow-hidden group cursor-pointer"
              >
                <img
                  src={video.poster}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                
                {/* View count at bottom-left in Arabic RTL format (Image 2: ▶ 125K / ▶ 98K / ▶ 76K) */}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-black text-white drop-shadow">
                  <Play className="w-2.5 h-2.5 fill-white text-white" />
                  <span>{video.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
