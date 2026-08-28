import React from 'react';
import { useApp } from '../context/AppContext';
import { MovieGroup } from '../types';
import { MovieCard } from './MovieCard';
import { Layers, ArrowRight, Play, Sparkles } from 'lucide-react';

export const GroupsView: React.FC = () => {
  const { groups, activeGroup, setActiveGroup, movies, navigateTo } = useApp();

  const currentGroup = activeGroup || groups[0];
  const groupMovies = movies.filter(m => 
    currentGroup.movieIds.some(id => String(id) === String(m.id)) ||
    (currentGroup.id === 'trending-now' && (m.isTrending || Number(m.rating) >= 8.5)) ||
    (currentGroup.id === 'action-thrill' && m.genres?.includes('أكشن')) ||
    (currentGroup.id === 'sci-fi-masterpieces' && (m.genres?.includes('خيال علمي') || m.genres?.includes('مغامرة'))) ||
    (currentGroup.id === 'critics-choice' && Number(m.rating) >= 8.6) ||
    (currentGroup.id === 'mystery-horror' && (m.genres?.includes('رعب') || m.genres?.includes('غموض') || m.genres?.includes('جريمة'))) ||
    (currentGroup.id === 'family-animation' && (m.genres?.includes('عائلي') || m.genres?.includes('رسوم متحركة') || m.genres?.includes('كوميدي'))) ||
    (currentGroup.id === 'free-to-watch' && m.isFree) ||
    (currentGroup.id === 'originals' && (m.source === 'pexels' || [120, 121, 122, 123, 124, 125].includes(Number(m.id)))) ||
    (currentGroup.id === 'documentaries' && (m.genres?.includes('وثائقي') || m.genres?.includes('طبيعة')))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Title Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo('home')}
          className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10 active:scale-95 transition-all"
          title="العودة للرئيسية"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#e50914]" />
            المجموعات السينمائية المختارة
          </h1>
          <p className="text-xs text-gray-400">
            مجموعات منسقة بعناية حسب تصنيفاتك وأذواقك المفضلة
          </p>
        </div>
      </div>

      {/* Group Selector Chips / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {groups.map(group => {
          const isActive = currentGroup.id === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#e50914] text-white border-[#e50914] shadow-lg shadow-[#e50914]/25 scale-105'
                  : 'bg-[#121620] text-gray-400 hover:text-white border-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Group Hero Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="px-3 py-1 bg-[#e50914]/20 border border-[#e50914]/40 text-[#ff4757] text-xs font-black rounded-full inline-block">
            {groupMovies.length} أعمال سينمائية متوفرة
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {currentGroup.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
            {currentGroup.description}
          </p>
        </div>

        {/* Ambient background accent */}
        <div
          className="absolute -top-10 -left-10 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentGroup.color || '#e50914' }}
        />
      </div>

      {/* Movies Grid */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-black text-white">الأفلام والمسلسلات في هذه المجموعة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {groupMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};
