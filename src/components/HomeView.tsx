import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { MovieCard } from './MovieCard';
import { HorizontalMovieTrack } from './HorizontalMovieTrack';
import { ShuffleModal } from './ShuffleModal';
import { CinemaRadarModal } from './CinemaRadarModal';
import { CinemaBattlesModal } from './CinemaBattlesModal';
import { CineJournalModal } from './CineJournalModal';
import { WorldCinemaMapModal } from './WorldCinemaMapModal';
import {
  Sparkles,
  Flame,
  Star,
  Tv,
  Layers,
  ChevronLeft,
  Clapperboard,
  Film,
  TrendingUp,
  Award,
  Users,
  Bot,
  Trophy,
  Shuffle,
  Smile,
  Cast,
  Play,
  Clock,
  X,
  Radio,
  Swords,
  BookOpen,
  Globe,
  Zap,
  Compass,
  Rocket,
  ShieldAlert,
  Heart
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    movies, 
    groups, 
    setActiveGroup, 
    navigateTo, 
    setIsChatSupportOpen, 
    setIsTVRemoteOpen,
    continueWatching,
    removeFromContinueWatching,
    setActiveMovie,
    loadMoreMovies,
    isLoadingMore
  } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [isShuffleOpen, setIsShuffleOpen] = useState<boolean>(false);
  const [isCinemaRadarOpen, setIsCinemaRadarOpen] = useState<boolean>(false);
  const [isCinemaBattlesOpen, setIsCinemaBattlesOpen] = useState<boolean>(false);
  const [isCineJournalOpen, setIsCineJournalOpen] = useState<boolean>(false);
  const [isWorldMapOpen, setIsWorldMapOpen] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(48);

  const categories = ['الكل', 'أفلام', 'مسلسلات', 'أكشن', 'خيال علمي', 'دراما', 'جريمة', 'رعب', 'عائلي'];

  // Categorize movies with diverse slicing & distinct filtering to prevent repetitive rows
  const trendingMovies = movies.filter(m => m.isTrending || Number(m.rating) >= 8.5);
  const freeMovies = movies.filter(m => m.isFree || [120, 121, 122, 123, 124, 125].includes(Number(m.id)));
  const trailersOnly = movies.filter(m => m.videoType === 'trailer' || m.youtubeKey);
  const seriesList = movies.filter(m => m.type === 'مسلسل');
  const topRatedMovies = [...movies].sort((a, b) => Number(b.rating) - Number(a.rating));
  const actionMovies = movies.filter(m => m.genres?.includes('أكشن') || m.genres?.includes('حركة'));
  const sciFiMovies = movies.filter(m => m.genres?.includes('خيال علمي') || m.genres?.includes('مغامرة'));
  const dramaCrimeMovies = movies.filter(m => m.genres?.includes('دراما') || m.genres?.includes('جريمة'));
  const familyAnimationMovies = movies.filter(m => m.genres?.includes('رسوم متحركة') || m.genres?.includes('عائلي') || m.genres?.includes('أنيميشن') || m.genres?.includes('كوميدي'));
  const documentaryMovies = movies.filter(m => m.genres?.includes('وثائقي') || m.genres?.includes('طبيعة'));
  const filmMaxOriginals = movies.filter(m => m.source === 'pexels' || [122, 124, 120, 125, 9006, 9008, 9004, 9001].includes(Number(m.id)));

  // Category filter
  const filteredCategoryMovies = activeCategory === 'الكل'
    ? movies
    : activeCategory === 'أفلام'
    ? movies.filter(m => m.type === 'فيلم')
    : activeCategory === 'مسلسلات'
    ? movies.filter(m => m.type === 'مسلسل')
    : movies.filter(m => m.genres?.includes(activeCategory));

  return (
    <div className="space-y-8 pb-12">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/25 scale-105'
                : 'bg-[#121620] text-gray-400 hover:text-gray-900 dark:hover:text-white border border-white/5 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Hero Spotlight */}
      <HeroBanner />

      {/* Continue Watching Section */}
      {continueWatching.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">أكمل المشاهدة</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
            {continueWatching.map((item, index) => (
              <div 
                key={`cw-${item.id}-${index}`} 
                className="flex-shrink-0 w-64 group relative cursor-pointer"
                onClick={() => {
                  const movie = movies.find(m => m.id === item.videoId);
                  if (movie) {
                    setActiveMovie(movie);
                    navigateTo('player');
                  }
                }}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                    <div 
                      className="h-full bg-[#e50914] shadow-[0_0_8px_rgba(229,9,20,0.6)]" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="text-xs font-black text-white truncate max-w-[80%]">{item.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromContinueWatching(item.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Smart Cinema Feature Hub - Elegant Horizontal Carousel */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">الميزات السينمائية الحصرية</h2>
              <span className="text-[10px] sm:text-xs text-amber-400 font-bold">تجارب تفاعلية ذكية ✨</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400">مرّر للمزيد ⟵</span>
        </div>

        {/* Smooth Horizontal Scrolling Cards Strip */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth">
          {/* 1. Watch Party */}
          <button
            onClick={() => navigateTo('watchparty')}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e50914]/20 text-[#e50914] flex items-center justify-center shrink-0 group-hover:bg-[#e50914] group-hover:text-white transition-all shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">مشاهدة جماعية</b>
              <span className="text-[10px] text-gray-400 block truncate">Watch Party تفاعلي</span>
            </div>
          </button>

          {/* 2. AI CineBot */}
          <button
            onClick={() => setIsChatSupportOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">مساعد AI السينمائي</b>
              <span className="text-[10px] text-gray-400 block truncate">ترشيحات وشرح نهايات</span>
            </div>
          </button>

          {/* 3. Cinema Trivia */}
          <button
            onClick={() => navigateTo('trivia')}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-all shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">تحديات وتريفيا</b>
              <span className="text-[10px] text-gray-400 block truncate">مسابقات وأوسكار 🏆</span>
            </div>
          </button>

          {/* 4. Smart Shuffle */}
          <button
            onClick={() => setIsShuffleOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-sm">
              <Shuffle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">فاجئني بالقرعة</b>
              <span className="text-[10px] text-gray-400 block truncate">تدوير واختيار ذكي</span>
            </div>
          </button>

          {/* 5. Kids Mode */}
          <button
            onClick={() => navigateTo('kids')}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
              <Smile className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">عالم الأطفال</b>
              <span className="text-[10px] text-gray-400 block truncate">محتوى كرتوني آمن 🎈</span>
            </div>
          </button>

          {/* 6. TV Remote & Cast */}
          <button
            onClick={() => setIsTVRemoteOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
              <Cast className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">بث وتحكم TV</b>
              <span className="text-[10px] text-gray-400 block truncate">ريموت ذكي للشاشة 📺</span>
            </div>
          </button>

          {/* 7. Cinema Premiere Radar & Live Countdown */}
          <button
            onClick={() => setIsCinemaRadarOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e50914] to-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">رادار عروض السينما</b>
              <span className="text-[10px] text-amber-400 block truncate">عد تنازلي وتذكيرات ⏱️</span>
            </div>
          </button>

          {/* 8. Cinema Battles */}
          <button
            onClick={() => setIsCinemaBattlesOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
              <Swords className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">معارك وتصويت السينما</b>
              <span className="text-[10px] text-amber-300 block truncate">نزال أسبوعي ونقاش ⚔️</span>
            </div>
          </button>

          {/* 9. CineJournal & Story Cards */}
          <button
            onClick={() => setIsCineJournalOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">مذكرة الذكريات Story</b>
              <span className="text-[10px] text-purple-300 block truncate">بطاقات مراجعة VIP 🌟</span>
            </div>
          </button>

          {/* 10. World Cinema Map */}
          <button
            onClick={() => setIsWorldMapOpen(true)}
            className="glass-card flex-shrink-0 w-44 sm:w-48 p-3.5 rounded-2xl border border-white/10 hover:border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-transparent flex items-center gap-3 text-right hover:scale-[1.02] active:scale-95 transition-all group shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <b className="text-xs font-black text-white block truncate">خريطة سينما العالم</b>
              <span className="text-[10px] text-cyan-300 block truncate">اكتشف بلدان الأفلام 🌍</span>
            </div>
          </button>
        </div>
      </section>

      {/* Thematic Groups Preview Carousel - Smooth Fluid Horizontal Slider */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#e50914]/15 border border-[#e50914]/30 text-[#e50914]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">المجموعات السينمائية المختارة</h2>
              <p className="text-[11px] text-gray-400">سلاسل وأكوان سينمائية كاملة بجودة فائقة</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('groups')}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-bold transition-colors bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10"
          >
            <span>استعراض الكل ({groups.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Fluid Horizontal Scrolling Row */}
        <div className="relative group/carousel">
          <div className="flex items-center gap-3.5 overflow-x-auto custom-scrollbar pb-3 pt-1 px-1 scroll-smooth snap-x snap-mandatory">
            {groups.map((group, gIdx) => {
              const matchedGroupMovies = movies.filter(m => 
                group.movieIds.some(id => String(id) === String(m.id)) ||
                (group.id === 'trending-now' && (m.isTrending || Number(m.rating) >= 8.5)) ||
                (group.id === 'action-thrill' && m.genres?.includes('أكشن')) ||
                (group.id === 'sci-fi-masterpieces' && (m.genres?.includes('خيال علمي') || m.genres?.includes('مغامرة'))) ||
                (group.id === 'critics-choice' && Number(m.rating) >= 8.6) ||
                (group.id === 'mystery-horror' && (m.genres?.includes('رعب') || m.genres?.includes('غموض') || m.genres?.includes('جريمة'))) ||
                (group.id === 'family-animation' && (m.genres?.includes('عائلي') || m.genres?.includes('رسوم متحركة') || m.genres?.includes('كوميدي'))) ||
                (group.id === 'free-to-watch' && m.isFree) ||
                (group.id === 'originals' && (m.source === 'pexels' || [120, 121, 122, 123, 124, 125].includes(Number(m.id)))) ||
                (group.id === 'documentaries' && (m.genres?.includes('وثائقي') || m.genres?.includes('طبيعة')))
              );
              const sampleMovies = (matchedGroupMovies.length > 0 ? matchedGroupMovies : movies).slice(0, 3);
              return (
                <div
                  key={`group-${group.id}-${gIdx}`}
                  onClick={() => {
                    setActiveGroup(group);
                    navigateTo('groups');
                  }}
                  className="min-w-[200px] sm:min-w-[230px] md:min-w-[250px] snap-start glass-card p-4 rounded-2xl border border-white/10 cursor-pointer group hover:border-[#e50914]/60 transition-all flex flex-col justify-between hover:scale-[1.03] active:scale-95 duration-300 relative overflow-hidden bg-gradient-to-br from-white/[0.07] to-white/[0.02]"
                >
                  {/* Subtle Accent Glow */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#e50914]/15 rounded-full blur-2xl group-hover:bg-[#e50914]/30 transition-all" />

                  {/* 3D Stacked Mini Posters */}
                  <div className="relative h-28 w-full mb-3 flex items-center justify-center">
                    {sampleMovies.map((m, idx) => (
                      <img
                        key={`group-movie-${group.id}-${m.id}-${idx}`}
                        src={m.poster}
                        alt=""
                        className="absolute w-16 h-22 rounded-xl object-cover shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-105"
                        style={{
                          transform:
                            idx === 0
                              ? 'translateX(-16px) rotate(-8deg)'
                              : idx === 2
                              ? 'translateX(16px) rotate(8deg)'
                              : 'translateY(-4px) scale(1.1)',
                          zIndex: idx === 1 ? 3 : idx === 2 ? 2 : 1
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center relative z-10 pt-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#e50914] transition-colors truncate">
                      {group.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                      {group.description || 'أفضل أفلام السلسلة'}
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-300">
                      <Film className="w-3 h-3 text-[#e50914]" />
                      <span>{group.movieIds.length} أعمال كاملة</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtered / Active Category Row */}
      {activeCategory !== 'الكل' && (
        <HorizontalMovieTrack
          title={`أفضل أعمال: ${activeCategory}`}
          subtitle={`تصفح أحدث وأقوى إنتاجات قسم ${activeCategory}`}
          icon={<Film className="w-4 h-4 text-[#e50914]" />}
          badge={`${filteredCategoryMovies.length} أعمال`}
          badgeColor="bg-[#e50914]"
          movies={filteredCategoryMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Trending & Popular Row */}
      <HorizontalMovieTrack
        title="الأكثر رواجاً وإثارة اليوم 🔥"
        subtitle="الأفلام الأكثر مشاهدة وتفاعلاً حول العالم بجودة 4K فائقة"
        icon={<Flame className="w-4 h-4 text-[#e50914]" />}
        badge="HOT"
        badgeColor="bg-[#e50914]"
        movies={trendingMovies}
        onViewMore={() => navigateTo('search')}
      />

      {/* FilmMax Originals - High Premium Row */}
      <HorizontalMovieTrack
        title="إنتاجات FilmMax الأصلية والحصرية 🎬"
        subtitle="أعمال أصلية بتقنيات سينمائية عالمية وترجمة احترافية"
        icon={<Film className="w-4 h-4 text-[#e50914]" />}
        badge="ORIGINALS"
        badgeColor="bg-[#e50914]"
        movies={filmMaxOriginals}
        onViewMore={() => navigateTo('search')}
      />

      {/* Action Cinema Block */}
      {actionMovies.length > 0 && (
        <HorizontalMovieTrack
          title="أقوى أفلام الأكشن والإثارة والمطاردات 💥"
          subtitle="قتالات ملحمية ومطاردات تحبس الأنفاس"
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          badge="ACTION"
          badgeColor="bg-amber-600"
          movies={actionMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Free Movies Section */}
      {freeMovies.length > 0 && (
        <HorizontalMovieTrack
          title="شاهد مجانًا بدون اشتراك 🔓"
          subtitle="أفلام وتريلرات مفتوحة قانونية بجودة عالية"
          icon={<Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />}
          badge="مجاني 100%"
          badgeColor="bg-emerald-600"
          movies={freeMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Sci-Fi & Adventure */}
      {sciFiMovies.length > 0 && (
        <HorizontalMovieTrack
          title="عوالم الخيال العلمي والفضاء 🚀"
          subtitle="رحلات عبر الزمن، أكوان موازية، ومستقبل مجهول"
          icon={<Rocket className="w-4 h-4 text-cyan-400" />}
          badge="SCI-FI"
          badgeColor="bg-cyan-600"
          movies={sciFiMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Stunning Documentaries Row (Wide Cards) */}
      {documentaryMovies.length > 0 && (
        <HorizontalMovieTrack
          title="وثائقيات تأخذك حول كوكب الأرض 🌍"
          subtitle="قصص حقيقية مذهلة بجودة 4K فائقة الوضوح"
          icon={<Layers className="w-4 h-4 text-emerald-400" />}
          badge="4K ULTRA"
          badgeColor="bg-emerald-700"
          movies={documentaryMovies}
          cardType="wide"
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Trailers & Official Clips Section (Wide Cards) */}
      {trailersOnly.length > 0 && (
        <HorizontalMovieTrack
          title="تريلرات ومقتطفات سينمائية رسمية 🎬"
          subtitle="أحدث إعلانات هوليوود والسينما العالمية بدقة صوت وفيديو كاملة"
          icon={<TrendingUp className="w-4 h-4 text-purple-400" />}
          badge="OFFICIAL TRAILERS"
          badgeColor="bg-purple-600"
          movies={trailersOnly}
          cardType="wide"
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Top TV Series Row */}
      {seriesList.length > 0 && (
        <HorizontalMovieTrack
          title="أقوى المسلسلات التلفزيونية والمواسم 📺"
          subtitle="دراما مشوقة وسلاسل تلفزيونية مستمرة بجودة فائقة"
          icon={<Tv className="w-4 h-4 text-indigo-400" />}
          badge="SERIES"
          badgeColor="bg-indigo-600"
          movies={seriesList}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Featured Full Episodes & Seasons Section */}
      <section className="space-y-4 bg-gradient-to-r from-red-950/30 via-[#121622] to-amber-950/20 p-5 sm:p-6 rounded-3xl border border-red-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] flex items-center justify-center shrink-0 shadow-lg">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-white">الحلقات الكاملة والمواسم HD 🎬</h2>
                <span className="bg-[#e50914] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                  حلقات كاملة
                </span>
              </div>
              <p className="text-xs text-gray-300">شاهد كافة حلقات المسلسلات العالمية والمحلية بجودة 4K وبدون تقطيع</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('search')}
            className="text-xs text-amber-400 hover:text-amber-300 font-black flex items-center gap-1 self-start sm:self-auto bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
          >
            <span>استعرض جميع الحلقات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Full Episodes Cards Horizontal Carousel */}
        <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory">
          {seriesList.map((series, sIdx) => {
            const episodes = series.episodes || [];
            return (
              <div
                key={`series-${series.id}-${sIdx}`}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] snap-start glass-card p-4 rounded-2xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-3 group bg-[#0d1017]/80"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={series.poster}
                    alt={series.title}
                    className="w-16 h-24 rounded-xl object-cover border border-white/15 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/20 inline-block">
                      ★ {series.rating} • {series.duration || 'مواسم كاملة'}
                    </span>
                    <h3 className="text-sm font-black text-white truncate group-hover:text-[#e50914] transition-colors">
                      {series.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {series.overview}
                    </p>
                  </div>
                </div>

                {/* Quick Episode Selector List */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-300 block">اختر حلقة لمشاهدتها فوراً:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {episodes.slice(0, 4).map((ep, eIdx) => (
                      <button
                        key={`ep-${series.id}-${ep.id}-${eIdx}`}
                        onClick={() => navigateTo('player', series)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-[#e50914] text-gray-200 hover:text-white border border-white/5 hover:border-[#e50914] text-right transition-all flex items-center justify-between group/ep"
                      >
                        <span className="text-[11px] font-bold truncate">{ep.title.split(':')[0]}</span>
                        <Play className="w-3 h-3 text-red-400 group-hover/ep:text-white shrink-0 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Drama & Crime Masterpieces */}
      {dramaCrimeMovies.length > 0 && (
        <HorizontalMovieTrack
          title="روائع الدراما والجريمة والغموض 🎭"
          subtitle="أفلام نالت جوائز الأوسكار وتقييمات عالمية تاريخية"
          icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
          badge="DRAMA & CRIME"
          badgeColor="bg-rose-700"
          movies={dramaCrimeMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Family & Animation */}
      {familyAnimationMovies.length > 0 && (
        <HorizontalMovieTrack
          title="عالم الرسوم المتحركة والسينما العائلية 🎈"
          subtitle="أفلام ممتعة تناسب جميع أفراد العائلة والأصدقاء"
          icon={<Smile className="w-4 h-4 text-yellow-400" />}
          badge="FAMILY & ANIME"
          badgeColor="bg-amber-500"
          movies={familyAnimationMovies}
          onViewMore={() => navigateTo('search')}
        />
      )}

      {/* Top Rated Masterpieces */}
      <HorizontalMovieTrack
        title="الأعلى تقييماً في تاريخ السينما ⭐"
        subtitle="تحف فنية خالدة من تصنيف IMDb و Rotten Tomatoes"
        icon={<Award className="w-4 h-4 text-amber-400" />}
        badge="TOP RATED"
        badgeColor="bg-amber-500"
        movies={topRatedMovies}
        onViewMore={() => navigateTo('search')}
      />

      {/* Massive Library Explorer - 500+ Horizontal Track Showcase */}
      <section className="space-y-6 pt-12 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121620]/50 p-6 rounded-3xl border border-white/5 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] flex items-center justify-center shadow-xl">
              <Film className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white">استكشف المكتبة الضخمة 🎬</h2>
              <p className="text-sm text-gray-400 font-bold">أكثر من 500+ تريلر وفيلم حقيقي متصل بـ TMDB & YouTube بتمرير أفقي سلس</p>
            </div>
          </div>
        </div>

        {/* Horizontal Infinite Track Showcase */}
        <HorizontalMovieTrack
          title="تصفح كافة أعمال المكتبة الشاملة (أفقي سلس) 🍿"
          subtitle="مرّر بالسحب أو اللمس أو الأسهم لاستكشاف مئات الأفلام"
          icon={<Compass className="w-4 h-4 text-[#e50914]" />}
          badge={`معروض ${Math.min(displayLimit, movies.length)} فيلم`}
          badgeColor="bg-[#e50914]"
          movies={movies.slice(0, displayLimit)}
        />

        <div className="flex flex-col items-center justify-center gap-4 py-10 border-b border-white/5">
          <button 
            onClick={async () => {
              await loadMoreMovies();
              setDisplayLimit(prev => prev + 36);
            }}
            disabled={isLoadingMore}
            className="group relative px-10 py-4 rounded-2xl bg-[#e50914] hover:bg-red-500 text-white font-black text-lg transition-all shadow-2xl shadow-red-900/40 active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-3">
              {isLoadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري جلب المزيد من الأفلام...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-6 h-6 group-hover:translate-y-[-2px] transition-transform" />
                  <span>تحميل دفعة إضافية (+36 فيلم)</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
          
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">
            تصفح أفقي فائق السلاسة • جودة 4K • تحديث مباشر
          </p>
        </div>
      </section>

      {/* Interactive Modals */}
      <ShuffleModal isOpen={isShuffleOpen} onClose={() => setIsShuffleOpen(false)} />
      <CinemaRadarModal isOpen={isCinemaRadarOpen} onClose={() => setIsCinemaRadarOpen(false)} />
      <CinemaBattlesModal isOpen={isCinemaBattlesOpen} onClose={() => setIsCinemaBattlesOpen(false)} />
      <CineJournalModal isOpen={isCineJournalOpen} onClose={() => setIsCineJournalOpen(false)} />
      <WorldCinemaMapModal isOpen={isWorldMapOpen} onClose={() => setIsWorldMapOpen(false)} />
    </div>
  );
};
