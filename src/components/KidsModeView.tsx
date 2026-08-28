import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Movie } from '../types';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Lock,
  Play,
  Heart,
  Volume2,
  VolumeX,
  Tv,
  ArrowRight,
  Smile,
  Sun,
  Flame,
  Check,
  Music,
  Palette,
  HelpCircle,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Search,
  X,
  Star,
  Award,
  Brush,
  Trash2,
  Download,
  Film,
  Zap,
  Radio,
  Bookmark
} from 'lucide-react';

// Character Avatar Options for Kids
const KIDS_AVATARS = [
  { id: 'spongy', name: 'سبونج بوب', icon: '🧽', bg: 'from-yellow-400 to-amber-500', song: 'جاهزون يا أطفال؟ كابتن!' },
  { id: 'simba', name: 'سيمبا الملك', icon: '🦁', bg: 'from-amber-500 to-orange-600', song: 'هاكونا ماتاتا! لا قلق بعد اليوم' },
  { id: 'moana', name: 'موانا البطلة', icon: '🌺', bg: 'from-teal-400 to-cyan-600', song: 'المحيط يناديني لننطلق في المغامرة' },
  { id: 'elsa', name: 'إلسا الثلجية', icon: '❄️', bg: 'from-blue-400 to-indigo-600', song: 'أطلقي سركِ في الفضاء الجليدي' },
  { id: 'minion', name: 'المينيونز', icon: '🍌', bg: 'from-[#f5c518] to-yellow-500', song: 'بببببـانانا! مرح ضاحك دائماً' },
  { id: 'panda', name: 'بو الباندا', icon: '🐼', bg: 'from-emerald-400 to-teal-600', song: 'محارب التنين الأسطوري وجبة النودلز' }
];

// Audio Stories & Kids Songs Playlist
const KIDS_AUDIO_PLAYLIST = [
  {
    id: 'track-1',
    title: 'أغنية سبونج بوب — جاهزون يا أطفال؟ 🧽',
    category: 'أغاني أطفال',
    duration: '2:15',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    icon: '🧽',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'track-2',
    title: 'أغنية موانا — إلى أي مدى سأذهب 🌺',
    category: 'موسيقى سينمائية',
    duration: '2:40',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    icon: '🌺',
    color: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'track-3',
    title: 'قصة علاء الدين والمصباح السحري (قبل النوم) 🌙',
    category: 'قصص صوتية',
    duration: '4:10',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    icon: '🧞‍♂️',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'track-4',
    title: 'معزوفة الاسترخاء والأحلام السعيدة للأطفال 💤',
    category: 'أحلام سعيدة',
    duration: '5:00',
    audioUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    icon: '⭐',
    color: 'from-blue-500 to-purple-600'
  }
];

// Interactive Kids Trivia Questions
const KIDS_TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: 'ما هو لون سبونج بوب الشهير؟ 🧽',
    options: ['أصفر زاهي 💛', 'أزرق سمائي 💙', 'أحمر ناري ❤️'],
    correct: 0,
    explanation: 'ممتاز! سبونج بوب هو الإسفنجة الصفراء المبهجة في قاع الهامور! 🎉'
  },
  {
    id: 2,
    question: 'ما اسم الصديق المقرب الشجاع للأسد سيمبا؟ 🦁',
    options: ['سكار الشرير', 'تيمون وبومبا 🐗', 'شيرخان النمر'],
    correct: 1,
    explanation: 'صحيح 100%! تيمون وبومبا أصحاب حكمه هاكونا ماتاتا الشهيرة! 🥳'
  },
  {
    id: 3,
    question: 'ما اسم ملكة الثلج التي تمتلك القوى الجليدية؟ ❄️',
    options: ['إلسا ❄️', 'موانا 🌺', 'سنو وايت 🍎'],
    correct: 0,
    explanation: 'رائع جداً! الملكة إلسا هي من تبني القصور الجليدية الساحرة! 🏰'
  },
  {
    id: 4,
    question: 'ما هو طعام الباندا المفضل لدى المحارب "بو"؟ 🐼',
    options: ['النودلز والخيزران 🍜', 'البيتزا والجبن 🍕', 'الآيس كريم 🍦'],
    correct: 0,
    explanation: 'إجابة مذهلة! بو يعشق النودلز اللذيذة التي يصنعها والده الأب بينغ! 🥢'
  }
];

export const KidsModeView: React.FC = () => {
  const { movies, navigateTo, showToast, isFavorite, toggleFavorite } = useApp();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'shows' | 'songs' | 'trivia' | 'canvas'>('shows');

  // Age Group Category Filter
  const [ageCategory, setAgeCategory] = useState<'all' | 'toddlers' | 'kids' | 'juniors'>('all');

  // Search in Kids Mode
  const [kidsSearch, setKidsSearch] = useState<string>('');

  // Selected Character Avatar
  const [selectedAvatar, setSelectedAvatar] = useState(KIDS_AVATARS[0]);

  // Parental Control Lock & Timer
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(45);
  const [remainingTimerSeconds, setRemainingTimerSeconds] = useState<number>(45 * 60);

  // Audio Player State
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Kids Trivia Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#f59e0b');
  const [brushSize, setBrushSize] = useState<number>(8);
  const [activeSticker, setActiveSticker] = useState<string | null>(null);

  // Filter STRICTLY kids/animation/cartoons content - NO ACTION or adult movies!
  const kidsMovies = movies.filter(m => {
    // Exclude action/adult genres
    const isAdultOrAction = m.genres?.some(g =>
      ['أكشن', 'رعب', 'جريمة', 'سيرة ذاتية', 'إثارة'].includes(g)
    ) && !m.genres?.includes('أنيميشن');

    if (isAdultOrAction && m.ageRating !== 'G') return false;

    // Must be animation, kids, family, cartoon, or G/PG rated
    const isKidsMatch =
      m.genres?.some(g => ['أنيميشن', 'عائلي', 'أطفال', 'كرتون', 'موسيقي', 'تعليمي', 'كوميديا'].includes(g)) ||
      ['G', 'PG'].includes(m.ageRating || '');

    if (!isKidsMatch) return false;

    // Apply Kids Search filter
    if (kidsSearch.trim()) {
      return m.title.toLowerCase().includes(kidsSearch.toLowerCase()) ||
        m.overview?.toLowerCase().includes(kidsSearch.toLowerCase());
    }

    // Apply Age Category Filter
    if (ageCategory === 'toddlers') {
      return ['G'].includes(m.ageRating || '') || m.genres?.some(g => ['أطفال', 'تعليمي'].includes(g));
    }
    if (ageCategory === 'kids') {
      return m.genres?.some(g => ['أنيميشن', 'كرتون', 'عائلي'].includes(g));
    }
    if (ageCategory === 'juniors') {
      return ['PG', '12+'].includes(m.ageRating || '') || m.genres?.some(g => ['مغامرة', 'أنيميشن'].includes(g));
    }

    return true;
  });

  const featuredKidsMovie = kidsMovies[0] || movies.find(m => m.genres?.includes('أنيميشن')) || movies[0];

  // Sleep Timer Countdown Ticker
  useEffect(() => {
    if (!sleepTimerMinutes) return;

    const interval = setInterval(() => {
      setRemainingTimerSeconds(prev => {
        if (prev <= 1) {
          showToast('انتهى وقت المشاهدة اليومي للأطفال! 🌙💤 حان وقت النوم الآن');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes]);

  // Handle Exit Kids Mode with PIN Validation
  const handleExitKidsMode = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === '1234' || enteredPin === '0000') {
      showToast('تم التحقق من الرمز السري الأبوي، العودة للواجهة الرئيسية 🛡️');
      setIsPinModalOpen(false);
      navigateTo('home');
    } else {
      setPinError(true);
      showToast('الرمز السري غير صحيح! (الرمز الافتراضي للوالدين 1234)');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Audio Player Handlers
  const currentAudioTrack = KIDS_AUDIO_PLAYLIST[currentAudioIndex];

  const toggleAudioPlay = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      showToast(`تم تشغيل: ${currentAudioTrack.title}`);
    }
  };

  const nextAudioTrack = () => {
    const nextIdx = (currentAudioIndex + 1) % KIDS_AUDIO_PLAYLIST.length;
    setCurrentAudioIndex(nextIdx);
    setIsPlayingAudio(true);
    showToast(`التالي: ${KIDS_AUDIO_PLAYLIST[nextIdx].title}`);
  };

  const prevAudioTrack = () => {
    const prevIdx = (currentAudioIndex - 1 + KIDS_AUDIO_PLAYLIST.length) % KIDS_AUDIO_PLAYLIST.length;
    setCurrentAudioIndex(prevIdx);
    setIsPlayingAudio(true);
    showToast(`السابق: ${KIDS_AUDIO_PLAYLIST[prevIdx].title}`);
  };

  // Quiz Option Click Handler
  const handleAnswerSelect = (optionIndex: number) => {
    if (showAnswerResult) return;
    setSelectedOption(optionIndex);
    setShowAnswerResult(true);

    const q = KIDS_TRIVIA_QUESTIONS[currentQuestionIndex];
    if (optionIndex === q.correct) {
      setScore(prev => prev + 100);
      showToast('إجابة صحيحة مذهلة! 🎉 +100 نقطة للأبطال');
    } else {
      showToast('حاول مرة أخرى في السؤال التالي! 💪✨');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < KIDS_TRIVIA_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswerResult(false);
    } else {
      setIsQuizCompleted(true);
      showToast(`تهانينا للبطول الصغير! 🏆 حققت ${score + (selectedOption === KIDS_TRIVIA_QUESTIONS[currentQuestionIndex].correct ? 100 : 0)} نقطة!`);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswerResult(false);
    setScore(0);
    setIsQuizCompleted(false);
    showToast('بدء مسابقة جديدة للأبطال! 🚀');
  };

  // Drawing Canvas Handlers
  useEffect(() => {
    if (activeTab === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && canvas.width === 0) {
        canvas.width = canvas.parentElement?.clientWidth || 600;
        canvas.height = 360;
        ctx.fillStyle = '#121620';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (activeSticker) {
      // Stamp sticker
      ctx.font = '36px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeSticker, x, y);
      showToast(`تمت إضافة الملصق ${activeSticker} بنجاح! 🎨`);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeSticker) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#121620';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showToast('تم مسح اللوحة، جاهزة لرسمة جديدة جميلة! 🎨✨');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Cheerful Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-pink-400 text-black flex items-center justify-center shadow-2xl font-black text-3xl animate-bounce shrink-0 border-2 border-white/50">
            🎈
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">عالم الأطفال الآمن (FilmMax Kids)</h1>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>محتوى آمن 100% للأطفال</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200 font-bold mt-1">
              أفضل أفلام الكرتون، الأنيميشن، الأغاني، والألغاز التفاعلية لكل أفراد العائلة
            </p>
          </div>
        </div>

        {/* Parental Controls & Timer Controls */}
        <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-auto">
          {/* Sleep Timer Indicator */}
          <div className="px-3.5 py-2 rounded-2xl bg-black/60 border border-white/15 text-xs text-white font-bold flex items-center gap-2 shadow-inner">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">مؤقت النوم:</span>
            <span className="font-mono text-amber-300 font-black text-sm">{formatTimer(remainingTimerSeconds)}</span>
            <button
              onClick={() => {
                const nextTimer = sleepTimerMinutes === 45 ? 30 : sleepTimerMinutes === 30 ? 15 : sleepTimerMinutes === 15 ? 60 : 45;
                setSleepTimerMinutes(nextTimer);
                setRemainingTimerSeconds(nextTimer * 60);
                showToast(`تم ضبط مؤقت المشاهدة على ${nextTimer} دقيقة ⏰`);
              }}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-400/30 transition-all ml-1"
              title="تعديل وقت المؤقت"
            >
              تعديل
            </button>
          </div>

          {/* Exit Kids Mode Button with Lock */}
          <button
            onClick={() => {
              setEnteredPin('');
              setPinError(false);
              setIsPinModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#151922] hover:bg-white/15 border border-amber-400/40 text-xs text-amber-300 font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-lg"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>الخروج من نمط الأطفال</span>
          </button>
        </div>
      </div>

      {/* 2. Kids Character Avatar Selection Bar */}
      <div className="glass-card p-4 rounded-3xl border border-white/10 space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-white flex items-center gap-2">
            <Smile className="w-4 h-4 text-yellow-400" />
            <span>اختر شخصيتك المفضل واستمع لصوتها! 🎭</span>
          </span>
          <span className="text-[11px] text-amber-400 font-bold">الشخصية الحالية: {selectedAvatar.name}</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {KIDS_AVATARS.map(avatar => {
            const isSelected = selectedAvatar.id === avatar.id;
            return (
              <button
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar);
                  showToast(`${avatar.name}: "${avatar.song}" 🎉`);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-r ' + avatar.bg + ' text-black font-black shadow-lg scale-105'
                    : 'border-white/10 bg-[#121620] text-white hover:bg-white/10 font-bold'
                }`}
              >
                <span className="text-xl">{avatar.icon}</span>
                <span className="text-xs">{avatar.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Interactive Tabs (العروض والكرتون | الأغاني والقصص | التحديات | مرسم الألوان) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar text-xs font-bold">
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'shows'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>أفلام ومسلسلات الكرتون 🎬</span>
        </button>

        <button
          onClick={() => setActiveTab('songs')}
          className={`px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'songs'
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-lg shadow-pink-500/20 scale-105'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Music className="w-4 h-4 text-pink-400" />
          <span>أغاني أطفال وقصص قبل النوم 🎵</span>
        </button>

        <button
          onClick={() => setActiveTab('trivia')}
          className={`px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'trivia'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black shadow-lg shadow-cyan-500/20 scale-105'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>ألغاز وتحديات الأبطال 🧩</span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'canvas'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-black shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          <span>مرسم الألوان والملصقات 🎨</span>
        </button>
      </div>

      {/* ================= TAB 1: SHOWS & CARTOONS ================= */}
      {activeTab === 'shows' && (
        <div className="space-y-6">
          {/* Search & Age Filter Chips */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Age Category Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {[
                { id: 'all', label: '🌟 الكل' },
                { id: 'toddlers', label: '👶 براعم (0-3 سنوات)' },
                { id: 'kids', label: '🎒 أطفال (4-7 سنوات)' },
                { id: 'juniors', label: '🚀 مغامرون (8-12 سنة)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setAgeCategory(cat.id as any);
                    showToast(`تم التصفية: ${cat.label}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                    ageCategory === cat.id
                      ? 'bg-amber-400 text-black shadow-md scale-105'
                      : 'bg-[#121620] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Kids Search Bar */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              <input
                type="text"
                value={kidsSearch}
                onChange={e => setKidsSearch(e.target.value)}
                placeholder="بحث في كرتون الأطفال..."
                className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-9 pl-4 py-2 text-xs text-white outline-none focus:border-amber-400"
              />
              {kidsSearch && (
                <button
                  onClick={() => setKidsSearch('')}
                  className="absolute left-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Featured Spotlight Kids Movie Banner */}
          {featuredKidsMovie && (
            <div className="relative min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden glass-card border-2 border-amber-400/30 p-6 sm:p-10 flex flex-col justify-end shadow-2xl group">
              <img
                src={featuredKidsMovie.backdrop || featuredKidsMovie.poster}
                alt={featuredKidsMovie.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/60 to-transparent" />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-400 text-black font-black text-xs px-3 py-1 rounded-xl shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-black" />
                    <span>اختيار الأطفال المفضل</span>
                  </span>
                  <span className="bg-black/70 text-emerald-300 border border-emerald-400/40 text-xs font-bold px-2.5 py-1 rounded-xl">
                    مناسب لكل الأعمار ({featuredKidsMovie.ageRating || 'G'})
                  </span>
                  <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold px-2.5 py-1 rounded-xl">
                    دقة عالية 4K HDR
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-xl leading-tight">
                  {featuredKidsMovie.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 leading-relaxed">
                  {featuredKidsMovie.overview}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      showToast(`جاري تشغيل فيلم الأطفال: ${featuredKidsMovie.title} 🎬🍿`);
                      navigateTo('player', featuredKidsMovie);
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>مشاهدة الفيديو الآن مع العائلة</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(featuredKidsMovie.id)}
                    className="p-3.5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/15 text-white active:scale-95 transition-all"
                    title="إضافة للمفضلة"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(featuredKidsMovie.id) ? 'fill-red-500 text-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Curated Kids Movies & Animation Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>عالم الكرتون والأفلام المتحركة 🎬🎨</span>
              </h3>
              <span className="text-xs text-amber-300 font-bold">{kidsMovies.length} أعمال آمنة للمشاهدة</span>
            </div>

            {kidsMovies.length === 0 ? (
              <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-white/10">
                <Smile className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">لم يتم العثور على نتائج للبحث في عالم الأطفال</h4>
                <p className="text-xs text-gray-400">جرب كتابة اسم فيلم آخر مثل سبونج بوب، موانا، إلسا، أو توم وجيري</p>
                <button
                  onClick={() => {
                    setKidsSearch('');
                    setAgeCategory('all');
                  }}
                  className="px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-xl"
                >
                  عرض جميع أفلام الأطفال
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {kidsMovies.map(movie => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      showToast(`فتح تفاصيل عمل الأطفال: ${movie.title} 🍿`);
                      navigateTo('details', movie);
                    }}
                    className="glass-card rounded-3xl overflow-hidden border-2 border-white/10 hover:border-amber-400/60 transition-all duration-300 cursor-pointer group hover:scale-[1.03] active:scale-95 shadow-xl flex flex-col"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
                        {movie.rating} ⭐
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/10">
                        {movie.ageRating || 'G'}
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <Play className="w-6 h-6 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 text-right space-y-1">
                      <h4 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors truncate">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{movie.year}</span>
                        <span className="text-amber-300 font-bold">{movie.genres?.[0] || 'عائلي'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ================= TAB 2: SONGS & STORIES PLAYER ================= */}
      {activeTab === 'songs' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-[#1d0312] via-[#10081d] to-[#07090d] shadow-2xl space-y-6 relative overflow-hidden">
            {/* Background Glow Accent */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Now Playing Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br ${currentAudioTrack.color} text-white flex flex-col items-center justify-center shadow-2xl border-4 border-white/20 shrink-0`}>
                <span className="text-5xl animate-pulse">{currentAudioTrack.icon}</span>
                <span className="text-[10px] font-black uppercase mt-2 bg-black/40 px-2 py-0.5 rounded-full">
                  {currentAudioTrack.category}
                </span>
              </div>

              <div className="space-y-2 text-center sm:text-right min-w-0 flex-1">
                <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full font-bold inline-block">
                  مشغل أغاني وقصص قبل النوم للأطفال 🎵
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{currentAudioTrack.title}</h3>
                <p className="text-xs text-gray-300">استمع لأحلى المقطوعات الموسيقية والقصص الصوتية الهادئة قبل النوم</p>

                {/* Progress Bar & Time */}
                <div className="pt-2 space-y-1">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full transition-all duration-300"
                      style={{ width: isPlayingAudio ? '45%' : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>{isPlayingAudio ? '1:12' : '0:00'}</span>
                    <span>{currentAudioTrack.duration}</span>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-center sm:justify-start gap-4 pt-3">
                  <button
                    onClick={prevAudioTrack}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
                    title="المقطع السابق"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={toggleAudioPlay}
                    className="p-4 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black active:scale-95 transition-all shadow-xl shadow-pink-500/30"
                    title={isPlayingAudio ? 'إيقاف مؤقت' : 'تشغيل'}
                  >
                    {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={nextAudioTrack}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
                    title="المقطع التالي"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mr-4 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
                    <Volume2 className="w-4 h-4 text-pink-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={audioVolume}
                      onChange={e => setAudioVolume(parseFloat(e.target.value))}
                      className="w-20 accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Selection */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-pink-400" />
                <span>قائمة الأغاني والقصص التفاعلية ({KIDS_AUDIO_PLAYLIST.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {KIDS_AUDIO_PLAYLIST.map((track, idx) => {
                  const isCurrent = idx === currentAudioIndex;
                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setCurrentAudioIndex(idx);
                        setIsPlayingAudio(true);
                        showToast(`تشغيل: ${track.title}`);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-right active:scale-95 ${
                        isCurrent
                          ? 'border-pink-500 bg-pink-500/20 text-white font-bold shadow-md'
                          : 'border-white/10 bg-[#121620] text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{track.icon}</span>
                        <div>
                          <b className="text-white block text-xs">{track.title}</b>
                          <span className="text-[10px] text-gray-400 block">{track.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-pink-300 font-bold">{track.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRIVIA & PUZZLE GAME ================= */}
      {activeTab === 'trivia' && (
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#021820] via-[#091220] to-[#07090d] shadow-2xl space-y-6 relative overflow-hidden">
            {/* Top Score Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-black text-white">مسابقة أبطال السينما والكرتون</h3>
              </div>
              <div className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3.5 py-1 rounded-full font-black text-xs flex items-center gap-1.5 shadow">
                <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>النقاط المحققة: {score} XP</span>
              </div>
            </div>

            {!isQuizCompleted ? (
              <div className="space-y-6 max-w-xl mx-auto text-center">
                <div className="text-xs text-cyan-300 font-bold">
                  السؤال {currentQuestionIndex + 1} من {KIDS_TRIVIA_QUESTIONS.length}
                </div>

                <div className="p-6 rounded-3xl bg-black/40 border border-cyan-500/20 space-y-3 shadow-inner">
                  <span className="text-4xl block animate-bounce">🧩</span>
                  <h4 className="text-lg sm:text-xl font-black text-white">
                    {KIDS_TRIVIA_QUESTIONS[currentQuestionIndex].question}
                  </h4>
                </div>

                {/* Question Options */}
                <div className="grid grid-cols-1 gap-3 text-xs">
                  {KIDS_TRIVIA_QUESTIONS[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === KIDS_TRIVIA_QUESTIONS[currentQuestionIndex].correct;

                    let btnStyle = 'border-white/15 bg-[#121620] text-white hover:bg-white/10';
                    if (showAnswerResult) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/30 text-emerald-200 font-black shadow-lg scale-102';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-500/30 text-red-200 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={showAnswerResult}
                        className={`p-4 rounded-2xl border text-right transition-all font-bold text-sm flex items-center justify-between active:scale-95 ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {showAnswerResult && isCorrect && <Check className="w-5 h-5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Next Question */}
                {showAnswerResult && (
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-right text-xs space-y-3 animate-fadeIn">
                    <p className="text-cyan-200 font-bold">{KIDS_TRIVIA_QUESTIONS[currentQuestionIndex].explanation}</p>
                    <button
                      onClick={nextQuestion}
                      className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black rounded-xl text-xs shadow-lg active:scale-95 transition-all"
                    >
                      {currentQuestionIndex < KIDS_TRIVIA_QUESTIONS.length - 1 ? 'السؤال التالي ⟵' : 'عرض النتيجة النهائية 🏆'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-5 max-w-md mx-auto">
                <span className="text-6xl block animate-bounce">🏆🎉</span>
                <h4 className="text-2xl font-black text-white">أحسنت يا بطل! أنهيت المسابقة بنجاح</h4>
                <p className="text-xs text-gray-300">
                  لقد حققت <b className="text-cyan-400 font-black text-lg">{score} XP</b> نقطة تميز في مسابقة كرتون الأطفال!
                </p>
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black rounded-2xl text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المسابقة من جديد</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: DRAWING & STICKER CANVAS ================= */}
      {activeTab === 'canvas' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#021a12] via-[#08151f] to-[#07090d] shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-500/20">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-400" />
                  <span>مرسم الألوان والملصقات السحرية للأطفال 🎨</span>
                </h3>
                <p className="text-xs text-gray-400">ارسم وشكّل لوحتك الفنية بحرية واستخدم الملصقات الملونة</p>
              </div>

              {/* Action Tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح اللوحة</span>
                </button>
                <button
                  onClick={() => showToast('تم حفظ الرسمة السحرية في ألبوم الطفل! 🖼️🎨')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>حفظ الرسمة</span>
                </button>
              </div>
            </div>

            {/* Color & Brush Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/10 text-xs">
              {/* Color Pickers */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-bold text-[11px]">اللون:</span>
                {['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#ffffff', '#000000'].map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setDrawColor(color);
                      setActiveSticker(null);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform active:scale-90 ${
                      drawColor === color && !activeSticker ? 'scale-125 border-white shadow-lg' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-bold text-[11px]">حجم الفرشاة:</span>
                {[4, 8, 14, 22].map(size => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                      brushSize === size ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 text-gray-300 border-white/10'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>

              {/* Stickers Tool */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-gray-300 font-bold text-[11px] shrink-0">ملصقات:</span>
                {['⭐', '🎈', '👑', '🦄', '🚀', '🍔', '❄️', '🎨'].map(sticker => (
                  <button
                    key={sticker}
                    onClick={() => {
                      setActiveSticker(activeSticker === sticker ? null : sticker);
                      showToast(activeSticker === sticker ? 'تم إلغاء تحديد الملصق' : `انقر على اللوحة لوضع الملصق ${sticker}`);
                    }}
                    className={`p-1.5 text-lg rounded-xl transition-transform active:scale-90 ${
                      activeSticker === sticker ? 'bg-amber-400/30 border border-amber-400 scale-110' : 'hover:bg-white/10'
                    }`}
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>

            {/* HTML5 Canvas Drawing Board */}
            <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-[#121620] relative cursor-crosshair shadow-inner">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full touch-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Parental PIN Lock Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm p-6 rounded-3xl border border-white/15 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">الرقابة الأبوية: أدخل رمز PIN</h3>
              <p className="text-xs text-gray-400 mt-1">أدخل الرمز السري للوالدين المكون من 4 أرقام لمغادرة نمط الأطفال</p>
            </div>

            <form onSubmit={handleExitKidsMode} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={e => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="• • • •"
                className={`w-40 mx-auto bg-[#121620] border ${
                  pinError ? 'border-red-500' : 'border-white/20'
                } rounded-2xl py-3 text-center text-2xl font-mono tracking-widest text-white outline-none focus:border-amber-400`}
              />

              <div className="text-[11px] text-gray-400">
                (رمز التجربة الافتراضي: <b className="text-amber-400">1234</b>)
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-xs shadow-lg active:scale-95 transition-all"
                >
                  تأكيد الخروج
                </button>
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-3 bg-white/10 hover:bg-white/15 text-gray-300 rounded-xl font-bold text-xs"
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
