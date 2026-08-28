import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Movie } from '../types';
import {
  Globe,
  MapPin,
  Compass,
  Film,
  Star,
  ChevronLeft,
  Sparkles,
  X,
  Play,
  Award,
  Layers
} from 'lucide-react';

interface CountryCinema {
  id: string;
  name: string;
  englishName: string;
  flag: string;
  iconicGenre: string;
  famousDirector: string;
  description: string;
  accentColor: string;
  matchKeywords: string[];
}

const CINEMA_COUNTRIES: CountryCinema[] = [
  {
    id: 'kr',
    name: 'كوريا الجنوبية',
    englishName: 'South Korea',
    flag: '🇰🇷',
    iconicGenre: 'غموض، إثارة نفسية، ودراما انتقام',
    famousDirector: 'بونغ جون هو • بارك تشان ووك',
    description: 'تتميز السينما الكورية بحبكاتها غير المتوقعة وعمقها النفسي وتفوقها في خلق التوتر والتفاصيل الواقعية.',
    accentColor: 'from-rose-500 to-red-600',
    matchKeywords: ['كوريا', 'طفيلي', 'لعبة الحبار', 'Squid', 'Parasite', 'قطار', 'دراما']
  },
  {
    id: 'us',
    name: 'هوليوود (الولايات المتحدة)',
    englishName: 'Hollywood, USA',
    flag: '🇺🇸',
    iconicGenre: 'خيال علمي، أكشن ملحمي، وأبطال خارقين',
    famousDirector: 'كريستوفر نولان • ستيفن سبيلبرغ',
    description: 'عاصمة الإنتاجات الضخمة والمؤثرات البصرية وسلاسل الأكوان السينمائية العالمية.',
    accentColor: 'from-blue-600 to-indigo-700',
    matchKeywords: ['Interstellar', 'Inception', 'Batman', 'Avengers', 'Avatar', 'Dune']
  },
  {
    id: 'jp',
    name: 'اليابان',
    englishName: 'Japan',
    flag: '🇯🇵',
    iconicGenre: 'أنمي فلسفي، رعب نفسي، وفانتازيا الطبيعة',
    famousDirector: 'هاياو ميازاكي • ماكوتو شينكاي',
    description: 'روائع الأنمي والقصص العميقة التي تناقش الروح والزمن والارتباط الإنساني بالطبيعة.',
    accentColor: 'from-amber-500 to-red-500',
    matchKeywords: ['أنمي', 'Spirited Away', 'Your Name', 'Attack on Titan', 'اليابان']
  },
  {
    id: 'es',
    name: 'إسبانيا',
    englishName: 'Spain',
    flag: '🇪🇸',
    iconicGenre: 'سرقات معقدة، غموض الغرفة المغلقة، وجرائم',
    famousDirector: 'أوريول باولو • أليكس دي لا إغليسيا',
    description: 'المرجع الأول لسينما الألغاز والنهايات الصادمة التي تجعلك تعيد التفكير في كل مشهد.',
    accentColor: 'from-yellow-500 to-red-600',
    matchKeywords: ['La Casa De Papel', 'البروفيسور', 'إسباني', 'The Invisible Guest']
  },
  {
    id: 'ar',
    name: 'مصر والعالم العربي',
    englishName: 'Arab Cinema',
    flag: '🇪🇬',
    iconicGenre: 'كوميديا كلاسيكية، دراما اجتماعية، وقصص واقعية',
    famousDirector: 'يوسف شاهين • مروان حامد',
    description: 'أعرق صناعة سينمائية في الشرق الأوسط، تمتد لأكثر من قرن من الضحك والمشاعر الأصيلة.',
    accentColor: 'from-emerald-500 to-teal-700',
    matchKeywords: ['عربي', 'مصر', 'الفيل الأزرق', 'كيرة والجن', 'مسلسل']
  },
  {
    id: 'fr',
    name: 'فرنسا',
    englishName: 'France',
    flag: '🇫🇷',
    iconicGenre: 'سينما المؤلف، الفلسفة الوجودية، والرومانسية',
    famousDirector: 'جان لوك غودار • دينيس فيلنوف',
    description: 'مهد الفن السابع، تركز على شاعرية المشهد والجماليات الفنية العالية.',
    accentColor: 'from-blue-500 to-purple-600',
    matchKeywords: ['فرنسي', 'أوروبي', 'فلسفي']
  }
];

export const WorldCinemaMapModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { movies, setActiveMovie, navigateTo } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<CountryCinema>(CINEMA_COUNTRIES[0]);

  // Find relevant movies in library or fallback to featured matches
  const matchedMovies = movies.filter(m => {
    return selectedCountry.matchKeywords.some(keyword => 
      m.title.toLowerCase().includes(keyword.toLowerCase()) || 
      m.overview?.toLowerCase().includes(keyword.toLowerCase()) ||
      m.genres?.some(g => g.toLowerCase().includes(keyword.toLowerCase()))
    );
  }).slice(0, 6);

  const displayList = matchedMovies.length > 0 ? matchedMovies : movies.slice(0, 4);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        id="world-cinema-map-modal"
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0b0e14] border border-white/15 rounded-3xl shadow-2xl flex flex-col text-right text-white"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#0b0e14]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">خريطة السينما العالمية التفاعلية</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  World Cinema Hub 🌍
                </span>
              </div>
              <p className="text-xs text-gray-400">استكشف ثقافات وصناع السينما حول العالم بضغطة زر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Hub Map & Country Selector Grid */}
        <div className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {CINEMA_COUNTRIES.map((c) => {
              const isSelected = selectedCountry.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c)}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-b from-blue-600/30 to-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <b className="text-xs font-black text-white block truncate">{c.name}</b>
                    <span className="text-[10px] text-gray-400 block truncate">{c.englishName}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Country Deep-Dive Feature Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">سينما {selectedCountry.name}</h3>
                  <p className="text-xs text-cyan-300 font-bold">أبرز الرواد: {selectedCountry.famousDirector}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-white/10 border border-white/10 text-gray-300">
                الأسلوب: {selectedCountry.iconicGenre}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/5">
              {selectedCountry.description}
            </p>
          </div>

          {/* Associated Films in Library */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                أبرز الأعمال المرتبطة بسينما {selectedCountry.name} المتاحة لديك:
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {displayList.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => {
                    setActiveMovie(movie);
                    navigateTo('details');
                    onClose();
                  }}
                  className="glass-card p-3 rounded-2xl border border-white/10 hover:border-cyan-400/60 cursor-pointer group transition-all duration-300 bg-white/5 hover:scale-[1.02]"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-2">
                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[10px] font-black text-amber-400 flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 fill-current" />
                      {movie.rating}
                    </div>
                  </div>
                  <h5 className="text-xs font-black text-white truncate">{movie.title}</h5>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{movie.type} • {movie.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
