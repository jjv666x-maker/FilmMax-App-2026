import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Info, Plus, Check, Star, Sparkles, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const {
    movies,
    navigateTo,
    isFavorite,
    toggleFavorite,
    refreshMovies,
    isLoadingMovies
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isInteractingRef = useRef<boolean>(false);

  // Take top 7 featured movies for 3D carousel
  const carouselMovies = movies.slice(0, 7);
  const moviesCount = carouselMovies.length;

  // Auto rotate every 4 seconds
  useEffect(() => {
    if (moviesCount === 0) return;
    const interval = setInterval(() => {
      if (!isInteractingRef.current) {
        setCurrentIndex(prev => (prev + 1) % moviesCount);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [moviesCount]);

  if (moviesCount === 0) return null;

  const currentMovie = carouselMovies[currentIndex] || carouselMovies[0];
  const favorite = isFavorite(currentMovie.id);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    isInteractingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    isInteractingRef.current = false;
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const distance = touchStartXRef.current - touchEndXRef.current;
      const threshold = 40; // minimum distance for swipe
      if (distance > threshold) {
        // Swiped Left -> Next
        setCurrentIndex(prev => (prev + 1) % moviesCount);
      } else if (distance < -threshold) {
        // Swiped Right -> Prev
        setCurrentIndex(prev => (prev - 1 + moviesCount) % moviesCount);
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + moviesCount) % moviesCount);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % moviesCount);
  };

  return (
    <div
      id="apiHero"
      data-scroll="auto"
      className="relative w-full rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl bg-[#080b11] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 select-none transition-all duration-500"
      onMouseEnter={() => { isInteractingRef.current = true; }}
      onMouseLeave={() => { isInteractingRef.current = false; }}
    >
      {/* Dynamic Blurred Background Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={currentMovie.backdrop || currentMovie.poster}
          alt=""
          className="w-full h-full object-cover filter blur-2xl opacity-25 scale-125 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/70 to-transparent" />
      </div>

      {/* 3D Carousel Header Title */}
      <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6 px-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#e50914] text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full shadow-lg shadow-[#e50914]/30">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            3D Cinema Spotlight
          </span>
          <span className="text-xs text-gray-400 font-bold hidden sm:inline">أبرز العروض الحصرية</span>
        </div>

        <button
          onClick={() => refreshMovies(true)}
          disabled={isLoadingMovies}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
          title="تحديث القائمة"
        >
          <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoadingMovies ? 'animate-spin text-[#e50914]' : ''}`} />
        </button>
      </div>

      {/* 3D Perspective Cards Stage */}
      <div
        className="relative z-10 w-full min-h-[280px] sm:min-h-[340px] md:min-h-[380px] flex items-center justify-center overflow-hidden py-4 perspective-[1200px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          {carouselMovies.map((movie, index) => {
            // Calculate distance relative to current active index
            let diff = index - currentIndex;

            // Handle loop wrap-around calculation for smooth cyclic 3D positioning
            if (diff > moviesCount / 2) diff -= moviesCount;
            if (diff < -moviesCount / 2) diff += moviesCount;

            const isCenter = diff === 0;

            // Only render cards within 2 steps of active card to avoid clutter
            if (Math.abs(diff) > 2) return null;

            // Determine 3D transform styles
            let translateX = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;
            let isGrayscale = true;

            if (isCenter) {
              translateX = 0;
              rotateY = 0;
              scale = 1.08;
              opacity = 1;
              zIndex = 30;
              isGrayscale = false; // Full color for active center card
            } else if (diff === -1) {
              // Left card
              translateX = -140; // Desktop px offset
              rotateY = 22; // 3D rotation in Y-axis
              scale = 0.82;
              opacity = 0.45;
              zIndex = 20;
              isGrayscale = true; // Grayscale filter as in reference video
            } else if (diff === 1) {
              // Right card
              translateX = 140;
              rotateY = -22;
              scale = 0.82;
              opacity = 0.45;
              zIndex = 20;
              isGrayscale = true;
            } else if (diff === -2) {
              translateX = -250;
              rotateY = 35;
              scale = 0.68;
              opacity = 0.2;
              zIndex = 10;
              isGrayscale = true;
            } else if (diff === 2) {
              translateX = 250;
              rotateY = -35;
              scale = 0.68;
              opacity = 0.2;
              zIndex = 10;
              isGrayscale = true;
            }

            return (
              <div
                key={movie.id}
                onClick={() => setCurrentIndex(index)}
                className={`card absolute cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                  isCenter ? 'pointer-events-auto' : 'hover:opacity-75'
                }`}
                style={{
                  transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Poster Container (shot / shot--mono matching video design reference) */}
                <div
                  className={`shot relative w-44 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-all duration-700 ${
                    isCenter
                      ? 'border-[#e50914] shadow-[#e50914]/30 ring-2 ring-[#e50914]/40'
                      : 'border-white/10'
                  }`}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className={`shot--mono w-full h-full object-cover transition-all duration-700 ${
                      isGrayscale ? 'filter grayscale contrast-125 brightness-90' : 'filter grayscale-0 contrast-100 brightness-100'
                    }`}
                  />

                  {/* Rating & Type Badge overlay */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15 text-[10px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{movie.rating}</span>
                  </div>

                  {movie.quality && (
                    <div className="absolute top-2 left-2 bg-[#e50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      {movie.quality}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Movie Title & Details Plate (card_plate) */}
      <div className="relative z-20 text-center max-w-xl mx-auto space-y-2 mt-2 sm:mt-4">
        <h2 className="card_plate text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-wide transition-all duration-300">
          {currentMovie.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 line-clamp-1 font-medium">
          {currentMovie.type} • {currentMovie.year} • {currentMovie.genres?.join(', ') || 'سينما عالمية'}
        </p>

        {/* Action Buttons for Centered Active Movie */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-2">
          <button
            onClick={() => navigateTo('player', currentMovie)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black text-xs sm:text-sm px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span>مشاهدة الآن</span>
          </button>

          <button
            onClick={() => navigateTo('details', currentMovie)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl active:scale-95 transition-all"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>التفاصيل</span>
          </button>

          <button
            onClick={() => toggleFavorite(currentMovie.id)}
            className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md active:scale-95 transition-all ${
              favorite
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
            title={favorite ? 'في قائمتك' : 'أضف لقائمتي'}
          >
            {favorite ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar & Step Navigation Controls (Matching Video Reference) */}
      <div className="relative z-20 pt-6 flex flex-col items-center gap-2 max-w-xs sm:max-w-md mx-auto">
        <div className="flex items-center justify-between w-full px-4 text-xs font-mono font-bold text-gray-400">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all active:scale-90 border border-white/10"
            title="السابق"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-white text-sm font-black">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">
              {String(moviesCount).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all active:scale-90 border border-white/10"
            title="التالي"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-[#e50914] transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex + 1) / moviesCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

