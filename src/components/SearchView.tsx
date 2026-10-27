import React, { useState, useMemo } from 'react';
import { searchMoviesWithElasticIndex } from '../services/searchIndexer';
import { useApp } from '../context/AppContext';
import { MovieCard } from './MovieCard';
import { Search, Mic, MicOff, X, Sparkles, Filter } from 'lucide-react';

const ARABIC_KEYS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر',
  'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف',
  'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
];

export const SearchView: React.FC = () => {
  const { movies, searchQuery, setSearchQuery, showToast } = useApp();
  const [selectedGenre, setSelectedGenre] = useState<string>('الكل');
  const [isListening, setIsListening] = useState<boolean>(false);

  const genres = ['الكل', 'أفلام', 'مسلسلات', 'أكشن', 'خيال علمي', 'دراما', 'جريمة', 'رعب', 'الأعلى تقييماً'];

  // Netflix Elasticsearch-style Multi-Token Relevance Search
  const allFilteredMovies = useMemo(() => {
    return searchMoviesWithElasticIndex(movies, searchQuery, selectedGenre);
  }, [movies, searchQuery, selectedGenre]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('البحث الصوتي غير مدعوم في متصفحك');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      setIsListening(true);
      showToast('🎤 تحدث الآن للبحث...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          showToast(`تم البحث عن: "${transcript}"`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('تعذر التعرف على الصوت');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('حدث خطأ في تشغيل الميكروفون');
    }
  };

  const handleKeyClick = (key: string) => {
    setSearchQuery(searchQuery + key);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-[#e50914]" />
            البحث والاستكشاف الذكي
          </h1>
          <p className="text-xs text-gray-400">
            ابحث عن أي فيلم أو مسلسل أو ممثل في مكتبة FilmMax الضخمة
          </p>
        </div>

        <span className="text-xs font-bold text-gray-400 bg-[#121620] px-3 py-1.5 rounded-xl border border-white/5">
          {allFilteredMovies.length} نتيجة
        </span>
      </div>

      {/* Main Search Input Box */}
      <div className="relative flex items-center bg-[#151924] border border-white/10 rounded-2xl p-2 sm:p-3 focus-within:border-[#e50914] focus-within:ring-4 focus-within:ring-[#e50914]/10 transition-all shadow-xl">
        <Search className="w-5 h-5 text-gray-400 shrink-0 ml-3 mr-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، النوع، سنة الإنتاج، أو القصة..."
          className="w-full bg-transparent border-0 outline-none text-sm sm:text-base text-white placeholder-gray-500 font-medium"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors ml-2"
            title="مسح"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleVoiceSearch}
          className={`p-2 rounded-xl text-xs transition-all ${
            isListening
              ? 'bg-[#e50914] text-white animate-pulse'
              : 'bg-white/5 text-gray-300 hover:text-[#e50914] hover:bg-white/10'
          }`}
          title="بحث صوتي"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {/* Filter Genre Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedGenre === genre
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/25'
                : 'bg-[#121620] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Arabic Quick Keyboard */}
      <div className="glass-card p-4 rounded-2xl border border-white/5">
        <span className="text-[11px] font-bold text-gray-400 block mb-2">لوحة المفاتيح السريعة:</span>
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1.5">
          {ARABIC_KEYS.map(char => (
            <button
              key={char}
              onClick={() => handleKeyClick(char)}
              className="p-2 rounded-lg bg-white/5 hover:bg-[#e50914] hover:text-white text-gray-300 text-xs font-bold transition-all text-center active:scale-90"
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        {allFilteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {allFilteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 rounded-3xl text-center space-y-3 border border-white/5">
            <Search className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-gray-300">لا توجد نتائج مطابقة لبحثك</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              جرب كلمات بحث مختلفة أو اختر أحد التصنيفات السريعة في الأعلى
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('الكل');
              }}
              className="px-4 py-2 bg-[#e50914] text-white text-xs font-bold rounded-xl"
            >
              إعادة ضبط البحث
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
