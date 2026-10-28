import React from 'react';
import { Movie } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, Play, Film, Tv } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  layout?: 'standard' | 'compact' | 'horizontal';
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, layout = 'standard' }) => {
  const { navigateTo, isFavorite, toggleFavorite } = useApp();
  const favorite = isFavorite(movie.id);

  if (layout === 'horizontal') {
    return (
      <div
        onClick={() => navigateTo('details', movie)}
        className="glass-card flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer group"
      >
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-[#e50914] transition-colors">
            {movie.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {movie.rating}
            </span>
            <span>•</span>
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.type}</span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-1 mt-1">
            {movie.overview}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
          }}
          className="p-2 text-gray-400 hover:text-[#e50914] transition-colors shrink-0"
          title={favorite ? 'إزالة من قائمتي' : 'إضافة إلى قائمتي'}
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigateTo('details', movie)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group relative flex flex-col justify-between"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-0.5 sm:gap-1 bg-black/75 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-amber-400 text-[10px] sm:text-xs font-black border border-amber-400/20 shadow-md">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Quality / Type Badge */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-1">
          {movie.quality && (
            <span className="bg-[#e50914]/90 backdrop-blur-md px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black text-white shadow">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Quick Play & Heart Actions on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('player', movie);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            title="مشاهدة الآن"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white mr-0.5" />
          </button>
        </div>

        {/* Heart Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
          }}
          className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-black/60 backdrop-blur-md text-white hover:text-[#e50914] active:scale-90 transition-all border border-white/10"
          title={favorite ? 'إزالة من قائمتي' : 'إضافة إلى قائمتي'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
        </button>

        {/* Media Type Indicator */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2 flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-300 font-medium drop-shadow">
          {movie.type === 'مسلسل' ? <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Film className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          <span>{movie.year}</span>
        </div>
      </div>

      {/* Title & Info */}
      <div className="p-2 sm:p-2.5 bg-[#0d1017]">
        <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-white truncate group-hover:text-[#e50914] transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-gray-400">
          <span>{movie.genres?.[0] || movie.type}</span>
          <span className="text-emerald-400 font-bold">{movie.matchScore || 95}% تطابق</span>
        </div>
      </div>
    </div>
  );
};
