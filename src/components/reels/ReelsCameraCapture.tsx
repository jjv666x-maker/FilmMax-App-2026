import React, { useState, useRef } from 'react';
import {
  X,
  SwitchCamera,
  Zap,
  ZapOff,
  Music,
  Clock,
  LayoutGrid,
  Mic,
  Maximize2,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Check,
  Search,
  Heart,
  Flame,
  Star
} from 'lucide-react';

interface ReelsCameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptured: (media: { type: 'story' | 'reel'; url: string; duration?: string; audioTrack?: string }) => void;
  showToast: (msg: string) => void;
}

export const ReelsCameraCapture: React.FC<ReelsCameraCaptureProps> = ({
  isOpen,
  onClose,
  onCaptured,
  showToast
}) => {
  if (!isOpen) return null;

  const [durationMode, setDurationMode] = useState<'10m' | '60s' | '15s' | 'photo' | 'text'>('15s');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);
  const [activeSound, setActiveSound] = useState<string>('FilmMax Studio - الصوت الأصلي 🎵');
  const [isSoundPickerOpen, setIsSoundPickerOpen] = useState<boolean>(false);
  const [soundTab, setSoundTab] = useState<'trending' | 'foryou' | 'favorites' | 'recent'>('trending');
  const [soundSearchQuery, setSoundSearchQuery] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [bottomTab, setBottomTab] = useState<'camera' | 'creativity'>('camera');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');

  const galleryInputRef = useRef<HTMLInputElement>(null);

  const soundTracks = [
    { id: 's1', title: 'FilmMax Studio - الصوت الأصلي', artist: 'FilmMax', duration: '1:00', popular: true },
    { id: 's2', title: 'Scott Adkins - Epic Action Track', artist: 'Action Beats', duration: '0:30', popular: true },
    { id: 's3', title: 'Majnun Nabu - Cinematic Remix', artist: 'DJ Nabu', duration: '0:45', popular: true },
    { id: 's4', title: 'Hans Zimmer - Interstellar Theme', artist: 'Orchestra', duration: '2:15', popular: false },
    { id: 's5', title: 'Paper Moon Static', artist: 'Marnie Cusk', duration: '0:55', popular: true }
  ];

  const handleCaptureClick = () => {
    setIsRecording(true);
    showToast(durationMode === 'photo' ? 'تم التقاط الصورة بنجاح! 📸' : 'جاري تسجيل مقطع Reel 🎬...');
    setTimeout(() => {
      setIsRecording(false);
      onCaptured({
        type: durationMode === 'photo' ? 'story' : 'reel',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: durationMode,
        audioTrack: activeSound
      });
    }, 1200);
  };

  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      showToast('تم تحميل الفيديو من المعرض بنجاح! 📁🎬');
      onCaptured({
        type: 'reel',
        url,
        duration: '60s',
        audioTrack: activeSound
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#07090d] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Hidden Gallery Input */}
        <input
          type="file"
          ref={galleryInputRef}
          accept="video/*,image/*"
          onChange={handleGalleryFileSelect}
          className="hidden"
        />

        {/* Background Camera Feed Simulation */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
            isFrontCamera ? 'scale-x-[-1]' : ''
          }`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

        {/* Top Header Controls matching TikTok Video */}
        <div className="flex items-center justify-between px-4 py-3 z-30 shrink-0">
          {/* Close X Button */}
          <button
            onClick={onClose}
            className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Sound Picker Button in Center matching TikTok Video */}
          <button
            onClick={() => setIsSoundPickerOpen(true)}
            className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all border border-white/20 shadow-xl flex items-center gap-2 active:scale-95 cursor-pointer"
            title="إضافة صوت"
          >
            <Music className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span className="text-xs font-black truncate max-w-[150px]">{activeSound}</span>
          </button>

          {/* Flip Camera & Flash */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsFlashOn(!isFlashOn);
                showToast(!isFlashOn ? 'الفلاش مفعّل ⚡' : 'الفلاش معطل');
              }}
              className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors active:scale-95"
            >
              {isFlashOn ? <Zap className="w-4 h-4 text-amber-400" /> : <ZapOff className="w-4 h-4 text-white" />}
            </button>
            <button
              onClick={() => {
                setIsFrontCamera(!isFrontCamera);
                showToast(isFrontCamera ? 'الكاميرا الخلفية 🔄' : 'الكاميرا الأمامية 🔄');
              }}
              className="p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors active:scale-95"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right-Side Vertical Toolbar matching TikTok Video */}
        <div className="absolute top-16 right-3 z-30 flex flex-col items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl">
          {/* المؤقت (Timer) */}
          <button
            onClick={() => showToast('مؤقت التسجيل التلقائي ⏱️')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
            title="المؤقت"
          >
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-[9px] font-black">المؤقت</span>
          </button>

          {/* التخطيط (Layout) */}
          <button
            onClick={() => showToast('تخطيط الشاشة المقسمة ⊞')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
            title="التخطيط"
          >
            <LayoutGrid className="w-5 h-5 text-cyan-400" />
            <span className="text-[9px] font-black">التخطيط</span>
          </button>

          {/* ميكروفون (Microphone) */}
          <button
            onClick={() => showToast('تسجيل الصوت والتعليق الصوتي 🎤')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
            title="ميكروفون"
          >
            <Mic className="w-5 h-5 text-pink-400" />
            <span className="text-[9px] font-black">ميكروفون</span>
          </button>

          {/* النسبة (Aspect Ratio / Crop) */}
          <button
            onClick={() => {
              const ratios: Array<'9:16' | '1:1' | '16:9'> = ['9:16', '1:1', '16:9'];
              const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
              setAspectRatio(next);
              showToast(`تم ضبط نسبة الإطار: ${next} 📐`);
            }}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
            title="النسبة"
          >
            <Maximize2 className="w-5 h-5 text-emerald-400" />
            <span className="text-[9px] font-black">{aspectRatio}</span>
          </button>

          {/* التنميق (Beauty) */}
          <button
            onClick={() => showToast('تنميق وتجميل الوجه الذكي ✨')}
            className="flex flex-col items-center gap-0.5 text-white/90 hover:text-white active:scale-90"
            title="التنميق"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-[9px] font-black">التنميق</span>
          </button>
        </div>

        {/* Recording active indicator */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 pointer-events-none">
            <div className="px-6 py-3 bg-red-600/90 backdrop-blur-md rounded-2xl text-white font-black text-sm shadow-[0_0_30px_rgba(229,9,20,0.8)] animate-pulse flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-ping" />
              <span>جاري تسجيل المقطع سينمائياً...</span>
            </div>
          </div>
        )}

        {/* Bottom Controls Area matching TikTok Video */}
        <div className="mt-auto pb-6 pt-3 px-6 z-30 flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/85 to-transparent">
          
          {/* Duration Selector Tabs: 10د | 60ث | 15ث | صورة | نص */}
          <div className="flex items-center gap-4 text-xs font-black tracking-wide bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => setDurationMode('10m')}
              className={`transition-colors ${durationMode === '10m' ? 'text-amber-400 font-extrabold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              10 د
            </button>
            <button
              onClick={() => setDurationMode('60s')}
              className={`transition-colors ${durationMode === '60s' ? 'text-amber-400 font-extrabold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              60 ث
            </button>
            <button
              onClick={() => setDurationMode('15s')}
              className={`transition-colors ${durationMode === '15s' ? 'text-amber-400 font-extrabold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              15 ث
            </button>
            <button
              onClick={() => setDurationMode('photo')}
              className={`transition-colors ${durationMode === 'photo' ? 'text-amber-400 font-extrabold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              صورة
            </button>
            <button
              onClick={() => setDurationMode('text')}
              className={`transition-colors ${durationMode === 'text' ? 'text-amber-400 font-extrabold scale-105' : 'text-gray-400 hover:text-gray-200'}`}
            >
              نص
            </button>
          </div>

          {/* Shutter Row with Gallery Thumbnail */}
          <div className="w-full flex items-center justify-between px-2">
            {/* Gallery Thumbnail Button */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl active:scale-90 transition-transform bg-zinc-900 cursor-pointer"
              title="فتح المعرض لرفع فيديو"
            >
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100"
                alt="Gallery"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Red Recording Shutter Button matching TikTok exactly */}
            <button
              onClick={handleCaptureClick}
              className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center shadow-[0_0_35px_rgba(229,9,20,0.6)] active:scale-90 transition-transform cursor-pointer"
              title="بدء التسجيل"
            >
              <div className="w-full h-full rounded-full bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center shadow-inner" />
            </button>

            <div className="w-12" />
          </div>

          {/* Bottom Mode Switcher Tabs: الكاميرا | الإبداع */}
          <div className="flex items-center gap-8 text-xs font-black tracking-wider pt-2">
            <button
              onClick={() => setBottomTab('creativity')}
              className={`transition-all ${bottomTab === 'creativity' ? 'text-white scale-105 font-extrabold' : 'text-gray-400 hover:text-gray-200'}`}
            >
              الإبداع
            </button>
            <button
              onClick={() => setBottomTab('camera')}
              className={`transition-all ${bottomTab === 'camera' ? 'text-red-500 scale-105 font-extrabold border-b-2 border-red-500 pb-0.5' : 'text-gray-400 hover:text-gray-200'}`}
            >
              الكاميرا
            </button>
          </div>

        </div>

        {/* ================= SOUND PICKER POPUP MODAL (As seen in video) ================= */}
        {isSoundPickerOpen && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Top Sound Picker Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60">
              <button
                onClick={() => setIsSoundPickerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-white">اختر صوتاً للمقطع 🎵</span>
              <div className="w-8" />
            </div>

            {/* Search Bar */}
            <div className="p-3 bg-black/40 border-b border-white/10">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/15">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={soundSearchQuery}
                  onChange={e => setSoundSearchQuery(e.target.value)}
                  placeholder="ابحث عن أغنية أو صوت..."
                  className="w-full bg-transparent text-xs text-white outline-none text-right"
                />
              </div>
            </div>

            {/* Tabs: المشهور | اخترنا لك | المفضلة | الأحدث */}
            <div className="flex items-center justify-around border-b border-white/10 bg-black/50 text-xs font-black">
              <button
                onClick={() => setSoundTab('trending')}
                className={`py-3 px-3 relative ${soundTab === 'trending' ? 'text-white' : 'text-gray-400'}`}
              >
                المشهور
                {soundTab === 'trending' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />}
              </button>
              <button
                onClick={() => setSoundTab('foryou')}
                className={`py-3 px-3 relative ${soundTab === 'foryou' ? 'text-white' : 'text-gray-400'}`}
              >
                اخترنا لك
                {soundTab === 'foryou' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />}
              </button>
              <button
                onClick={() => setSoundTab('favorites')}
                className={`py-3 px-3 relative ${soundTab === 'favorites' ? 'text-white' : 'text-gray-400'}`}
              >
                المفضلة
                {soundTab === 'favorites' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />}
              </button>
              <button
                onClick={() => setSoundTab('recent')}
                className={`py-3 px-3 relative ${soundTab === 'recent' ? 'text-white' : 'text-gray-400'}`}
              >
                الأحدث
                {soundTab === 'recent' && <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full" />}
              </button>
            </div>

            {/* Sound Tracks List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-right">
              {soundTracks.map(track => (
                <div
                  key={track.id}
                  onClick={() => {
                    setActiveSound(`${track.artist} - ${track.title} 🎵`);
                    setIsSoundPickerOpen(false);
                    showToast(`تم اختيار الصوت: ${track.title} 🎶`);
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
                      {track.duration}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Music className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white">{track.title}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{track.artist}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
