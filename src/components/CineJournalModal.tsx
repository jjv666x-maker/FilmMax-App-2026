import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Movie } from '../types';
import {
  BookOpen,
  Star,
  PenTool,
  Download,
  Share2,
  Sparkles,
  Check,
  Copy,
  X,
  Heart,
  Flame,
  Camera,
  Calendar,
  Film,
  Award
} from 'lucide-react';

const MOOD_OPTIONS = [
  { id: 'mindblown', emoji: '🤯', label: 'صدمة وعبقرية' },
  { id: 'masterpiece', emoji: '🏆', label: 'تحفة سينمائية' },
  { id: 'emotional', emoji: '🥹', label: 'مؤثر ويبكي' },
  { id: 'adrenaline', emoji: '⚡', label: 'حماس وأكشن' },
  { id: 'chill', emoji: '🍿', label: 'سهرة ممتعة' },
  { id: 'scary', emoji: '😱', label: 'رعب وتوتر' }
];

export const CineJournalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { movies, showToast, userProfile } = useApp();
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0] || {
    id: 'sample',
    title: 'Interstellar',
    rating: 8.7,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    type: 'فيلم',
    year: '2014',
    videoUrl: '',
    overview: '',
    genres: ['خيال علمي', 'مغامرة']
  });

  const [userRating, setUserRating] = useState<number>(5);
  const [selectedMood, setSelectedMood] = useState<string>('masterpiece');
  const [favoriteQuote, setFavoriteQuote] = useState<string>('تجربة سينمائية لا تُنسى هزت وجداني وغيرت نظرتي للكون والزمن.');
  const [reviewNote, setReviewNote] = useState<string>('الإخراج والموسيقى التصويرية والأداء التمثيلي في قمة الإتقان والإبهار.');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMovies = searchQuery.trim()
    ? movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies.slice(0, 8);

  const currentMoodObj = MOOD_OPTIONS.find(m => m.id === selectedMood) || MOOD_OPTIONS[1];

  const handleCopyCardText = () => {
    const textToCopy = `🎬 مذكرة مشاهدة سينمائية من تطبيق FilmMax VIP\n\nالعمل: ${selectedMovie.title} (${selectedMovie.year})\nالتقييم: ${'⭐'.repeat(userRating)}\nالشعور: ${currentMoodObj.emoji} ${currentMoodObj.label}\n\nالاقتباس المفضل:\n"${favoriteQuote}"\n\nالانطباع:\n${reviewNote}\n\nالمشاهد: ${userProfile.name} 🍿✨`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast('✨ تم نسخ نص بطاقة المراجعة بنجاح لمشاركتها كمنشور أو ستوري!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadCard = () => {
    showToast('📸 جاري تجهيز وتحميل بطاقة الستوري السينمائية بجودة HD...');
    setTimeout(() => {
      showToast('🎉 تم حفظ بطاقة ذكريات الفيلم بنجاح في جهازك!');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        id="cine-journal-modal"
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0d1117] border border-white/15 rounded-3xl shadow-2xl flex flex-col text-right text-white"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">مذكرة الذكريات السينمائية وبطاقات الستوري</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  CineJournal VIP 🌟
                </span>
              </div>
              <p className="text-xs text-gray-400">وثّق مشاعرك وتقييمك وشارك بطاقة فخمة لأي فيلم تشاهده</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left is Live Story Card Preview, Right is Customizer Form */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls & Customizer (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Pick Movie from library */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-purple-400" />
                <span>اختر الفيلم أو المسلسل للتوثيق:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن فيلم من مكتبتك..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {filteredMovies.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className={`flex-shrink-0 flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedMovie.id === movie.id
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <img src={movie.poster} alt="" className="w-6 h-8 rounded-lg object-cover" />
                    <span className="truncate max-w-[100px]">{movie.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Star Rating (1 to 5) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>تقييمك الشخصي:</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`p-2 rounded-xl border transition-all ${
                      userRating >= star
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 scale-105'
                        : 'bg-white/5 border-white/5 text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="text-xs font-black text-amber-300 mr-2">
                  {userRating === 5 ? 'تحفة فنية أسطورية 10/10' : userRating === 4 ? 'رائع جداً ويستحق المشاهدة' : userRating === 3 ? 'جيد وممتع' : 'متوسط'}
                </span>
              </div>
            </div>

            {/* 3. Mood Badges */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>الشعور العام أثناء العرض:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedMood === mood.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400 shadow-md'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-base">{mood.emoji}</span>
                    <span className="truncate">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Quote / Review */}
            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-indigo-400" />
                <span>اقتباس أو جملة أثرت بك:</span>
              </label>
              <input
                type="text"
                value={favoriteQuote}
                onChange={(e) => setFavoriteQuote(e.target.value)}
                placeholder="اكتب عبارة مشهورة من الفيلم..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-400" />
                <span>انطباعك ومراجعتك السريعة:</span>
              </label>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={2}
                placeholder="ما الذي جعلك تعجب بهذا العمل تحديداً؟"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Story Card Live Preview (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between space-y-4">
            <div
              ref={cardPreviewRef}
              className="relative w-full max-w-[320px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 p-5 flex flex-col justify-between text-right bg-gradient-to-b from-[#181126] via-[#0f0c1b] to-black"
            >
              {/* Background Poster Ambience */}
              <img
                src={selectedMovie.poster}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

              {/* Card Top Brand & Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#e50914] to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                    FM
                  </div>
                  <span className="text-xs font-black tracking-wider text-white">FilmMax VIP</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {currentMoodObj.emoji} {currentMoodObj.label}
                </span>
              </div>

              {/* Card Center Movie Details */}
              <div className="relative z-10 space-y-3 my-auto">
                <div className="w-24 h-36 mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
                  <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-full h-full object-cover" />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-white leading-tight">
                    {selectedMovie.title}
                  </h3>
                  <span className="text-[11px] text-gray-400 block font-medium">
                    {selectedMovie.type} • {selectedMovie.year}
                  </span>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 text-amber-400 py-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < userRating ? 'fill-current text-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote Box */}
                {favoriteQuote && (
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                    <p className="text-[10px] text-amber-200 italic font-medium">
                      «{favoriteQuote}»
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer User Profile Sign */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-black">
                    {userProfile.name.slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">{userProfile.name}</span>
                    <span className="text-[9px] text-purple-300 block">ناقد سينمائي موثق</span>
                  </div>
                </div>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="w-full max-w-[320px] flex items-center gap-2">
              <button
                onClick={handleCopyCardText}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={handleDownloadCard}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>حفظ كـ Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
