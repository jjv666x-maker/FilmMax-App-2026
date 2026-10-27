import React, { useState, useRef } from 'react';
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
  Check,
  Image as ImageIcon,
  X,
  Camera
} from 'lucide-react';

interface ReelsVideoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  onNext: (editorData: {
    videoUrl: string;
    filter: string;
    speed: number;
    audioTrack: string;
    captionOverlay: string;
    coverPoster: string;
  }) => void;
  showToast: (msg: string) => void;
}

export const ReelsVideoEditor: React.FC<ReelsVideoEditorProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  onNext,
  showToast
}) => {
  if (!isOpen) return null;

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'standard' | 'vector' | 'glitch' | 'tint'>('normal');
  const [speed, setSpeed] = useState<number>(1);
  const [captionOverlay, setCaptionOverlay] = useState<string>('');
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [audioTrack, setAudioTrack] = useState<string>('FilmMax Studio - الصوت الأصلي');
  const [coverPoster, setCoverPoster] = useState<string>('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80');

  const coverInputRef = useRef<HTMLInputElement>(null);

  const filterStyles: Record<string, string> = {
    normal: '',
    standard: 'contrast-110 saturate-105',
    vector: 'contrast-150 saturate-125 brightness-95',
    glitch: 'hue-rotate-15 contrast-125',
    tint: 'sepia-[0.4] saturate-125'
  };

  const handleNext = () => {
    onNext({
      videoUrl,
      filter: activeFilter,
      speed,
      audioTrack,
      captionOverlay,
      coverPoster
    });
  };

  const handleFilterToggle = (filterName: 'normal' | 'standard' | 'vector' | 'glitch' | 'tint') => {
    setActiveFilter(filterName);
    showToast(`فلتر السينما: ${filterName} 🎨`);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPoster(reader.result as string);
        showToast('تم تحديث غلاف الفيديو وصورته المصغرة بنجاح 🖼️✨');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#07090d] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Hidden Cover Input */}
        <input
          type="file"
          ref={coverInputRef}
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />

        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md z-30 shrink-0 border-b border-white/10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('تم حفظ المشروع كمسودة 📝')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
            >
              حفظ
            </button>
            <button
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-red-900/50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>التالي</span>
            </button>
          </div>
        </div>

        {/* Video Canvas Area with dynamic videoUrl and Cover thumbnail button */}
        <div
          className="flex-1 relative bg-black flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-300 ${filterStyles[activeFilter]}`}
          />

          {/* Cover Thumbnail Preview Button on top-left of video */}
          <div className="absolute top-4 left-4 z-30 flex flex-col items-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
                coverInputRef.current?.click();
              }}
              className="w-14 h-20 rounded-xl bg-zinc-900 border-2 border-white/40 overflow-hidden shadow-2xl relative group cursor-pointer"
              title="تعديل الغلاف"
            >
              <img
                src={coverPoster}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/85 py-1 text-[8px] font-black text-white text-center flex items-center justify-center gap-0.5">
                <Camera className="w-2.5 h-2.5 text-amber-400" />
                <span>الغلاف</span>
              </div>
            </div>
          </div>

          {/* Text Overlay */}
          {captionOverlay && (
            <div className="absolute top-1/3 left-4 right-4 text-center z-20 pointer-events-none">
              <span className="bg-black/70 backdrop-blur-md text-white font-black text-base px-4 py-2 rounded-2xl border border-white/20 shadow-2xl inline-block">
                {captionOverlay}
              </span>
            </div>
          )}

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Filter Bar */}
        <div className="p-3 bg-[#0d0f14] border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => handleFilterToggle('normal')}
              className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeFilter === 'normal' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <X className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold">لا شيء</span>
            </button>

            <button
              onClick={() => handleFilterToggle('standard')}
              className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeFilter === 'standard' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Type className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-[10px] font-bold">قياسي</span>
            </button>

            <button
              onClick={() => handleFilterToggle('vector')}
              className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeFilter === 'vector' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <span className="text-[10px] font-black text-cyan-400">TikTok</span>
              </div>
              <span className="text-[10px] font-bold">Vector</span>
            </button>

            <button
              onClick={() => handleFilterToggle('glitch')}
              className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeFilter === 'glitch' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-[10px] font-bold">خلل</span>
            </button>

            <button
              onClick={() => handleFilterToggle('tint')}
              className={`flex flex-col items-center gap-1 shrink-0 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                activeFilter === 'tint' ? 'bg-red-600/20 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-pink-400" />
              </div>
              <span className="text-[10px] font-bold">Tint</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
