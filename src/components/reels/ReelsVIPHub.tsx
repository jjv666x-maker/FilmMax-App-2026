import React, { useState } from 'react';
import { ArrowRight, Crown, Sparkles, CheckCircle2, Play, Lock } from 'lucide-react';
import { ReelItem } from '../../types';

interface ReelsVIPHubProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReel: (reelId: string | number) => void;
  showToast: (msg: string) => void;
}

export const ReelsVIPHub: React.FC<ReelsVIPHubProps> = ({
  isOpen,
  onClose,
  onSelectReel,
  showToast
}) => {
  if (!isOpen) return null;

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const vipClips = [
    {
      id: 'vip1',
      title: 'تاج الدم - الحلقة الخاصة',
      views: '240K',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
      duration: '0:58'
    },
    {
      id: 'vip2',
      title: 'مشهد محذوف وحصري',
      views: '185K',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400',
      duration: '0:45'
    },
    {
      id: 'vip3',
      title: 'كواليس المؤثرات السينمائية 4K',
      views: '160K',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
      duration: '0:52'
    },
    {
      id: 'vip4',
      title: 'مقابلة المخرج الخاصة',
      views: '130K',
      poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400',
      duration: '1:00'
    }
  ];

  const handleSubscribeToggle = () => {
    const next = !isSubscribed;
    setIsSubscribed(next);
    showToast(
      next
        ? 'تهانينا! تم تفعيل اشتراك VIP بنجاح 👑✨ استمتع بالمحتوى الحصري'
        : 'تم إلغاء اشتراك VIP'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#0d0f14] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Top Header matching Mockup #10 */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 font-black text-sm text-amber-400">
            <span>VIP</span>
            <Crown className="w-4 h-4" />
          </div>

          <div className="w-8" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-right">
          
          {/* VIP Banner Card matching Mockup #10 */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-red-900/30 to-[#12151e] border border-amber-400/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 left-2 text-amber-400/20">
              <Crown className="w-24 h-24 stroke-[1]" />
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-end gap-2">
                <h3 className="text-base font-black text-amber-300">عضوية FilmMax VIP</h3>
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>

              <p className="text-xs text-gray-300 font-bold">
                انضم إلى النخبة واستمتع بأقوى الميزات الحصرية وصناع الأفلام المحترفين:
              </p>

              {/* Benefits Checklist matching Mockup #10 */}
              <div className="space-y-2 pt-1 text-xs font-bold text-gray-200">
                <div className="flex items-center justify-end gap-2">
                  <span>مشاهدة المحتوى الحصري قبل الجميع</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>جودة 4K بدون إعلانات</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>بث مباشر حصري</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>شارات VIP ومميزات خاصة</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>دعم فني مخصص</span>
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
              </div>

              {/* Subscribe CTA button matching Mockup #10 */}
              <div className="pt-3">
                <button
                  onClick={handleSubscribeToggle}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 ${
                    isSubscribed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-red-900/50'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>{isSubscribed ? 'عضوية VIP مفعلة ✅' : 'اشترك الآن'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exclusive Section Title matching Mockup #10 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-amber-400 font-bold">4 مقاطع حصرية</span>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>محتوى حصري لـ VIP</span>
              </h4>
            </div>

            {/* Exclusive Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {vipClips.map(clip => (
                <div
                  key={clip.id}
                  onClick={() => {
                    if (isSubscribed) {
                      onSelectReel(clip.id);
                      onClose();
                    } else {
                      showToast('هذا المقطع متاح فقط لأعضاء VIP 👑 اشترك الآن لفتحه!');
                    }
                  }}
                  className="relative aspect-[9/14] bg-gray-900 rounded-2xl overflow-hidden group cursor-pointer border border-amber-500/20 shadow-lg"
                >
                  <img
                    src={clip.poster}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Top VIP Badge */}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-200 text-black text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Crown className="w-2.5 h-2.5" />
                    <span>VIP</span>
                  </div>

                  {/* Locked indicator if not subscribed */}
                  {!isSubscribed && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/70 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-xl">
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Title & Views */}
                  <div className="absolute bottom-2 left-2 right-2 text-right">
                    <div className="text-[11px] font-black text-white line-clamp-1">{clip.title}</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 font-bold mt-0.5">
                      <span>{clip.views}</span>
                      <Play className="w-2.5 h-2.5 fill-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
