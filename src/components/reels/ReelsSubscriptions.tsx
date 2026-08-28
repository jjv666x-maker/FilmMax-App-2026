import React, { useState } from 'react';
import { ArrowRight, Bell, BellRing, Check, Plus, Search } from 'lucide-react';

interface ChannelItem {
  id: string | number;
  name: string;
  subscribers: string;
  avatar: string;
  badge?: number;
  isFollowing: boolean;
  isNotificationOn: boolean;
  isVerified?: boolean;
}

interface ReelsSubscriptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCreator: (name: string) => void;
  showToast: (msg: string) => void;
}

export const ReelsSubscriptions: React.FC<ReelsSubscriptionsProps> = ({
  isOpen,
  onClose,
  onSelectCreator,
  showToast
}) => {
  if (!isOpen) return null;

  const [channels, setChannels] = useState<ChannelItem[]>([
    {
      id: 'ch1',
      name: 'FilmMax Studio',
      subscribers: '12.4M متابع',
      avatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120',
      badge: 6,
      isFollowing: true,
      isNotificationOn: true,
      isVerified: true
    },
    {
      id: 'ch2',
      name: 'Cinema News',
      subscribers: '2.1M متابع',
      avatar: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=120',
      isFollowing: true,
      isNotificationOn: false,
      isVerified: true
    },
    {
      id: 'ch3',
      name: 'Ahmed Movies',
      subscribers: '1.8M متابع',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      isFollowing: true,
      isNotificationOn: true,
      isVerified: true
    },
    {
      id: 'ch4',
      name: 'Series Hub',
      subscribers: '950K متابع',
      avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120',
      isFollowing: false,
      isNotificationOn: false,
      isVerified: false
    },
    {
      id: 'ch5',
      name: 'Behind The Scene',
      subscribers: '780K متابع',
      avatar: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=120',
      isFollowing: true,
      isNotificationOn: false,
      isVerified: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const toggleFollow = (id: string | number) => {
    setChannels(prev =>
      prev.map(c => {
        if (c.id === id) {
          const next = !c.isFollowing;
          showToast(next ? `أنت تتابع الآن ${c.name} ✅` : `تم إلغاء متابعة ${c.name}`);
          return { ...c, isFollowing: next };
        }
        return c;
      })
    );
  };

  const toggleBell = (id: string | number) => {
    setChannels(prev =>
      prev.map(c => {
        if (c.id === id) {
          const next = !c.isNotificationOn;
          showToast(next ? `تم تفعيل جرس التنبيهات لـ ${c.name} 🔔` : `تم إيقاف التنبيهات لـ ${c.name}`);
          return { ...c, isNotificationOn: next };
        }
        return c;
      })
    );
  };

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#0d0f14] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header matching Mockup #11 */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <h3 className="text-sm font-black text-white">اشتراكات</h3>

          <div className="w-8" />
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="flex items-center gap-2 bg-[#171b24] border border-white/10 rounded-2xl px-3.5 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="البحث في القنوات والمبدعين..."
              className="w-full bg-transparent text-xs text-white placeholder-gray-400 outline-none text-right"
            />
          </div>
        </div>

        {/* Channel List matching Mockup #11 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-right">
          {filteredChannels.map(ch => (
            <div
              key={ch.id}
              className="p-3 bg-[#151821] hover:bg-[#1c202c] border border-white/10 rounded-2xl flex items-center justify-between transition-all"
            >
              {/* Left Actions (Bell & Follow Button in RTL) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBell(ch.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    ch.isNotificationOn
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                  title="التنبيهات"
                >
                  {ch.isNotificationOn ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => toggleFollow(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 ${
                    ch.isFollowing
                      ? 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/15'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40'
                  }`}
                >
                  {ch.isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>متابع</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>متابعة</span>
                    </>
                  )}
                </button>
              </div>

              {/* Creator Info (Avatar, Name, Sub count) */}
              <div
                onClick={() => {
                  onSelectCreator(ch.name);
                  onClose();
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 font-black text-xs text-white group-hover:text-red-400 transition-colors">
                    {ch.isVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-black flex items-center justify-center">
                        ✓
                      </span>
                    )}
                    <span>{ch.name}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold">{ch.subscribers}</div>
                </div>

                <div className="relative">
                  <img
                    src={ch.avatar}
                    alt={ch.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/20"
                  />
                  {ch.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-black shadow">
                      {ch.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
