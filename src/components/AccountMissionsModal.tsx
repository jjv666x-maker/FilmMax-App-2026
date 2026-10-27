import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Zap,
  Check,
  CheckCircle2,
  Film,
  Heart,
  Edit3,
  Video,
  Sparkles,
  Trophy,
  Crown,
  Gem,
  Star,
  Award,
  Clapperboard,
  Flame,
  ChevronLeft
} from 'lucide-react';

export interface MissionItem {
  id: string;
  title: string;
  desc: string;
  xpReward: number;
  completed: boolean;
  type?: 'watch' | 'like' | 'review' | 'reel' | 'story';
}

export interface LevelThreshold {
  level: number;
  title: string;
  tierName: string;
  maxXP: number;
  badgeType: 'verified' | 'star' | 'critic' | 'lens4k' | 'luminary' | 'crown' | 'diamond';
  accentColor: string;
  glowColor: string;
}

export const CINEMATIC_LEVELS: LevelThreshold[] = [
  {
    level: 1,
    title: 'هاوي سينما',
    tierName: 'شارة التوثيق الزرقاء الكلاسيكية',
    maxXP: 200,
    badgeType: 'verified',
    accentColor: 'from-sky-500 to-blue-600',
    glowColor: 'rgba(0, 149, 246, 0.4)'
  },
  {
    level: 2,
    title: 'مشاهد متميز',
    tierName: 'شارة النجمة الفضية المعتمدة',
    maxXP: 500,
    badgeType: 'star',
    accentColor: 'from-slate-200 via-sky-400 to-blue-500',
    glowColor: 'rgba(56, 189, 248, 0.45)'
  },
  {
    level: 3,
    title: 'ناقد صاعد',
    tierName: 'شارة الناقد السينمائي المحفورة',
    maxXP: 1000,
    badgeType: 'critic',
    accentColor: 'from-amber-600 via-amber-500 to-yellow-600',
    glowColor: 'rgba(217, 119, 6, 0.5)'
  },
  {
    level: 4,
    title: 'خبير أفلام 4K',
    tierName: 'شارة العدسة الذهبية فائقة الدقة 4K',
    maxXP: 2000,
    badgeType: 'lens4k',
    accentColor: 'from-amber-400 via-rose-500 to-red-600',
    glowColor: 'rgba(239, 68, 68, 0.55)'
  },
  {
    level: 5,
    title: 'أسطورة الشاشة والنقاد',
    tierName: 'شارة النجم الملكي المتألق VIP',
    maxXP: 3500,
    badgeType: 'luminary',
    accentColor: 'from-blue-500 via-indigo-400 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.6)'
  },
  {
    level: 6,
    title: 'مخرج هوليوودي',
    tierName: 'شارة التاج الذهبي الإمبراطوري',
    maxXP: 5500,
    badgeType: 'crown',
    accentColor: 'from-amber-300 via-amber-400 to-yellow-500',
    glowColor: 'rgba(245, 158, 11, 0.65)'
  },
  {
    level: 7,
    title: 'ملك السينما الأسمى 👑',
    tierName: 'شارة الماسة الملكية الكونية الأسمى',
    maxXP: 10000,
    badgeType: 'diamond',
    accentColor: 'from-cyan-400 via-amber-300 to-rose-400',
    glowColor: 'rgba(245, 158, 11, 0.85)'
  }
];

// Tier-Specific Vector Verification Badges
export const EvolvingVerificationBadge: React.FC<{
  type: LevelThreshold['badgeType'];
  className?: string;
  isCurrent?: boolean;
}> = ({ type, className = 'w-6 h-6', isCurrent = false }) => {
  switch (type) {
    case 'verified': // Level 1 - Authentic Blue Rosette
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_12px_rgba(0,149,246,0.85)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} fill-current select-none`}>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="#0095F6"
            />
            <path d="M10.54 16.2L6.8 12.46l1.41-1.42 2.33 2.33 5.3-5.3 1.41 1.41-6.71 6.72z" fill="#FFFFFF" />
          </svg>
        </span>
      );

    case 'star': // Level 2 - Blue Rosette with Brilliant Inset Star
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} fill-current select-none`}>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="#0284C7"
            />
            <path
              d="M12 7.2l1.4 3.1 3.4.4-2.5 2.3.6 3.4-2.9-1.6-2.9 1.6.6-3.4-2.5-2.3 3.4-.4z"
              fill="#FFFFFF"
            />
          </svg>
        </span>
      );

    case 'critic': // Level 3 - Bronze/Gold Rosette with Cinema Clapper Glyph
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_14px_rgba(217,119,6,0.9)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} fill-current select-none`}>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="#D97706"
            />
            <path
              d="M7.5 8h9a1 1 0 011 1v6a1 1 0 01-1 1h-9a1 1 0 01-1-1V9a1 1 0 011-1zm2 2.5v3l3-1.5-3-1.5z"
              fill="#FEF3C7"
            />
          </svg>
        </span>
      );

    case 'lens4k': // Level 4 - Radiant 4K Cinema Lens Crest
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.95)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} select-none`}>
            <defs>
              <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
            </defs>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="url(#lensGrad)"
            />
            <circle cx="12" cy="12" r="4.2" stroke="#FEF08A" strokeWidth="1.6" fill="none" />
            <circle cx="12" cy="12" r="1.8" fill="#FFFFFF" />
          </svg>
        </span>
      );

    case 'luminary': // Level 5 - Royal Purple/Blue Rosette with Star Crest
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_16px_rgba(139,92,246,0.95)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} select-none`}>
            <defs>
              <linearGradient id="lumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="url(#lumGrad)"
            />
            <path
              d="M12 6.5l1.6 3.6 3.9.4-2.9 2.6.8 3.9-3.4-1.9-3.4 1.9.8-3.9-2.9-2.6 3.9-.4z"
              fill="#FDE047"
            />
          </svg>
        </span>
      );

    case 'crown': // Level 6 - Golden Royal Crown Rosette
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_18px_rgba(245,158,11,1)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} select-none`}>
            <defs>
              <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="url(#crownGrad)"
            />
            <path
              d="M7 15h10l-1-6-2.5 3L12 8l-1.5 4L8 9z"
              fill="#FFFFFF"
            />
            <circle cx="12" cy="7" r="1.1" fill="#FFFFFF" />
          </svg>
        </span>
      );

    case 'diamond': // Level 7 - Cosmic 4K Diamond Rosette
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${isCurrent ? 'drop-shadow-[0_0_22px_rgba(245,158,11,1)]' : ''}`}>
          <svg viewBox="0 0 24 24" className={`${className} select-none`}>
            <defs>
              <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>
            <path
              d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              fill="url(#diamondGrad)"
            />
            {/* Crowned Diamond Facet */}
            <path
              d="M12 7l4 3.5-4 5.5-4-5.5z"
              fill="#FFFFFF"
            />
            <path
              d="M9 10.5l3-3.5 3 3.5-3 1.5z"
              fill="#E0F2FE"
              opacity="0.9"
            />
          </svg>
        </span>
      );

    default:
      return null;
  }
};

interface AccountMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userXP: number;
  missions: MissionItem[];
  onCompleteMission: (missionId: string, reward: number) => void;
}

export const AccountMissionsModal: React.FC<AccountMissionsModalProps> = ({
  isOpen,
  onClose,
  userXP,
  missions,
  onCompleteMission
}) => {
  if (!isOpen) return null;

  // Determine current level
  const currentLevel = CINEMATIC_LEVELS.find(l => userXP <= l.maxXP) || CINEMATIC_LEVELS[CINEMATIC_LEVELS.length - 1];
  const isMaxLevel = currentLevel.level === 7 && userXP >= 10000;

  // Calculate XP progress
  const prevLevelMax = currentLevel.level === 1 ? 0 : CINEMATIC_LEVELS[currentLevel.level - 2].maxXP;
  const xpInCurrentLevel = Math.max(0, userXP - prevLevelMax);
  const xpNeededForLevel = currentLevel.maxXP - prevLevelMax;
  const levelProgressPct = isMaxLevel ? 100 : Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForLevel) * 100));
  const pointsRemaining = isMaxLevel ? 0 : Math.max(0, currentLevel.maxXP - userXP);

  // Helper for mission icons
  const getMissionIcon = (id: string, title: string) => {
    if (id === 'm1' || title.includes('شاهد') || title.includes('فيلم')) {
      return <Film className="w-5 h-5 text-sky-400" />;
    }
    if (id === 'm2' || title.includes('مفضل') || title.includes('قائمتك')) {
      return <Heart className="w-5 h-5 text-rose-400" />;
    }
    if (id === 'm3' || title.includes('ريلز') || title.includes('مقطع')) {
      return <Video className="w-5 h-5 text-amber-400" />;
    }
    if (id === 'm4' || title.includes('قصة') || title.includes('ستوري')) {
      return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
    return <Edit3 className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl bg-[#090c13]/95 border border-white/15 rounded-3xl p-5 sm:p-7 text-white shadow-[0_24px_70px_rgba(0,0,0,0.95)] relative max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Ambient Lighting Accents */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-sky-400/10 to-amber-500/20 border border-sky-400/30 flex items-center justify-center shadow-inner">
                <EvolvingVerificationBadge type={currentLevel.badgeType} className="w-6 h-6" isCurrent />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>سجل مهام ومستويات الحساب</span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {userXP} XP
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-medium">شارات توثيق سينمائية متدرجة ومنظومة ترقية المشاهدين</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-95"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 py-4 pr-1 relative z-10">
            {/* 1. Cinematic XP Progress Card */}
            <div className="bg-[#10141d]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <EvolvingVerificationBadge type={currentLevel.badgeType} className="w-7 h-7" isCurrent />
                    <span className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm pointer-events-none animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-400">المستوى الحالي</div>
                    <div className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                      <span>المستوى {currentLevel.level}: {currentLevel.title}</span>
                      <span className="text-amber-400 text-xs">★</span>
                    </div>
                  </div>
                </div>

                <div className="text-left font-mono font-bold text-xs text-gray-300">
                  <span className="text-amber-400 font-black text-sm">{userXP}</span>
                  <span className="text-gray-500"> / {currentLevel.maxXP} XP</span>
                </div>
              </div>

              {/* Progress Bar (FilmMax Blue to Red to Gold) */}
              <div className="w-full h-2 bg-black/80 rounded-full overflow-hidden p-[1px] border border-white/10 my-3 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#0095F6] via-[#e50914] to-[#f59e0b] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>

              {/* Progress Feedback Subtext */}
              <div className="flex items-center justify-between text-xs font-semibold">
                {isMaxLevel ? (
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>وصلت إلى قمة الرتب السينمائية الأسمى 👑</span>
                  </span>
                ) : (
                  <span className="text-gray-300">
                    أنت على بعد <span className="text-amber-400 font-mono font-black">{pointsRemaining} نقطة</span> للوصول إلى المستوى التالي
                  </span>
                )}
                <span className="font-mono text-gray-400 text-[11px]">{Math.round(levelProgressPct)}%</span>
              </div>
            </div>

            {/* 2. Missions Section (Dark Cards with Gleaming Claim Buttons) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>المهام اليومية وجمع نقاط الترقية</span>
                </h4>
                <span className="text-[11px] text-gray-400 font-medium">تتجدد تلقائياً</span>
              </div>

              <div className="space-y-2.5">
                {missions.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-gradient-to-r from-[#11151f] to-[#0c0f17] border border-white/10 hover:border-white/20 rounded-2xl flex items-center justify-between gap-3 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {getMissionIcon(m.id, m.title)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-white truncate">{m.title}</div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">{m.desc}</div>
                        <div className="text-[10px] text-amber-400 font-mono font-bold mt-1">
                          مكافأة: +{m.xpReward} XP
                        </div>
                      </div>
                    </div>

                    {m.completed ? (
                      <span className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم الاستلام</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCompleteMission(m.id, m.xpReward)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs rounded-xl shadow-[0_0_14px_rgba(245,158,11,0.4)] hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all active:scale-95 shrink-0 cursor-pointer flex items-center gap-1.5 border border-amber-300/40"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>استلام المكافأة</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 7-Tier Evolving Verification Badges Showcase */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>شارات التوثيق السينمائية الـ 7 المتطورة</span>
                </h4>
                <span className="text-[11px] text-gray-400 font-medium">حسب النقاط والمشاهدة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CINEMATIC_LEVELS.map((lvl) => {
                  const isCurrent = currentLevel.level === lvl.level;
                  const isUnlocked = userXP >= (lvl.level === 1 ? 0 : CINEMATIC_LEVELS[lvl.level - 2].maxXP);

                  return (
                    <div
                      key={lvl.level}
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-transparent border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/30'
                          : isUnlocked
                          ? 'bg-[#10141e]/90 border-white/10 hover:border-white/20'
                          : 'bg-[#0a0d14]/60 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Glowing badge icon */}
                        <div className="relative shrink-0">
                          <EvolvingVerificationBadge
                            type={lvl.badgeType}
                            className="w-7 h-7"
                            isCurrent={isCurrent}
                          />
                          {isCurrent && (
                            <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-md pointer-events-none animate-pulse" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-white truncate">
                              المستوى {lvl.level}: {lvl.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded-md font-black shadow-sm">
                                الحالي
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate mt-0.5">{lvl.tierName}</div>
                          <div className="text-[10px] font-mono text-gray-400 font-bold mt-0.5">
                            الحد: {lvl.maxXP} XP
                          </div>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                          </span>
                        ) : isUnlocked ? (
                          <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-gray-500 font-bold px-2 py-0.5 rounded-lg bg-white/5 border border-white/5">
                            مغلق
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/10 shrink-0 text-center relative z-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-black tracking-wide cursor-pointer transition-all active:scale-98"
            >
              إغلاق النافذة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
