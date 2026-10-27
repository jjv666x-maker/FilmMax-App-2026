import React, { useRef, useState, useEffect } from 'react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HorizontalMovieTrackProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  movies: Movie[];
  cardType?: 'poster' | 'backdrop' | 'wide';
  onViewMore?: () => void;
}

export const HorizontalMovieTrack: React.FC<HorizontalMovieTrackProps> = ({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = 'bg-[#e50914]',
  movies,
  cardType = 'poster',
  onViewMore
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setActiveMovie, navigateTo } = useApp();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    // In RTL, scrollLeft can be negative or positive depending on browser,
    // so we handle both RTL and standard scroll calculations
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setScrollProgress(0);
      return;
    }

    const currentScroll = Math.abs(el.scrollLeft);
    const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
    setScrollProgress(progress);

    // Can scroll left or right
    setCanScrollLeft(currentScroll > 15);
    setCanScrollRight(currentScroll < maxScroll - 15);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
    };
  }, [movies]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    const isRtl = document.dir === 'rtl' || true; // Arabic RTL layout
    
    // In Arabic RTL, moving forward in the list usually means scrolling left or decrementing/incrementing depending on browser implementation
    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Mouse Drag to Scroll handlers for desktop & touch
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const el = scrollContainerRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    el.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="space-y-3.5 relative group/section">
      {/* Header with Title, Icon & Navigation Controls */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-sm">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-sm sm:text-lg md:text-xl font-black text-white leading-tight">{title}</h2>
              {badge && (
                <span className={`${badgeColor} text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium line-clamp-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action & Nav Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Scroll Progress Bar Track */}
          <div className="hidden sm:block w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e50914] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(229,9,20,0.6)]"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>

          {/* Previous / Next Arrow Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              title="السابق"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
              title="التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {onViewMore && (
            <button
              onClick={onViewMore}
              className="text-[10px] sm:text-xs text-gray-400 hover:text-white flex items-center gap-0.5 sm:gap-1 font-bold transition-colors bg-white/5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-white/5 hover:border-white/10"
            >
              <span>المزيد</span>
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div className="relative">
        {/* Left/Right Subtle Vignette Gradient Shadows */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-[#0b0e14]/80 to-transparent z-10 hidden sm:block" />
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-[#0b0e14]/80 to-transparent z-10 hidden sm:block" />

        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar py-1.5 sm:py-2 px-1 scroll-smooth snap-x snap-mandatory ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cardType === 'poster' && (
            movies.map((movie, index) => (
              <div
                key={`track-poster-${movie.id}-${index}`}
                className="flex-shrink-0 w-[130px] sm:w-[160px] md:w-[190px] snap-start transition-transform duration-300 hover:scale-[1.02]"
              >
                <MovieCard movie={movie} />
              </div>
            ))
          )}

          {cardType === 'wide' && (
            movies.map((movie, index) => (
              <div
                key={`track-wide-${movie.id}-${index}`}
                onClick={() => {
                  setActiveMovie(movie);
                  navigateTo('player');
                }}
                className="flex-shrink-0 w-[210px] sm:w-[260px] md:w-[320px] snap-start group relative cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-gray-900">
                  <img
                    src={movie.backdrop || movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  
                  {movie.quality && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] sm:text-[10px] font-black text-amber-400 border border-amber-500/30">
                      {movie.quality}
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2.5 left-2.5 sm:bottom-2.5 sm:right-3 sm:left-3">
                    <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold block mb-0.5">
                      ★ {movie.rating} • {movie.year}
                    </span>
                    <h3 className="text-[11px] sm:text-xs md:text-sm font-black text-white truncate">{movie.title}</h3>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
