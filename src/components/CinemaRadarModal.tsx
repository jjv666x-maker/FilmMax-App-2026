import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Timer,
  Calendar,
  Bell,
  BellRing,
  Flame,
  Play,
  Check,
  Sparkles,
  Ticket,
  Share2,
  X,
  Clock,
  Film,
  Star,
  Tv
} from 'lucide-react';

interface UpcomingMovie {
  id: string;
  title: string;
  originalTitle: string;
  releaseDate: string; // ISO date format
  daysLeft: number;
  backdrop: string;
  poster: string;
  director: string;
  genres: string[];
  cast: string[];
  hypePercent: number;
  hypeVotes: number;
  description: string;
  formats: string[];
  trailerYoutubeKey?: string;
  isPremieringSoon?: boolean;
}

const UPCOMING_PREMIERES: UpcomingMovie[] = [
  {
    id: 'up-1',
    title: 'كثيب: الجزء الثالث (مسيح كثيب)',
    originalTitle: 'Dune: Messiah (Part Three)',
    releaseDate: '2026-11-18',
    daysLeft: 82,
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    director: 'دينيس فيلنوف',
    genres: ['خيال علمي', 'مغامرة', 'ملحمي'],
    cast: ['تيموثي شالاماي', 'زيندايا', 'فلورنس بيو'],
    hypePercent: 98,
    hypeVotes: 14200,
    description: 'الفصل الختامي الأسطوري لملحمة كوكب آراكيس، حيث يواجه بول أتريدس مصيره كإمبراطور للكون وتبعات ثورته المجرية.',
    formats: ['IMAX 70mm', 'Dolby Cinema', '4DX', 'HDR10+'],
    trailerYoutubeKey: 'Way9Dexny3w',
    isPremieringSoon: true
  },
  {
    id: 'up-2',
    title: 'أفاتار: النار والرماد',
    originalTitle: 'Avatar: Fire and Ash',
    releaseDate: '2026-12-19',
    daysLeft: 114,
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    director: 'جيمس كاميرون',
    genres: ['مغامرة', 'خيال علمي', 'فانتازيا'],
    cast: ['سام ورذينجتن', 'زوي سالدانا', 'ميشيل يوه'],
    hypePercent: 96,
    hypeVotes: 19850,
    description: 'عودة إلى كوكب باندورا لاكتشاف قبيلة رماد النافي العدائية وثقافتها البركانية الغامضة بتقنيات بصرية غير مسبوقة.',
    formats: ['RealD 3D', 'IMAX Laser', 'HFR 48fps'],
    trailerYoutubeKey: 'd9MyW72ELq0',
    isPremieringSoon: false
  },
  {
    id: 'up-3',
    title: 'المنتقمون: الحروب السرية',
    originalTitle: 'Avengers: Secret Wars',
    releaseDate: '2027-05-07',
    daysLeft: 252,
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&auto=format&fit=crop&q=80',
    director: 'الأخوان روسو',
    genres: ['أكشن', 'أبطال خارقين', 'خيال علمي'],
    cast: ['روبرت داوني جونيور (دكتور دوم)', 'توم هولاند', 'بنديكت كمبرباتش'],
    hypePercent: 99,
    hypeVotes: 32400,
    description: 'الحدث السينمائي الأضخم في تاريخ مارفل: اصطدام الأكوان المتعددة وظهور دكتور دوم لحكم عالم المعارك الأخير.',
    formats: ['IMAX Exclusive Aspect Ratio', 'Dolby Atmos'],
    trailerYoutubeKey: 'hA6hldpST08',
    isPremieringSoon: false
  },
  {
    id: 'up-4',
    title: 'ذا باتمان: الجزء الثاني',
    originalTitle: 'The Batman Part II',
    releaseDate: '2026-10-02',
    daysLeft: 36,
    backdrop: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600&auto=format&fit=crop&q=80',
    director: 'مات ريفز',
    genres: ['جريمة', 'غموض', 'نوار نوار'],
    cast: ['روبرت باتينسون', 'كولين فاريل', 'آندي سركيس'],
    hypePercent: 94,
    hypeVotes: 11200,
    description: 'مدينة غوثام الغارقة تحت الثلوج والمكائد، ومواجهة باتمان لأعداء جدد في أعمق وأظلم تحقيق بوليسي في مسيرته.',
    formats: ['IMAX 70mm Film', 'Dolby Cinema'],
    trailerYoutubeKey: 'mqqft2x_Aa4',
    isPremieringSoon: true
  }
];

export const CinemaRadarModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [selectedMovie, setSelectedMovie] = useState<UpcomingMovie>(UPCOMING_PREMIERES[0]);
  const [reminders, setReminders] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('filmmax_radar_reminders');
      return saved ? JSON.parse(saved) : { 'up-1': true };
    } catch {
      return { 'up-1': true };
    }
  });
  const [votedHype, setVotedHype] = useState<Record<string, boolean>>({});
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);

  // Live real-time seconds countdown
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(selectedMovie.releaseDate).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, target - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedMovie]);

  const toggleReminder = (id: string, title: string) => {
    const nextState = !reminders[id];
    const updated = { ...reminders, [id]: nextState };
    setReminders(updated);
    try {
      localStorage.setItem('filmmax_radar_reminders', JSON.stringify(updated));
    } catch {}

    if (nextState) {
      showToast(`🔔 تم تفعيل تذكير العرض الأول لفيلم: ${title}`);
    } else {
      showToast(`تم إلغاء التذكير لفيلم: ${title}`);
    }
  };

  const handleVoteHype = (id: string) => {
    if (votedHype[id]) return;
    setVotedHype({ ...votedHype, [id]: true });
    showToast('🔥 شكراً لتصويتك! تم رفع مؤشر الحماس العالمي للفيلم.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        id="cinema-radar-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0f121a] border border-white/15 rounded-3xl shadow-2xl flex flex-col text-right text-white"
      >
        {/* Top Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#0f121a]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#e50914] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-red-500/25 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">رادار عروض السينما العالمية</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  مباشر
                </span>
              </div>
              <p className="text-xs text-gray-400">تتبع مواعيد الإطلاق الرسمية والعد التنازلي الحصري</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Movie Feature Hero */}
        <div className="relative min-h-[300px] sm:min-h-[340px] flex flex-col justify-end p-5 sm:p-8 overflow-hidden">
          {/* Backdrop Image */}
          <img
            src={selectedMovie.backdrop}
            alt={selectedMovie.title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f121a] via-[#0f121a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f121a]/90 via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                تاريخ الإطلاق: {selectedMovie.releaseDate}
              </span>
              {selectedMovie.formats.map((fmt, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 backdrop-blur-md text-gray-200 border border-white/10">
                  {fmt}
                </span>
              ))}
            </div>

            <div>
              <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                {selectedMovie.title}
              </h1>
              <span className="text-xs sm:text-sm text-gray-300/80 font-medium block mt-0.5">
                {selectedMovie.originalTitle} • إخراج {selectedMovie.director}
              </span>
            </div>

            {/* Countdown Box */}
            <div className="inline-flex items-center gap-2 sm:gap-3 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center gap-1 text-[#e50914] font-black text-xs px-1">
                <Timer className="w-4 h-4 animate-spin-slow" />
                <span>العد التنازلي:</span>
              </div>
              <div className="flex items-center gap-2 text-center font-mono">
                <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-base sm:text-lg font-black text-white block">{timeLeft.days}</span>
                  <span className="text-[9px] text-gray-400 block font-sans">يوم</span>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-base sm:text-lg font-black text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 block font-sans">ساعة</span>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/10">
                  <span className="text-base sm:text-lg font-black text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] text-gray-400 block font-sans">دقيقة</span>
                </div>
                <span className="text-gray-500 font-bold">:</span>
                <div className="bg-red-500/20 px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400">
                  <span className="text-base sm:text-lg font-black block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] text-red-300 block font-sans">ثانية</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => toggleReminder(selectedMovie.id, selectedMovie.title)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  reminders[selectedMovie.id]
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-[#e50914] hover:bg-red-700 text-white shadow-lg shadow-red-600/30'
                }`}
              >
                {reminders[selectedMovie.id] ? (
                  <>
                    <BellRing className="w-4 h-4" />
                    <span>تم ضبط التذكير (مفعل 🔔)</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>ذكرني فور توفر العرض</span>
                  </>
                )}
              </button>

              {selectedMovie.trailerYoutubeKey && (
                <button
                  onClick={() => setActiveTrailerKey(selectedMovie.trailerYoutubeKey!)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center gap-2 backdrop-blur-md transition-all"
                >
                  <Play className="w-4 h-4 fill-current text-amber-400" />
                  <span>مشاهدة الإعلان الرسمي</span>
                </button>
              )}

              <button
                onClick={() => handleVoteHype(selectedMovie.id)}
                disabled={votedHype[selectedMovie.id]}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                  votedHype[selectedMovie.id]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 hover:text-white'
                }`}
              >
                <Flame className={`w-4 h-4 ${votedHype[selectedMovie.id] ? 'text-amber-400 fill-current' : 'text-gray-400'}`} />
                <span>حماس {selectedMovie.hypePercent}% ({selectedMovie.hypeVotes + (votedHype[selectedMovie.id] ? 1 : 0)})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trailer Video Player Overlay if opened */}
        {activeTrailerKey && (
          <div className="p-4 bg-black/90 border-y border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" />
                عرض الإعلان الترويجي بدقة فائقة
              </span>
              <button
                onClick={() => setActiveTrailerKey(null)}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-white/10 rounded-lg"
              >
                إغلاق المشغل ✕
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeTrailerKey}?autoplay=1&rel=0`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Horizontal Reel List of Upcoming Titles */}
        <div className="p-5 sm:p-6 space-y-3 bg-[#131722]/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              قائمة أضخم العروض السينمائية المرتقبة
            </h3>
            <span className="text-xs text-gray-400">انقر للتبديل واستعراض العد التنازلي</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {UPCOMING_PREMIERES.map((movie) => {
              const isSelected = selectedMovie.id === movie.id;
              return (
                <div
                  key={movie.id}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setActiveTrailerKey(null);
                  }}
                  className={`relative p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#e50914]/20 to-transparent border-[#e50914] shadow-lg shadow-red-500/20 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-2">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-black text-amber-400 border border-white/10">
                      {movie.daysLeft} يوم
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white truncate">{movie.title}</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{movie.releaseDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
