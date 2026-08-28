import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TriviaQuestion } from '../types';
import { INITIAL_TRIVIA_QUESTIONS } from '../data/mockMovies';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  Medal,
  Crown,
  Share2,
  Film,
  Zap,
  Clock,
  Star
} from 'lucide-react';

const LEADERBOARD_USERS = [
  { rank: 1, name: 'فاطمة الكرخي', points: 2850, badge: '👑 أستاذ السينما', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'علي المهندس', points: 2420, badge: '⭐ ناقد VIP', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'حيدر البصراوي', points: 2100, badge: '🎬 سينيفيلي ذهبي', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'سارة المنصور', points: 1890, badge: '🍿 عاشق الشاشة', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'محمد الصالح', points: 1650, badge: '⚡ متسابق نشط', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
];

export const TriviaQuizView: React.FC = () => {
  const { navigateTo, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard' | 'badges'>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<TriviaQuestion[]>(INITIAL_TRIVIA_QUESTIONS);

  const currentQuestion = questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isAnswerSubmitted || isQuizCompleted) return;

    if (timeLeft <= 0) {
      // Time out
      handleSelectOption(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswerSubmitted, isQuizCompleted]);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;

    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      const bonusMultiplier = streak >= 2 ? 1.5 : 1;
      const earned = Math.round(currentQuestion.points * bonusMultiplier);
      setScore(prev => prev + earned);
      setStreak(prev => prev + 1);
      showToast(`إجابة صحيحة! +${earned} نقطة 🎉`);
    } else {
      setStreak(0);
      showToast('إجابة غير صحيحة، حظاً أفضل في السؤال القادم 💔');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(15);
    } else {
      setIsQuizCompleted(true);
      showToast(`تهانينا! أكملت التحدي بمجموع ${score} نقطة 🏆`);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>المسابقات والتحديات السينمائية (Cinema Trivia)</span>
            </h1>
            <p className="text-xs text-gray-400">
              اختبر ثقافتك السينمائية، نافس أصدقاءك في لوحة الصدارة، واجمع جوائز وشارات VIP
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>النقاط: {score}</span>
          </div>

          {streak > 1 && (
            <div className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black flex items-center gap-1 animate-pulse">
              <Flame className="w-4 h-4 fill-red-400" />
              <span>كومبو x{streak} 🔥</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'quiz' ? 'bg-[#e50914] text-white shadow-md' : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          تحدي اليوم السينمائي 🎯
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'leaderboard' ? 'bg-[#e50914] text-white shadow-md' : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          لوحة الصدارة (Leaderboard) 🏆
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'badges' ? 'bg-[#e50914] text-white shadow-md' : 'text-gray-400 hover:text-white bg-white/5'
          }`}
        >
          شارات الإنجاز والجوائز 🎖️
        </button>
      </div>

      {/* TAB 1: QUIZ INTERACTIVE INTERFACE */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!isQuizCompleted ? (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
              {/* Top Progress & Timer Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Film className="w-4 h-4" />
                    <span>السؤال {currentIndex + 1} من {questions.length}</span>
                  </span>
                  <span className={`flex items-center gap-1 font-mono ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-gray-300'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft} ثانية</span>
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#e50914] transition-all duration-300 rounded-full"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Image Backdrop if Available */}
              {currentQuestion.image && (
                <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={currentQuestion.image}
                    alt=""
                    className="w-full h-full object-cover filter brightness-[0.7]"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-white/10">
                    {currentQuestion.category}
                  </div>
                </div>
              )}

              {/* Question Text */}
              <h2 className="text-base sm:text-xl font-black text-white leading-relaxed text-right">
                {currentQuestion.question}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let btnStyle = 'border-white/10 bg-[#121620] hover:bg-white/10 text-gray-200';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-black shadow-lg';
                    } else if (isSelected) {
                      btnStyle = 'border-red-500 bg-red-500/20 text-red-300 font-bold';
                    } else {
                      btnStyle = 'border-white/5 bg-white/5 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${btnStyle} active:scale-98`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{opt}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Step */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                    <HelpCircle className="w-4 h-4" />
                    <span>تفسير الإجابة:</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {currentQuestion.explanation}
                  </p>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-[#e50914]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>السؤال التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Results Card */
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/15 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-black flex items-center justify-center mx-auto shadow-xl">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">رائع جداً! تم اجتياز التحدي 🌟</h2>
                <p className="text-xs text-gray-400">لقد أثبت أنك خبير سينمائي من الطراز الرفيع</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-around">
                <div>
                  <span className="text-[11px] text-gray-400 block">إجمالي النقاط:</span>
                  <b className="text-xl font-black text-amber-400">{score}</b>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-[11px] text-gray-400 block">الرتبة الجديدة:</span>
                  <b className="text-sm font-black text-emerald-400">ناقد سينمائي خبير ⭐</b>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 py-3 bg-[#e50914] hover:bg-[#ff1f2d] text-white font-black rounded-xl text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`حققت ${score} نقطة في تحدي السينما على FilmMax! هل يمكنك التغلب علي؟ 🎬🏆`);
                    showToast('تم نسخ نتيجتك لمشاركتها مع أصدقائك! 📋');
                  }}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة النتيجة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>أبطال السينما لهذا الأسبوع</span>
            </h3>

            <div className="space-y-2.5">
              {LEADERBOARD_USERS.map(user => (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    user.rank === 1
                      ? 'bg-gradient-to-r from-amber-500/20 via-white/5 to-transparent border-amber-500/40 shadow-lg'
                      : 'bg-[#121620] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1
                          ? 'bg-amber-400 text-black'
                          : user.rank === 2
                          ? 'bg-gray-300 text-black'
                          : user.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {user.rank}
                    </div>

                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />

                    <div>
                      <b className="text-xs sm:text-sm text-white block">{user.name}</b>
                      <span className="text-[10px] text-amber-400 font-bold">{user.badge}</span>
                    </div>
                  </div>

                  <span className="text-sm font-mono font-black text-white">{user.points} نقطة</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BADGES & ACHIEVEMENTS */}
      {activeTab === 'badges' && (
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-3 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
              <Award className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-black text-white">خبير الأوسكار الذهبي</h4>
            <p className="text-[11px] text-gray-400">تم الفتح: الإجابة على 5 أسئلة تاريخية متتالية بنجاح</p>
            <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
              مكتمل ومفعل 🎖️
            </span>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-red-500/30 bg-red-500/5 space-y-3 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <Zap className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-black text-white">ملك الكومبو الأسطوري</h4>
            <p className="text-[11px] text-gray-400">تحقيق 5 إجابات صحيحة متتالية في أقل من 30 ثانية</p>
            <span className="inline-block text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full">
              جاري التقدم (3/5) ⏳
            </span>
          </div>

          <div className="glass-card p-5 rounded-3xl border border-purple-500/30 bg-purple-500/5 space-y-3 text-center shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
              <Star className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-black text-white">موسوعة السينما الشاملة</h4>
            <p className="text-[11px] text-gray-400">جمع أكثر من 2000 نقطة في مختلف فئات المسابقات</p>
            <span className="inline-block text-[10px] bg-white/10 text-gray-300 font-bold px-2.5 py-0.5 rounded-full">
              قريباً 🔒
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
