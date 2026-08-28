import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MovieCard } from './MovieCard';
import { getSubtitlesForMovie } from '../data/subtitlesData';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sliders,
  Settings,
  Share2,
  Info,
  Tv,
  ArrowRight,
  Sparkles,
  Subtitles,
  Gauge,
  ShieldCheck,
  Lock,
  Unlock,
  FastForward,
  SkipForward,
  Download,
  Mic,
  Gamepad2,
  Check,
  X,
  Moon,
  Clock,
  Flame,
  Music,
  Award,
  Film,
  Eye,
  SlidersHorizontal,
  Zap,
  Radio,
  Layers
} from 'lucide-react';
import { securityShield } from '../services/securityEngine';
import { AppLogo } from './AppLogo';

export const VideoPlayerView: React.FC = () => {
  const {
    activeMovie,
    movies,
    navigateTo,
    setIsShareModalOpen,
    setShareTargetMovie,
    addToHistory,
    subtitleSettings,
    updateSubtitleSettings,
    audioSettings,
    updateAudioSettings,
    addDownload,
    showToast,
    setIsTVRemoteOpen,
    addToContinueWatching,
    continueWatching
  } = useApp();

  const currentMovie = activeMovie || movies[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState<string>('4K Ultra HD');
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState<boolean>(false);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState<boolean>(false);
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState<boolean>(false);

  // 1. Netflix Touch Lock Feature
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [showLockPrompt, setShowLockPrompt] = useState<boolean>(false);

  // 2. Interactive Story Feature (Bandersnatch)
  const [isInteractiveOpen, setIsInteractiveOpen] = useState<boolean>(false);
  const [chosenBranch, setChosenBranch] = useState<string | null>(null);
  const [interactiveTimer, setInteractiveTimer] = useState<number>(10);

  // 3. Auto-Next Episode Feature
  const [showAutoNext, setShowAutoNext] = useState<boolean>(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number>(5);

  // Active audio track
  const [activeAudioTrack, setActiveAudioTrack] = useState<string>('دبلجة عربية فصحى 🇸🇦');

  // NEW FEATURE 1: AI X-Ray Scene Explorer
  const [isXRayOpen, setIsXRayOpen] = useState<boolean>(false);
  const [activeXRayTab, setActiveXRayTab] = useState<'actors' | 'music' | 'trivia'>('actors');

  // NEW FEATURE 2: Ambilight Cinema Glow
  const [isAmbilightEnabled, setIsAmbilightEnabled] = useState<boolean>(true);

  // NEW FEATURE 3: Smart Audio EQ & Sleep Timer
  const [audioEQMode, setAudioEQMode] = useState<'normal' | 'clearVoice' | 'bassBoost' | 'nightMode'>('normal');
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // NEW FEATURE 4: Binge-Watch Tracker & Stats Badge
  const [isBingeStatsOpen, setIsBingeStatsOpen] = useState<boolean>(false);
  const [totalWatchMinutes, setTotalWatchMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('filmmax_binge_mins');
      return saved ? parseInt(saved, 10) : 248; // Default 248 mins (~4 hours)
    } catch {
      return 248;
    }
  });
  const [streakDays, setStreakDays] = useState<number>(7);

  // Strict video key resolution without random fallback
  const activeYoutubeKey = currentMovie.youtubeKey;
  const hasValidVideo = !!activeYoutubeKey || (!!currentMovie.videoUrl && !currentMovie.videoUrl.includes('undefined'));

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find next movie for Auto-Next
  const nextMovieIndex = movies.findIndex(m => m.id === currentMovie.id) + 1;
  const nextMovie = movies[nextMovieIndex] || movies[0];

  // Dynamic Subtitles Generation for active movie
  const subtitleCues = useMemo(() => {
    return getSubtitlesForMovie(currentMovie.title, duration || 180);
  }, [currentMovie.title, duration]);

  // Find active subtitle line based on currentTime
  const currentSubtitleText = useMemo(() => {
    const matched = subtitleCues.find(c => currentTime >= c.start && currentTime <= c.end);
    if (!matched) return null;
    if (activeAudioTrack.includes('العراقية')) return matched.iq;
    if (activeAudioTrack.includes('English')) return matched.en;
    return matched.ar;
  }, [subtitleCues, currentTime, activeAudioTrack]);

  // Live Timer Ticker: keeps progress counter ticking continuously when video is playing
  useEffect(() => {
    let ticker: any;
    if (isPlaying) {
      ticker = setInterval(() => {
        if (videoRef.current) {
          const cur = videoRef.current.currentTime;
          const dur = videoRef.current.duration || 180;
          setCurrentTime(cur);
          setDuration(dur);
        } else {
          // If playing YouTube trailer or stream, advance time ticker
          setCurrentTime(prev => {
            const next = prev + 1;
            if (next >= (duration || 180)) {
              return 0; // loop or reset
            }
            return next;
          });
        }
      }, 1000);
    }
    return () => clearInterval(ticker);
  }, [isPlaying, duration]);

  // Add to watch history and seek to last position
  useEffect(() => {
    if (currentMovie) {
      addToHistory(currentMovie, 35);
      
      // Seek to last watched position if exists
      const saved = continueWatching.find(item => item.videoId === currentMovie.id);
      if (saved && videoRef.current && saved.progress < 95) {
        videoRef.current.currentTime = saved.currentTime;
        showToast(`استئناف المشاهدة من ${formatTime(saved.currentTime)} 🎬`);
      }
    }
  }, [currentMovie, addToHistory, continueWatching, showToast]);

  // Handle controls auto-hide
  const handleUserActivity = () => {
    if (isScreenLocked) {
      setShowLockPrompt(true);
      setTimeout(() => setShowLockPrompt(false), 3000);
      return;
    }

    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsMenuOpen && !isSubtitlesOpen && !isAudioMenuOpen && !isInteractiveOpen) {
        setShowControls(false);
      }
    }, 3800);
  };

  // Helper to send commands to YouTube Iframe if active
  const sendYtCommand = (command: string, arg?: any) => {
    const iframe = document.getElementById('filmmax-yt-player') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: arg !== undefined ? (Array.isArray(arg) ? arg : [arg]) : []
        }),
        '*'
      );
    }
  };

  // Helper to synthesize audio & dubbing voice output
  const triggerDubbingVoice = (trackName: string) => {
    setActiveAudioTrack(trackName);
    showToast(`تم تغيير المسار الصوتي والبدء بالدبلجة: ${trackName} 🎙️`);
    setIsAudioMenuOpen(false);

    // 1. Web Audio API Synth Effect
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = trackName.includes('الذكاء الاصطناعي') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}

    // 2. Real Speech Synthesis Voice Output
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = '';
      let lang = 'ar-SA';
      let pitch = 1.0;
      let rate = 1.0;

      if (trackName.includes('فصحى')) {
        text = `تم تفعيل الدبلجة العربية الفصحى لفيلم ${currentMovie.title}. مشاهدة ممتعة على فيلم ماكس.`;
        lang = 'ar-SA';
        pitch = 1.0;
      } else if (trackName.includes('العراقية')) {
        text = `هلا بيك! دبلجة اللهجة العراقية حية الآن لفيلم ${currentMovie.title}.`;
        lang = 'ar-IQ';
        pitch = 0.95;
        rate = 1.05;
      } else if (trackName.includes('English')) {
        text = `English original audio activated for ${currentMovie.title}. Enjoy the show!`;
        lang = 'en-US';
        pitch = 1.0;
      } else if (trackName.includes('الذكاء الاصطناعي')) {
        text = `تمت معالجة الصوت الاصطناعي والتحسين المباشر لفيلم ${currentMovie.title}.`;
        lang = 'ar-SA';
        pitch = 1.25;
        rate = 1.1;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const togglePlay = () => {
    if (isScreenLocked) return;

    const nextState = !isPlaying;
    setIsPlaying(nextState);

    // Native HTML5 video
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }

    // YouTube Iframe
    if (currentMovie.youtubeKey) {
      sendYtCommand(isPlaying ? 'pauseVideo' : 'playVideo');
    }

    showToast(nextState ? 'إيقاف مؤقت ⏸️' : 'تشغيل ◀');
  };

  const handleSkipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 28;
    }
    if (currentMovie.youtubeKey) {
      sendYtCommand('seekTo', [28, true]);
    }
    setCurrentTime(28);
    showToast('تم تخطي مقدمة العرض بنجاح ⚡');
  };

  const handleSeek = (delta: number) => {
    if (isScreenLocked) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + delta));
    setCurrentTime(newTime);

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    if (currentMovie.youtubeKey) {
      sendYtCommand('seekTo', [newTime, true]);
    }
    showToast(delta > 0 ? `تقديم +${delta} ثانية ⏩` : `ترجيع ${delta} ثانية ⏪`);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScreenLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetSec = pos * (duration || 180);
    setCurrentTime(targetSec);

    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
    }
    if (currentMovie.youtubeKey) {
      sendYtCommand('seekTo', [targetSec, true]);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (currentMovie.youtubeKey) {
      sendYtCommand('setPlaybackRate', speed);
    }
    showToast(`تم تعيين سرعة التشغيل إلى ${speed}x ⚡`);
    setIsSettingsMenuOpen(false);
  };

  const handleFullscreenToggle = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Sleep Timer countdown effect
  useEffect(() => {
    let interval: any;
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0 && isPlaying) {
      interval = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            if (videoRef.current) videoRef.current.pause();
            if (currentMovie.youtubeKey) sendYtCommand('pauseVideo');
            showToast('توقف التشغيل تلقائياً بواسطة مؤقت النوم 🌙 نتمنى لك نومًا هنيئاً!');
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance('تم إيقاف العرض بواسطة مؤقت النوم. طليلة سعيدة.');
              u.lang = 'ar-SA';
              window.speechSynthesis.speak(u);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepTimerRemaining, isPlaying, currentMovie.youtubeKey, showToast]);

  // Binge watch minutes tracker effect (increments every minute while watching)
  useEffect(() => {
    let tracker: any;
    if (isPlaying) {
      tracker = setInterval(() => {
        setTotalWatchMinutes(prev => {
          const next = prev + 1;
          try {
            localStorage.setItem('filmmax_binge_mins', next.toString());
          } catch {}
          return next;
        });
      }, 60000);
    }
    return () => clearInterval(tracker);
  }, [isPlaying]);

  const handleSetSleepTimer = (mins: number | null) => {
    setSleepTimerMinutes(mins);
    if (mins === null) {
      setSleepTimerRemaining(null);
      showToast('تم إلغاء مؤقت النوم ⏰');
    } else {
      setSleepTimerRemaining(mins * 60);
      showToast(`تم ضبط مؤقت النوم بعد ${mins} دقيقة 🌙`);
    }
    setIsSleepTimerOpen(false);
  };

  const applyAudioEQMode = (mode: 'normal' | 'clearVoice' | 'bassBoost' | 'nightMode') => {
    setAudioEQMode(mode);
    let label = 'العادي';
    if (mode === 'clearVoice') label = 'الحوارات النقية (Clear Voice 🗣️)';
    if (mode === 'bassBoost') label = 'تضخيم الباس السينمائي (Bass Boost 🔊)';
    if (mode === 'nightMode') label = 'النمط الليلي المريح (Night Mode 🌙)';

    showToast(`تم تفعيل معالج الصوت: ${label}`);
    setIsSettingsMenuOpen(false);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`تم تطبيق معالج الصوت ${label}`);
      u.lang = 'ar-SA';
      window.speechSynthesis.speak(u);
    }
  };

  // Dynamic Ambilight glow class generator
  const getAmbilightClass = () => {
    if (!isAmbilightEnabled) return '';
    const cat = (currentMovie.genres?.join(' ') || (currentMovie as any).category || currentMovie.type || '').toLowerCase();
    if (cat.includes('أكشن') || cat.includes('إثارة') || cat.includes('حركة')) {
      return 'shadow-[0_0_80px_rgba(239,68,68,0.4)] ring-2 ring-red-500/30';
    }
    if (cat.includes('خيال') || cat.includes('مغامرة') || cat.includes('أنيميشن')) {
      return 'shadow-[0_0_80px_rgba(6,182,212,0.4)] ring-2 ring-cyan-500/30';
    }
    if (cat.includes('دراما') || cat.includes('تاريخي') || cat.includes('وثائقي')) {
      return 'shadow-[0_0_80px_rgba(245,158,11,0.4)] ring-2 ring-amber-500/30';
    }
    return 'shadow-[0_0_80px_rgba(168,85,247,0.4)] ring-2 ring-purple-500/30';
  };

  // Helper to resolve cast actor name securely
  const getActorName = (castItem: any, fallback: string) => {
    if (!castItem) return fallback;
    if (typeof castItem === 'string') return castItem;
    if (typeof castItem === 'object' && castItem.name) return castItem.name;
    return fallback;
  };

  // Dynamic X-Ray data generator for current movie
  const xRayData = {
    actors: [
      {
        name: getActorName(currentMovie.cast?.[0], 'أحمد زكي / النجم الرئيسي'),
        role: 'البطل / الشخصية القيادية 🎭',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'برع الممثل في تجسيد تعابير المشهد الصعب مع مخرج العمل الموهوب.'
      },
      {
        name: getActorName(currentMovie.cast?.[1], 'سارة المحمداوي'),
        role: 'مستشارة العمل والشريكة 🎬',
        img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'أداء سينمائي رفيع فاز بجوائز النقاد لموسم 2026.'
      },
      {
        name: getActorName(currentMovie.cast?.[2], 'كريم عبد العزيز'),
        role: 'قائد الفرقة الخاصة ⚔️',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'شخصية أساسية تقود مسار الأحداث التشويقية للمشهد المباشر.'
      }
    ],
    music: {
      title: `${currentMovie.title} - الموسيقى التصويرية 🎼`,
      composer: 'هانز زيمر (Hans Zimmer Orchestra & Choir)',
      duration: '3:45',
      genre: 'سيمفونية تشويق سينمائية عالية الإثارة'
    },
    trivia: [
      { label: 'تقنية تصوير اللقطة', val: 'كاميرا IMAX 70mm 12K Dual System' },
      { label: 'موقع التصوير المباشر', val: 'استوديوهات لندن الكبرى والواحات الصحراوية' },
      { label: 'حقائق الكواليس', val: 'تم مشاركة أكثر من 500 كاسكادير محترف لتصوير هذه اللقطة المباشرة دون استبدال جرافيك' },
      { label: 'الميزانية التقديرية', val: '145 مليون دولار أمريكي' }
    ]
  };

  // Auto-Next countdown timer effect near end of video
  useEffect(() => {
    let timer: any;
    if (showAutoNext && autoNextCountdown > 0) {
      timer = setInterval(() => {
        setAutoNextCountdown(prev => prev - 1);
      }, 1000);
    } else if (showAutoNext && autoNextCountdown === 0) {
      setShowAutoNext(false);
      showToast(`جاري تشغيل العمل التالي: ${nextMovie.title}... ⏭️`);
      navigateTo('player', nextMovie);
    }
    return () => clearInterval(timer);
  }, [showAutoNext, autoNextCountdown, nextMovie, navigateTo, showToast]);

  // Monitor time update for Auto-Next trigger and saving progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 180;
      setCurrentTime(cur);
      setDuration(dur);

      // Save progress to continue watching every 5 seconds
      if (Math.floor(cur) % 5 === 0) {
        addToContinueWatching(currentMovie, cur, dur);
      }

      // Trigger auto-next when within 10 seconds of end
      if (dur > 30 && cur >= dur - 10 && !showAutoNext) {
        setShowAutoNext(true);
        setAutoNextCountdown(5);
      }
    }
  };

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const remainingM = m % 60;
    const remainingS = s % 60;
    if (h > 0) {
      return `${h}:${remainingM < 10 ? '0' : ''}${remainingM}:${remainingS < 10 ? '0' : ''}${remainingS}`;
    }
    return `${remainingM}:${remainingS < 10 ? '0' : ''}${remainingS}`;
  };

  // Relevant related movies (same genre, same actors, or same type)
  const relatedMovies = useMemo(() => {
    const currentGenres = currentMovie.genres || [];
    const sameCategory = movies.filter(m => 
      m.id !== currentMovie.id && 
      (m.genres?.some(g => currentGenres.includes(g)) || m.type === currentMovie.type)
    );
    if (sameCategory.length >= 6) {
      return sameCategory.slice(0, 12);
    }
    const otherMovies = movies.filter(m => m.id !== currentMovie.id && !sameCategory.includes(m));
    return [...sameCategory, ...otherMovies].slice(0, 12);
  }, [movies, currentMovie]);

  return (
    <div className={`space-y-6 pb-12 transition-all ${isCinemaMode ? 'fixed inset-0 z-50 bg-black p-4 sm:p-8 overflow-y-auto' : ''}`}>
      {/* Top Bar with Back & Share */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('details', currentMovie)}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            title="العودة"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white truncate max-w-md">
              {currentMovie.title}
            </h1>
            <span className="text-xs text-amber-400 font-bold">
              ★ {currentMovie.rating} • {currentMovie.type} • {currentMovie.year} {chosenBranch && `• مسار [${chosenBranch}]`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* TV Remote & Cast Button */}
          <button
            onClick={() => setIsTVRemoteOpen(true)}
            className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
            title="بث البلازما وريموت TV"
          >
            <Tv className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">بث TV 📺</span>
          </button>

          {/* AI X-Ray Button */}
          <button
            onClick={() => setIsXRayOpen(!isXRayOpen)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isXRayOpen
                ? 'bg-amber-500 text-black border-amber-400 font-black shadow-lg'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="X-Ray AI - كواليس اللقطة والأبطال"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">X-Ray AI 🔍</span>
          </button>

          {/* Binge Tracker & Stats */}
          <button
            onClick={() => setIsBingeStatsOpen(true)}
            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
            title="سجل الإنجاز السينمائي"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">الإنجاز السينمائي 📊</span>
          </button>

          {/* Downloads Button */}
          <button
            onClick={() => addDownload(currentMovie, '4K Ultra HD')}
            className="p-2 rounded-xl bg-[#151922] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1 text-xs font-bold"
            title="تحميل أوفلاين"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">أوفلاين</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              setShareTargetMovie(currentMovie);
              setIsShareModalOpen(true);
            }}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="مشاركة"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Cinema Mode Toggle */}
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isCinemaMode
                ? 'bg-[#e50914] text-white border-[#e50914]'
                : 'bg-[#151922] text-gray-300 hover:text-white border-white/10'
            }`}
            title="نمط السينما"
          >
            {isCinemaMode ? 'إلغاء نمط السينما' : 'نمط السينما 🎬'}
          </button>
        </div>
      </div>

      {/* Main Cinema Player Container with Interactive Ambilight Glow */}
      <div
        ref={playerContainerRef}
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
        className={`relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group select-none protected-media transition-all duration-500 ${getAmbilightClass()}`}
      >
        {/* FilmMax Brand Watermark */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none select-none opacity-40 hover:opacity-80 transition-opacity px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-md">
          <span className="text-white/80 font-black text-xs sm:text-sm tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            FilmMax
          </span>
        </div>

        {/* Video or YouTube Player or Not Available Error State */}
        {hasValidVideo ? (
          activeYoutubeKey ? (
            <iframe
              id="filmmax-yt-player"
              src={`https://www.youtube-nocookie.com/embed/${activeYoutubeKey}?autoplay=1&enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=1`}
              title={currentMovie.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentMovie.videoUrl}
              poster={currentMovie.backdrop || currentMovie.poster}
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setIsPlaying(false);
                setShowAutoNext(true);
                setAutoNextCountdown(5);
              }}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c10] text-white p-8 text-center space-y-4 z-20">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black">عذراً، فيديو هذا العرض غير متوفر حالياً</h3>
            <p className="text-sm text-gray-400 max-w-md font-medium">
              حرصاً منا على دقة المحتوى وعدم تشغيل مقاطع غير مطابقة لهذا العنوان، يتطلب هذا العرض توفر مصدر فيديو رسمي تم التحقق منه.
            </p>
          </div>
        )}

        {/* 1. NETFLIX FEATURE: SKIP INTRO BUTTON (تخطي المقدمة) */}
        {currentTime >= 2 && currentTime <= 28 && !isScreenLocked && (
          <button
            onClick={handleSkipIntro}
            className="absolute bottom-20 right-6 z-30 bg-black/80 hover:bg-white text-white hover:text-black font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/30 backdrop-blur-md shadow-2xl transition-all animate-bounce flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>تخطي المقدمة (Skip Intro ⚡)</span>
          </button>
        )}

        {/* 2. NETFLIX FEATURE: SCREEN TOUCH LOCK OVERLAY (قفل لمس الشاشة) */}
        {isScreenLocked && (
          <div
            onClick={() => {
              setShowLockPrompt(true);
              setTimeout(() => setShowLockPrompt(false), 3000);
            }}
            onDoubleClick={() => {
              setIsScreenLocked(false);
              showToast('تم فك قفل لمس الشاشة 🔓');
            }}
            className="absolute inset-0 z-40 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 cursor-pointer"
          >
            <div className="p-4 rounded-3xl bg-black/80 border border-white/20 text-white flex flex-col items-center gap-2 shadow-2xl animate-pulse">
              <Lock className="w-8 h-8 text-amber-400" />
              <span className="text-xs font-black">الشاشة مقفولة حالياً 🔒</span>
              <span className="text-[10px] text-gray-300">انقر مرتين متبوعين لفك القفل</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsScreenLocked(false);
                showToast('تم فك قفل الشاشة بنجاح 🔓');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black shadow-lg hover:bg-amber-400 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>إلغاء القفل الآن</span>
            </button>
          </div>
        )}

        {/* 3. NETFLIX FEATURE: INTERACTIVE STORY MODAL (الأفلام التفاعلية - Bandersnatch) */}
        {isInteractiveOpen && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Gamepad2 className="w-6 h-6 animate-spin-slow" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                فيلم تفاعلي متعدد المسارات (Choose Your Own Story 🎮)
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                ⚡ حدث مفصلي! ماذا تريد أن تفعل الشجاعة الآن؟
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-2">
              <button
                onClick={() => {
                  setChosenBranch('المواجهة والاقتحام');
                  setIsInteractiveOpen(false);
                  handleSeek(30);
                  showToast('تم اعتماد خيار: المواجهة المباشرة! تحولت أحداث القصة ⚔️🔥');
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance('اخترت مسار المواجهة والاقتحام! تحولت الأحداث لمواجهة ساخنة الآن.');
                    u.lang = 'ar-SA';
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="p-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 text-white text-xs font-black border border-purple-400/40 shadow-xl transition-all text-right space-y-1 active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span>الخيار الأول ⚔️</span>
                  <span className="text-[10px] text-amber-300">مسار الأكشن والتشويق</span>
                </div>
                <p className="text-[11px] text-purple-200 font-normal">اقتحام المقر الرئيسي ومواجهة الخصم مباشرة دون انتظار</p>
              </button>

              <button
                onClick={() => {
                  setChosenBranch('التسلل والدعم');
                  setIsInteractiveOpen(false);
                  handleSeek(60);
                  showToast('تم اعتماد خيار: التسلل والهروب الخفي! تحولت أحداث القصة 🕵️‍♂️✨');
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance('اخترت مسار التسلل الخفي! بدأت خطة التسلل والاستطلاع الآن.');
                    u.lang = 'ar-SA';
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 to-teal-800 hover:from-blue-600 text-white text-xs font-black border border-teal-400/40 shadow-xl transition-all text-right space-y-1 active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span>الخيار الثاني 🕵️‍♂️</span>
                  <span className="text-[10px] text-teal-300">مسار الغموض والذكاء</span>
                </div>
                <p className="text-[11px] text-teal-200 font-normal">التراجع للتسلل واستدعاء طاقم المساندة الجوية</p>
              </button>
            </div>

            <button
              onClick={() => setIsInteractiveOpen(false)}
              className="text-xs text-gray-400 underline hover:text-white pt-2"
            >
              تخطي واستكمال القصة الافتراضية
            </button>
          </div>
        )}

        {/* 4. NETFLIX FEATURE: AUTO-NEXT EPISODE OVERLAY (التشغيل التلقائي بنهاية الفيلم) */}
        {showAutoNext && (
          <div className="absolute bottom-6 left-6 z-40 bg-[#0c0f18]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 w-72 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                <FastForward className="w-3.5 h-3.5" />
                <span>العمل التالي يعمل خلال {autoNextCountdown}ث</span>
              </span>
              <button
                onClick={() => setShowAutoNext(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={nextMovie.poster}
                alt={nextMovie.title}
                className="w-14 h-18 object-cover rounded-xl border border-white/10 shadow"
              />
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-black text-white truncate">{nextMovie.title}</h5>
                <span className="text-[10px] text-amber-400 font-bold block">
                  ★ {nextMovie.rating} • {nextMovie.year}
                </span>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{nextMovie.overview}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAutoNext(false);
                  navigateTo('player', nextMovie);
                }}
                className="flex-1 py-2 rounded-xl bg-[#e50914] text-white text-xs font-black hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>تشغيل الآن</span>
              </button>
              <button
                onClick={() => setShowAutoNext(false)}
                className="px-3 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Subtitles Display - Real-time dynamic synced subtitles with dialect translation */}
        {isSubtitlesOpen && (
          <div
            className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-4 z-20 transition-all"
            style={{
              color: subtitleSettings.fontColor,
              fontSize:
                subtitleSettings.fontSize === 'small'
                  ? '14px'
                  : subtitleSettings.fontSize === 'large'
                  ? '22px'
                  : subtitleSettings.fontSize === 'xlarge'
                  ? '26px'
                  : '18px'
            }}
          >
            <span
              className="px-4 py-2 rounded-2xl font-bold shadow-2xl inline-block border border-white/20 backdrop-blur-md transition-all duration-300 max-w-2xl leading-relaxed"
              style={{ backgroundColor: subtitleSettings.backgroundColor }}
            >
              {currentSubtitleText || `[ترجمة وتدقيق FilmMax AI • ${currentMovie.title}]`}
            </span>
          </div>
        )}

        {/* 5. AUDIO DUBBING TRACKS DRAWER */}
        {isAudioMenuOpen && (
          <div className="absolute top-4 left-4 z-30 bg-[#0c0f18]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 w-64 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>المسار الصوت والدبلجة السينمائية</span>
              </h4>
              <button onClick={() => setIsAudioMenuOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { name: 'دبلجة عربية فصحى 🇸🇦', desc: 'استوديو أرينا الفاخر' },
                { name: 'اللهجة العراقية المحلية ✨', desc: 'أداء واحتراف محلي' },
                { name: 'اللغة الأصلية English 🇬🇧', desc: 'المسار الصوتي الأصلي 5.1' },
                { name: 'الذكاء الاصطناعي AI Audio 🤖', desc: 'توليد صدمات ومؤثرات حية' }
              ].map(track => (
                <button
                  key={track.name}
                  onClick={() => triggerDubbingVoice(track.name)}
                  className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between ${
                    activeAudioTrack === track.name
                      ? 'bg-purple-600 text-white font-black shadow'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-xs">{track.name}</span>
                    <span className="text-[9px] opacity-80 block">{track.desc}</span>
                  </div>
                  {activeAudioTrack === track.name && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floating Settings Drawer on Player */}
        {isSettingsMenuOpen && (
          <div className="absolute top-4 left-4 z-30 bg-[#0c0f15]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 w-60 shadow-2xl space-y-3">
            <h4 className="text-xs font-black text-white border-b border-white/10 pb-2">
              إعدادات الفيديو والجودة
            </h4>
            <div className="space-y-2 text-xs">
              <span className="text-gray-400 block text-[10px]">السرعة:</span>
              <div className="grid grid-cols-4 gap-1">
                {[0.75, 1, 1.25, 1.5].map(s => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`py-1 rounded font-bold ${
                      playbackSpeed === s ? 'bg-[#e50914] text-white' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-white/10">
              <span className="text-gray-400 block text-[10px]">الجودة:</span>
              <div className="grid grid-cols-2 gap-1">
                {['4K Ultra HD', '1080p FHD', '720p HD', 'تلقائي'].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setSelectedQuality(q);
                      showToast(`تم التبديل إلى جودة ${q}`);
                      setIsSettingsMenuOpen(false);
                    }}
                    className={`py-1 px-2 rounded font-bold text-[11px] truncate ${
                      selectedQuality === q ? 'bg-[#e50914] text-white' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio EQ Selector */}
            <div className="space-y-2 text-xs pt-2 border-t border-white/10">
              <span className="text-gray-400 block text-[10px]">معالج الصوت الذكي (Audio EQ):</span>
              <div className="space-y-1">
                {[
                  { id: 'normal', name: 'العادي (Default 🎧)' },
                  { id: 'clearVoice', name: 'حوارات نقية (Clear Voice 🗣️)' },
                  { id: 'bassBoost', name: 'تضخيم الباس (Bass Boost 🔊)' },
                  { id: 'nightMode', name: 'النمط الليلي (Night Mode 🌙)' }
                ].map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => applyAudioEQMode(eq.id as any)}
                    className={`w-full py-1.5 px-2 rounded text-right font-bold text-[10px] flex items-center justify-between ${
                      audioEQMode === eq.id ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{eq.name}</span>
                    {audioEQMode === eq.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SLEEP TIMER DRAWER */}
        {isSleepTimerOpen && (
          <div className="absolute top-4 left-4 z-30 bg-[#0c0f15]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 w-60 shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-purple-400" />
                <span>مؤقت النوم (Sleep Timer)</span>
              </h4>
              <button onClick={() => setIsSleepTimerOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400">إيقاف الفيديو والصوت تلقائياً عند النعاس والنوم</p>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[15, 30, 45, 60].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className={`py-2 rounded-xl font-bold border text-center transition-all ${
                    sleepTimerMinutes === mins
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {mins} دقيقة
                </button>
              ))}
            </div>

            {sleepTimerRemaining !== null && (
              <button
                onClick={() => handleSetSleepTimer(null)}
                className="w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-bold text-xs"
              >
                إلغاء المؤقت الحالي
              </button>
            )}
          </div>
        )}

        {/* AI X-RAY EXPLORER SLIDE-OVER PANEL */}
        {isXRayOpen && (
          <div className="absolute top-0 right-0 bottom-0 z-40 w-72 sm:w-80 bg-[#080b11]/95 backdrop-blur-2xl border-l border-white/15 p-4 shadow-2xl flex flex-col justify-between space-y-4 animate-in slide-in-from-right duration-300">
            <div className="space-y-4 overflow-y-auto max-h-full pl-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">X-Ray AI Explorer</h4>
                    <span className="text-[9px] text-amber-400 font-bold block">مستكشف اللقطة والأبطال بـ AI</span>
                  </div>
                </div>
                <button onClick={() => setIsXRayOpen(false)} className="p-1.5 rounded-xl bg-white/10 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* X-Ray Navigation Tabs */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setActiveXRayTab('actors')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                    activeXRayTab === 'actors' ? 'bg-amber-500 text-black font-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  الأبطال 🎭
                </button>
                <button
                  onClick={() => setActiveXRayTab('music')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                    activeXRayTab === 'music' ? 'bg-amber-500 text-black font-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  الموسيقى 🎼
                </button>
                <button
                  onClick={() => setActiveXRayTab('trivia')}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                    activeXRayTab === 'trivia' ? 'bg-amber-500 text-black font-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  الكواليس 📍
                </button>
              </div>

              {/* Tab 1: Actors in Current Scene */}
              {activeXRayTab === 'actors' && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">الأبطال المتواجدون في هذه اللقطة:</span>
                  {xRayData.actors.map((actor, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex gap-3 items-center hover:border-amber-500/40 transition-all">
                      <img src={actor.img} alt={actor.name} className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 shadow shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-black text-white truncate">{actor.name}</h5>
                        <span className="text-[10px] text-amber-400 font-bold block">{actor.role}</span>
                        <p className="text-[9px] text-gray-300 line-clamp-2 mt-1">{actor.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Background Music Track */}
              {activeXRayTab === 'music' && (
                <div className="space-y-3 p-3 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Music className="w-4 h-4 animate-bounce" />
                    <span className="text-xs font-black">الموسيقى الخلفية الحية</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white">{xRayData.music.title}</h5>
                    <span className="text-[10px] text-purple-300 font-bold block">{xRayData.music.composer}</span>
                  </div>
                  {/* Audio visualizer simulation */}
                  <div className="flex items-center justify-center gap-1 h-8 py-1 bg-black/40 rounded-xl px-2">
                    {[40, 75, 90, 30, 60, 100, 45, 80, 50, 95, 30, 70].map((h, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 bg-gradient-to-t from-purple-500 to-amber-400 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${idx * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      showToast('تم حفظ مقطع الموسيقى في قائمة مفضلات الصوت 🎵');
                      if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const u = new SpeechSynthesisUtterance('تم حفظ المقطع الصوتي لهانز زيمر');
                        u.lang = 'ar-SA';
                        window.speechSynthesis.speak(u);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all"
                  >
                    حفظ الموسيقى للمفضلة 🎵
                  </button>
                </div>
              )}

              {/* Tab 3: Scene Trivia & Location */}
              {activeXRayTab === 'trivia' && (
                <div className="space-y-2.5">
                  {xRayData.trivia.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-amber-400 font-black block">📍 {t.label}</span>
                      <p className="text-xs text-gray-200 font-bold">{t.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsXRayOpen(false)}
              className="w-full py-2 rounded-xl bg-white/10 text-gray-300 hover:text-white font-bold text-xs"
            >
              إغلاق X-Ray
            </button>
          </div>
        )}

        {/* Subtitles Customization Drawer on Player */}
        {isSubtitlesOpen && (
          <div className="absolute top-4 right-4 z-30 bg-[#0c0f15]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 w-64 shadow-2xl space-y-3">
            <h4 className="text-xs font-black text-white border-b border-white/10 pb-2">
              تخصيص الترجمة (CC)
            </h4>
            <div className="space-y-1.5 text-xs">
              <span className="text-gray-400 block text-[10px]">حجم الخط:</span>
              <div className="grid grid-cols-4 gap-1">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => updateSubtitleSettings({ fontSize: sz })}
                    className={`py-1 rounded font-bold text-[10px] ${
                      subtitleSettings.fontSize === sz ? 'bg-[#e50914] text-white' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    {sz === 'small' ? 'صغير' : sz === 'medium' ? 'وسط' : sz === 'large' ? 'كبير' : 'ضخم'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-white/10">
              <span className="text-gray-400 block text-[10px]">لون الخط:</span>
              <div className="flex gap-2">
                {['#ffffff', '#f5c518', '#00f5d4', '#ff477e'].map(clr => (
                  <button
                    key={clr}
                    onClick={() => updateSubtitleSettings({ fontColor: clr })}
                    className="w-6 h-6 rounded-full border-2 border-white/20 shadow"
                    style={{ backgroundColor: clr }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM PLAYER CONTROLS BAR */}
        {showControls && !isScreenLocked && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 space-y-3 animate-in fade-in duration-200">
            {/* Progress Bar & Time */}
            <div className="space-y-1">
              <div
                onClick={handleProgressBarClick}
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group/bar"
              >
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-[#e50914] to-amber-400 rounded-full transition-all relative"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/bar:scale-100 transition-transform" />
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-gray-300 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSeek(-10)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                  title="-10 ثوانٍ"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleSeek(10)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                  title="+10 ثوانٍ"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>

              {/* Extra Feature Controls: Touch Lock, Audio, Story, Subtitles, Settings */}
              <div className="flex items-center gap-2">
                {/* Touch Lock Toggle */}
                <button
                  onClick={() => {
                    setIsScreenLocked(true);
                    showToast('تم قفل لمس الشاشة 🔒 (انقر مرتين للتأكيد)');
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10 transition-colors"
                  title="قفل لمس الشاشة"
                >
                  <Lock className="w-4 h-4" />
                </button>

                {/* Sleep Timer Button */}
                <button
                  onClick={() => setIsSleepTimerOpen(!isSleepTimerOpen)}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
                    sleepTimerRemaining !== null
                      ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
                      : 'bg-white/10 text-gray-300 hover:text-white border-white/10'
                  }`}
                  title="مؤقت النوم 🌙"
                >
                  <Moon className="w-4 h-4" />
                  {sleepTimerRemaining !== null && (
                    <span className="text-[10px] font-mono">
                      {Math.floor(sleepTimerRemaining / 60)}m
                    </span>
                  )}
                </button>

                {/* Interactive Story Trigger */}
                <button
                  onClick={() => setIsInteractiveOpen(true)}
                  className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="الأفلام التفاعلية (Bandersnatch)"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span className="hidden sm:inline">قصة تفاعلية</span>
                </button>

                {/* Audio Dubbing Tracks */}
                <button
                  onClick={() => {
                    setIsAudioMenuOpen(!isAudioMenuOpen);
                    setIsSubtitlesOpen(false);
                    setIsSettingsMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 transition-colors"
                  title="الصوت والدبلجة"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Subtitles CC */}
                <button
                  onClick={() => {
                    setIsSubtitlesOpen(!isSubtitlesOpen);
                    setIsAudioMenuOpen(false);
                    setIsSettingsMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl border transition-colors ${
                    isSubtitlesOpen
                      ? 'bg-[#e50914] text-white border-[#e50914]'
                      : 'bg-white/10 text-gray-300 hover:text-white border-white/10'
                  }`}
                  title="الترجمة"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {/* Quality & Speed Settings */}
                <button
                  onClick={() => {
                    setIsSettingsMenuOpen(!isSettingsMenuOpen);
                    setIsSubtitlesOpen(false);
                    setIsAudioMenuOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 transition-colors"
                  title="الإعدادات والجودة"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreenToggle}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10 transition-colors"
                  title="ملء الشاشة"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Movie Details Under Player */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#e50914]/20 border border-[#e50914]/40 text-[#ff4757] text-xs font-black rounded-full">
              {currentMovie.quality || '4K Ultra HD'}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-full">
              {activeAudioTrack}
            </span>
            <span className="text-xs text-gray-400 font-bold">
              مدة العرض: {currentMovie.duration || '2h 15m'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{currentMovie.title}</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{currentMovie.overview}</p>
        </div>

        <button
          onClick={() => navigateTo('details', currentMovie)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shrink-0 active:scale-95 transition-all border border-white/10"
        >
          <Info className="w-4 h-4" />
          <span>كل تفاصيل العمل وطاقم التمثيل</span>
        </button>
      </div>

      {/* Full Episodes Selector for TV Series */}
      {currentMovie.episodes && currentMovie.episodes.length > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-[#e50914]" />
              <h3 className="text-base sm:text-lg font-black text-white">قائمة الحلقات الكاملة والمواسم ({currentMovie.episodes.length} حلقات)</h3>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              الموسم الأول HD
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentMovie.episodes.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => {
                  showToast(`جاري تشغيل ${ep.title}...`);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 group ${
                  idx === 0
                    ? 'bg-[#e50914]/20 border-[#e50914] text-white ring-2 ring-[#e50914]/40 shadow-lg'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-black/40 text-amber-400">
                    {ep.duration}
                  </span>
                  <span className={`text-xs font-black ${idx === 0 ? 'text-[#ff4757]' : 'text-gray-400'}`}>
                    {idx === 0 ? 'جاري العرض الآن ▶' : `حلقة ${ep.number}`}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black line-clamp-1 group-hover:text-[#e50914] transition-colors">{ep.title}</h4>
                  <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{ep.overview}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Up Next / Related Movies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#e50914]" />
            أعمال مقترحة ومشابهة لهذا العرض ({relatedMovies.length} أعمال)
          </h3>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {currentMovie.genres?.[0] || 'سينما مختارة'} • 4K
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {relatedMovies.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>

      {/* NEW FEATURE 4: BINGE-WATCH TRACKER & CINEPHILE BADGES MODAL */}
      {isBingeStatsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">سجل الإنجاز والتطور السينمائي 📊</h3>
                  <span className="text-xs text-emerald-400 font-bold block">مستكشف حاسبة الإدمان والأوسمة</span>
                </div>
              </div>
              <button
                onClick={() => setIsBingeStatsOpen(false)}
                className="p-2 rounded-xl bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <span className="text-gray-400 text-[10px] font-bold block">إجمالي المشاهدة</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                  {(totalWatchMinutes / 60).toFixed(1)} <span className="text-xs font-normal">ساعة</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <span className="text-gray-400 text-[10px] font-bold block">السلسلة المتتالية</span>
                <span className="text-lg sm:text-xl font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{streakDays} أيام</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <span className="text-gray-400 text-[10px] font-bold block">رتبة المشاهد</span>
                <span className="text-xs font-black text-purple-300 block truncate">
                  سينمائي ماسي 💎
                </span>
              </div>
            </div>

            {/* Unlockable Badges Showcase */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>أوسمة الشرف السينمائية المكتسبة:</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: '🏆 سينمائي عريق', desc: 'مشاهدة أكثر من 50 عمل سينمائي 4K', unlocked: true, color: 'from-amber-500 to-yellow-600' },
                  { title: '⚡ ماراثون السهر', desc: 'استمرار المشاهدة 4 ساعات متتالية', unlocked: true, color: 'from-purple-600 to-indigo-600' },
                  { title: '🔥 عاشق الأكشن', desc: 'إكمال 15 فيلم أكشن وإثارة', unlocked: true, color: 'from-red-600 to-orange-600' },
                  { title: '💎 مكتشف السينما 8K', desc: 'تجربة تقنيات IMAX وتخطي المقدمة', unlocked: true, color: 'from-emerald-500 to-teal-600' }
                ].map((badge, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 hover:border-emerald-500/40 transition-all">
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${badge.color} text-white shadow shrink-0`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-white">{badge.title}</h5>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">التقدم نحو الرتبة التالية (أسطورة FilmMax 👑)</span>
                <span className="font-mono text-emerald-400 font-black">78%</span>
              </div>
              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full w-[78%] animate-pulse" />
              </div>
            </div>

            <button
              onClick={() => setIsBingeStatsOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all active:scale-95"
            >
              إغلاق وحفظ الإنجاز
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

