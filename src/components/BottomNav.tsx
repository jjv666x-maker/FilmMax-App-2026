import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';
import { Home, Clapperboard, Radio, Bookmark, User } from 'lucide-react';

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
  { id: 'account', label: 'الحساب', icon: User }
];

export const BottomNav: React.FC = () => {
  const { activeScreen, navigateTo } = useApp();

  // Hide navigation bar when watching a video in player
  if (activeScreen === 'player') return null;

  // Determine which nav is active
  const isNavActive = (id: ScreenId) => {
    if (activeScreen === id) return true;
    if (id === 'account' && ['account', 'subscription', 'quality', 'notifications', 'privacy', 'help', 'about', 'downloads', 'subtitles', 'audio', 'security', 'parent', 'personal', 'share', 'settings'].includes(activeScreen)) {
      return true;
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none safe-area-pb px-0 sm:px-4 md:px-6">
      <nav className="pointer-events-auto w-full max-w-full sm:max-w-md md:max-w-xl h-12 sm:h-14 md:h-18 sm:mb-2 sm:rounded-2xl bg-[#0c0f15]/95 backdrop-blur-2xl border-t sm:border border-white/10 sm:border-white/15 px-1 sm:px-3 py-0.5 sm:py-1 flex items-center justify-around shadow-2xl transition-all">
        {NAV_ITEMS.map(item => {
          const active = isNavActive(item.id);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                navigateTo(item.id);
              }}
              className={`flex flex-col items-center justify-center py-0.5 sm:py-1 px-1 sm:px-3 rounded-xl transition-all relative ${
                active
                  ? 'text-[#e50914] font-black'
                  : 'text-gray-400 hover:text-gray-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                {item.id === 'live' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-xs mt-0.5 transition-colors whitespace-nowrap">
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-3.5 sm:w-5 h-0.5 bg-[#e50914] rounded-full shadow-[0_0_8px_#e50914]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
