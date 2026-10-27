import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MovieCard } from './MovieCard';
import { Bookmark, Play, Clock, ArrowUpDown, Heart, Film, Tv, Trash2, Download, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const MyListView: React.FC = () => {
  const {
    favorites,
    movies,
    navigateTo,
    toggleFavorite,
    watchHistory,
    clearWatchHistory,
    downloads,
    playDownloadedMovie,
    removeDownload,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series' | 'downloads'>('all');
  const [isNewestFirst, setIsNewestFirst] = useState<boolean>(true);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState<boolean>(false);

  // Favorite movies
  const favMovies = movies.filter(m => favorites.includes(m.id));

  // Filtered
  const filteredFavorites = favMovies.filter(m => {
    if (activeTab === 'movies') return m.type === 'فيلم';
    if (activeTab === 'series') return m.type === 'مسلسل';
    return true;
  });

  const sortedFavorites = isNewestFirst ? [...filteredFavorites] : [...filteredFavorites].reverse();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 relative overflow-hidden flex items-center justify-between shadow-2xl">
        <div className="relative z-10 space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight">
            قائمتي ومتابعاتي
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 max-w-md">
            كل الأفلام والمسلسلات التي حفظتها مع استكمال المشاهدة من آخر ثانية
          </p>
        </div>

        <div className="relative z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#e50914] to-[#7f060b] text-white flex items-center justify-center shadow-xl border border-[#ff3b49] shrink-0">
          <Bookmark className="w-5 h-5 sm:w-7 sm:h-7 fill-white" />
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#e50914]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#121620] p-1.5 rounded-2xl border border-white/10 shadow-inner flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'all'
              ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          كل المحتوى ({favMovies.length})
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'movies'
              ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          أفلام ({favMovies.filter(m => m.type === 'فيلم').length})
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'series'
              ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          مسلسلات ({favMovies.filter(m => m.type === 'مسلسل').length})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex-1 min-w-[70px] py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'downloads'
              ? 'bg-[#e50914] text-white shadow-md shadow-[#e50914]/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>أوفلاين ({downloads.length})</span>
        </button>
      </div>

      {/* Continue Watching Section (only shown when not on downloads-only tab) */}
      {activeTab !== 'downloads' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e50914]" />
              <h2 className="text-base sm:text-lg font-black text-white">أكمل المشاهدة</h2>
            </div>
            {watchHistory.length > 0 && (
              <div>
                {showClearHistoryConfirm ? (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-xl">
                    <span className="text-[11px] text-red-300 font-bold">تأكيد المسح؟</span>
                    <button
                      onClick={() => {
                        clearWatchHistory();
                        setShowClearHistoryConfirm(false);
                      }}
                      className="text-[11px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded-md"
                    >
                      نعم
                    </button>
                    <button
                      onClick={() => setShowClearHistoryConfirm(false)}
                      className="text-[11px] bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-0.5 rounded-md"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearHistoryConfirm(true)}
                    className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                    title="مسح السجل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح السجل</span>
                  </button>
                )}
              </div>
            )}
          </div>

        {watchHistory.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-2.5 sm:gap-3">
            {watchHistory.slice(0, 3).map((item, idx) => (
              <div
                key={`history-${item.movie.id}-${idx}`}
                onClick={() => navigateTo('player', item.movie)}
                className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-900 shadow">
                  <img
                    src={item.movie.poster}
                    alt={item.movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-white text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#e50914] transition-colors">
                    {item.movie.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {item.movie.type} • {item.lastTime}
                  </span>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-[#e50914] rounded-full"
                        style={{ width: `${item.watchedPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-[#e50914]">{item.watchedPct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-6 rounded-2xl text-center text-gray-400 text-xs border border-white/5">
            لا توجد أعمال قيد المشاهدة حالياً. ابدأ بمشاهدة فيلم أو مسلسل ليظهر هنا!
          </div>
        )}
      </section>
      )}

      {/* Content Section: Downloads or Saved Items */}
      {activeTab === 'downloads' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-black text-white">العروض المحمّلة أوفلاين (جاهزة بدون إنترنت)</h2>
            </div>
            <span className="text-xs bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-3 py-1 rounded-lg font-bold">
              {downloads.length} أعمال جاهزة
            </span>
          </div>

          {downloads.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-2.5 sm:gap-3">
              {downloads.map(item => (
                <div
                  key={item.id}
                  onClick={() => playDownloadedMovie(item)}
                  className="glass-card p-3 rounded-2xl border border-white/10 flex items-center gap-3.5 cursor-pointer group hover:border-emerald-500/40 transition-colors"
                >
                  <div className="relative w-16 h-22 sm:w-20 sm:h-26 rounded-xl overflow-hidden shrink-0 bg-gray-900 shadow-md">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold mb-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{item.quality}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-1 font-normal">
                      تشغيل فوري في المشغل أوفلاين بدون استهلاك بيانات
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDownload(item.id);
                    }}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 active:scale-90 transition-all shrink-0"
                    title="حذف من التنزيلات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-white/5">
              <Download className="w-10 h-10 text-gray-500 mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-gray-300">لا توجد تنزيلات أوفلاين حالياً</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                يمكنك الضغط على زر "تحميل أوفلاين" في أي فيلم أو مسلسل لمشاهدته في أي وقت بدون إنترنت
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="bg-[#e50914] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-[#ff1f2d] transition-all"
              >
                تصفح قائمتك للتحميل
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Saved Items Section */
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-black text-white">المحفوظات وقائمتي</h2>
            </div>

            <button
              onClick={() => setIsNewestFirst(!isNewestFirst)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{isNewestFirst ? 'الأحدث أولاً' : 'الأقدم أولاً'}</span>
            </button>
          </div>

          {sortedFavorites.length > 0 ? (
            <div className="auto-grid-movies">
              {sortedFavorites.map(movie => (
                <MovieCard key={`fav-${movie.id}`} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-white/5">
              <Bookmark className="w-10 h-10 text-gray-500 mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-gray-300">قائمتك فارغة حالياً</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                تصفح الأفلام والمسلسلات واضغط على أيقونة القلب لإضافتها إلى قائمتك الخاصة
              </p>
              <button
                onClick={() => navigateTo('home')}
                className="bg-[#e50914] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-[#ff1f2d] transition-all"
              >
                استكشف الأفلام والمسلسلات
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
