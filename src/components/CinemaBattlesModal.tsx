import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Swords,
  Trophy,
  Flame,
  ThumbsUp,
  MessageSquare,
  Share2,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Star,
  Film
} from 'lucide-react';

interface BattleContender {
  id: string;
  title: string;
  director: string;
  year: string;
  rating: string;
  poster: string;
  quote: string;
  votes: number;
}

interface CinemaBattle {
  id: string;
  category: string;
  tagline: string;
  movieA: BattleContender;
  movieB: BattleContender;
}

const CINEMA_BATTLES: CinemaBattle[] = [
  {
    id: 'battle-1',
    category: 'نزال الخيال العلمي الأسطوري 🌌',
    tagline: 'من يملك التأثير الأكثر خلوداً ودهشة في العقل البشري؟',
    movieA: {
      id: 'interstellar',
      title: 'Interstellar (بين النجوم)',
      director: 'كريستوفر نولان',
      year: '2014',
      rating: '8.7',
      poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
      quote: '«الحب هو الشيء الوحيد القادر على تجاوز أبعاد الزمان والمكان»',
      votes: 18450
    },
    movieB: {
      id: 'inception',
      title: 'Inception (استهلال)',
      director: 'كريستوفر نولان',
      year: '2010',
      rating: '8.8',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      quote: '«الفكرة كالفيروس، مرنة ومعدية ومستحيلة النسيان»',
      votes: 16920
    }
  },
  {
    id: 'battle-2',
    category: 'نزال السينما النفسية والجريمة 🎭',
    tagline: 'من العمل الأكثر إثارة للجدل والفلسفة؟',
    movieA: {
      id: 'dark-knight',
      title: 'The Dark Knight (فارس الظلام)',
      director: 'كريستوفر نولان',
      year: '2008',
      rating: '9.0',
      poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
      quote: '«إما أن تموت بطلاً، أو تعيش طويلاً لتشهد نفسك تصبح الشرير»',
      votes: 24100
    },
    movieB: {
      id: 'fight-club',
      title: 'Fight Club (نادي القتال)',
      director: 'ديفيد فينشر',
      year: '1999',
      rating: '8.8',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      quote: '«الأشياء التي تمتلكها تنتهي بامتلاكك أنت»',
      votes: 19800
    }
  },
  {
    id: 'battle-3',
    category: 'نزال روائع الأنمي السينمائي 🎌',
    tagline: 'الرحلة السحرية الخالدة أم دراما الأبعاد والقدر؟',
    movieA: {
      id: 'spirited-away',
      title: 'Spirited Away (المخطوفة)',
      director: 'هاياو ميازاكي',
      year: '2001',
      rating: '8.6',
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      quote: '«بمجرد أن تقابل شخصاً، لن تنساه أبداً»',
      votes: 15300
    },
    movieB: {
      id: 'your-name',
      title: 'Your Name (اسمك)',
      director: 'ماكوتو شينكاي',
      year: '2016',
      rating: '8.4',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      quote: '«كنت أبحث عنك دائماً في مكان ما من هذا العالم»',
      votes: 14750
    }
  }
];

interface BattleComment {
  id: string;
  user: string;
  side: 'A' | 'B';
  text: string;
  likes: number;
  time: string;
}

export const CinemaBattlesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [selectedBattleIdx, setSelectedBattleIdx] = useState(0);
  const currentBattle = CINEMA_BATTLES[selectedBattleIdx];

  const [userVotes, setUserVotes] = useState<Record<string, 'A' | 'B'>>(() => {
    try {
      const saved = localStorage.getItem('filmmax_cinema_battles_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [comments, setComments] = useState<BattleComment[]>([
    {
      id: 'c1',
      user: 'خالد السينمائي (VIP)',
      side: 'A',
      text: 'الموسيقى التصويرية لهانز زيمر في مشهد الرسو بكوكب ميلر كافية لتخليد الفيلم للأبد!',
      likes: 42,
      time: 'منذ ساعتين'
    },
    {
      id: 'c2',
      user: 'سارة الناقدة',
      side: 'B',
      text: 'الحبكة المعقدة وطبقات الأحلام في Inception عبقرية لم تتكرر في تاريخ السينما.',
      likes: 38,
      time: 'منذ 4 ساعات'
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSide, setCommentSide] = useState<'A' | 'B'>('A');

  const currentVote = userVotes[currentBattle.id];

  const votesA = currentBattle.movieA.votes + (currentVote === 'A' ? 1 : 0);
  const votesB = currentBattle.movieB.votes + (currentVote === 'B' ? 1 : 0);
  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (side: 'A' | 'B') => {
    if (currentVote) {
      showToast('لقد صوتت بالفعل في هذا النزال! شكراً لمشاركتك.');
      return;
    }
    const updated = { ...userVotes, [currentBattle.id]: side };
    setUserVotes(updated);
    try {
      localStorage.setItem('filmmax_cinema_battles_votes', JSON.stringify(updated));
    } catch {}

    const chosenMovie = side === 'A' ? currentBattle.movieA.title : currentBattle.movieB.title;
    showToast(`⚔️ تم تسجيل صوتك لصالح: ${chosenMovie}!`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: BattleComment = {
      id: Date.now().toString(),
      user: 'أنت (عضو FilmMax VIP)',
      side: commentSide,
      text: newCommentText.trim(),
      likes: 0,
      time: 'الآن'
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    showToast('💬 تم نشر رأيك في ساحة النقاش السينمائي!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        id="cinema-battles-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0d1117] border border-white/15 rounded-3xl shadow-2xl flex flex-col text-right text-white"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-500/25">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">ساحة معارك السينما وتصويت الجمهور</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  نزال الأسبوع 🔥
                </span>
              </div>
              <p className="text-xs text-gray-400">{currentBattle.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Battle Switcher Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/[0.02]">
          {CINEMA_BATTLES.map((b, idx) => (
            <button
              key={b.id}
              onClick={() => setSelectedBattleIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedBattleIdx === idx
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
              }`}
            >
              <span>{b.category}</span>
              {userVotes[b.id] && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>
          ))}
        </div>

        {/* Battle Arena Visual Showdown */}
        <div className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
            {/* VS Badge in Center */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-[#e50914] text-white font-black text-sm items-center justify-center shadow-xl border-2 border-white/20 animate-pulse">
              VS
            </div>

            {/* Contender A */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              currentVote === 'A'
                ? 'bg-red-950/40 border-red-500/80 shadow-xl shadow-red-500/20'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}>
              <div className="flex gap-4">
                <img
                  src={currentBattle.movieA.poster}
                  alt={currentBattle.movieA.title}
                  className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl object-cover shadow-lg border border-white/10 flex-shrink-0"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{currentBattle.movieA.rating} • {currentBattle.movieA.year}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug truncate">
                    {currentBattle.movieA.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">إخراج: {currentBattle.movieA.director}</p>
                  <p className="text-[11px] text-gray-300/80 italic line-clamp-3 bg-black/30 p-2 rounded-lg border border-white/5">
                    {currentBattle.movieA.quote}
                  </p>
                </div>
              </div>

              {/* Voting Button / Percentage */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <button
                  onClick={() => handleVote('A')}
                  className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    currentVote === 'A'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                      : 'bg-white/10 hover:bg-red-600/80 text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{currentVote === 'A' ? 'صوتت لهذا العمل ✓' : 'تصويت لهذا العمل'}</span>
                </button>
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>نسبة الجمهور: <strong className="text-red-400 font-mono text-sm">{pctA}%</strong></span>
                  <span>{votesA.toLocaleString()} صوت</span>
                </div>
              </div>
            </div>

            {/* Contender B */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              currentVote === 'B'
                ? 'bg-amber-950/40 border-amber-500/80 shadow-xl shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}>
              <div className="flex gap-4">
                <img
                  src={currentBattle.movieB.poster}
                  alt={currentBattle.movieB.title}
                  className="w-24 sm:w-28 h-36 sm:h-40 rounded-xl object-cover shadow-lg border border-white/10 flex-shrink-0"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{currentBattle.movieB.rating} • {currentBattle.movieB.year}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug truncate">
                    {currentBattle.movieB.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">إخراج: {currentBattle.movieB.director}</p>
                  <p className="text-[11px] text-gray-300/80 italic line-clamp-3 bg-black/30 p-2 rounded-lg border border-white/5">
                    {currentBattle.movieB.quote}
                  </p>
                </div>
              </div>

              {/* Voting Button / Percentage */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <button
                  onClick={() => handleVote('B')}
                  className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    currentVote === 'B'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/40'
                      : 'bg-white/10 hover:bg-amber-600/80 text-white'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{currentVote === 'B' ? 'صوتت لهذا العمل ✓' : 'تصويت لهذا العمل'}</span>
                </button>
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>نسبة الجمهور: <strong className="text-amber-400 font-mono text-sm">{pctB}%</strong></span>
                  <span>{votesB.toLocaleString()} صوت</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Dual Progress Bar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-red-400 truncate max-w-[45%]">{currentBattle.movieA.title} ({pctA}%)</span>
              <span className="text-gray-400 font-normal">إجمالي الأصوات: {totalVotes.toLocaleString()}</span>
              <span className="text-amber-400 truncate max-w-[45%]">({pctB}%) {currentBattle.movieB.title}</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 shadow-[0_0_12px_rgba(229,9,20,0.5)]"
                style={{ width: `${pctA}%` }}
              />
              <div
                className="h-full bg-gradient-to-l from-amber-600 to-amber-500 transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ width: `${pctB}%` }}
              />
            </div>
          </div>

          {/* Community Debates / Discussion Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                آراء ونقاشات النقاد والمشاهدين ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">اختر صفك:</span>
                <button
                  type="button"
                  onClick={() => setCommentSide('A')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    commentSide === 'A'
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  فريق {currentBattle.movieA.title.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => setCommentSide('B')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    commentSide === 'B'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  فريق {currentBattle.movieB.title.split(' ')[0]}
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="شارك تحليلك ورأيك السينمائي في هذا النزال..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{c.user}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        c.side === 'A' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {c.side === 'A' ? 'مؤيد A' : 'مؤيد B'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
