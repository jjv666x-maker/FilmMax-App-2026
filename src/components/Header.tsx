import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clapperboard,
  Search,
  Mic,
  MicOff,
  Bell,
  Crown,
  Gem,
  X,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Check,
  Layers,
  Server
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/translations';
import { AppLogo } from './AppLogo';

export const Header: React.FC = () => {
  const {
    navigateTo,
    activeScreen,
    unreadNotificationsCount,
    setIsNotificationOpen,
    setIsPremiumModalOpen,
    setIsEvolutionModalOpen,
    setIsAccountSwitcherOpen,
    setIsIngestionStudioOpen,
    setIsNetflixArchOpen,
    userProfile,
    searchQuery,
    setSearchQuery,
    language,
    setLanguage,
    currentLanguageInfo,
    theme,
    setTheme,
    t,
    showToast
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      if (activeScreen !== 'search') {
        navigateTo('search');
      }
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('البحث الصوتي غير مدعوم في متصفحك حالياً');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : language;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      showToast('🎤 تحدث الآن للبحث...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setLocalSearch(transcript);
          setSearchQuery(transcript);
          navigateTo('search');
          showToast(`تم البحث عن: "${transcript}"`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('تعذر التعرف على الصوت، يرجى المحاولة ثانية');
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

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('cinema');
    } else {
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-header px-2.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3 transition-all">
      {/* Brand Logo */}
      <button
        onClick={() => navigateTo('home')}
        className="hover:opacity-90 active:scale-95 transition-transform shrink-0"
        title="FilmMax Cinema"
      >
        <AppLogo size="sm" showSubtitle={true} subtitleText="VIP" />
      </button>

      {/* Global Search Input with Voice & Clear */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 min-w-[120px] max-w-xs sm:max-w-md mx-1 sm:mx-2 flex items-center bg-[#151922] dark:bg-[#151922] border border-white/10 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 focus-within:border-[#e50914]/60 focus-within:ring-2 focus-within:ring-[#e50914]/20 transition-all shadow-inner"
      >
        <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0 ml-1.5 sm:ml-2" />
        <input
          type="text"
          value={localSearch}
          onChange={e => {
            setLocalSearch(e.target.value);
            if (activeScreen === 'search') {
              setSearchQuery(e.target.value);
            }
          }}
          placeholder={t('search', 'بحث...')}
          className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 font-medium"
        />

        {localSearch && (
          <button
            type="button"
            onClick={() => {
              setLocalSearch('');
              setSearchQuery('');
            }}
            className="p-0.5 sm:p-1 text-gray-400 hover:text-white rounded-full transition-colors"
            title="مسح"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`p-1 sm:p-1.5 rounded-full text-xs transition-all ${
            isListening
              ? 'bg-[#e50914] text-white animate-pulse shadow-md shadow-[#e50914]/40'
              : 'text-gray-400 hover:text-[#e50914] hover:bg-white/5'
          }`}
          title="بحث صوتي"
        >
          {isListening ? <MicOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* AI Evolution Diamond Button (المطور الذكي) */}
        <button
          onClick={() => setIsEvolutionModalOpen(true)}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border border-amber-500/35 text-[#f5c518] hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 active:scale-95 transition-all shrink-0"
          title="التطور الذكي AI"
        >
          <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f5c518] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap">AI الذكي</span>
        </button>



        {/* FilmMax Premium VIP Crown Button (اشتراك VIP) */}
        <button
          onClick={() => setIsPremiumModalOpen(true)}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e50914]/25 via-[#e50914]/15 to-[#ff4757]/10 border border-[#e50914]/40 text-white hover:border-[#e50914] hover:shadow-lg hover:shadow-[#e50914]/20 active:scale-95 transition-all shrink-0"
          title="اشتراك VIP"
        >
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 drop-shadow" />
          <span className="text-[10px] sm:text-xs font-black whitespace-nowrap">VIP</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-1.5 sm:p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
          title="الإشعارات"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#e50914] text-white text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#07090d]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

