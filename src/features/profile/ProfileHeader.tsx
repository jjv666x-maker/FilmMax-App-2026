import React, { useState, useEffect } from 'react';
import { Camera, Palette, Sparkles, RefreshCw, Check, Crown, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../shared/types';
import {
  ProfileBackground,
  profileBackgroundService,
  COLOR_PRESETS,
  IMAGE_PRESETS
} from './profileBackgroundService';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  favoritesCount?: number;
  reelsCount?: number;
  onEditProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  favoritesCount = 0,
  reelsCount = 0,
  onEditProfile
}) => {
  const profileId = profile?.id || 'default-profile';
  const [background, setBackground] = useState<ProfileBackground>(() =>
    profileBackgroundService.getBackground(profileId)
  );
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');

  useEffect(() => {
    setBackground(profileBackgroundService.getBackground(profileId));
  }, [profileId]);

  const updateBackground = (newBg: ProfileBackground) => {
    const saved = profileBackgroundService.saveBackground(profileId, newBg);
    setBackground(saved);
  };

  const handleReset = () => {
    const res = profileBackgroundService.resetBackground(profileId);
    setBackground(res);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-8">
      {/* Background Banner Area */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-black">
        {background.mode === 'image' && (
          <img
            src={background.value}
            alt="Profile Cover"
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: `scale(${background.zoom || 1}) translateY(${background.offsetY || 0}px)`
            }}
          />
        )}

        {background.mode === 'color' && (
          <div
            className="w-full h-full transition-all duration-500"
            style={{ background: background.value }}
          />
        )}

        {background.mode === 'video' && (
          <video
            src={background.value}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

        {/* Customization Button */}
        <button
          onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium border border-white/10 transition"
        >
          <Camera className="w-4 h-4 text-amber-400" />
          تخصيص الغلاف
        </button>

        {/* Customization Panel */}
        {isCustomizeOpen && (
          <div className="absolute top-16 left-4 z-30 w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl text-white space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                تخصيص غلاف الملف الشخصي
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                إعادة ضبط
              </button>
            </div>

            {/* Colors */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">تدرجات ألوان فاخرة</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {COLOR_PRESETS.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateBackground({ mode: 'color', value: color })}
                    className="w-8 h-8 rounded-full border border-white/20 shrink-0 transition hover:scale-110 flex items-center justify-center"
                    style={{ background: color }}
                  >
                    {background.mode === 'color' && background.value === color && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">خلفيات سينمائية</label>
              <div className="grid grid-cols-4 gap-2">
                {IMAGE_PRESETS.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => updateBackground({ mode: 'image', value: img, zoom: 1 })}
                    className="relative h-12 rounded-lg overflow-hidden border border-white/20 transition hover:opacity-90"
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                    {background.mode === 'image' && background.value === img && (
                      <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-zinc-400 font-medium">رابط صورة خارجي</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/cover.jpg"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (customImageUrl.trim()) {
                      updateBackground({ mode: 'image', value: customImageUrl.trim(), zoom: 1 });
                      setCustomImageUrl('');
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  تطبيق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Profile Content */}
      <div className="relative px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
        {/* Left Info with Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-right">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-red-500 to-purple-600 shadow-2xl">
              <img
                src={
                  profile?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                }
                alt={profile?.name || 'Profile'}
                className="w-full h-full object-cover rounded-[22px] bg-zinc-900"
              />
            </div>

            {profile?.isPremium && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 text-black p-1.5 rounded-full shadow-lg border border-black">
                <Crown className="w-4 h-4 fill-black" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black text-white tracking-wide">
                {profile?.name || 'المستخدم الرئيسي'}
              </h1>
              {profile?.isPremium && (
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VIP
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-400 font-mono dir-ltr text-center sm:text-right">
              {profile?.username || '@filmmax_user'}
            </p>

            <div className="flex items-center gap-4 pt-2 justify-center sm:justify-start text-xs text-zinc-300">
              <div>
                <span className="font-bold text-white ml-1">{favoritesCount}</span>
                <span className="text-zinc-500">المفضلة</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div>
                <span className="font-bold text-white ml-1">{reelsCount}</span>
                <span className="text-zinc-500">الريلز</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div>
                <span className="font-bold text-amber-400 ml-1">FilmMax</span>
                <span className="text-zinc-500">Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-center sm:justify-end">
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition border border-zinc-700"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              تعديل الحساب
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
