import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Movie, WatchPartyRoom, WatchPartyParticipant, WatchPartyMessage } from '../types';
import {
  Users,
  Play,
  Pause,
  Send,
  Sparkles,
  Share2,
  Copy,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Crown,
  Smile,
  Heart,
  Flame,
  Clapperboard,
  Film,
  Plus,
  ArrowRight,
  Check,
  MessageSquare,
  Radio,
  Tv
} from 'lucide-react';

const PRESET_ROOMS: WatchPartyRoom[] = [
  {
    id: 'room-1',
    code: 'FILM-7890',
    name: 'سهرة نولان الأسطورية 🎬🌌',
    hostName: 'علي كينغ (أنت)',
    isPlaying: true,
    currentTime: 4250,
    movie: {
      id: 102,
      title: 'Interstellar — بين النجوم',
      rating: 8.7,
      poster: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      backdrop: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      type: 'فيلم',
      year: '2014',
      videoUrl: 'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E',
      youtubeKey: 'zSWdZVtXT7E',
      overview: 'رحلة استكشافية ملحمية عبر ثقب دودي للبحث عن كوكب بديل للبشرية.',
      genres: ['خيال علمي', 'مغامرة', 'دراما']
    },
    participants: [
      {
        id: 'p1',
        name: 'علي كينغ (أنت)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isHost: true,
        isMuted: false
      },
      {
        id: 'p2',
        name: 'سارة المهندسة',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        isMuted: true,
        reaction: '❤️'
      },
      {
        id: 'p3',
        name: 'حيدر البصراوي',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        isMuted: false,
        reaction: '🍿'
      },
      {
        id: 'p4',
        name: 'مريم الأنيقة',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        isMuted: true
      }
    ],
    messages: [
      {
        id: 'm1',
        senderName: 'النظام',
        avatar: '',
        text: 'مرحباً بكم في غرفة المشاهدة المتزامنة لفيلم Interstellar! تم مزامنة التشغيل بين الجميع 🍿✨',
        time: 'منذ 10 دقائق',
        isSystem: true
      },
      {
        id: 'm2',
        senderName: 'سارة المهندسة',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'الموسيقى التصويرية لهانز زيمر تجعل المشهد تقشعر له الأبدان! 🎵🌌',
        time: '10:04 م'
      },
      {
        id: 'm3',
        senderName: 'حيدر البصراوي',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        text: 'دقيقة واحدة على كوكب ميلر تساوي 7 سنوات على الأرض.. مشهد أسطوري 🔥',
        time: '10:06 م'
      }
    ]
  }
];

const PRESET_REACTIONS = ['🍿', '❤️', '🔥', '😱', '👏', '🤯', '😭', '🎉'];

const PRESET_QUICK_MESSAGES = [
  '🍿 جهزوا الفشار للمشهد القادم!',
  '🔥 يا له من تمثيل أسطوري!',
  '😱 مستحيل اللي جالس يصير!',
  '🤯 حبكة عبقرية جداً!',
  '⏸️ لحظة يا شباب وقفو دقيقة'
];

export const WatchPartyView: React.FC = () => {
  const { movies, activeMovie, navigateTo, showToast, userProfile } = useApp();

  const [activeRoom, setActiveRoom] = useState<WatchPartyRoom | null>(PRESET_ROOMS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newRoomName, setNewRoomName] = useState<string>('سهرة الليلة السينمائية 🔥');
  const [selectedMovieForRoom, setSelectedMovieForRoom] = useState<Movie>(activeMovie || movies[0]);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeRoom?.messages]);

  // Handle Play/Pause Sync
  const togglePlaySync = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (activeRoom) {
      const syncMsg: WatchPartyMessage = {
        id: `sys-${Date.now()}`,
        senderName: 'النظام',
        avatar: '',
        text: newState
          ? `▶️ قام ${userProfile.name} باستئناف التشغيل لدى جميع المشاركين`
          : `⏸️ قام ${userProfile.name} بإيقاف التشغيل مؤقتاً لدى الجميع`,
        time: 'الآن',
        isSystem: true
      };
      setActiveRoom(prev => (prev ? { ...prev, isPlaying: newState, messages: [...prev.messages, syncMsg] } : null));
    }
    showToast(newState ? 'تم استئناف العرض عند الجميع 🍿' : 'تم إيقاف العرض مؤقتاً للجميع ⏸️');
  };

  // Send Chat Message
  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || chatInput;
    if (!content.trim() || !activeRoom) return;

    const newMsg: WatchPartyMessage = {
      id: `msg-${Date.now()}`,
      senderName: userProfile.name,
      avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: content.trim(),
      time: 'الآن'
    };

    setActiveRoom(prev => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    if (!textToSend) setChatInput('');
  };

  // Trigger Flying Reaction Emoji
  const handleTriggerReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: 20 + Math.random() * 60
    };
    setFloatingReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);

    // Also update participant reaction badge
    if (activeRoom) {
      setActiveRoom(prev => {
        if (!prev) return null;
        return {
          ...prev,
          participants: prev.participants.map(p =>
            p.isHost ? { ...p, reaction: emoji } : p
          )
        };
      });
    }
  };

  // Copy Room Link & Code
  const handleCopyInvite = () => {
    if (!activeRoom) return;
    const inviteText = `انضم معي لمشاهدة فيلم "${activeRoom.movie.title}" في غرفة المشاهدة الجماعية على FilmMax! رمز الغرفة: ${activeRoom.code}`;
    navigator.clipboard?.writeText(inviteText);
    showToast('تم نسخ رمز ودعوة الغرفة للحافظة بنجاح! 📋✨');
  };

  // Create New Room
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: WatchPartyRoom = {
      id: `room-${Date.now()}`,
      code: `FILM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newRoomName,
      movie: selectedMovieForRoom,
      hostName: userProfile.name,
      isPlaying: true,
      currentTime: 0,
      participants: [
        {
          id: 'p-host',
          name: `${userProfile.name} (المضيف)`,
          avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          isHost: true,
          isMuted: false
        },
        {
          id: 'p-guest1',
          name: 'أحمد الشمري',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
          isMuted: true
        }
      ],
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderName: 'النظام',
          avatar: '',
          text: `تم إنشاء الغرفة بواسطة ${userProfile.name}. شارك الرمز لبدء المشاهدة الجماعية! 🍿✨`,
          time: 'الآن',
          isSystem: true
        }
      ]
    };

    setActiveRoom(newRoom);
    setIsCreateModalOpen(false);
    showToast(`تم إنشاء غرفة "${newRoomName}" بنجاح! 🎉`);
  };

  // Join Room by Code
  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    showToast(`جاري الانضمام إلى الغرفة ${joinCodeInput}... 🚀`);
    setTimeout(() => {
      showToast('تم الانضمام للغرفة بنجاح وتزامن المشغل! 🎬');
      setJoinCodeInput('');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#e50914]" />
              <span>المشاهدة الجماعية مع الأصدقاء (Watch Party)</span>
            </h1>
            <p className="text-xs text-gray-400">
              شاهد الأفلام والمسلسلات في نفس اللحظة مع أصدقائك بتزامن كامل وشات تفاعلي مباشر
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء غرفة جديدة</span>
          </button>

          {activeRoom && (
            <button
              onClick={handleCopyInvite}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/10 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>دعوة أصدقاء</span>
            </button>
          )}
        </div>
      </div>

      {activeRoom ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Synchronized Video Player Area (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Screen Box */}
            <div className="relative aspect-video rounded-3xl overflow-hidden glass-card border border-white/15 shadow-2xl bg-black group">
              {/* Actual Video / Trailer */}
              <iframe
                src={`${activeRoom.movie.videoUrl}?autoplay=1&mute=${isSoundMuted ? 1 : 0}&enablejsapi=1`}
                title={activeRoom.movie.title}
                className="w-full h-full object-cover pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />

              {/* Floating Live Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {floatingReactions.map(r => (
                  <span
                    key={r.id}
                    className="absolute bottom-10 text-3xl sm:text-4xl animate-bounce transition-all duration-1000 transform -translate-y-24 opacity-90 select-none"
                    style={{ left: `${r.left}%` }}
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>

              {/* Synchronized Status Pill */}
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                <span className="bg-red-600/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-red-400/40 animate-pulse">
                  <Radio className="w-3.5 h-3.5" />
                  <span>بث مباشر متزامن</span>
                </span>
                <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-[11px] font-black px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{activeRoom.participants.length} متصلين</span>
                </span>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 z-30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlaySync}
                    className="w-11 h-11 rounded-2xl bg-[#e50914] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={() => setIsSoundMuted(!isSoundMuted)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {isSoundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setIsMicOn(!isMicOn);
                      showToast(isMicOn ? 'تم كتم الميكروفون 🔇' : 'تم تشغيل الميكروفون المباشر 🎙️');
                    }}
                    className={`p-2.5 rounded-xl transition-all ${
                      isMicOn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-400'
                    }`}
                    title={isMicOn ? 'كتم الميكروفون' : 'تشغيل الميكروفون'}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* Movie Title & Info */}
                <div className="text-right min-w-0">
                  <span className="text-xs text-amber-400 font-bold block">{activeRoom.name}</span>
                  <h3 className="text-sm sm:text-base font-black text-white truncate">{activeRoom.movie.title}</h3>
                </div>
              </div>
            </div>

            {/* Quick Reactions Bar */}
            <div className="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-lg">
              <span className="text-xs text-gray-400 font-bold whitespace-nowrap ml-2 flex items-center gap-1">
                <Smile className="w-4 h-4 text-amber-400" />
                <span>تفاعلات حية:</span>
              </span>
              <div className="flex items-center gap-2">
                {PRESET_REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleTriggerReaction(emoji)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 hover:scale-125 active:scale-95 text-lg flex items-center justify-center transition-all border border-white/5 shadow-md"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Participants Grid Strip */}
            <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>المتواجدون في الغرفة ({activeRoom.participants.length})</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono bg-white/10 px-2.5 py-1 rounded-lg text-amber-400 font-bold">
                    رمز الغرفة: {activeRoom.code}
                  </span>
                  <button
                    onClick={handleCopyInvite}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                    title="نسخ الرمز"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeRoom.participants.map(p => (
                  <div
                    key={p.id}
                    className="p-2.5 bg-[#121620] rounded-2xl border border-white/5 flex items-center gap-2.5 relative overflow-hidden"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                      {p.isHost && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-amber-500 text-black flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <b className="text-xs text-white block truncate">{p.name}</b>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        {p.isMuted ? <MicOff className="w-2.5 h-2.5 text-red-400" /> : <Mic className="w-2.5 h-2.5 text-emerald-400" />}
                        <span>{p.isMuted ? 'مكتوم' : 'صوت مباشر'}</span>
                      </span>
                    </div>

                    {p.reaction && (
                      <span className="text-sm animate-bounce absolute top-2 left-2">{p.reaction}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Interactive Chat Drawer (1 Column) */}
          <div className="glass-card rounded-3xl border border-white/10 flex flex-col h-[580px] shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">الدردشة الحية للغرفة</h4>
                  <span className="text-[10px] text-emerald-400 font-bold">متصل ومتزامن الآن 🟢</span>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 text-xs">
              {activeRoom.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.isSystem
                      ? 'items-center text-center my-2'
                      : msg.senderName.includes('(أنت)')
                      ? 'items-end'
                      : 'items-start'
                  }`}
                >
                  {msg.isSystem ? (
                    <div className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full text-[11px] max-w-[90%]">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[85%] space-y-1">
                      <div className="flex items-center gap-1.5 px-1">
                        <span className="text-[10px] text-gray-400 font-bold">{msg.senderName}</span>
                        <span className="text-[9px] text-gray-500">{msg.time}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.senderName.includes('(أنت)')
                            ? 'bg-[#e50914] text-white rounded-br-none shadow-md'
                            : 'bg-[#121620] text-gray-200 border border-white/10 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Preset Messages Strip */}
            <div className="p-2 border-t border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {PRESET_QUICK_MESSAGES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-gray-300 hover:text-white whitespace-nowrap transition-colors border border-white/5"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 bg-[#0c0f15]/90 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="اكتب تعليقك على المشهد..."
                className="flex-1 bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#e50914]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#e50914] text-white hover:bg-[#ff1f2d] shadow-md active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Empty State / Join Box */
        <div className="glass-card p-10 rounded-3xl border border-white/10 text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-[#e50914]/20 text-[#e50914] flex items-center justify-center mx-auto border border-[#e50914]/30">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">انضم إلى غرفة مشاهدة حالية</h3>
            <p className="text-xs text-gray-400 mt-1">أدخل رمز الغرفة المكون من 8 أحرف وأرقام الذي أرسله لك صديقك</p>
          </div>

          <form onSubmit={handleJoinByCode} className="flex gap-2">
            <input
              type="text"
              value={joinCodeInput}
              onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
              placeholder="مثال: FILM-7890"
              className="flex-1 bg-[#121620] border border-white/10 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-sm text-white outline-none focus:border-[#e50914]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e50914] hover:bg-[#ff1f2d] text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              انضمام
            </button>
          </form>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#e50914]" />
                <span>إنشاء غرفة مشاهدة جماعية جديدة</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">اسم الغرفة:</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={e => setNewRoomName(e.target.value)}
                  placeholder="سهرة الليلة السينمائية..."
                  className="w-full bg-[#121620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#e50914]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold">اختر العمل المراد مشاهدته:</label>
                <select
                  value={selectedMovieForRoom.id}
                  onChange={e => {
                    const found = movies.find(m => String(m.id) === e.target.value);
                    if (found) setSelectedMovieForRoom(found);
                  }}
                  className="w-full bg-[#121620] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#e50914]"
                >
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.year}) — {m.rating}⭐
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#121620] rounded-xl border border-white/5 flex items-center gap-3">
                <img
                  src={selectedMovieForRoom.poster}
                  alt={selectedMovieForRoom.title}
                  className="w-12 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <b className="text-white block truncate">{selectedMovieForRoom.title}</b>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">
                    {selectedMovieForRoom.quality || '4K HDR'} • {selectedMovieForRoom.genres?.join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black rounded-xl shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all"
                >
                  بدء الغرفة ودعوة الأصدقاء 🍿
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-gray-300 rounded-xl font-bold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
