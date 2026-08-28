import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Movie } from '../types';
import {
  Shuffle,
  Play,
  Bookmark,
  Check,
  Star,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Film,
  Tv,
  Flame,
  X
} from 'lucide-react';

interface ShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShuffleModal: React.FC<ShuffleModalProps> = ({ isOpen, onClose }) => {
  const { movies, navigateTo, isFavorite, toggleFavorite, showToast } = useApp();

  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('الكل');
  const [minRating, setMinRating] = useState<number>(7.5);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [revealedMovie, setRevealedMovie] = useState<Movie | null>(null);

  if (!isOpen) return null;

  const genresList = ['الكل', 'أكشن', 'خيال علمي', 'دراما', 'جريمة', 'رعب', 'كوميديا', 'أنيميشن'];

  const handleSpinWheel = () => {
    setIsSpinning(true);
    setRevealedMovie(null);

    // Filter candidate movies based on preferences
    let candidates = movies.filter(m => {
      if (selectedType === 'movie' && m.type !== 'فيلم') return false;
      if (selectedType === 'tv' && m.type !== 'مسلسل') return false;
      if (selectedGenre !== 'الكل' && !m.genres?.includes(selectedGenre)) return false;
      if (Number(m.rating) < minRating) return false;
      return true;
    });

    if (candidates.length === 0) {
      candidates = movies;
    }

    // Simulate exciting wheel spin delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const chosen = candidates[randomIndex] || movies[0];
      setRevealedMovie(chosen);
      setIsSpinning(false);
      showToast(`✨ وجدنا لك عملاً مبهراً: "${chosen.title}"!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#e50914]/20 text-[#e50914] flex items-center justify-center mx-auto border border-[#e50914]/30 shadow-lg">
            <Shuffle className={`w-7 h-7 ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">الترشيح العشوائي الذكي (فاجئني) 🎲</h3>
          <p className="text-xs text-gray-400">محتار ماذا تشاهد؟ دع ذكاء FilmMax يختار لك عملاً سينمائياً استثنائياً</p>
        </div>

        {/* Filters Box */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3.5 text-xs">
          {/* Format Type */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold">نوع العمل:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'movie', label: 'أفلام فقط' },
                { id: 'tv', label: 'مسلسلات فقط' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedType === t.id
                      ? 'bg-[#e50914] text-white shadow'
                      : 'bg-[#121620] text-gray-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold">التصنيف المفضل:</span>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="bg-[#121620] border border-white/10 text-white rounded-xl px-3 py-1.5 outline-none font-bold"
            >
              {genresList.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-bold">الحد الأدنى للتقييم:</span>
            <div className="flex items-center gap-2">
              {[7.0, 8.0, 8.5].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 ${
                    minRating === r
                      ? 'bg-amber-400 text-black font-black'
                      : 'bg-[#121620] text-gray-400'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{r}+</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spin / Result Area */}
        {isSpinning ? (
          <div className="py-8 text-center space-y-4 animate-pulse">
            <div className="w-20 h-20 rounded-full border-4 border-[#e50914] border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-black text-amber-400">جاري تدوير شريط السينما واختيار أفضل عمل لك... 🍿✨</p>
          </div>
        ) : revealedMovie ? (
          <div className="glass-card p-4 rounded-2xl border border-white/10 flex gap-4 items-center bg-[#121620] animate-in fade-in zoom-in-95">
            <img
              src={revealedMovie.poster}
              alt={revealedMovie.title}
              className="w-24 h-32 rounded-xl object-cover shadow-xl shrink-0"
            />
            <div className="min-w-0 flex-1 text-right space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md">
                  {revealedMovie.rating} ⭐
                </span>
                <span className="bg-white/10 text-gray-300 text-[10px] px-2 py-0.5 rounded-md">
                  {revealedMovie.year}
                </span>
                <span className="text-emerald-400 text-[10px] font-bold">
                  {revealedMovie.matchScore || 97}% تطابق
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-black text-white truncate">
                {revealedMovie.title}
              </h4>

              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {revealedMovie.overview}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('player', revealedMovie);
                  }}
                  className="px-4 py-2 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>مشاهدة الآن</span>
                </button>

                <button
                  onClick={() => toggleFavorite(revealedMovie.id)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl active:scale-95 transition-all"
                  title="حفظ في قائمتي"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isFavorite(revealedMovie.id) ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            disabled={isSpinning}
            onClick={handleSpinWheel}
            className="flex-1 py-3.5 bg-gradient-to-r from-[#e50914] via-[#ff2e3b] to-[#e50914] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{revealedMovie ? 'إعادة السحب والترشيح 🎲' : 'ابدأ السحب وفاجئني الآن! 🚀'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
