import React, { useState } from 'react';
import {
  ArrowRight,
  Settings,
  Zap,
  ZapOff,
  SwitchCamera,
  Type,
  Smile,
  Music,
  MapPin,
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface ReelsCameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptured: (media: { type: 'story' | 'reel'; url: string }) => void;
  showToast: (msg: string) => void;
}

export const ReelsCameraCapture: React.FC<ReelsCameraCaptureProps> = ({
  isOpen,
  onClose,
  onCaptured,
  showToast
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'story' | 'reel'>('story');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);
  const [overlayText, setOverlayText] = useState<string>('');
  const [activeSticker, setActiveSticker] = useState<string | null>(null);
  const [activeMusic, setActiveMusic] = useState<string | null>(null);

  const handleCapture = () => {
    showToast(mode === 'story' ? 'تم التقاط القصة بنجاح! 📸' : 'تم تصوير مقطع Reel بنجاح! 🎬');
    onCaptured({
      type: mode,
      url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800'
    });
  };

  const handleToggleFlash = () => {
    setIsFlashOn(!isFlashOn);
    showToast(!isFlashOn ? 'الفلاش مفعّل ⚡' : 'الفلاش معطل');
  };

  const handleFlipCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    showToast(isFrontCamera ? 'الكاميرا الخلفية 🔄' : 'الكاميرا الأمامية 🔄');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#07090d] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Background Camera Feed Simulation (City sunset skyline matching mockup #8) */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
            isFrontCamera ? 'scale-x-[-1]' : ''
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Top Camera Controls matching Mockup #8 */}
        <div className="flex items-center justify-between px-4 py-3 z-30 shrink-0">
          <button
            onClick={onClose}
            className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('إعدادات الكاميرا والجودة ⚙️')}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleFlash}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              {isFlashOn ? <Zap className="w-5 h-5 text-amber-400" /> : <ZapOff className="w-5 h-5 text-white" />}
            </button>

            <button
              onClick={handleFlipCamera}
              className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Toolbar matching Mockup #8 */}
        <div className="absolute top-16 right-3 z-30 flex flex-col items-center gap-3.5 bg-black/30 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
          {/* نص Aa */}
          <button
            onClick={() => {
              const text = prompt('اكتب النص المضاف للقصة:', 'سهرة أفلام ممتعة 🍿');
              if (text) {
                setOverlayText(text);
                showToast('تمت إضافة النص');
              }
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
          >
            <Type className="w-5 h-5 text-white" />
            <span className="text-[9px] font-black">نص</span>
          </button>

          {/* ملصق */}
          <button
            onClick={() => {
              setActiveSticker(prev => (prev ? null : '🎭 السينما'));
              showToast('تم اختيار الملصق');
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
          >
            <Smile className="w-5 h-5 text-amber-400" />
            <span className="text-[9px] font-black">ملصق</span>
          </button>

          {/* موسيقى */}
          <button
            onClick={() => {
              setActiveMusic(prev => (prev ? null : 'Hans Zimmer - Interstellar 🎵'));
              showToast('تمت إضافة موسيقى خلفية 🎶');
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
          >
            <Music className="w-5 h-5 text-pink-400" />
            <span className="text-[9px] font-black">موسيقى</span>
          </button>

          {/* GIF */}
          <button
            onClick={() => showToast('مكتبة صور متحركة GIF 🎬')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
          >
            <span className="text-xs font-black text-cyan-400">GIF</span>
            <span className="text-[9px] font-black">GIF</span>
          </button>

          {/* موقع */}
          <button
            onClick={() => showToast('تمت إضافة موقع: Cinema Hall 📍')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
          >
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="text-[9px] font-black">موقع</span>
          </button>
        </div>

        {/* Center Canvas Preview Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative pointer-events-none p-4">
          {overlayText && (
            <span className="bg-black/60 backdrop-blur-md text-white font-black text-base px-4 py-2 rounded-2xl border border-white/20 shadow-2xl">
              {overlayText}
            </span>
          )}
          {activeSticker && (
            <span className="mt-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-2xl">
              {activeSticker}
            </span>
          )}
          {activeMusic && (
            <span className="mt-2 bg-black/60 text-pink-300 font-bold text-xs px-3 py-1 rounded-full border border-pink-500/30">
              {activeMusic}
            </span>
          )}
        </div>

        {/* Bottom Shutter & Mode Switcher Area matching Mockup #8 */}
        <div className="pb-6 pt-3 px-6 z-30 flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          {/* Shutter row with gallery preview on left */}
          <div className="w-full flex items-center justify-between">
            {/* Gallery Thumbnail Button */}
            <button
              onClick={() => showToast('فتح معرض الصور والفيديوهات 🖼️')}
              className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg active:scale-90 transition-transform"
            >
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100"
                alt="Gallery"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Large Shutter Button matching Mockup #8 */}
            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-90 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center hover:bg-gray-200" />
            </button>

            <div className="w-11" />
          </div>

          {/* Mode Switcher: قصة | ريلز matching Mockup #8 */}
          <div className="flex items-center gap-6 text-sm font-black tracking-wide">
            <button
              onClick={() => setMode('story')}
              className={`transition-all ${
                mode === 'story' ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              قصة
            </button>

            <button
              onClick={() => setMode('reel')}
              className={`transition-all ${
                mode === 'reel' ? 'text-white scale-110' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              ريلز
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
