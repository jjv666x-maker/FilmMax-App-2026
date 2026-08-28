import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovieCard } from './MovieCard';
import {
  Play,
  Heart,
  Share2,
  Download,
  Star,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  MessageCircle,
  ShieldCheck,
  Check,
  Film,
  Award,
  Volume2,
  Tv,
  CheckCircle2,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const MovieDetailsView: React.FC = () => {
  const {
    activeMovie,
    movies,
    navigateTo,
    isFavorite,
    toggleFavorite,
    addDownload,
    setIsShareModalOpen,
    setShareTargetMovie,
    showToast,
    setIsTVRemoteOpen
  } = useApp();

  const currentMovie = activeMovie || movies[0];
  const favorite = isFavorite(currentMovie.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'specs' | 'reviews'>('overview');
  const [userRating, setUserRating] = useState<number>(5);
  const [newReview, setNewReview] = useState<string>('');
  const [reviewsList, setReviewsList] = useState<Array<{ id: string; author: string; text: string; rating: number; date: string }>>([
    {
      id: 'rev-1',
      author: 'علي المهندس (ناقد معتمد VIP)',
      text: 'تحفة سينمائية خالدة، الإخراج والموسيقى التصويرية تأخذك إلى عالم آخر تماماً! أنصح الجميع بمشاهدته بدقة 4K.',
      rating: 5,
      date: 'اليوم'
    },
    {
      id: 'rev-2',
      author: 'مريم الصالح',
      text: 'القصة محبوكة بذكاء شديد والمؤثرات البصرية مذهلة، فيلم يستحق العلامة الكاملة بجدارة وأداء الممثلين استثنائي.',
      rating: 5,
      date: 'منذ يومين'
    },
    {
      id: 'rev-3',
      author: 'حيدر الكرخي',
      text: 'تسلسل الأحداث مشوق جداً والنهاية غير متوقعة تماماً. من أفضل ما شاهدت هذا العام على المنصة.',
      rating: 4.8,
      date: 'منذ 4 أيام'
    }
  ]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    const item = {
      id: `rev-${Date.now()}`,
      author: 'أنت (مشترك VIP)',
      text: newReview.trim(),
      rating: userRating,
      date: 'الآن'
    };
    setReviewsList([item, ...reviewsList]);
    setNewReview('');
    showToast('تمت إضافة تقييمك ورأيك بنجاح ⭐');
  };

  const similarMovies = movies.filter(m => m.id !== currentMovie.id).slice(0, 6);

  // Cast members fallback with realistic movie figures
  const castList = currentMovie.cast && currentMovie.cast.length > 0
    ? currentMovie.cast
    : [
        { name: 'كريستوفر نولان', role: 'المخرج والمنتج' },
        { name: 'هانز زيمر', role: 'المؤلف الموسيقي' },
        { name: 'كيليان مورفي', role: 'البطولة الرئيسية' },
        { name: 'إميلي بلنت', role: 'البطولة النسائية' },
        { name: 'مات ديمون', role: 'شخصية قيادية' },
        { name: 'روبرت داوني جونيور', role: 'دور متميز' }
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10 active:scale-95 transition-all text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </button>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Cinematic Hero Backdrop Header */}
      <div className="relative min-h-[350px] sm:min-h-[460px] md:min-h-[520px] rounded-3xl overflow-hidden glass-card border border-white/10 p-4 sm:p-8 md:p-10 flex flex-col justify-end shadow-2xl">
        <img
          src={currentMovie.backdrop || currentMovie.poster}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] transform scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090d]/95 via-black/40 to-transparent" />

        {/* Content Details */}
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#e50914] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
              {currentMovie.type}
            </span>

            <span className="bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-400 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {currentMovie.rating} / 10
            </span>

            <span className="text-emerald-400 font-black text-xs bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/25">
              {currentMovie.matchScore || 98}% نسبة التوصية
            </span>

            <span className="bg-black/60 text-gray-300 text-xs px-2.5 py-1 rounded-lg border border-white/10">
              {currentMovie.year}
            </span>

            <span className="bg-black/60 text-gray-300 text-xs px-2.5 py-1 rounded-lg border border-white/10">
              {currentMovie.duration || '2h 15m'}
            </span>

            <span className="bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black px-2.5 py-1 rounded-lg">
              {currentMovie.quality || '4K Ultra HDR'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-300 font-medium">
            <span className="text-gray-400">التصنيف:</span>
            {currentMovie.genres?.map(g => (
              <span key={g} className="bg-white/10 px-2.5 py-0.5 rounded-lg text-white font-bold border border-white/5">
                {g}
              </span>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl font-normal drop-shadow">
            {currentMovie.overview}
          </p>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {/* Play Button */}
            <button
              onClick={() => navigateTo('player', currentMovie)}
              className="flex items-center justify-center gap-2 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all col-span-2 sm:col-span-1"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>مشاهدة الفيلم</span>
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(currentMovie.id)}
              className={`flex items-center justify-center gap-2 font-bold text-xs py-3 px-4 rounded-xl backdrop-blur-md border active:scale-95 transition-all ${
                favorite
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
              <span>{favorite ? 'في قائمتك' : 'أضف لقائمتي'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={() => addDownload(currentMovie, currentMovie.quality || '1080p FHD')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs py-3 px-4 rounded-xl active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>تحميل أوفلاين</span>
            </button>

            {/* TV Remote Button */}
            <button
              onClick={() => setIsTVRemoteOpen(true)}
              className="flex items-center justify-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs py-3 px-4 rounded-xl active:scale-95 transition-all"
              title="البث المباشر والتحكم بالتلفاز"
            >
              <Tv className="w-4 h-4 text-indigo-400" />
              <span>بث TV 📺</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                setShareTargetMovie(currentMovie);
                setIsShareModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs py-3 px-4 rounded-xl active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ratings & Critical Consensus Strip */}
      <div className="glass-card p-4 sm:p-5 rounded-3xl border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-[11px] text-gray-400 block mb-1">تقييم TMDB العالمي</span>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-lg">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{currentMovie.rating} / 10</span>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-[11px] text-gray-400 block mb-1">تقييم مجتمع FilmMax</span>
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-lg">
            <TrendingUp className="w-5 h-5" />
            <span>97% إيجابي</span>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-[11px] text-gray-400 block mb-1">دقة العرض والصوت</span>
          <div className="flex items-center justify-center gap-1 text-white font-black text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <span>4K Atmos</span>
          </div>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <span className="text-[11px] text-gray-400 block mb-1">الرقابة والتصنيف</span>
          <div className="flex items-center justify-center gap-1 text-teal-400 font-black text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>{currentMovie.ageRating || '16+ مسموح'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#e50914] text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          نظرة عامة والقصة
        </button>

        <button
          onClick={() => setActiveTab('cast')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeTab === 'cast'
              ? 'bg-[#e50914] text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          طاقم التمثيل والنجوم
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeTab === 'specs'
              ? 'bg-[#e50914] text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          المواصفات التقنية والترجمة
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-[#e50914] text-white shadow-md'
              : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          آراء المشاهدين والتقييمات ({reviewsList.length})
        </button>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-[#e50914]" />
            <span>تفاصيل العمل والإنتاج</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-gray-400 block text-[11px] mb-1">سنة الإنتاج:</span>
              <span className="text-white font-bold text-sm">{currentMovie.year}</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-gray-400 block text-[11px] mb-1">الفئة العمرية:</span>
              <span className="text-white font-bold text-sm">{currentMovie.ageRating || '16+'}</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-gray-400 block text-[11px] mb-1">جودة البث:</span>
              <span className="text-amber-400 font-bold text-sm">{currentMovie.quality || '4K HDR'}</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-gray-400 block text-[11px] mb-1">الصوت والترجمة:</span>
              <span className="text-white font-bold text-sm">عربي + إنجليزي 5.1</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <h4 className="text-sm font-bold text-white">القصة والأحداث:</h4>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              {currentMovie.overview}
            </p>
          </div>
        </div>
      )}

      {/* Tab Content: Cast */}
      {activeTab === 'cast' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            <span>صناع العمل ونجوم البطولة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {castList.map((c, i) => (
              <div key={i} className="p-3.5 bg-[#121620] rounded-2xl border border-white/5 flex items-center gap-3.5 shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e50914]/30 to-purple-600/30 border border-[#e50914]/40 flex items-center justify-center font-black text-base text-white shrink-0 shadow-inner">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-black text-white block truncate">{c.name}</span>
                  <span className="text-[11px] text-gray-400 block truncate mt-0.5">{c.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Technical Specs */}
      {activeTab === 'specs' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl text-xs">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-blue-400" />
            <span>المواصفات التقنية وتجهيزات العرض</span>
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 bg-[#121620] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400">ترميز الفيديو (Video Codec):</span>
              <span className="text-white font-bold">H.265 / HEVC 10-Bit Ultra HD</span>
            </div>
            <div className="p-3 bg-[#121620] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400">تنسيق الصوت (Audio Format):</span>
              <span className="text-emerald-400 font-bold">Dolby Digital Plus 5.1 / Dolby Atmos</span>
            </div>
            <div className="p-3 bg-[#121620] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400">الترجمة واللغات المتاحة:</span>
              <span className="text-white font-bold">العربية (رسمية)، الإنجليزية، الفرنسية، الألمانية</span>
            </div>
            <div className="p-3 bg-[#121620] rounded-xl flex justify-between items-center border border-white/5">
              <span className="text-gray-400">نسبة التباين والألوان:</span>
              <span className="text-amber-400 font-bold">HDR10+ / Dolby Vision</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Reviews */}
      {activeTab === 'reviews' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6 shadow-xl">
          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="p-4 bg-white/5 rounded-2xl space-y-3 border border-white/5">
            <h4 className="text-xs font-black text-white">أضف تقييمك ورأيك في العمل:</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400' : 'text-gray-600'}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 mr-2">{userRating} / 5 نجوم</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
                placeholder="اكتب انطباعك عن العمل ومستوى التمثيل والإخراج..."
                className="flex-1 bg-[#121620] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#e50914]"
              />
              <button
                type="submit"
                className="bg-[#e50914] text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-[#ff1f2d] active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-[#e50914]/30 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>نشر التقييم</span>
              </button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviewsList.map(rev => (
              <div key={rev.id} className="p-4 bg-[#121620] rounded-2xl border border-white/5 space-y-2 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rev.author}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-black">{rev.rating}/5</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{rev.text}</p>
                <span className="text-[10px] text-gray-500 block">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e50914]" />
          <span>أعمال مشابهة قد تعجبك</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {similarMovies.map(m => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </div>
    </div>
  );
};

