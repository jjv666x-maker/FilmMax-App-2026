import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import {
  User,
  CreditCard,
  Crown,
  Settings,
  Bell,
  Lock,
  HelpCircle,
  Info,
  Sliders,
  ShieldCheck,
  Users,
  Palette,
  Share2,
  Download,
  Trash2,
  Globe,
  LogOut,
  ChevronLeft,
  ArrowRight,
  Camera,
  Check,
  Volume2,
  Subtitles,
  Smartphone,
  Eye,
  KeyRound,
  RotateCcw,
  Sparkles,
  Gem,
  Play,
  Copy,
  Shield,
  Laptop,
  Tv,
  Sun,
  Moon,
  Film,
  Award,
  Trophy,
  Clock,
  Flame,
  QrCode,
  Zap,
  Plus
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/translations';
import { securityShield } from '../services/securityEngine';

export const SettingsView: React.FC = () => {
  const {
    activeScreen,
    navigateTo,
    userProfile,
    updateUserProfile,
    userAccounts,
    addNewAccount,
    switchAccount,
    setIsAccountSwitcherOpen,
    subtitleSettings,
    updateSubtitleSettings,
    audioSettings,
    updateAudioSettings,
    setIsPremiumModalOpen,
    setIsEvolutionModalOpen,
    setIsShareModalOpen,
    setIsChatSupportOpen,
    downloads,
    removeDownload,
    playDownloadedMovie,
    twoFactorEnabled,
    twoFactorSecret,
    twoFactorBackupCodes,
    toggleTwoFactor,
    verify2FACode,
    theme,
    setTheme,
    language,
    setLanguage,
    currentLanguageInfo,
    showToast,
    replayIntro,
    openWelcomeSlides,
    openAuthScreen
  } = useApp();

  // Sub-screen selector
  const [currentSubScreen, setCurrentSubScreen] = useState<string>('main');

  // Edit Profile Form State
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileUsername, setProfileUsername] = useState(userProfile.username || 'mohamed_cinema_vip');
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);
  const [profileBio, setProfileBio] = useState(userProfile.bio || '');
  const [profileGenre, setProfileGenre] = useState(userProfile.favoriteGenre || 'أكشن وحركة 4K');
  const [profileFrame, setProfileFrame] = useState<'gold' | 'neon' | 'fire' | 'diamond' | 'none'>(
    userProfile.avatarFrame || 'diamond'
  );
  const [profileTab, setProfileTab] = useState<'info' | 'stats' | 'card' | 'accounts'>('info');

  // 2FA code test state
  const [test2FACode, setTest2FACode] = useState<string>('');

  // Password Modal
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Parental PIN
  const [parentalPin, setParentalPin] = useState('1234');
  const [parentalAgeLimit, setParentalAgeLimit] = useState('16+');

  // Cache storage size
  const [cacheSize, setCacheSize] = useState('32.4 MB');

  // Active sessions mock list
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'هذا الجهاز الحالي (المتصفح)', location: 'بغداد، العراق', isCurrent: true, icon: Laptop },
    { id: 'sess-2', device: 'Apple iPhone 15 Pro Max', location: 'أربيل، العراق', isCurrent: false, icon: Smartphone },
    { id: 'sess-3', device: 'Samsung QLED Smart TV 4K', location: 'البصرة، العراق', isCurrent: false, icon: Tv }
  ]);

  const handleCopy2FASecret = () => {
    navigator.clipboard?.writeText(twoFactorSecret);
    showToast('تم نسخ المفتاح السري للحافظة 📋');
  };

  const handleTest2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!test2FACode) return;
    const ok = verify2FACode(test2FACode);
    if (ok) {
      setTest2FACode('');
    }
  };

  const handleLogoutOtherDevices = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
    showToast('تم إنهاء جميع الجلسات النشطة على الأجهزة الأخرى بنجاح 🔒');
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة صالح');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateUserProfile({ avatar: reader.result });
        showToast('تم تحديث صورة الملف الشخصي بنجاح 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.trim() || userProfile.name,
      username: profileUsername.trim() || userProfile.username,
      email: profileEmail.trim() || userProfile.email,
      phone: profilePhone.trim() || userProfile.phone,
      bio: profileBio.trim(),
      favoriteGenre: profileGenre,
      avatarFrame: profileFrame
    });
    showToast('تم حفظ وترقية بيانات الملف الشخصي بنجاح 🌟');
  };

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    showToast('تم مسح الذاكرة المؤقتة وتنظيف مساحة التخزين بنجاح');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    showToast('تم تحديث كلمة المرور وحفظها بأمان');
    setCurrentSubScreen('main');
  };

  /* ================= SUB-SCREENS ================= */

  // 1. Account Details Sub-screen (ترقية الملف الشخصي الشامل)
  if (currentSubScreen === 'account') {
    return (
      <div className="space-y-6 pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentSubScreen('main')}
              className="p-2.5 rounded-2xl bg-[#151922] text-gray-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                الملف الشخصي والحساب VIP
              </h1>
              <p className="text-xs text-gray-400">تخصيص هوية المشاهد، الأوسمة، بطاقة العضوية والبيانات</p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-black flex items-center gap-1.5 shadow-lg">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{userProfile.membershipBadge || 'VIP Diamond 4K 💎'}</span>
          </span>
        </div>

        {/* Hero Profile Banner */}
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
          {/* Cover Photo */}
          <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-gradient-to-r from-red-950 via-purple-950 to-slate-900">
            <img
              src={userProfile.coverPhoto || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'}
              alt="Cover"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-transparent to-black/30" />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-300 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>تصفح أسرع 3x بدون إعلانات</span>
            </div>
          </div>

          {/* Profile Info Overlay */}
          <div className="px-6 pb-6 relative -mt-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4 min-w-0 w-full sm:w-auto">
              {/* Avatar with Custom Frame */}
              <div className="relative group shrink-0">
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 overflow-hidden shadow-2xl bg-black ${
                    profileFrame === 'diamond'
                      ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.5)]'
                      : profileFrame === 'gold'
                      ? 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]'
                      : profileFrame === 'neon'
                      ? 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                      : profileFrame === 'fire'
                      ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]'
                      : 'border-white/20'
                  }`}
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                  <label
                    htmlFor="avatar-upload-input"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] mt-1 font-bold">تغيير الصورة</span>
                  </label>
                </div>
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="absolute bottom-0 right-0 bg-[#e50914] text-white p-1.5 rounded-full border-2 border-[#0c0f17] shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Title & Stats Preview */}
              <div className="min-w-0 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white truncate">{userProfile.name}</h2>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
                    @{userProfile.username || 'mohamed_cinema_vip'}
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-bold mt-0.5 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userProfile.levelTitle || 'خبير السينما الأسطوري 🏆'} (المستوى {userProfile.level || 14})</span>
                </p>
                <p className="text-xs text-gray-300 mt-1 max-w-xl line-clamp-2">
                  {userProfile.bio || 'عاشق للسينما العالمية والأفلام الوثائقية بأعلى دقة 4K HDR. متابع شغوف لكل جديد 🎬🍿'}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 pt-2 sm:pt-0">
              <button
                onClick={() => setIsAccountSwitcherOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all border border-white/10 flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>تبديل الحساب</span>
              </button>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="px-6 pb-5 pt-2 border-t border-white/5 bg-black/20">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-gray-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>تقدم المستوى سينمائي: {userProfile.xp || 8450} / {userProfile.nextLevelXp || 10000} XP</span>
              </span>
              <span className="text-amber-400">84.5% للمستوى التالي</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-[#e50914] rounded-full transition-all duration-500 shadow-md"
                style={{ width: '84.5%' }}
              />
            </div>
          </div>
        </div>

        {/* Profile Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            onClick={() => setProfileTab('info')}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
              profileTab === 'info'
                ? 'bg-[#e50914] text-white shadow-lg shadow-red-600/30 font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="w-4 h-4" />
            <span>البيانات الشخصية والهوية</span>
          </button>

          <button
            onClick={() => setProfileTab('stats')}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
              profileTab === 'stats'
                ? 'bg-[#e50914] text-white shadow-lg shadow-red-600/30 font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>الإحصائيات والأوسمة (5)</span>
          </button>

          <button
            onClick={() => setProfileTab('card')}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
              profileTab === 'card'
                ? 'bg-[#e50914] text-white shadow-lg shadow-red-600/30 font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>بطاقة VIP الرقمية</span>
          </button>

          <button
            onClick={() => setProfileTab('accounts')}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
              profileTab === 'accounts'
                ? 'bg-[#e50914] text-white shadow-lg shadow-red-600/30 font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>إدارة أفراد العائلة ({userAccounts.length})</span>
          </button>
        </div>

        {/* TAB 1: PERSONAL INFO EDIT */}
        {profileTab === 'info' && (
          <div className="space-y-6">
            <form onSubmit={handleProfileSave} className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#e50914]" />
                  <span>بيانات الحساب وتخصيص المظهر</span>
                </h3>
                <span className="text-[10px] text-gray-400">تحديث فوري لجميع الأجهزة المقترنة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">الاسم الكامل:</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">اسم المستخدم (المعرف):</label>
                  <div className="relative">
                    <span className="absolute right-3.5 top-3 text-gray-500 font-bold">@</span>
                    <input
                      type="text"
                      value={profileUsername}
                      onChange={e => setProfileUsername(e.target.value)}
                      className="w-full bg-[#121620] border border-white/10 rounded-xl pr-8 pl-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">رقم الهاتف الدولي:</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Bio & Tagline */}
              <div className="text-xs">
                <label className="block text-gray-300 font-bold mb-1.5">النبذة التعريفية (Bio):</label>
                <textarea
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  rows={2}
                  placeholder="اكتب نبذة سينمائية بسيطة عن اهتماماتك..."
                  className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#e50914] transition-colors resize-none"
                />
              </div>

              {/* Favorite Genre & Avatar Frame */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">التصنيف السينمائي المفضل:</label>
                  <select
                    value={profileGenre}
                    onChange={e => setProfileGenre(e.target.value)}
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914]"
                  >
                    <option value="أكشن وحركة 4K">أكشن وحركة 4K</option>
                    <option value="دراما وتشويق">دراما وتشويق</option>

                    <option value="خيال علمي وسينما مستقبلي">خيال علمي وسينما مستقبلي</option>
                    <option value="رعب وغموض سينمائي">رعب وغموض سينمائي</option>
                    <option value="كوميديا وعائلي">كوميديا وعائلي</option>
                    <option value="وثائقيات وطبيعة HD">وثائقيات وطبيعة HD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1.5">إطار الصورة الشخصية (Frame):</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'diamond', name: 'الماس', color: 'border-cyan-400 bg-cyan-500/20' },
                      { id: 'gold', name: 'ذهبي', color: 'border-amber-400 bg-amber-500/20' },
                      { id: 'neon', name: 'نيون', color: 'border-purple-500 bg-purple-500/20' },
                      { id: 'fire', name: 'ناري', color: 'border-red-500 bg-red-500/20' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setProfileFrame(f.id as any)}
                        className={`py-2 px-1 rounded-xl border text-[10px] font-bold text-center transition-all ${
                          profileFrame === f.id
                            ? `${f.color} text-white shadow-md`
                            : 'border-white/10 bg-[#121620] text-gray-400'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#e50914] hover:bg-[#ff1f2d] text-white rounded-xl font-black text-xs active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وترقية بيانات الحساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSubScreen('main')}
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold text-xs"
                >
                  رجوع
                </button>
              </div>
            </form>

            {/* Change Password Card */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                تغيير كلمة المرور وتأمين الدخول
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="كلمة المرور الحالية"
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#e50914]"
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)"
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#e50914]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all border border-white/10 active:scale-95"
                >
                  تحديث كلمة المرور
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: STATS & ACHIEVEMENTS */}
        {profileTab === 'stats' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xl sm:text-2xl font-black text-white block">{userProfile.watchTimeHours || 184} س</b>
                  <span className="text-[10px] text-gray-400 block font-bold">إجمالي ساعات المشاهدة</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xl sm:text-2xl font-black text-white block">{userProfile.moviesCompleted || 68}</b>
                  <span className="text-[10px] text-gray-400 block font-bold">أفلام سينمائية مكتملة</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xl sm:text-2xl font-black text-white block">{userProfile.seriesCompleted || 14}</b>
                  <span className="text-[10px] text-gray-400 block font-bold">مسلسلات تم ختمها</span>
                </div>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-2 relative overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xl sm:text-2xl font-black text-white block">{userProfile.streakDays || 12} يوم</b>
                  <span className="text-[10px] text-gray-400 block font-bold">تتابع المشاهدة اليومي 🔥</span>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>دروع وأوسمة التميز السينمائي</span>
                </h3>
                <span className="text-xs text-amber-400 font-bold">4 من 5 محققة 🏆</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(userProfile.achievements || []).map(ach => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      ach.isUnlocked
                        ? 'border-amber-500/30 bg-amber-500/10 text-white'
                        : 'border-white/5 bg-[#121620]/50 text-gray-500 opacity-60'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-md">
                      {ach.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <b className="text-white block font-black text-sm">{ach.title}</b>
                        {ach.isUnlocked ? (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            مفتوح ✅
                          </span>
                        ) : (
                          <span className="text-[9px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                            قيد التقدم 🔒
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5">{ach.desc}</p>
                      {ach.unlockedAt && (
                        <span className="text-[9px] text-amber-400/80 block mt-1 font-bold">
                          تم التحقيق: {ach.unlockedAt}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DIGITAL VIP PASS */}
        {profileTab === 'card' && (
          <div className="space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1a1300] via-[#0f121d] to-[#1d0305] shadow-2xl relative overflow-hidden space-y-6">
              {/* Gold Foil Accent */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <b className="text-base sm:text-lg font-black text-white tracking-wide">FILMMAX CINEMA VIP PASS</b>
                </div>
                <span className="text-[10px] font-black bg-amber-400 text-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  DIAMOND TIER
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-3 min-w-0 text-center sm:text-right">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">اسم حامل العضوية</span>
                    <b className="text-xl sm:text-2xl text-white font-black">{userProfile.name}</b>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-gray-300 font-bold">
                    <div>
                      <span className="text-[9px] text-gray-400 block font-normal">رقم العضوية</span>
                      <span className="text-cyan-300">#FM-88201-99</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block font-normal">تاريخ الانتهاء</span>
                      <span className="text-emerald-400">{userProfile.premiumExpiry}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block font-normal">الجودة المعززة</span>
                      <span className="text-amber-400">4K Ultra HDR</span>
                    </div>
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="w-28 h-28 bg-white p-2.5 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-black shrink-0 border-2 border-amber-400">
                  <QrCode className="w-full h-full text-black" />
                  <span className="text-[8px] font-black text-black mt-1">VERIFIED PASS</span>
                </div>
              </div>

              {/* Active Perks List */}
              <div className="pt-4 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-bold text-gray-300">
                <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>بث مباشر 4K بدون تقطيع</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>ربط 5 أجهزة معاً</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>صوت Dolby Atmos 7.1</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>تحميل غير محدود أوفلاين</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('FM-88201-99');
                    showToast('تم نسخ رقم العضوية VIP للحافظة 📋');
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <Copy className="w-4 h-4" />
                  <span>نسخ معرف العضوية الرقمية</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MULTI-PROFILE FAMILY ACCOUNTS */}
        {profileTab === 'accounts' && (
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>إدارة الحسابات العائلية وشاشات العرض</span>
                  </h3>
                  <p className="text-xs text-gray-400">بدل بسهولة بين الحسابات أو أضف شاشة طفل جديدة</p>
                </div>
                <button
                  onClick={() => {
                    addNewAccount({
                      name: `حساب عائلي ${userAccounts.length + 1}`,
                      role: 'family'
                    });
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة شاشة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {userAccounts.map(acc => {
                  const isActive = acc.id === userProfile.id || (acc.email === userProfile.email && acc.name === userProfile.name);
                  return (
                    <div
                      key={acc.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        isActive
                          ? 'border-[#e50914] bg-[#e50914]/15 shadow-md'
                          : 'border-white/10 bg-[#121620] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
                        />
                        <div>
                          <b className="text-white block font-bold text-sm">{acc.name}</b>
                          <span className="text-[10px] text-gray-400 block">{acc.email}</span>
                          <span className="text-[9px] text-amber-400 font-bold block mt-0.5">{acc.badge}</span>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                          نشط الآن ✅
                        </span>
                      ) : (
                        <button
                          onClick={() => switchAccount(acc.id)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl active:scale-95 transition-all text-xs"
                        >
                          تبديل
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Subtitles & Audio Customizer
  if (currentSubScreen === 'subtitles') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSubScreen('main')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">إعدادات الترجمة والصوت والمعادل</h1>
            <p className="text-xs text-gray-400">تخصيص مظهر الترجمة وجودة الصوت والمعادل السينمائي</p>
          </div>
        </div>

        {/* Live Subtitle Preview */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-3 relative overflow-hidden bg-[radial-gradient(#1c2330_1px,transparent_1px)] [background-size:16px_16px]">
          <span className="text-[11px] text-gray-400 font-bold block">معاينة الترجمة الحية:</span>
          <div
            className="p-3 rounded-xl inline-block font-black shadow-2xl transition-all"
            style={{
              color: subtitleSettings.fontColor,
              backgroundColor: subtitleSettings.backgroundColor,
              fontSize:
                subtitleSettings.fontSize === 'small'
                  ? '14px'
                  : subtitleSettings.fontSize === 'large'
                  ? '22px'
                  : subtitleSettings.fontSize === 'xlarge'
                  ? '26px'
                  : '18px'
            }}
          >
            هذا مثال حي على شكل وحجم ولون الترجمة في المشغل
          </div>
        </div>

        {/* Font Size & Color controls */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 text-xs">
          <div>
            <span className="text-gray-400 font-bold block mb-2">حجم الخط:</span>
            <div className="grid grid-cols-4 gap-2">
              {(['small', 'medium', 'large', 'xlarge'] as const).map(sz => (
                <button
                  key={sz}
                  onClick={() => updateSubtitleSettings({ fontSize: sz })}
                  className={`py-2.5 rounded-xl font-bold transition-all ${
                    subtitleSettings.fontSize === sz
                      ? 'bg-[#e50914] text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {sz === 'small' ? 'صغير' : sz === 'medium' ? 'متوسط' : sz === 'large' ? 'كبير' : 'ضخم'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-400 font-bold block mb-2">لون الخط:</span>
            <div className="flex gap-3">
              {['#ffffff', '#f5c518', '#00f5d4', '#ff477e', '#a8dadc'].map(clr => (
                <button
                  key={clr}
                  onClick={() => updateSubtitleSettings({ fontColor: clr })}
                  className={`w-9 h-9 rounded-xl border-2 shadow-md transition-transform ${
                    subtitleSettings.fontColor === clr ? 'scale-110 border-white ring-2 ring-[#e50914]' : 'border-white/20'
                  }`}
                  style={{ backgroundColor: clr }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Audio Equalizer */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 text-xs">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            المعادل الصوتي الذكي (Audio EQ)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['default', 'cinema', 'dialogue', 'bass'] as const).map(eq => (
              <button
                key={eq}
                onClick={() => updateAudioSettings({ eqPreset: eq })}
                className={`py-2.5 rounded-xl font-bold transition-all ${
                  audioSettings.eqPreset === eq
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {eq === 'default' ? 'الافتراضي' : eq === 'cinema' ? 'سينمائي 7.1' : eq === 'dialogue' ? 'تعزيز الحوار' : 'جهير قوي Bass'}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <b className="text-white block">تطبيع مستوى الصوت</b>
              <small className="text-gray-400">موازنة الأصوات المرتفعة والهادئة تلقائياً</small>
            </div>
            <button
              onClick={() => updateAudioSettings({ volumeNormalization: !audioSettings.volumeNormalization })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                audioSettings.volumeNormalization ? 'bg-[#e50914]' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  audioSettings.volumeNormalization ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Parental Controls PIN
  if (currentSubScreen === 'parental') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSubScreen('main')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">الرقابة الأبوية وحماية الأطفال</h1>
            <p className="text-xs text-gray-400">تحديد الفئات العمرية وقفل المحتوى برمز PIN</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 text-xs">
          <div>
            <span className="text-gray-400 font-bold block mb-2">الفئة العمرية المسموح بها:</span>
            <div className="grid grid-cols-5 gap-2">
              {['3+', '7+', '12+', '16+', '18+'].map(age => (
                <button
                  key={age}
                  onClick={() => {
                    setParentalAgeLimit(age);
                    showToast(`تم تعيين حد الرقابة الأبوية على ${age}`);
                  }}
                  className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                    parentalAgeLimit === age
                      ? 'bg-[#e50914] text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-gray-400 font-bold block">رمز الحماية (PIN):</span>
            <input
              type="password"
              maxLength={4}
              value={parentalPin}
              onChange={e => setParentalPin(e.target.value)}
              className="w-36 text-center tracking-widest text-lg font-black bg-[#121620] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#e50914]"
            />
            <span className="text-[10px] text-gray-400 block">
              سيُطلب هذا الرمز عند محاولة فتح محتوى أعلى من الفئة المحددة.
            </span>
          </div>

          <button
            onClick={() => {
              showToast('تم حفظ إعدادات الرقابة الأبوية بنجاح 🛡️');
              setCurrentSubScreen('main');
            }}
            className="w-full py-3 bg-[#e50914] text-white rounded-xl font-bold text-xs hover:bg-[#ff1f2d] shadow-lg"
          >
            حفظ إعدادات الرقابة الأبوية
          </button>
        </div>
      </div>
    );
  }

  // 4. Downloads Manager Sub-screen
  if (currentSubScreen === 'downloads') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentSubScreen('main')}
              className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white">إدارة التنزيلات والمشاهدة أوفلاين</h1>
              <p className="text-xs text-gray-400">الأفلام والمسلسلات المحفوظة على هذا الجهاز</p>
            </div>
          </div>
        </div>

        {downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map(d => (
              <div
                key={d.id}
                onClick={() => playDownloadedMovie(d)}
                className="glass-card p-3 sm:p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-3 cursor-pointer group hover:border-[#e50914]/50 transition-all shadow-lg"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-22 sm:w-18 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-900 shadow-md">
                    <img
                      src={d.poster}
                      alt={d.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-[#e50914]/40 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 text-right">
                    <b className="text-xs sm:text-base text-white block truncate group-hover:text-[#e50914] transition-colors">
                      {d.title}
                    </b>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                      {d.quality} • {d.size} • جاهز للمشاهدة بدون إنترنت
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      اضغط للمشاهدة الفورية في المشغل
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playDownloadedMovie(d);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-xs font-bold shadow-md shadow-[#e50914]/30 active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>تشغيل</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDownload(d.id);
                    }}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="حذف من الذاكرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-white/5">
            <Download className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-sm font-bold text-gray-300">لا توجد تنزيلات محفوظة حالياً</h3>
            <p className="text-xs text-gray-500">
              يمكنك تنزيل أي فيلم أو مسلسل من صفحة التفاصيل للمشاهدة أينما كنت بدون إنترنت
            </p>
          </div>
        )}
      </div>
    );
  }

  // 5. Privacy, Security & 2FA Sub-screen (المصادقة الثنائية والخصوصية والأمان)
  if (currentSubScreen === 'security') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSubScreen('main')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">الخصوصية، الأمان والمصادقة الثنائية</h1>
            <p className="text-xs text-gray-400">تأمين حسابك عبر 2FA وإدارة الجلسات وكلمات المرور</p>
          </div>
        </div>

        {/* Real-time Anti-Theft & DRM Security Shield Status */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>حارس الحماية والأمان السينمائي (FilmMax Shield Guard)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                    محمي 100% 🛡️
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  حماية متكاملة ضد السرقة، تسريب البث، الحقن البرمجي (XSS) والتلاعب بالبيانات
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              Session: {securityShield.getSessionId()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 text-xs">
            <div className="p-3 bg-black/30 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <b className="text-white block text-[11px]">حماية البث من السرقة</b>
                <span className="text-[10px] text-gray-400">DRM Media Shield</span>
              </div>
            </div>

            <div className="p-3 bg-black/30 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <b className="text-white block text-[11px]">حماية الذاكرة المشفرة</b>
                <span className="text-[10px] text-gray-400">Signed Storage Checksum</span>
              </div>
            </div>

            <div className="p-3 bg-black/30 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <b className="text-white block text-[11px]">فلترة المدخلات XSS</b>
                <span className="text-[10px] text-gray-400">Input Sanitization</span>
              </div>
            </div>

            <div className="p-3 bg-black/30 rounded-2xl border border-white/5 flex items-center gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <b className="text-white block text-[11px]">جدار عزل الأخطاء</b>
                <span className="text-[10px] text-gray-400">Error Boundary Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Master Switch Box */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg border border-emerald-400/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>المصادقة الثنائية (Two-Factor Authentication / 2FA)</span>
                  {twoFactorEnabled && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      مفعلة ونشطة 🔒
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  حماية مشددة تطلب إدخال رمز تحقق مكون من 6 أرقام عند كل تسجيل دخول جديد
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => toggleTwoFactor(!twoFactorEnabled)}
              className={`w-14 h-7 rounded-full transition-colors relative shrink-0 ${
                twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  twoFactorEnabled ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Expanded 2FA Details when Enabled */}
          {twoFactorEnabled && (
            <div className="space-y-4 pt-1 text-xs">
              <div className="bg-[#121620] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-bold">المفتاح السري لتطبيقات المصادقة (Google Authenticator / Authy):</span>
                  <button
                    onClick={handleCopy2FASecret}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </button>
                </div>
                <div className="p-3 bg-black/50 rounded-xl font-mono text-center tracking-widest text-sm text-emerald-400 font-bold border border-white/5 select-all">
                  {twoFactorSecret}
                </div>
              </div>

              {/* Verify Test Code */}
              <form onSubmit={handleTest2FACode} className="bg-[#121620] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-gray-300 font-bold block">اختبار رمز التحقق (6 أرقام):</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={test2FACode}
                    onChange={e => setTest2FACode(e.target.value)}
                    placeholder="أدخل 6 أرقام..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center tracking-widest text-sm font-bold text-white outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    تحقق
                  </button>
                </div>
              </form>

              {/* Backup Codes */}
              <div className="bg-[#121620] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-gray-300 font-bold block">رموز الاسترداد الاحتياطية (Backup Codes):</span>
                <p className="text-[11px] text-gray-400">
                  احتفظ بهذه الرموز في مكان آمن لاستخدامها في حال فقدت هاتفك:
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {twoFactorBackupCodes.map((code, i) => (
                    <div
                      key={i}
                      className="p-2 bg-black/40 rounded-lg text-center font-mono text-xs text-gray-300 border border-white/5"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Box */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white">تغيير كلمة المرور</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block text-gray-400 mb-1">كلمة المرور الحالية:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#e50914]"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">كلمة المرور الجديدة:</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121620] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#e50914]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#e50914] text-white rounded-xl font-bold text-xs hover:bg-[#ff1f2d] shadow-md transition-all active:scale-95"
            >
              حفظ كلمة المرور الجديدة
            </button>
          </form>
        </div>

        {/* Active Devices & Sessions */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-black text-white">الأجهزة والجلسات المسجلة</h3>
            </div>
            {activeSessions.length > 1 && (
              <button
                onClick={handleLogoutOtherDevices}
                className="text-xs text-red-400 hover:text-red-300 font-bold"
              >
                تسجيل الخروج من باقي الأجهزة
              </button>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            {activeSessions.map(s => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.id}
                  className="p-3 bg-[#121620] rounded-2xl border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <b className="text-white block font-bold">{s.device}</b>
                      <span className="text-[10px] text-gray-400">{s.location}</span>
                    </div>
                  </div>

                  {s.isCurrent ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      نشط الآن
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveSessions(prev => prev.filter(item => item.id !== s.id));
                        showToast('تم إنهاء الجلسة للجهاز المحدد');
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300"
                    >
                      إنهاء
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 6. Appearance & Language Sub-screen (المظهر والسمات واللغات)
  if (currentSubScreen === 'appearance') {
    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSubScreen('main')}
            className="p-2 rounded-xl bg-[#151922] text-gray-300 hover:text-white border border-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white">المظهر والسمات ولغة التطبيق</h1>
            <p className="text-xs text-gray-400">تخصيص النمط اللوني ولغات العرض المتعددة</p>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>سمة وتصميم التطبيق (النمط اللوني)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Dark Theme */}
            <button
              onClick={() => {
                setTheme('dark');
                showToast('تم تفعيل النمط الليلي الفاخر (Dark Mode) 🌙');
              }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                theme === 'dark'
                  ? 'border-[#e50914] bg-[#e50914]/10 shadow-lg'
                  : 'border-white/10 bg-[#121620] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Moon className="w-5 h-5 text-blue-400" />
                {theme === 'dark' && <Check className="w-4 h-4 text-[#e50914]" />}
              </div>
              <div>
                <b className="text-white block font-black text-sm">النمط الليلي (Dark)</b>
                <span className="text-[10px] text-gray-400">النمط المظلم الكلاسيكي المريح للعين</span>
              </div>
            </button>

            {/* Light Theme */}
            <button
              onClick={() => {
                setTheme('light');
                showToast('تم تفعيل النمط النهاري المشرق (Light Mode) ☀️');
              }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                theme === 'light'
                  ? 'border-[#e50914] bg-[#e50914]/10 shadow-lg'
                  : 'border-white/10 bg-[#121620] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sun className="w-5 h-5 text-amber-400" />
                {theme === 'light' && <Check className="w-4 h-4 text-[#e50914]" />}
              </div>
              <div>
                <b className="text-white block font-black text-sm">النمط النهاري (Light)</b>
                <span className="text-[10px] text-gray-400">واجهة زجاجية مشرقة وواضحة</span>
              </div>
            </button>

            {/* Cinema Theme */}
            <button
              onClick={() => {
                setTheme('cinema');
                showToast('تم تفعيل نمط السينما الغامر (Cinema Gold) 🎬');
              }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                theme === 'cinema'
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg'
                  : 'border-white/10 bg-[#121620] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Film className="w-5 h-5 text-amber-400" />
                {theme === 'cinema' && <Check className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <b className="text-white block font-black text-sm">نمط السينما (Cinema)</b>
                <span className="text-[10px] text-amber-300/80">أجواء صالات السينما الذهبية الغامرة</span>
              </div>
            </button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>لغة العرض والواجهة</span>
            </h3>
            <span className="text-xs text-gray-400">اللغة الحالية: {currentLanguageInfo.nativeName}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as SupportedLanguage);
                  showToast(`تم تغيير لغة التطبيق إلى ${lang.nativeName} (${lang.name})`);
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between ${
                  language === lang.code
                    ? 'border-[#e50914] bg-[#e50914]/15 shadow-md text-white'
                    : 'border-white/10 bg-[#121620] hover:bg-white/5 text-gray-300'
                }`}
              >
                <div>
                  <b className="block font-bold text-xs">{lang.nativeName}</b>
                  <span className="text-[10px] text-gray-400">{lang.name}</span>
                </div>
                {language === lang.code && <Check className="w-4 h-4 text-[#e50914]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN SETTINGS HUB ================= */
  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          الإعدادات والتحكم الشامل
        </h1>
        <span className="text-xs bg-[#e50914]/20 border border-[#e50914]/40 text-[#ff4757] px-3 py-1 rounded-full font-black">
          FilmMax VIP
        </span>
      </div>

      {/* User VIP Profile Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-0 z-10">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#e50914] overflow-hidden shrink-0 shadow-lg">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <b className="text-base sm:text-lg text-white truncate">{userProfile.name}</b>
              <span className="gold-badge px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-400" />
                VIP
              </span>
            </div>
            <span className="text-xs text-gray-400 block truncate">{userProfile.email}</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
              عضوية نشطة حتى: {userProfile.premiumExpiry}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => setIsAccountSwitcherOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white font-bold text-xs active:scale-95 transition-all shadow-md flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>تبديل الحساب</span>
          </button>
          <button
            onClick={() => setCurrentSubScreen('account')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs active:scale-95 transition-all border border-white/10"
          >
            تعديل الملف
          </button>
        </div>

        <div className="absolute top-0 right-1/3 w-60 h-60 bg-[#e50914]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Rows Group 0: Cinema Exclusive Experiences */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5 shadow-xl">
        <div
          onClick={() => navigateTo('watchparty')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">غرفة المشاهدة الجماعية (Watch Party)</b>
              <small className="text-xs text-gray-400">مشاهدة متزامنة مع الأصدقاء، صوت مباشر وتفاعل حي 🍿</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => navigateTo('trivia')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <b className="text-sm text-white block">مسابقات وتحديات السينما (Trivia & Quizzes)</b>
              <small className="text-xs text-gray-400">اختبر معلوماتك، نافس في الصدارة، واجمع جوائز الأوسكار 🏆</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => navigateTo('kids')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <b className="text-sm text-white block">عالم الأطفال الآمن (Kids Mode)</b>
              <small className="text-xs text-gray-400">محتوى كرتوني وعائلي محمي برمز أمان ومؤقت إيقاف تلقائي 🎈</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Navigation Rows Group 1: Core Account & Subscriptions */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5 shadow-xl">
        <div
          onClick={() => setCurrentSubScreen('account')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">الحساب والملف الشخصي</b>
              <small className="text-xs text-gray-400">تعديل الاسم والبريد والهاتف والصورة الشخصية</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setIsPremiumModalOpen(true)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">اشتراك FilmMax Premium الفاخر</b>
              <small className="text-xs text-gray-400">إدارة الباقات (أسبوعي، شهري، سنوي) ووسائل الدفع</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setIsEvolutionModalOpen(true)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">اشتراك التطور الذكي AI Evolution</b>
              <small className="text-xs text-gray-400">ترقية الأداء الذكي وتنظيف الذاكرة وميزات الذكاء الاصطناعي</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setCurrentSubScreen('security')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <b className="text-sm text-white block">الخصوصية، الأمان والمصادقة الثنائية (2FA)</b>
                {twoFactorEnabled && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                    2FA مفعل 🔒
                  </span>
                )}
              </div>
              <small className="text-xs text-gray-400">تأمين الحساب برمز 2FA وإدارة الأجهزة وكلمة المرور</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setCurrentSubScreen('appearance')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">المظهر والسمات ولغة التطبيق</b>
              <small className="text-xs text-gray-400">النمط الليلي والنهاري والسينمائي، وتحديد لغات العرض</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setCurrentSubScreen('downloads')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">التنزيلات والمشاهدة بدون إنترنت</b>
              <small className="text-xs text-gray-400">إدارة الملفات المحفوظة ({downloads.length} أعمال)</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Navigation Rows Group 2: Playback, Audio & Subtitles */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5 shadow-xl">
        <div
          onClick={() => setCurrentSubScreen('subtitles')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Subtitles className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">الترجمة والصوت والمعادل السينمائي</b>
              <small className="text-xs text-gray-400">تخصيص حجم ولون الترجمة ومؤثرات الصوت EQ</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setCurrentSubScreen('parental')}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">الرقابة الأبوية ورمز الأمان PIN</b>
              <small className="text-xs text-gray-400">قفل المحتوى وحماية الفئات العمرية</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        {/* Clear Cache Row */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">تنظيف الذاكرة المؤقتة (Cache)</b>
              <small className="text-xs text-gray-400">المساحة المستخدمة حالياً: {cacheSize}</small>
            </div>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-xs font-bold rounded-xl border border-white/10 transition-all"
          >
            مسح الآن
          </button>
        </div>
      </div>

      {/* Navigation Rows Group 3: Support, Share, About */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden divide-y divide-white/5 shadow-xl">
        <div
          onClick={() => setIsChatSupportOpen(true)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">المساعد السينمائي الذكي والدعم الفني</b>
              <small className="text-xs text-gray-400">محادثة فورية لاقتراحات الأفلام والمساعدة</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => replayIntro()}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">إعادة تشغيل المقدمة السينمائية (Cinematic Intro)</b>
              <small className="text-xs text-gray-400">مشاهدة عرض البداية والصوت السينمائي المحيطي 🎬</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => openWelcomeSlides()}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">جولة الميزات وشرائح الترحيب (VIP Tour)</b>
              <small className="text-xs text-gray-400">استعراض ميزات البث وجودة 4K والغرف التفاعلية</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>

        <div
          onClick={() => setIsShareModalOpen(true)}
          className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <b className="text-sm text-white block">مشاركة تطبيق FilmMax</b>
              <small className="text-xs text-gray-400">دعوة الأصدقاء ورمز الاستجابة السريعة QR</small>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Logout / Switch Account Action */}
      <button
        onClick={() => {
          openAuthScreen();
          showToast('تم تسجيل الخروج. يمكنك الدخول أو التبديل لحساب آخر');
        }}
        className="w-full py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-[#e50914] font-black text-xs border border-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>تسجيل الخروج والتبديل لحساب آخر</span>
      </button>

      {/* Version Note */}
      <div className="text-center text-gray-600 text-[11px] space-y-0.5">
        <p>FilmMax Cinema VIP — الإصدار 3.0.0 Pro</p>
        <p>جميع الحقوق محفوظة © 2026</p>
      </div>
    </div>
  );
};
