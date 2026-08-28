import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import { Home, Clapperboard, Radio, Bookmark, MoreHorizontal } from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'reels', label: 'ريلز', icon: Clapperboard },
  { id: 'live', label: 'بث مباشر', icon: Radio },
  { id: 'favorites', label: 'قائمتي', icon: Bookmark },
  { id: 'settings', label: 'المزيد', icon: MoreHorizontal }
];

export const BottomNav: React.FC = () => {
  const { activeScreen, navigateTo } = useApp();

  // Determine which nav is active
  const isNavActive = (id: ScreenId) => {
    if (activeScreen === id) return true;
    if (id === 'settings' && ['account', 'subscription', 'quality', 'notifications', 'privacy', 'help', 'about', 'downloads', 'subtitles', 'audio', 'security', 'parent', 'personal', 'share'].includes(activeScreen)) {
      return true;
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none safe-area-pb px-0 sm:px-4 md:px-6">
      <nav className="pointer-events-auto w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl sm:mb-2.5 sm:rounded-3xl bg-[#0c0f15]/95 backdrop-blur-2xl border-t sm:border border-white/10 sm:border-white/15 px-2 sm:px-4 py-1.5 flex items-center justify-around shadow-2xl transition-all">
        {NAV_ITEMS.map(item => {
          const active = isNavActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 rounded-2xl transition-all relative ${
                active
                  ? 'text-[#e50914] font-black'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                {item.id === 'live' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-1 transition-colors whitespace-nowrap">
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-5 sm:w-6 h-1 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
