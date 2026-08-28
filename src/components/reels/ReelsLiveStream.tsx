import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Gift,
  Share2,
  MoreHorizontal,
  Send,
  Sparkles,
  Check,
  Plus,
  Crown,
  Share,
  X,
  Smile,
  Image as ImageIcon
} from 'lucide-react';

interface ReelsLiveStreamProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ReelsLiveStream: React.FC<ReelsLiveStreamProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  if (!isOpen) return null;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(12400);
  const [liveChatInput, setLiveChatInput] = useState<string>('');
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showGiftModal, setShowGiftModal] = useState<boolean>(false);

  // Live messages matching Mockup #1
  const [messages, setMessages] = useState<Array<{ id: number; user: string; text: string; avatar: string }>>([
    {
      id: 1,
      user: 'ahmed.mo',
      text: 'مرحبا بالجميع 👋',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    {
      id: 2,
      user: 'sara.films',
      text: '🔥🔥🔥',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: 3,
      user: 'mohamed.tv',
      text: '👏 !رائع',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    }
  ]);

  // Periodic simulated live chat
  useEffect(() => {
    const timer = setInterval(() => {
      const livePool = [
        { user: 'khalid.pro', text: 'الإضاءة والكاميرا رائعة جداً 🎥', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
        { user: 'noura.cinema', text: 'متحمسين للحلقة القادمة 🔥', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        { user: 'omar_film', text: 'أفضل استوديو في الوطن العربي 🍿', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100' }
      ];
      const nextMsg = livePool[Math.floor(Math.random() * livePool.length)];
      setMessages(prev => [
        ...prev.slice(-4),
        {
          id: Date.now(),
          user: nextMsg.user,
          text: nextMsg.text,
          avatar: nextMsg.avatar
        }
      ]);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleBurstHeart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2 + (Math.random() * 60 - 30),
      y: rect.top - 20 - Math.random() * 40
    };
    setFloatingHearts(prev => [...prev, newHeart]);
    setIsLiked(true);
    setLikesCount(prev => prev + 1);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        user: 'ahmed.mo',
        text: liveChatInput.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      }
    ]);
    setLiveChatInput('');
    showToast('تم إرسال رسالتك في البث المباشر 💬');
  };

  const handleSendGift = (giftName: string) => {
    showToast(`أرسلت هدية ${giftName} إلى المضيف! 🎁✨`);
    setShowGiftModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-20px)] sm:rounded-[36px] bg-[#0c0d12] text-white border-0 sm:border border-white/10 shadow-2xl flex flex-col relative overflow-hidden font-sans">
        
        {/* ========================================================================= */}
        {/* TOP LIVE VIDEO STREAM AREA (Matching Image 1 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="relative w-full h-[52%] bg-black overflow-hidden flex items-center justify-center">
          {/* Streamer Video Feed */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
            alt="Live Streamer"
            className="w-full h-full object-cover brightness-95"
          />

          {/* Top Video Header Overlay */}
          <div className="absolute top-0 left-0 right-0 p-3 pt-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
            {/* Left: Red LIVE badge + Star 12.4K viewers */}
            <div className="flex items-center gap-1.5">
              <span className="bg-[#e50914] text-white font-black text-[11px] px-2.5 py-0.5 rounded-lg tracking-wider shadow-lg flex items-center gap-1">
                LIVE
              </span>
              <div className="bg-black/60 backdrop-blur-md border border-white/15 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                <span>★ 12.4K</span>
              </div>
            </div>

            {/* Right: Network/Effects icon + Close button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('تأثيرات الكاميرا والمشاركة')}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10"
              >
                {/* Custom multi-node connected circle icon matching screenshot */}
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute -top-0.5 left-1/2 -translate-x-1/2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1/2 -left-0.5 -translate-y-1/2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1/2 -right-0.5 -translate-y-1/2" />
                  <div className="w-2.5 h-2.5 border border-white/60 rounded-sm rotate-45" />
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Floating Chat Over Video (Bottom Left of Video Feed - Exactly like Image 1) */}
          <div className="absolute bottom-3 left-3 z-20 space-y-1.5 max-w-[80%] pointer-events-none">
            {messages.map(msg => (
              <div
                key={msg.id}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <img
                  src={msg.avatar}
                  alt={msg.user}
                  className="w-5 h-5 rounded-full object-cover border border-white/30"
                />
                <span className="text-[11px] font-black text-gray-200">{msg.user}</span>
                <span className="text-[11px] font-medium text-white">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Floating Hearts Container */}
          {floatingHearts.map(h => (
            <div
              key={h.id}
              style={{ left: `${h.x}px`, top: `${h.y}px` }}
              className="fixed pointer-events-none z-50 animate-bounce duration-1000"
            >
              <Heart className="w-9 h-9 text-red-500 fill-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]" />
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* MIDDLE ACTION BAR: إعجاب | تعليق | هدايا | مشاركة | المزيد (Image 1) */}
        {/* ========================================================================= */}
        <div className="h-16 bg-[#111319] border-y border-white/10 px-4 flex items-center justify-between text-white shrink-0">
          {/* 1. إعجاب (Heart) */}
          <button
            onClick={handleBurstHeart}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isLiked ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-300 group-hover:text-white'
              }`}
            />
            <span className="text-[11px] font-bold text-gray-300">إعجاب</span>
          </button>

          {/* 2. تعليق (Comment) */}
          <button
            onClick={() => showToast('اكتب تعليقك في الحقل بالأسفل 💬')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white" />
            <span className="text-[11px] font-bold text-gray-300">تعليق</span>
          </button>

          {/* 3. هدايا (Gifts - Glowing Pink/Red Outline Box) */}
          <button
            onClick={() => setShowGiftModal(true)}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <div className="relative">
              <Gift className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />
            </div>
            <span className="text-[11px] font-bold text-pink-400">هدايا</span>
          </button>

          {/* 4. مشاركة (Share) */}
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('تم نسخ رابط البث المباشر! 🔗');
            }}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <Gift className="w-5 h-5 text-gray-300 group-hover:text-white" />
            <span className="text-[11px] font-bold text-gray-300">مشاركة</span>
          </button>

          {/* 5. المزيد (More) */}
          <button
            onClick={() => showToast('المزيد من خيارات البث ⚙️')}
            className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
          >
            <Share className="w-5 h-5 text-gray-300 group-hover:text-white" />
            <span className="text-[11px] font-bold text-gray-300">المزيد</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STREAMER PROFILE & BROADCAST INFO (Matching Image 1 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-[#0c0d12] p-4 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Top row: Streamer avatar + Name + Verified Badge on Left, Red 'متابعة' on Right */}
            <div className="flex items-center justify-between">
              {/* Red Follow Button */}
              <button
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  showToast(isFollowing ? 'تم إلغاء المتابعة' : 'أنت تتابع FilmMax Studio الآن ✅');
                }}
                className={`px-5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-md ${
                  isFollowing
                    ? 'bg-white/15 text-gray-200 border border-white/20'
                    : 'bg-[#e50914] hover:bg-red-600 text-white'
                }`}
              >
                {isFollowing ? 'متابع' : 'متابعة'}
              </button>

              {/* Creator details */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center">
                    ✓
                  </span>
                  <span className="font-black text-sm text-white">FilmMax Studio</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120"
                  alt="FilmMax Studio"
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
                />
              </div>
            </div>

            {/* Broadcast Topic Title */}
            <div className="text-right">
              <p className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                <span>مناقشة عن أفضل المسلسلات القادمة</span>
                <span>🔥</span>
              </p>
            </div>

            {/* Viewers count in Arabic matching image: مشاهدة 12.4K الآن */}
            <div className="text-right">
              <span className="text-[11px] font-bold text-gray-400">
                مشاهدة 12.4K الآن
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM INTERACTION & CHAT BAR (Matching Image 1 EXACTLY) */}
          {/* ========================================================================= */}
          <div className="pt-2">
            <form onSubmit={handleSendChat} className="flex items-center gap-2">
              {/* Leftmost: Quick Reactions/Gift Icon */}
              <button
                type="button"
                onClick={() => setShowGiftModal(true)}
                className="w-10 h-10 rounded-full bg-[#1b1e27] hover:bg-white/10 flex items-center justify-center text-gray-300 active:scale-95 transition-all shrink-0 border border-white/10"
              >
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
              </button>

              {/* Middle: Input field with nested 'هدية 🎁' pill */}
              <div className="flex-1 bg-[#1b1e27] border border-white/10 rounded-full px-3.5 py-1.5 flex items-center justify-between">
                {/* Gift quick pill inside input */}
                <button
                  type="button"
                  onClick={() => setShowGiftModal(true)}
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-full transition-colors"
                >
                  <span>🎁</span>
                  <span>هدية</span>
                </button>

                <input
                  type="text"
                  value={liveChatInput}
                  onChange={e => setLiveChatInput(e.target.value)}
                  placeholder="...اكتب تعليقاً"
                  className="w-full bg-transparent text-xs text-white placeholder-gray-400 outline-none text-right px-2"
                />
              </div>

              {/* Heart Button */}
              <button
                type="button"
                onClick={handleBurstHeart}
                className="w-9 h-9 rounded-full bg-[#1b1e27] hover:bg-white/10 flex items-center justify-center text-gray-300 active:scale-95 transition-all shrink-0 border border-white/10"
              >
                <Heart className="w-5 h-5 text-gray-300" />
              </button>

              {/* Send / Paper Plane Button */}
              <button
                type="submit"
                disabled={!liveChatInput.trim()}
                className="w-9 h-9 rounded-full bg-[#1b1e27] hover:bg-red-600 disabled:opacity-50 text-white flex items-center justify-center active:scale-95 transition-all shrink-0 border border-white/10"
              >
                <Send className="w-4 h-4 rotate-180 text-gray-300" />
              </button>
            </form>
          </div>
        </div>

        {/* Gift Selector Modal */}
        {showGiftModal && (
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-end justify-center p-4 z-50 animate-in fade-in duration-150"
            onClick={() => setShowGiftModal(false)}
          >
            <div
              className="w-full bg-[#161821] border border-white/15 rounded-3xl p-4 text-center space-y-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
              <h4 className="text-xs font-black text-amber-400 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4" />
                <span>إرسال هدية للمضيف في البث المباشر</span>
              </h4>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'فشار 🍿', cost: '10' },
                  { name: 'تاج 👑', cost: '50' },
                  { name: 'صاروخ 🚀', cost: '100' },
                  { name: 'كاميرا 🎥', cost: '200' }
                ].map(g => (
                  <button
                    key={g.name}
                    onClick={() => handleSendGift(g.name)}
                    className="p-3 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-all"
                  >
                    <span className="text-xl">{g.name.split(' ')[1]}</span>
                    <span className="text-[10px] font-bold text-white">{g.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-amber-400 font-black">{g.cost} 🪙</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowGiftModal(false)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
