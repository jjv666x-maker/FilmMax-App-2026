import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  Monitor,
  Volume2,
  Subtitles,
  Smartphone,
  Cloud,
  FileText,
  Bookmark,
  Clock,
  RotateCcw,
  Crown,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MoreSidebar: React.FC = () => {
  const { 
    isMoreSidebarOpen, 
    setIsMoreSidebarOpen, 
    navigateTo, 
    userProfile, 
    theme,
    setTheme,
    language,
    setLanguage,
    setIsPremiumModalOpen,
    setIsChatSupportOpen,
    t,
    setStartupStage
  } = useApp();

  const menuGroups = [
    {
      title: 'الحساب والملف الشخصي',
      items: [
        { id: 'account', label: 'الملف الشخصي', icon: User, screen: 'account' },
        { id: 'edit_profile', label: 'تعديل الملف الشخصي', icon: User, screen: 'personal' },
        { id: 'account_mgmt', label: 'إدارة الحساب', icon: Settings, screen: 'settings' },
      ]
    },
    {
      title: 'المحتوى والمشاهدة',
      items: [
        { id: 'saved', label: 'قائمتي والمحفوظات', icon: Bookmark, screen: 'favorites' },
        { id: 'history', label: 'سجل المشاهدة', icon: RotateCcw, screen: 'settings' },
        { id: 'search', label: 'سجل البحث', icon: FileText, screen: 'search' },
      ]
    },
    {
      title: 'التفضيلات',
      items: [
        { id: 'notifications', label: 'الإشعارات', icon: Bell, screen: 'notifications' },
        { id: 'privacy', label: 'الخصوصية والأمان', icon: ShieldCheck, screen: 'privacy' },
        { id: 'quality', label: 'الجودة والتنزيلات', icon: Monitor, screen: 'quality' },
        { id: 'theme', label: 'المظهر', icon: Settings, screen: 'settings' },
        { id: 'lang', label: 'اللغة', icon: Settings, screen: 'settings' },
      ]
    },
    {
      title: 'الخدمات',
      items: [
        { id: 'vip', label: 'عضوية VIP والاشتراكات', icon: Crown, screen: 'subscription' },
        { id: 'help', label: 'المساعدة والدعم', icon: HelpCircle, screen: 'help' },
        { id: 'about', label: 'حول FilmMax', icon: Info, screen: 'about' },
      ]
    }
  ];

  if (!isMoreSidebarOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMoreSidebarOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Sidebar Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`relative w-full max-w-[320px] sm:max-w-md h-full ${
            theme === 'light' ? 'bg-white' : 'bg-[#0f111a]'
          } shadow-2xl border-l border-white/5 flex flex-col`}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#e50914]" />
              {t('more_options', 'المزيد')}
            </h2>
            <button
              onClick={() => setIsMoreSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* User Profile Summary */}
          <div className="p-6 flex items-center gap-4 bg-gradient-to-br from-[#e50914]/5 to-transparent">
            <div className="relative w-16 h-16 rounded-full border-2 border-[#e50914] p-0.5 overflow-hidden">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{userProfile.name}</h3>
              <p className="text-sm text-gray-400">@{userProfile.username || 'user'}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-wider">
                {userProfile.membershipBadge || 'VIP Member'}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
            {menuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <h3 className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {group.title}
                </h3>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'theme') {
                        setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'cinema' : 'dark');
                      } else if (item.id === 'lang') {
                        setLanguage(language === 'ar' ? 'en' : 'ar');
                      } else if (item.id === 'vip') {
                        setIsPremiumModalOpen(true);
                      } else if (item.id === 'help') {
                        setIsChatSupportOpen(true);
                      } else {
                        navigateTo(item.screen as any);
                      }
                      setIsMoreSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                      theme === 'light' 
                        ? 'hover:bg-gray-100 text-gray-900' 
                        : 'hover:bg-white/5 text-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${
                        theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-white/5 text-gray-400'
                      } group-hover:text-[#e50914] transition-colors`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm sm:text-base">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5 space-y-4">
            <button
              onClick={() => {
                setStartupStage('auth');
                setIsMoreSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {t('logout', 'تسجيل الخروج')}
            </button>
            <p className="text-center text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
              FilmMax Cinema — Build v5.4.2
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
