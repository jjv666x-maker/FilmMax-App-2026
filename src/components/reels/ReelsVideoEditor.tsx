import React, { useState } from 'react';
import {
  ArrowRight,
  Scissors,
  Music,
  Type,
  Smile,
  Sparkles,
  SlidersHorizontal,
  Gauge,
  Plus,
  Play,
  Pause,
  Check
} from 'lucide-react';

interface ReelsVideoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (editorData: {
    videoUrl: string;
    filter: string;
    speed: number;
    audioTrack: string;
    captionOverlay: string;
  }) => void;
  showToast: (msg: string) => void;
}

export const ReelsVideoEditor: React.FC<ReelsVideoEditorProps> = ({
  isOpen,
  onClose,
  onNext,
  showToast
}) => {
  if (!isOpen) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'cinematic' | 'noir' | 'vintage' | 'vibrant'>('normal');
  const [speed, setSpeed] = useState<number>(1);
  const [captionOverlay, setCaptionOverlay] = useState<string>('');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [audioTrack, setAudioTrack] = useState<string>('FilmMax Studio - الصوت الأصلي');
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);

  const filterStyles: Record<string, string> = {
    normal: '',
    cinematic: 'contrast-125 saturate-110 brightness-95',
    noir: 'grayscale contrast-150',
    vintage: 'sepia-[0.35] contrast-110 saturate-90',
    vibrant: 'saturate-150 contrast-110'
  };

  const handleNext = () => {
    onNext({
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      filter: activeFilter,
      speed,
      audioTrack,
      captionOverlay
    });
  };

  const handleSpeedToggle = () => {
    const speeds = [0.5, 1, 1.5, 2, 3];
    const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(nextSpeed);
    showToast(`تم ضبط سرعة الفيديو على ${nextSpeed}x ⚡`);
  };

  const handleFilterToggle = () => {
    const filters: Array<'normal' | 'cinematic' | 'noir' | 'vintage' | 'vibrant'> = [
      'normal',
      'cinematic',
      'noir',
      'vintage',
      'vibrant'
    ];
    const nextFilter = filters[(filters.indexOf(activeFilter) + 1) % filters.length];
    setActiveFilter(nextFilter);
    showToast(`فلتر السينما: ${nextFilter} 🎨`);
  };

  const handleAudioChange = () => {
    const tracks = [
      'FilmMax Studio - الصوت الأصلي 🎵',
      'Hans Zimmer - Time 🎻',
      'Ludwig Göransson - Oppenheimer 💥',
      'Ramin Djawadi - House of the Dragon 🐉'
    ];
    const next = tracks[(tracks.indexOf(audioTrack) + 1) % tracks.length];
    setAudioTrack(next);
    showToast(`تم اختيار المسار: ${next}`);
  };

  const handleStickerToggle = () => {
    const stickers = ['🔥 مشهد أسطوري', '🍿 FilmMax Exclusive', '👑 4K HDR', '⭐ 10/10'];
    const next = activeSticker ? null : stickers[Math.floor(Math.random() * stickers.length)];
    setActiveSticker(next);
    showToast(next ? `تمت إضافة ملصق: ${next}` : 'تمت إزالة الملصق');
  };

  const handleEffectToggle = () => {
    const effects = ['sparkles', 'glow', 'cinema-vignette'];
    const next = selectedEffect ? null : effects[Math.floor(Math.random() * effects.length)];
    setSelectedEffect(next);
    showToast(next ? 'تم تطبيق المؤثر السينمائي ✨' : 'تم إلغاء المؤثر');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#07090d] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Top Header matching Mockup #6 */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-md z-30 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-red-900/50 active:scale-95 transition-all flex items-center gap-1"
          >
            <span>التالي</span>
          </button>
        </div>

        {/* Video Canvas Area */}
        <div
          className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <video
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-300 ${filterStyles[activeFilter]}`}
          />

          {/* Vignette & Effects Layer */}
          {selectedEffect === 'sparkles' && (
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(255,215,0,0.15)_10%,transparent_70%)] animate-pulse" />
          )}

          {/* Text Overlay */}
          {captionOverlay && (
            <div className="absolute top-1/3 left-4 right-4 text-center z-20 pointer-events-none">
              <span className="bg-black/70 backdrop-blur-md text-white font-black text-base sm:text-lg px-4 py-2 rounded-2xl border border-white/20 shadow-2xl inline-block">
                {captionOverlay}
              </span>
            </div>
          )}

          {/* Active Sticker */}
          {activeSticker && (
            <div className="absolute top-1/4 right-6 z-20 pointer-events-none animate-bounce">
              <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-2xl border border-white/30">
                {activeSticker}
              </span>
            </div>
          )}

          {/* Play/Pause Overlay Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Right-Side Vertical Tools Toolbar matching Mockup #6 */}
          <div
            className="absolute top-4 right-3 z-30 flex flex-col items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* 1. قص (Trim) */}
            <button
              onClick={() => showToast('أداة القص وتحديد بداية ونهاية المقطع ✂️')}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="قص"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black">قص</span>
            </button>

            {/* 2. صوت (Audio) */}
            <button
              onClick={handleAudioChange}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="صوت"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Music className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[9px] font-black">صوت</span>
            </button>

            {/* 3. نص (Text) */}
            <button
              onClick={() => setIsAddingText(!isAddingText)}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="نص"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Type className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-[9px] font-black">نص</span>
            </button>

            {/* 4. ملصقات (Stickers) */}
            <button
              onClick={handleStickerToggle}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="ملصقات"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Smile className="w-4 h-4 text-yellow-400" />
              </div>
              <span className="text-[9px] font-black">ملصقات</span>
            </button>

            {/* 5. تأثيرات (Effects) */}
            <button
              onClick={handleEffectToggle}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="تأثيرات"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              <span className="text-[9px] font-black">تأثيرات</span>
            </button>

            {/* 6. فلاتر (Filters) */}
            <button
              onClick={handleFilterToggle}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="فلاتر"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[9px] font-black">فلاتر</span>
            </button>

            {/* 7. السرعة (Speed) */}
            <button
              onClick={handleSpeedToggle}
              className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
              title="السرعة"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[9px] font-black">{speed}x</span>
            </button>
          </div>

          {/* Text Input Modal when adding text */}
          {isAddingText && (
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-4 z-40"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full max-w-xs space-y-3 text-center">
                <h4 className="text-sm font-black text-white">إضافة نص فوق الفيديو</h4>
                <input
                  type="text"
                  autoFocus
                  value={captionOverlay}
                  onChange={e => setCaptionOverlay(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white text-center outline-none"
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setIsAddingText(false)}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl"
                  >
                    تم
                  </button>
                  <button
                    onClick={() => {
                      setCaptionOverlay('');
                      setIsAddingText(false);
                    }}
                    className="px-4 py-1.5 bg-white/10 text-gray-300 text-xs font-bold rounded-xl"
                  >
                    مسح
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Audio Bar matching Mockup #6 */}
          <div className="absolute bottom-16 left-4 right-4 z-20 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-2 shadow-xl">
              <Music className="w-3.5 h-3.5 text-white animate-spin-slow" />
              <span>{audioTrack}</span>
            </div>
          </div>
        </div>

        {/* Film Frame Strip at Bottom matching Mockup #6 */}
        <div className="p-3 bg-black/90 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[1, 2, 3, 4, 5].map(frame => (
              <div
                key={frame}
                className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden border border-white/20 shrink-0 relative opacity-80 hover:opacity-100 cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100"
                  alt={`Frame ${frame}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => showToast('إضافة مقطع إضافي للدمج 🎞️')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white shrink-0 active:scale-95"
            title="إضافة مقطع"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
