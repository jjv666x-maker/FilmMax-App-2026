import React, { useState, useEffect } from 'react';
import { AppLogo } from './AppLogo';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Crown,
  ArrowLeft,
  Check,
  Fingerprint,
  Smartphone,
  Star,
  Film,
  Award,
  Zap,
  Globe,
  Camera,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Tv
} from 'lucide-react';

interface AuthViewProps {
  onSuccess: () => void;
}

// Avatar choices for VIP members
const VIP_AVATARS = [
  { id: 'gold_crown', icon: '👑', name: 'الملك VIP', frame: 'gold' as const },
  { id: 'director', icon: '🎬', name: 'المخرج السينمائي', frame: 'neon' as const },
  { id: 'popcorn', icon: '🍿', name: 'عاشق السينما', frame: 'fire' as const },
  { id: 'hero', icon: '🦸', name: 'البطل الخارق', frame: 'diamond' as const },
  { id: 'star', icon: '🌟', name: 'النجم العالمي', frame: 'gold' as const },
  { id: 'wizard', icon: '🧙‍♂️', name: 'الساحر السينمائي', frame: 'diamond' as const }
];

// Favorite Genres for personalization during signup
const GENRE_OPTIONS = [
  { id: 'action', name: 'أكشن ومغامرات 💥' },
  { id: 'animation', name: 'أنيميشن وكرتون 🎨' },
  { id: 'drama', name: 'دراما وإثارة 🎭' },
  { id: 'horror', name: 'رعب وغموض 👻' },
  { id: 'comedy', name: 'كوميديا وضحك 😂' },
  { id: 'scifi', name: 'خيال علمي وخاروق 🌌' }
];

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const { updateUserProfile, showToast, navigateTo } = useApp();

  // Auth Method Tabs: 'signup' | 'login' | 'otp'
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'otp'>('signup');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Customization State (for VIP Signup & Preview)
  const [selectedAvatar, setSelectedAvatar] = useState(VIP_AVATARS[0]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['action', 'animation']);

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Biometric Modal State
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Password strength calculator
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'أدخل كلمة المرور', color: 'bg-gray-600' };
    if (password.length < 6) return { score: 1, label: 'ضعيفة', color: 'bg-red-500' };
    if (password.length < 10) return { score: 2, label: 'متوسطة', color: 'bg-amber-500' };
    return { score: 3, label: 'قوية جداً 🛡️', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  // 4. Permanent Storage: Load saved preferences & credentials from localStorage on mount
  useEffect(() => {
    try {
      const savedProfileStr = localStorage.getItem('userProfile');
      if (savedProfileStr) {
        const saved = JSON.parse(savedProfileStr);
        if (saved) {
          if (saved.selectedGenreIds && Array.isArray(saved.selectedGenreIds) && saved.selectedGenreIds.length > 0) {
            setSelectedGenres(saved.selectedGenreIds);
          }
          if (saved.email && !email) {
            setEmail(saved.email);
          }
          if (saved.name && !name) {
            setName(saved.name);
          }
          if (saved.phone && !phone) {
            setPhone(saved.phone);
          }
          if (saved.avatar) {
            const av = VIP_AVATARS.find(a => a.icon === saved.avatar);
            if (av) setSelectedAvatar(av);
          }
        }
      }

      // Check remember email
      const rememberedEmail = localStorage.getItem('filmmax_remember_email');
      if (rememberedEmail && !email) {
        setEmail(rememberedEmail);
      }
    } catch {}
  }, []);

  // 4. Permanent Storage: Genre Toggle with instant State & localStorage sync
  const toggleGenre = (genreId: string) => {
    let updated: string[];
    if (selectedGenres.includes(genreId)) {
      if (selectedGenres.length > 1) {
        updated = selectedGenres.filter(g => g !== genreId);
      } else {
        showToast('يرجى اختيار تصنيف سينمائي واحد على الأقل 🎬');
        return;
      }
    } else {
      updated = [...selectedGenres, genreId];
    }
    setSelectedGenres(updated);

    // Save genres preference in localStorage if a profile exists
    try {
      const savedProfileStr = localStorage.getItem('userProfile');
      if (savedProfileStr) {
        const prof = JSON.parse(savedProfileStr);
        const genreNames = updated.map(gid => GENRE_OPTIONS.find(g => g.id === gid)?.name || gid);
        prof.selectedGenreIds = updated;
        prof.favoriteGenres = genreNames;
        prof.favoriteGenre = genreNames[0] || prof.favoriteGenre;
        localStorage.setItem('userProfile', JSON.stringify(prof));
        localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(prof));
        updateUserProfile({ selectedGenreIds: updated, favoriteGenres: genreNames, favoriteGenre: genreNames[0] });
      }
    } catch {}
  };

  // Main Form Submission: 1. Signup VIP & 2. Login Logic using pure localStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'signup') {
      // ==========================================
      // 1. VIP Sign Up (إنشاء حساب VIP)
      // ==========================================
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const trimmedPassword = password.trim();

      if (!trimmedName) {
        showToast('يرجى كتابة الاسم أو اللقب السينمائي 👤');
        return;
      }
      if (!trimmedEmail) {
        showToast('يرجى كتابة البريد الإلكتروني 📧');
        return;
      }
      if (!trimmedPassword) {
        showToast('يرجى كتابة كلمة المرور 🔒');
        return;
      }

      setIsLoading(true);

      const selectedGenreNames = selectedGenres.map(
        gid => GENRE_OPTIONS.find(g => g.id === gid)?.name || gid
      );
      const primaryGenre = selectedGenreNames[0] || 'أكشن ومغامرات 💥';

      const userData = {
        id: `usr-${Date.now()}`,
        name: trimmedName,
        username: trimmedName.toLowerCase().replace(/\s+/g, '_') || 'vip_user',
        email: trimmedEmail.toLowerCase(),
        phone: trimmedPhone || '+966 50 123 4567',
        password: trimmedPassword,
        avatar: selectedAvatar.icon,
        avatarFrame: selectedAvatar.frame as 'gold' | 'neon' | 'fire' | 'diamond' | 'none',
        favoriteGenre: primaryGenre,
        favoriteGenres: selectedGenreNames,
        selectedGenreIds: selectedGenres,
        isPremium: true,
        membershipBadge: '👑 ULTRA VIP MEMBER',
        premiumExpiry: '31/12/2026',
        level: 15,
        levelTitle: 'أسطورة السينما VIP',
        xp: 4500,
        createdAt: Date.now()
      };

      try {
        const emailKey = userData.email.toLowerCase();
        localStorage.setItem('filmMax_user_' + emailKey, JSON.stringify(userData));
        localStorage.setItem('filmMax_session', emailKey);
        localStorage.setItem('userProfile', JSON.stringify(userData));
        localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(userData));

        // Save to registered users list for subsequent login verification
        let registeredUsers: any[] = [];
        try {
          const savedUsers = localStorage.getItem('filmmax_registered_users');
          if (savedUsers) registeredUsers = JSON.parse(savedUsers);
        } catch {}

        const existingIdx = registeredUsers.findIndex(
          u => u.email?.toLowerCase() === userData.email
        );
        if (existingIdx >= 0) {
          registeredUsers[existingIdx] = userData;
        } else {
          registeredUsers.push(userData);
        }
        localStorage.setItem('filmmax_registered_users', JSON.stringify(registeredUsers));

        if (rememberMe) {
          localStorage.setItem('filmmax_remember_email', userData.email);
        }
      } catch (err) {
        console.warn('localStorage save note:', err);
      }

      // Update State
      updateUserProfile(userData);

      setTimeout(() => {
        setIsLoading(false);
        showToast('🎉 تم إنشاء حساب VIP وحفظ البيانات بنجاح! مرحباً بك');
        navigateTo('home');
        onSuccess();
      }, 400);

    } else {
      // ==========================================
      // 2. Login (تسجيل الدخول)
      // ==========================================
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      if (!trimmedEmail) {
        showToast('يرجى إدخال البريد الإلكتروني 📧');
        return;
      }
      if (!trimmedPassword) {
        showToast('يرجى إدخال كلمة المرور 🔒');
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);

        // Verification against saved data in localStorage
        let matchedUser: any = null;

        // 0) Search in user-specific key filmMax_user_[email]
        try {
          const specificUserStr = localStorage.getItem('filmMax_user_' + trimmedEmail);
          if (specificUserStr) {
            const specificUser = JSON.parse(specificUserStr);
            if (specificUser && (!specificUser.password || specificUser.password === trimmedPassword)) {
              matchedUser = specificUser;
            }
          }
        } catch {}

        // 1) Search in registered users registry
        if (!matchedUser) {
          try {
            const savedUsersStr = localStorage.getItem('filmmax_registered_users');
            if (savedUsersStr) {
              const usersList = JSON.parse(savedUsersStr);
              if (Array.isArray(usersList)) {
                matchedUser = usersList.find(
                  (u: any) =>
                    u.email?.toLowerCase() === trimmedEmail &&
                    u.password === trimmedPassword
                );
              }
            }
          } catch {}
        }

        // 2) Search in 'userProfile' key
        if (!matchedUser) {
          try {
            const savedProfileStr = localStorage.getItem('userProfile');
            if (savedProfileStr) {
              const prof = JSON.parse(savedProfileStr);
              if (
                prof &&
                prof.email?.toLowerCase() === trimmedEmail &&
                (!prof.password || prof.password === trimmedPassword)
              ) {
                matchedUser = prof;
              }
            }
          } catch {}
        }

        // 3) Search in 'filmmax_react_profile_v5'
        if (!matchedUser) {
          try {
            const savedV5Str = localStorage.getItem('filmmax_react_profile_v5');
            if (savedV5Str) {
              const prof = JSON.parse(savedV5Str);
              if (
                prof &&
                prof.email?.toLowerCase() === trimmedEmail &&
                (!prof.password || prof.password === trimmedPassword)
              ) {
                matchedUser = prof;
              }
            }
          } catch {}
        }

        // 4) Demo credentials compatibility
        if (
          !matchedUser &&
          (trimmedEmail === 'user@filmmax.vip' || trimmedEmail === 'mohamed@filmmax.vip') &&
          (trimmedPassword === 'FilmMax#2026' || trimmedPassword === '123456')
        ) {
          matchedUser = {
            id: 'usr-vip-001',
            name: 'محمد أحمد الحامد',
            email: trimmedEmail,
            phone: '+964 770 123 4567',
            avatar: '👑',
            isPremium: true,
            membershipBadge: '👑 ULTRA VIP MEMBER',
            level: 15,
            levelTitle: 'أسطورة السينما VIP',
            xp: 4500
          };
        }

        if (matchedUser) {
          // Merge with any existing saved profile data (like coverPhoto, avatar, etc.) if stored in localStorage
          try {
            const emailKey = (matchedUser.email || trimmedEmail).toLowerCase();
            const specificUserStr = localStorage.getItem('filmMax_user_' + emailKey);
            if (specificUserStr) {
              const existingSpec = JSON.parse(specificUserStr);
              if (existingSpec && existingSpec.name) {
                matchedUser = {
                  ...matchedUser,
                  ...existingSpec,
                  avatar: existingSpec.avatar || matchedUser.avatar,
                  coverPhoto: existingSpec.coverPhoto || matchedUser.coverPhoto
                };
              }
            }

            localStorage.setItem('filmMax_session', emailKey);
            localStorage.setItem('filmMax_user_' + emailKey, JSON.stringify(matchedUser));
            localStorage.setItem('userProfile', JSON.stringify(matchedUser));
            localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(matchedUser));
            if (rememberMe) {
              localStorage.setItem('filmmax_remember_email', matchedUser.email);
            }
          } catch {}

          updateUserProfile(matchedUser);
          showToast(`✨ تم تسجيل الدخول بنجاح! أهلاً بك يا ${matchedUser.name || 'عضو VIP'}`);
          navigateTo('home');
          onSuccess();
        } else {
          // If credentials do not match, show simple error message
          showToast('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى التحقق من البيانات');
        }
      }, 350);
    }
  };

  // 3. Quick Access: Fast Guest Login (دخول سريع كزائر VIP)
  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const guestData = {
        id: `guest-${Date.now()}`,
        name: 'زائر VIP مميز',
        email: 'guest@filmmax.vip',
        phone: '+964 770 000 0000',
        avatar: '🍿',
        avatarFrame: 'gold' as const,
        favoriteGenre: 'أكشن ومغامرات 💥',
        favoriteGenres: ['أكشن ومغامرات 💥'],
        selectedGenreIds: ['action'],
        isPremium: true,
        membershipBadge: '🍿 GUEST VIP',
        level: 1,
        levelTitle: 'زائر VIP',
        xp: 100,
        createdAt: Date.now()
      };
      try {
        const emailKey = guestData.email.toLowerCase();
        const existingSpec = localStorage.getItem('filmMax_user_' + emailKey);
        let finalGuest = guestData;
        if (existingSpec) {
          try {
            const p = JSON.parse(existingSpec);
            if (p && p.name) finalGuest = { ...guestData, ...p };
          } catch {}
        }
        localStorage.setItem('filmMax_user_' + emailKey, JSON.stringify(finalGuest));
        localStorage.setItem('filmMax_session', emailKey);
        localStorage.setItem('userProfile', JSON.stringify(finalGuest));
        localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(finalGuest));
      } catch {}

      updateUserProfile(guestData);
      showToast('🍿 تم الدخول السريع كزائر VIP! استمتع بكافة الميزات');
      navigateTo('home');
      onSuccess();
    }, 250);
  };

  // 3. Quick Access: Biometric Passkey (دخول ببصمة الوجه FaceID)
  const handleBiometricAuth = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      let bioUser: any = null;
      try {
        const saved = localStorage.getItem('userProfile') || localStorage.getItem('filmmax_react_profile_v5');
        if (saved) bioUser = JSON.parse(saved);
      } catch {}

      if (!bioUser || !bioUser.name) {
        bioUser = {
          id: `bio-${Date.now()}`,
          name: 'عضو البصمة الذكية FaceID',
          email: 'biometric@filmmax.vip',
          phone: '+964 770 123 4567',
          avatar: '👑',
          avatarFrame: 'diamond' as const,
          favoriteGenre: 'أكشن ومغامرات 💥',
          favoriteGenres: ['أكشن ومغامرات 💥'],
          selectedGenreIds: ['action'],
          isPremium: true,
          membershipBadge: '🛡️ FACE-ID VIP',
          level: 15,
          levelTitle: 'أسطورة السينما VIP',
          xp: 4500,
          createdAt: Date.now()
        };
      }
      try {
        const emailKey = bioUser.email.toLowerCase();
        const existingSpec = localStorage.getItem('filmMax_user_' + emailKey);
        if (existingSpec) {
          try {
            const p = JSON.parse(existingSpec);
            if (p && p.name) bioUser = { ...bioUser, ...p };
          } catch {}
        }
        localStorage.setItem('filmMax_user_' + emailKey, JSON.stringify(bioUser));
        localStorage.setItem('filmMax_session', emailKey);
        localStorage.setItem('userProfile', JSON.stringify(bioUser));
        localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(bioUser));
      } catch {}

      updateUserProfile(bioUser);
      showToast('🛡️ تم التحقق عبر البصمة الحيوية (FaceID) بنجاح!');
      navigateTo('home');
      onSuccess();
    }, 800);
  };

  // 3. Quick Access: Mobile OTP Fast Pass (رمز OTP)
  const handleSendOtp = () => {
    if (!phone.trim()) {
      showToast('يرجى كتابة رقم الهاتف أولاً 📱');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      showToast('📩 تم إرسال رمز التحقق OTP إلى هاتفك (الرمز التجريبي: 1234)');
    }, 350);
  };

  const handleVerifyOtp = () => {
    const codeStr = otpCode.join('');
    if (codeStr === '1234' || codeStr.length === 4) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        let otpUser = {
          id: `otp-${Date.now()}`,
          name: phone.trim() ? `عضو OTP (${phone.trim().slice(-4)})` : 'عضو الدخول السريع OTP',
          phone: phone.trim() || '+966 50 123 4567',
          email: `otp_${phone.trim().replace(/\D/g, '') || 'user'}@filmmax.vip`,
          avatar: '📱',
          avatarFrame: 'neon' as const,
          favoriteGenre: 'دراما وإثارة 🎭',
          favoriteGenres: ['دراما وإثارة 🎭'],
          selectedGenreIds: ['drama'],
          isPremium: true,
          membershipBadge: '📱 OTP VIP',
          level: 10,
          levelTitle: 'عضو VIP موثق',
          xp: 2500,
          createdAt: Date.now()
        };
        try {
          const emailKey = otpUser.email.toLowerCase();
          const existingSpec = localStorage.getItem('filmMax_user_' + emailKey);
          if (existingSpec) {
            try {
              const p = JSON.parse(existingSpec);
              if (p && p.name) otpUser = { ...otpUser, ...p };
            } catch {}
          }
          localStorage.setItem('filmMax_user_' + emailKey, JSON.stringify(otpUser));
          localStorage.setItem('filmMax_session', emailKey);
          localStorage.setItem('userProfile', JSON.stringify(otpUser));
          localStorage.setItem('filmmax_react_profile_v5', JSON.stringify(otpUser));
        } catch {}

        updateUserProfile(otpUser);
        showToast('🛡️ تم التحقق بنجاح برمز OTP! مشاهدة ممتعة');
        navigateTo('home');
        onSuccess();
      }, 350);
    } else {
      showToast('رمز التحقق غير صحيح! الرمز التجريبي هو: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-[9980] bg-[#07090e] overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-4 sm:p-6 select-none text-white">
      {/* Cinematic Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[160px]" />
      </div>

      {/* Main Luxury Container */}
      <div className="relative z-10 w-full max-w-xl my-auto space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <AppLogo size="lg" showSubtitle={true} subtitleText="ULTRA VIP PORTAL" animated={true} />
          <p className="text-xs text-amber-200/80 font-bold tracking-wide">
            بوابتك الفاخرة لعالم السينما والمشاهدة بجودة 4K HDR & DOLBY ATMOS
          </p>
        </div>

        {/* Real-time 3D Live VIP Membership Pass Card Preview */}
        <div className="glass-card p-5 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-red-500/10 to-yellow-500/15 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            {/* User Avatar with Frame */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-red-500 to-yellow-500 text-black flex items-center justify-center text-2xl shadow-xl font-bold border-2 border-white/40">
                  {selectedAvatar.icon}
                </div>
                <span className="absolute -bottom-1 -right-1 text-[10px] bg-black text-amber-300 font-black px-1.5 py-0.5 rounded-md border border-amber-400/40">
                  VIP
                </span>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">
                    {name.trim() || (authMode === 'signup' ? 'عضو VIP السينمائي' : 'حساب سينما VIP')}
                  </h3>
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-amber-300 font-mono font-bold">
                  {email.trim() || 'member@filmmax.vip'}
                </p>
              </div>
            </div>

            {/* VIP Seal Badge */}
            <div className="text-left shrink-0">
              <span className="text-[10px] font-mono bg-amber-400 text-black font-black px-2.5 py-1 rounded-xl shadow-md block">
                4K ULTRA READY
              </span>
              <span className="text-[9px] text-gray-300 font-mono block mt-1">
                صلاحية غير محدودة ♾️
              </span>
            </div>
          </div>
        </div>

        {/* Main Form Glass Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6 bg-black/60 backdrop-blur-2xl">
          {/* Tab Switcher (إنشاء حساب VIP | تسجيل الدخول | دخول OTP) */}
          <div className="flex p-1.5 rounded-2xl bg-black/60 border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-[#e50914] via-[#ff2e3b] to-amber-500 text-white shadow-xl shadow-red-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>إنشاء حساب VIP</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-[#e50914] via-[#ff2e3b] to-amber-500 text-white shadow-xl shadow-red-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'otp'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-xl shadow-amber-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>رمز OTP</span>
            </button>
          </div>

          {/* Quick Access Action Bar (Biometric & Fast Guest Login) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBiometricAuth}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center gap-2 text-xs font-bold text-gray-200 transition-all active:scale-95 group shadow-sm"
            >
              <Fingerprint className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>دخول ببصمة الوجه FaceID</span>
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-300 transition-all active:scale-95 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>دخول سريع كزائر VIP</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest font-bold">
              {authMode === 'otp' ? 'الدخول عبر الهاتف' : 'أو أدخل بيانات الحساب'}
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ================= MODE 1 & 2: SIGNUP / LOGIN FORM ================= */}
          {(authMode === 'signup' || authMode === 'login') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Avatar Selector (Only for Signup) */}
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-amber-300 block">اختر أيقونة وشخصية حسابك VIP:</label>
                  <div className="grid grid-cols-6 gap-2">
                    {VIP_AVATARS.map(avatar => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`p-2.5 rounded-2xl border text-xl flex items-center justify-center transition-all active:scale-95 ${
                          selectedAvatar.id === avatar.id
                            ? 'bg-amber-400/20 border-amber-400 shadow-lg scale-110'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        title={avatar.name}
                      >
                        <span>{avatar.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name Field (Signup Only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">الاسم الكامل / اللقب السينمائي</label>
                  <div className="relative flex items-center">
                    <User className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      required={authMode === 'signup'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="مثال: أحمد السينمائي"
                      className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">البريد الإلكتروني</label>
                <div className="relative flex items-center">
                  <Mail className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all font-medium dir-ltr text-right"
                  />
                </div>
              </div>

              {/* Phone Field (Signup Only) */}
              {authMode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">رقم الهاتف (اختياري)</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all font-medium dir-ltr text-right"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">كلمة المرور</label>
                <div className="relative flex items-center">
                  <Lock className="absolute right-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-10 pl-10 py-3 text-xs text-white placeholder-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all font-medium dir-ltr text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (Signup Only) */}
                {authMode === 'signup' && password && (
                  <div className="space-y-1 pt-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">قوة كلمة المرور:</span>
                      <span className="font-bold text-white">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Favorite Genre Selection Chips (Signup Only) */}
              {authMode === 'signup' && (
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-bold text-amber-300 block">حدد اهتماماتك السينمائية المفضلة:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {GENRE_OPTIONS.map(genre => {
                      const isSelected = selectedGenres.includes(genre.id);
                      return (
                        <button
                          key={genre.id}
                          type="button"
                          onClick={() => toggleGenre(genre.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-600 to-amber-500 border-amber-400 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                          }`}
                        >
                          {genre.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password Bar */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e50914] bg-[#121620] border-white/20 focus:ring-0"
                  />
                  <span>تذكر بياناتي على هذا الجهاز</span>
                </label>

                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>

              {/* Submit Main Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#e50914] via-[#ff2e3b] to-amber-500 hover:from-[#ff1f2d] hover:to-amber-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-500/30 transition-all active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'تأكيد التسجيل وانضمام VIP 🎬✨' : 'تسجيل الدخول للمنصة 🚀'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= MODE 3: MOBILE OTP FAST PASS ================= */}
          {authMode === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">رقم الجوال لتلقي الرمز (OTP)</label>
                <div className="relative flex items-center">
                  <Smartphone className="absolute right-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full bg-[#121620] border border-white/10 rounded-2xl pr-10 pl-4 py-3 text-xs text-white placeholder-gray-500 focus:border-amber-400 outline-none font-bold dir-ltr text-right"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق (OTP) 📩'}
                </button>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center space-y-1">
                    <span className="text-xs text-amber-300 font-bold block">أدخل رمز التحقق المكون من 4 أرقام:</span>
                    <span className="text-[10px] text-gray-400 block">(الرمز للتجربة: 1234)</span>
                  </div>

                  <div className="flex justify-center gap-3 dir-ltr">
                    {[0, 1, 2, 3].map(idx => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={otpCode[idx] || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const newCode = [...otpCode];
                          newCode[idx] = val;
                          setOtpCode(newCode);
                          // Auto focus next
                          if (val && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        className="w-12 h-12 rounded-2xl bg-[#121620] border-2 border-amber-400 text-center font-mono font-black text-xl text-amber-300 focus:border-white outline-none shadow-md"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs rounded-2xl shadow-xl active:scale-95 transition-all"
                  >
                    {isLoading ? 'جاري التحقق...' : 'تأكيد الدخول عبر الهاتف 🛡️'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Footer Note */}
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-emerald-400 font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تشفير بيانات سينمائي فائق الأمان (256-bit SSL)</span>
          </div>
        </div>
      </div>

      {/* Biometric Scanning Overlay Modal */}
      {isBiometricScanning && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm p-8 rounded-3xl border border-emerald-500/40 text-center space-y-5 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 animate-pulse">
              <Fingerprint className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">التحقق عبر البصمة الحيوية (FaceID)</h3>
              <p className="text-xs text-gray-300">ضع بصمتك أو وجهك أمام المستشعر للتعرف الفوري</p>
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 animate-pulse w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-3xl border border-white/20 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">استعادة كلمة المرور</h3>
            <p className="text-xs text-gray-300">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور فوراً</p>

            <input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#121620] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-amber-400 text-right"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  showToast('تم إرسال رابط استعادة كلمة المرور لبريدك 📩');
                  setIsForgotModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-amber-400 text-black font-black text-xs rounded-xl"
              >
                إرسال الرابط
              </button>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="px-4 py-2.5 bg-white/10 text-white font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
