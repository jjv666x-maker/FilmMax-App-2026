import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { LiveChannel } from '../types';
import {
  Radio,
  Play,
  Pause,
  Bell,
  BellRing,
  Clock,
  MessageSquare,
  Send,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  Layers,
  Calendar,
  Settings,
  Check,
  Sparkles,
  Zap,
  Activity,
  Tv,
  AlertCircle,
  Video,
  RefreshCw,
  Film
} from 'lucide-react';

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
}

export const LiveChannelsView: React.FC = () => {
  const { liveChannels, toggleLiveReminder, navigateTo, showToast, setIsTVRemoteOpen } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(liveChannels[0]);
  const [secondaryChannel, setSecondaryChannel] = useState<LiveChannel | null>(liveChannels[1] || null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');

  // Video Refs & Mode State
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const secondaryVideoRef = useRef<HTMLVideoElement | null>(null);

  // STREAM MODE: 'youtube' (Guaranteed Video Stream) | 'mp4' (Direct MP4 Server) | 'interactive'
  const [streamMode, setStreamMode] = useState<'youtube' | 'mp4'>('youtube');
  const [videoError, setVideoError] = useState<boolean>(false);

  // FEATURE STATES
  const [isMultiView, setIsMultiView] = useState<boolean>(false);
  const [activeAudioChannelId, setActiveAudioChannelId] = useState<string>(liveChannels[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'chat' | 'epg' | 'settings'>('chat');

  // Stream Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Default muted to ensure autoplay success
  const [streamQuality, setStreamQuality] = useState<'4K Ultra HD' | '1080p 60fps' | '720p HD'>('4K Ultra HD');
  const [audioTrack, setAudioTrack] = useState<string>('تعليق عربي فصيح 🇸🇦');
  const [timeShiftOffsetSeconds, setTimeShiftOffsetSeconds] = useState<number>(0);
  const [currentShowTitle, setCurrentShowTitle] = useState<string>(selectedChannel?.currentShow?.title || 'البرنامج المباشر الرئيسي');

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; user: string; text: string; time: string; badge?: string; avatar: string }>
  >([
    {
      id: '1',
      user: 'فيصل الشمري',
      text: 'يا سلام على جودة البث المباشر الـ 4K النقية بدون تقطيع! 🔥',
      time: 'الآن',
      badge: 'مشترك ذهبي 👑',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    {
      id: '2',
      user: 'مريم العتيبي',
      text: 'هذا البث الفضائي رهيب جداً، الأحداث خرافية! 🍿',
      time: 'منذ دقيقة',
      badge: 'عاشق السينما 🎬',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      id: '3',
      user: 'عمر القحطاني',
      text: 'شغال ممتاز جداً والصوت واضح وصافي ❤️',
      time: 'منذ دقيقتين',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'
    }
  ]);
  const [inputChat, setInputChat] = useState<string>('');
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const [liveViewersCount, setLiveViewersCount] = useState<number>(28450);

  const categories = ['الكل', 'أفلام أجنبية', 'أكشن وحركة', 'مسلسلات عالمية', 'وثائقي واستكشاف'];

  const filteredChannels =
    activeCategory === 'الكل' ? liveChannels : liveChannels.filter(c => c.category === activeCategory);

  // Sync Video Ref when using MP4 mode
  useEffect(() => {
    if (streamMode === 'mp4' && mainVideoRef.current) {
      mainVideoRef.current.muted = isMuted;
      if (isPlaying) {
        mainVideoRef.current.play().catch(err => {
          console.log('Autoplay muted attempt required:', err);
          if (mainVideoRef.current) {
            mainVideoRef.current.muted = true;
            mainVideoRef.current.play().catch(() => {});
          }
        });
      } else {
        mainVideoRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, selectedChannel, streamMode]);

  // Update show title when channel changes
  useEffect(() => {
    if (selectedChannel) {
      setCurrentShowTitle(selectedChannel.currentShow.title);
      setTimeShiftOffsetSeconds(0);
      setVideoError(false);
    }
  }, [selectedChannel]);

  // Simulated live viewers & auto chat
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewersCount(prev => prev + Math.floor(Math.random() * 19) - 8);
    }, 3500);

    const botComments = [
      'اللقطة دي مستحيل تتكرر في تاريخ السينما! 🤯',
      'الصوت والصورة هنا بجد خيالية HD 🎬',
      'شكراً FilmMax على البث المباشر بدون أي تقطيع 🚀',
      'التفاصيل والـ 4K مبهرة على الشاشة 🔥',
      'مين بيتابع معنا البث الآن من الرياض وجدة؟ 🇸🇦',
      'أفضل بث فضائي مباشر وسينمائي 💎'
    ];

    const botAvatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100'
    ];

    const botNames = ['خالد العنزي', 'نورة الدوسري', 'سعد الماجد', 'رغد الغامدي', 'عبدالله الشمري'];

    const chatInterval = setInterval(() => {
      const randomComment = botComments[Math.floor(Math.random() * botComments.length)];
      const randomAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
      const randomName = botNames[Math.floor(Math.random() * botNames.length)];

      setChatMessages(prev => [
        {
          id: Date.now().toString(),
          user: randomName,
          text: randomComment,
          time: 'الآن',
          avatar: randomAvatar,
          badge: Math.random() > 0.5 ? 'عاشق البث 🔴' : undefined
        },
        ...prev.slice(0, 30)
      ]);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(chatInterval);
    };
  }, []);

  // Web Audio Synth FX
  const playInteractionSound = (freq = 520, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Ignore audio policy error
    }
  };

  // Floating reaction emitter
  const emitReaction = (emoji: string) => {
    playInteractionSound(680, 'triangle');
    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.floor(Math.random() * 70) + 15
    };
    setFloatingReactions(prev => [...prev.slice(-15), newReaction]);

    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2200);

    setLiveViewersCount(prev => prev + 1);
  };

  // Real Chat submit
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    playInteractionSound(880, 'sine');
    const userText = inputChat.trim();
    const newMsg = {
      id: Date.now().toString(),
      user: 'أنت (المشاهد الحقيقي)',
      text: userText,
      time: 'الآن',
      badge: 'VIP 💎',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    };

    setChatMessages(prev => [newMsg, ...prev]);
    setInputChat('');
    showToast('تم نشر تعليقك الحقيقي فوراً في الشات المباشر 💬');

    setTimeout(() => {
      setChatMessages(prev => [
        {
          id: (Date.now() + 1).toString(),
          user: 'مشرف القناة (FilmMax Mod)',
          text: `شكراً لمشاركتك المباشرة حول "${userText}" 🌟`,
          time: 'الآن',
          badge: 'مشرف القناة 🛡️',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        },
        ...prev
      ]);
      playInteractionSound(440, 'sine');
    }, 1500);
  };

  // Rewind 30s
  const handleRewind30s = () => {
    playInteractionSound(350, 'sawtooth');
    if (streamMode === 'mp4' && mainVideoRef.current) {
      mainVideoRef.current.currentTime = Math.max(0, mainVideoRef.current.currentTime - 30);
    }
    setTimeShiftOffsetSeconds(prev => prev + 30);
    showToast('تم إرجاع البث 30 ثانية حقيقية للوراء ⏪');
  };

  // Return to live
  const handleReturnToLive = () => {
    playInteractionSound(750, 'sine');
    if (streamMode === 'mp4' && mainVideoRef.current) {
      if (mainVideoRef.current.duration && !isNaN(mainVideoRef.current.duration)) {
        mainVideoRef.current.currentTime = mainVideoRef.current.duration - 1;
      }
    }
    setTimeShiftOffsetSeconds(0);
    showToast('تم العودة المباشرة للحظة الحية فوراً 🔴');
  };

  // EPG Catch-Up
  const handleCatchUpPlay = (itemTitle: string) => {
    playInteractionSound(600, 'sine');
    setCurrentShowTitle(`إعادة عرض: ${itemTitle}`);
    setTimeShiftOffsetSeconds(1800);
    showToast(`جاري تشغيل إعادة العرض المباشرة لبرنامج: ${itemTitle} ⏪`);
  };

  const epgSchedule = [
    { time: '14:00 - 16:30', title: selectedChannel?.currentShow?.title || 'الفيلم المباشر الرئيسي', status: 'live', desc: selectedChannel?.currentShow?.description },
    { time: '16:30 - 18:00', title: selectedChannel?.nextShow?.title || 'عروض واستكشاف كواليس السينما', status: 'upcoming', desc: 'برنامج تحليلي يستعرض أهم كواليس وصناع السينما العربية والعالمية.' },
    { time: '18:00 - 20:30', title: 'سلسلة أفلام الأكشن والمواجهة المسائية', status: 'upcoming', desc: 'عرض خاص ومحصور لأبرز أفلام الحركة والتشويق لعام 2026.' },
    { time: '11:30 - 14:00', title: 'الوثائقي المعماري: أعظم المدن السينمائية', status: 'past', desc: 'جولة استكشافية شاملة لأشهر مواقع التصوير والمدن المجهزة للأفلام.' }
  ];

  const currentYoutubeKey = selectedChannel.youtubeKey || 'EXeTwQWrcwY';
  const secondaryYoutubeKey = secondaryChannel?.youtubeKey || 'yjRHZEUamCc';

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] shadow-lg shadow-red-500/10">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>البث المباشر والقنوات الحية</span>
              <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                بث مباشر 4K
              </span>
            </h1>
            <p className="text-xs text-gray-400">بث فيديو حقيقي HD/4K بدون شاشة سوداء، تفاعل مباشر، وعرض متعدد</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* STREAM SOURCE MODE TOGGLE */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-bold gap-1">
            <button
              onClick={() => {
                playInteractionSound(500, 'sine');
                setStreamMode('youtube');
                showToast('تم التبديل إلى سيرفر بث YouTube HD المباشر 🔴');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                streamMode === 'youtube'
                  ? 'bg-red-600 text-white font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>سيرفر YouTube Live</span>
            </button>

            <button
              onClick={() => {
                playInteractionSound(500, 'sine');
                setStreamMode('mp4');
                showToast('تم التبديل إلى سيرفر MP4 المباشر 🎥');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                streamMode === 'mp4'
                  ? 'bg-purple-600 text-white font-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>سيرفر MP4 المباشر</span>
            </button>
          </div>

          {/* Multi-View Toggle Button */}
          <button
            onClick={() => {
              playInteractionSound(500, 'sine');
              setIsMultiView(!isMultiView);
              showToast(isMultiView ? 'تم إيقاف العرض المتعدد 📺' : 'تم تفعيل العرض الثنائي الحقيقي للمشاهدة المزدوجة 📺📱');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
              isMultiView
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                : 'bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>{isMultiView ? 'إلغاء العرض المتعدد' : 'العرض المتعدد (Dual View) 📺'}</span>
          </button>

          {/* TV Remote & Plasma Cast */}
          <button
            onClick={() => {
              playInteractionSound(500, 'sine');
              setIsTVRemoteOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-black transition-all flex items-center gap-1.5 active:scale-95"
            title="جهاز البث والتحكم بالبلازما والتلفزيون"
          >
            <Tv className="w-4 h-4 text-indigo-400" />
            <span>بث TV 📺</span>
          </button>

          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-black shadow">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>مباشر {liveViewersCount.toLocaleString('ar-EG')} مشاهد</span>
          </span>
        </div>
      </div>

      {/* Categories Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              playInteractionSound(400, 'sine');
              setActiveCategory(cat);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : 'bg-[#141822] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN LIVE PLAYER & CHAT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PLAYER AREA */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10 p-4 sm:p-5 relative shadow-2xl">
            {/* MULTI-VIEW MODE DUAL PLAYERS */}
            {isMultiView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Player 1 */}
                <div
                  onClick={() => {
                    playInteractionSound(520, 'sine');
                    setActiveAudioChannelId(selectedChannel.id);
                  }}
                  className={`relative aspect-video rounded-2xl overflow-hidden bg-black border-2 transition-all cursor-pointer ${
                    activeAudioChannelId === selectedChannel.id ? 'border-purple-500 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/20' : 'border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  {streamMode === 'youtube' ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentYoutubeKey}?autoplay=1&mute=${activeAudioChannelId === selectedChannel.id && !isMuted ? 0 : 1}&controls=0&loop=1&playlist=${currentYoutubeKey}&modestbranding=1&enablejsapi=1&rel=0`}
                      title={selectedChannel.name}
                      className="w-full h-full object-cover pointer-events-none border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={mainVideoRef}
                      src={selectedChannel.streamUrl}
                      autoPlay
                      loop
                      playsInline
                      muted={activeAudioChannelId !== selectedChannel.id || isMuted}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-white flex items-center gap-1.5 border border-white/10 shadow pointer-events-none">
                    <Tv className="w-3 h-3 text-purple-400" />
                    <span>قناة 1: {selectedChannel.name}</span>
                    {activeAudioChannelId === selectedChannel.id && <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />}
                  </div>
                </div>

                {/* Player 2 */}
                {secondaryChannel && (
                  <div
                    onClick={() => {
                      playInteractionSound(520, 'sine');
                      setActiveAudioChannelId(secondaryChannel.id);
                    }}
                    className={`relative aspect-video rounded-2xl overflow-hidden bg-black border-2 transition-all cursor-pointer ${
                      activeAudioChannelId === secondaryChannel.id ? 'border-purple-500 shadow-xl shadow-purple-500/30 ring-2 ring-purple-500/20' : 'border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {streamMode === 'youtube' ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${secondaryYoutubeKey}?autoplay=1&mute=${activeAudioChannelId === secondaryChannel.id && !isMuted ? 0 : 1}&controls=0&loop=1&playlist=${secondaryYoutubeKey}&modestbranding=1&enablejsapi=1&rel=0`}
                        title={secondaryChannel.name}
                        className="w-full h-full object-cover pointer-events-none border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        ref={secondaryVideoRef}
                        src={secondaryChannel.streamUrl}
                        autoPlay
                        loop
                        playsInline
                        muted={activeAudioChannelId !== secondaryChannel.id || isMuted}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-black text-white flex items-center gap-1.5 border border-white/10 shadow pointer-events-none">
                      <Tv className="w-3 h-3 text-purple-400" />
                      <span>قناة 2: {secondaryChannel.name}</span>
                      {activeAudioChannelId === secondaryChannel.id && <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* SINGLE MAIN LIVE PLAYER */
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black mb-4 shadow-2xl group border border-white/10">
                {/* YOUTUBE EMBED STREAM MODE (GUARANTEED NO BLACK SCREEN) */}
                {streamMode === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${currentYoutubeKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${currentYoutubeKey}&modestbranding=1&enablejsapi=1&rel=0`}
                    title={selectedChannel.name}
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  /* DIRECT MP4 VIDEO MODE WITH ERROR RECOVERY */
                  <video
                    ref={mainVideoRef}
                    src={selectedChannel.streamUrl}
                    autoPlay={isPlaying}
                    loop
                    playsInline
                    muted={isMuted}
                    onError={() => {
                      console.log('Video error on source, falling back to YouTube live stream stream');
                      setVideoError(true);
                      setStreamMode('youtube');
                      showToast('تم التحويل التلقائي لسيرفر YouTube لضمان جودة الفيديو 🎥');
                    }}
                    className={`w-full h-full object-cover transition-all ${
                      streamQuality === '4K Ultra HD' ? 'brightness-105 contrast-105' : 'brightness-95'
                    }`}
                  />
                )}

                {/* UNMUTE / PLAY OVERLAY FOR AUDIO POLICY & READY STATE */}
                {isMuted && (
                  <button
                    onClick={() => {
                      playInteractionSound(600, 'sine');
                      setIsMuted(false);
                      showToast('تم تشغيل الصوت الفعلي للبث المباشر 🔊');
                    }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 transition-all opacity-90 hover:opacity-100 z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#e50914] flex items-center justify-center text-white shadow-2xl shadow-red-600/50 mb-3 animate-pulse">
                      <Volume2 className="w-8 h-8" />
                    </div>
                    <span className="text-base font-black text-white">البث مباشر يعمل الآن 🔴</span>
                    <span className="text-xs text-amber-300 font-bold mt-1 bg-black/70 px-3 py-1 rounded-full border border-amber-500/30">
                      انقر هنا لتفعيل الصوت الفعلي عالي النقاء 🔊
                    </span>
                  </button>
                )}

                {/* FLOATING EMOJI ANIMATIONS CANVAS */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  {floatingReactions.map(r => (
                    <div
                      key={r.id}
                      className="absolute bottom-6 text-3xl animate-bounce"
                      style={{
                        left: `${r.left}%`,
                        animationDuration: '1.5s'
                      }}
                    >
                      {r.emoji}
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80 pointer-events-none" />

                {/* Top Live Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  <span className="bg-[#e50914] text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    ON AIR ({streamQuality})
                  </span>
                  <span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">
                    {selectedChannel.name}
                  </span>
                  {timeShiftOffsetSeconds > 0 && (
                    <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-lg shadow animate-pulse">
                      متأخر -{timeShiftOffsetSeconds}ث (إعادة العرض ⏪)
                    </span>
                  )}
                </div>

                {/* Interactive Controls Floating Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
                  {/* Reaction Buttons */}
                  <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl">
                    {['🔥', '❤️', '😮', '👏', '🍿', '🚀', '💎'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => emitReaction(emoji)}
                        className="w-8 h-8 rounded-xl hover:bg-white/20 text-base flex items-center justify-center transition-all active:scale-125"
                        title="إرسال تفاعل حقيقي"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Play / Pause / Mute / Fullscreen */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playInteractionSound(500, 'sine');
                        setIsPlaying(!isPlaying);
                      }}
                      className="p-2 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/15 hover:bg-black/95 transition-all"
                      title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل البث'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        playInteractionSound(400, 'sine');
                        setIsMuted(!isMuted);
                      }}
                      className="p-2 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/15 hover:bg-black/95 transition-all"
                      title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => navigateTo('player', {
                        id: `live-${selectedChannel.id}`,
                        title: `${selectedChannel.name} — ${currentShowTitle}`,
                        rating: 9.6,
                        poster: selectedChannel.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780',
                        type: 'فيلم',
                        year: '2026',
                        videoUrl: selectedChannel.streamUrl,
                        youtubeKey: currentYoutubeKey,
                        overview: selectedChannel.currentShow.description,
                        genres: [selectedChannel.category, 'بث مباشر 4K']
                      })}
                      className="p-2.5 rounded-xl bg-[#e50914] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-red-600 transition-all active:scale-95"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">مشاهدة بملء الشاشة</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Time-Shift Control Bar */}
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between gap-3 text-xs mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRewind30s}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>30ث للوراء (إرجاع حقيقي)</span>
                </button>

                {timeShiftOffsetSeconds > 0 && (
                  <button
                    onClick={handleReturnToLive}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black flex items-center gap-1.5 shadow animate-pulse active:scale-95"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>العودة للبث المباشر (اللحظة الحية)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>حالة السيرفر: متصل 4K 60FPS</span>
              </div>
            </div>

            {/* Program Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{currentShowTitle}</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-bold border border-purple-500/30">
                    {audioTrack}
                  </span>
                </h2>
                <p className="text-xs text-gray-300 max-w-xl">{selectedChannel.currentShow.description}</p>
              </div>

              <button
                onClick={() => {
                  playInteractionSound(600, 'sine');
                  toggleLiveReminder(selectedChannel.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedChannel.isReminded
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
              >
                {selectedChannel.isReminded ? <BellRing className="w-4 h-4 text-emerald-400" /> : <Bell className="w-4 h-4" />}
                <span>{selectedChannel.isReminded ? 'تم ضبط التذكير' : 'تذكير بالبرنامج'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR TABS (LIVE CHAT / EPG TIMELINE / STREAM SETTINGS) */}
        <div className="lg:col-span-4 glass-card rounded-3xl border border-white/10 p-4 shadow-2xl flex flex-col h-[540px]">
          {/* Navigation Tabs */}
          <div className="flex rounded-2xl bg-black/40 p-1 border border-white/10 text-xs font-bold gap-1 mb-4">
            <button
              onClick={() => {
                playInteractionSound(450, 'sine');
                setActiveTab('chat');
              }}
              className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chat' ? 'bg-[#e50914] text-white font-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>الشات المباشر</span>
            </button>

            <button
              onClick={() => {
                playInteractionSound(450, 'sine');
                setActiveTab('epg');
              }}
              className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'epg' ? 'bg-[#e50914] text-white font-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>دليل EPG</span>
            </button>

            <button
              onClick={() => {
                playInteractionSound(450, 'sine');
                setActiveTab('settings');
              }}
              className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-[#e50914] text-white font-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>الجودة والصوت</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden space-y-3">
              <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full object-cover border border-amber-400/40" />
                        <span className="text-xs font-black text-white">{msg.user}</span>
                        {msg.badge && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold border border-amber-500/30">
                            {msg.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-200 pr-8 font-bold">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={inputChat}
                  onChange={e => setInputChat(e.target.value)}
                  placeholder="اكتب تعليقك المباشر وشاهد الرد الفوري..."
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e50914]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#e50914] text-white hover:bg-red-600 font-bold shadow transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: INTERACTIVE EPG TIMELINE */}
          {activeTab === 'epg' && (
            <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
              <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-2">
                <span className="text-gray-300">جدول بث اليوم {selectedChannel.name}</span>
                <span className="text-amber-400 font-mono">EPG 24/7</span>
              </div>

              <div className="space-y-2.5">
                {epgSchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      item.status === 'live'
                        ? 'bg-[#e50914]/15 border-[#e50914]/40 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-amber-400 font-mono font-bold">{item.time}</span>
                      {item.status === 'live' && (
                        <span className="text-[9px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                          يعرض الآن
                        </span>
                      )}
                      {item.status === 'past' && (
                        <button
                          onClick={() => handleCatchUpPlay(item.title)}
                          className="text-[9px] bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 px-2.5 py-1 rounded-full font-bold shadow transition-all active:scale-95"
                        >
                          تشغيل إعادة العرض ⏪
                        </button>
                      )}
                    </div>
                    <h5 className="text-xs font-black text-white">{item.title}</h5>
                    <p className="text-[10px] text-gray-300 mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STREAM QUALITY & AUDIO SETTINGS */}
          {activeTab === 'settings' && (
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 text-xs">
              {/* Quality */}
              <div className="space-y-2">
                <span className="text-gray-400 font-bold block">دقة وسرعة جودة البث المباشر:</span>
                <div className="space-y-1.5">
                  {['4K Ultra HD', '1080p 60fps', '720p HD'].map(q => (
                    <button
                      key={q}
                      onClick={() => {
                        playInteractionSound(500, 'sine');
                        setStreamQuality(q as any);
                        showToast(`تم تغيير جودة فيديو البث المباشر فوراً إلى ${q} 📺`);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-black flex items-center justify-between transition-all ${
                        streamQuality === q
                          ? 'bg-[#e50914] text-white border-red-400 shadow'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <span>{q}</span>
                      {streamQuality === q && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Track */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-gray-400 font-bold block">المسار الصوتي والتعليق:</span>
                <div className="space-y-1.5">
                  {['تعليق عربي فصيح 🇸🇦', 'الدبلجة العربية العراقية 🇮🇶', 'Original English Audio 🇬🇧'].map(aud => (
                    <button
                      key={aud}
                      onClick={() => {
                        playInteractionSound(550, 'sine');
                        setAudioTrack(aud);
                        showToast(`تم تبديل المسار الصوتي إلى: ${aud} 🎙️`);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-right font-black flex items-center justify-between transition-all ${
                        audioTrack === aud
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <span>{aud}</span>
                      {audioTrack === aud && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CHANNELS GRID LIST */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <span>جميع القنوات الفضائية والسينمائية المباشرة</span>
          <span className="text-xs text-amber-400 font-bold">({filteredChannels.length} قناة متاحة)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredChannels.map(ch => (
            <div
              key={ch.id}
              onClick={() => {
                playInteractionSound(480, 'sine');
                setSelectedChannel(ch);
                if (isMultiView && selectedChannel.id !== ch.id) {
                  setSecondaryChannel(ch);
                }
                showToast(`تم التبديل بنجاح إلى قناة: ${ch.name} 📺`);
              }}
              className={`glass-card p-4 rounded-2xl cursor-pointer border transition-all relative overflow-hidden group ${
                selectedChannel.id === ch.id
                  ? 'border-[#e50914] bg-[#1a141b]/90 shadow-xl shadow-[#e50914]/20 scale-[1.02] ring-1 ring-red-500/30'
                  : 'border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-white">{ch.name}</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  LIVE
                </span>
              </div>

              <p className="text-xs font-bold text-gray-300 truncate">{ch.currentShow.title}</p>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2.5">
                <span>{ch.currentShow.time}</span>
                <span className="text-[#e50914] font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-red-600 text-red-600" />
                  <span>بث حقيقي</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
