import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Film,
  Image as ImageIcon,
  Sparkles,
  MoveVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  X,
  ArrowRight,
  Eye,
  Grid,
  Layers,
  ChevronLeft,
  Pin
} from 'lucide-react';
import { ReelItem, UserProfile } from '../types';

interface TikTokCoverCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  userReels?: ReelItem[];
  onSaveCover: (coverData: {
    coverPhoto: string;
    coverVideo?: string;
    coverType: 'image' | 'video';
    coverPosition: 'object-center' | 'object-top' | 'object-bottom';
    coverOffsetY: number;
    coverZoom: number;
    coverRotation: number;
  }) => void;
}

const PRESET_CINEMATIC_COVERS = [
  {
    type: 'video' as const,
    title: 'أكشن ومؤثرات 4K',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  },
  {
    type: 'video' as const,
    title: 'سديم فضاء وخيال علمي',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    type: 'video' as const,
    title: 'تريلر سينمائي ملحمي',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
  },
  {
    type: 'image' as const,
    title: 'مسرح سينمائي ملكي',
    url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
  },
  {
    type: 'image' as const,
    title: 'أضواء نيون سايبربانك',
    url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'
  },
  {
    type: 'image' as const,
    title: 'سماء ليلية كونية',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
  }
];

export const TikTokCoverCropModal: React.FC<TikTokCoverCropModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userReels = [],
  onSaveCover
}) => {
  // Step: 'sheet' | 'gallery' | 'crop' | 'loading'
  const [step, setStep] = useState<'sheet' | 'gallery' | 'crop' | 'loading'>('sheet');
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);

  // Crop & Framing adjustments
  const [offsetY, setOffsetY] = useState<number>(currentUser.coverOffsetY ?? 0);
  const [zoom, setZoom] = useState<number>(currentUser.coverZoom ?? 1);
  const [position, setPosition] = useState<'object-center' | 'object-top' | 'object-bottom'>(
    currentUser.coverPosition ?? 'object-center'
  );
  const [rotation, setRotation] = useState<number>(currentUser.coverRotation ?? 0);
  const [showAvatarPreview, setShowAvatarPreview] = useState<boolean>(true);
  const [pinClipboard, setPinClipboard] = useState<boolean>(true);

  // Hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep('sheet');
      setSelectedMedia(null);
      setOffsetY(currentUser.coverOffsetY ?? 0);
      setZoom(currentUser.coverZoom ?? 1);
      setPosition(currentUser.coverPosition ?? 'object-center');
      setRotation(currentUser.coverRotation ?? 0);
      setPinClipboard(true);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  // Handle local file picking with FileReader Base64 conversion
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|webm|mov|mkv)$/i);

    if (isVideo) {
      const url = URL.createObjectURL(file);
      setSelectedMedia({
        url,
        type: 'video'
      });
      setStep('crop');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        try {
          localStorage.setItem('fm_cover_image', base64Data);
        } catch (err) {
          console.warn('LocalStorage cover save note:', err);
        }
        setSelectedMedia({
          url: base64Data,
          type: 'image'
        });
        setStep('crop');
      };
      reader.readAsDataURL(file);
    }
  };

  // Select from preset or user reels
  const handleSelectPredefined = (url: string, type: 'image' | 'video') => {
    if (type === 'image') {
      try {
        localStorage.setItem('fm_cover_image', url);
      } catch {}
    }
    setSelectedMedia({ url, type });
    setStep('crop');
  };

  // Save changes with TikTok animated loader
  const handleSave = () => {
    if (!selectedMedia) return;

    if (selectedMedia.type === 'image') {
      try {
        localStorage.setItem('fm_cover_image', selectedMedia.url);
      } catch {}
    }

    setStep('loading');

    setTimeout(() => {
      onSaveCover({
        coverPhoto: selectedMedia.url,
        coverVideo: selectedMedia.type === 'video' ? selectedMedia.url : undefined,
        coverType: selectedMedia.type,
        coverPosition: position,
        coverOffsetY: offsetY,
        coverZoom: zoom,
        coverRotation: rotation
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md transition-opacity" dir="rtl">
      
      {/* Hidden file input with ID for 100% reliable label triggering */}
      <input
        id="tiktok-cover-file-input"
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 1. TIKTOK ACTION SHEET (تغيير الخلفية) */}
      {step === 'sheet' && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-[#161823] text-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 p-5 shadow-2xl flex flex-col gap-3 pb-8 sm:pb-5"
        >
          {/* Header with Title and Close X Button */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 relative">
            <div className="w-8" />
            <div className="text-center">
              <h3 className="text-base font-black text-white">تغيير الخلفية</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer active:scale-90"
              title="إغلاق ورجوع"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-2.5 mt-2">
            <label
              htmlFor="tiktok-cover-file-input"
              className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-2xl flex items-center justify-between text-right transition-colors group cursor-pointer border border-white/5 block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fe2c55]/20 text-[#fe2c55] flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-sm font-black text-white block">تحميل صورة</b>
                  <span className="text-[11px] text-gray-400">اختر صورة أو فيديو من جهازك</span>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </label>

            <button
              type="button"
              onClick={() => setStep('gallery')}
              className="w-full py-4 px-4 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-2xl flex items-center justify-between text-right transition-colors group cursor-pointer border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-sm font-black text-white block">الاختيار من منشوراتك</b>
                  <span className="text-[11px] text-gray-400">منشورات وريلز الحساب</span>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 mt-2 bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-2xl text-sm font-bold text-gray-300 transition-colors cursor-pointer"
          >
            إلغاء
          </button>
        </motion.div>
      )}

      {/* 2. GALLERY VIEW: Choose from user posts & presets */}
      {step === 'gallery' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#161823] text-white rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              onClick={() => setStep('sheet')}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black">الاختيار من المنشورات</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
            {userReels.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-gray-400 mb-2 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#fe2c55]" />
                  <span>مقاطع الريلز الخاصة بك ({userReels.length})</span>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {userReels.map((reel) => (
                    <div
                      key={reel.id}
                      onClick={() => handleSelectPredefined(reel.videoUrl, 'video')}
                      className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer border border-white/10 hover:border-[#fe2c55] transition-all bg-zinc-900"
                    >
                      <img
                        src={reel.poster || reel.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400'}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col justify-end p-2 transition-all">
                        <span className="text-[10px] font-bold text-white line-clamp-1">{reel.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-black text-gray-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>مشاهد سينمائية مميزة 4K</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_CINEMATIC_COVERS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPredefined(preset.url, preset.type)}
                    className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer border border-white/10 hover:border-amber-400 transition-all bg-zinc-900"
                  >
                    <img
                      src={preset.poster}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col justify-between p-1.5 transition-all">
                      <span className="self-end px-1.5 py-0.5 rounded text-[8px] font-black bg-black/70 text-amber-300">
                        {preset.type === 'video' ? 'فيديو' : 'صورة'}
                      </span>
                      <span className="text-[10px] font-bold text-white line-clamp-1">{preset.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. TIKTOK CROP / FRAMING SCREEN ("قص") */}
      {step === 'crop' && selectedMedia && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#0f1015] text-white rounded-t-3xl sm:rounded-3xl border border-white/10 p-4 sm:p-5 shadow-2xl flex flex-col h-[92vh] sm:h-auto sm:max-h-[88vh] overflow-hidden"
        >
          {/* Header with prominent "تم / حفظ" Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0 bg-[#0f1015]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('sheet')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 active:scale-90"
                title="رجوع"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">قص وتعديل الخلفية</h3>
            </div>

            {/* Top Bar "تم / حفظ" Action Button - Always 100% visible! */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-gradient-to-r from-[#fe2c55] to-[#e50914] hover:brightness-110 active:scale-95 rounded-full text-xs font-black text-white shadow-lg shadow-red-500/40 flex items-center gap-1.5 cursor-pointer border border-white/20 transition-all animate-pulse"
                title="تم وإتمام القص"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>تم (حفظ)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                title="إلغاء"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Framing / Crop Canvas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-4">
            
            {/* Guide Text */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-[#fe2c55]" />
                <span>حرك لأعلى وأسفل أو استخدم أزرار المحاذاة</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAvatarPreview(prev => !prev)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                  showAvatarPreview
                    ? 'bg-[#fe2c55]/20 text-[#fe2c55] border-[#fe2c55]/40'
                    : 'bg-white/5 text-gray-400 border-white/10'
                }`}
              >
                {showAvatarPreview ? 'إخفاء معاينة الحساب 👁️' : 'إظهار معاينة الحساب 👁️'}
              </button>
            </div>

            {/* Simulated Banner Area with High-Tech Crop Guide */}
            <div className="relative w-full h-56 bg-zinc-950 rounded-2xl overflow-hidden border-2 border-[#fe2c55] shadow-2xl">
              
              {/* Media rendering with transform */}
              {selectedMedia.type === 'video' ? (
                <video
                  src={selectedMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover transition-all duration-300 ${position}`}
                  style={{
                    transform: `scale(${zoom}) translateY(${offsetY}%) rotate(${rotation}deg)`
                  }}
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Crop preview"
                  className={`w-full h-full object-cover transition-all duration-300 ${position}`}
                  style={{
                    transform: `scale(${zoom}) translateY(${offsetY}%) rotate(${rotation}deg)`
                  }}
                />
              )}

              {/* Grid Crop Overlay Rule-of-Thirds */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-r border-b border-white/15" />
                <div className="border-b border-white/15" />
                <div className="border-r border-white/15" />
                <div className="border-r border-white/15" />
                <div />
              </div>

              {/* Corner Crop Marks */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#fe2c55] pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#fe2c55] pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#fe2c55] pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#fe2c55] pointer-events-none" />

              {/* Live Profile Overlay Simulation */}
              {showAvatarPreview && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#0f1015] overflow-hidden shadow-2xl bg-black">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Controls: Alignments */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-300">المحاذاة الرأسية للمشهد:</span>
                <span className="text-[#fe2c55] font-black">
                  {position === 'object-top' ? 'أعلى ⬆️' : position === 'object-bottom' ? 'أسفل ⬇️' : 'منتصف ⏺️'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPosition('object-top');
                    setOffsetY(-15);
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    position === 'object-top'
                      ? 'bg-[#fe2c55] text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>أعلى</span>
                  <span>⬆️</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPosition('object-center');
                    setOffsetY(0);
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    position === 'object-center'
                      ? 'bg-[#fe2c55] text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>منتصف</span>
                  <span>⏺️</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPosition('object-bottom');
                    setOffsetY(15);
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    position === 'object-bottom'
                      ? 'bg-[#fe2c55] text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>أسفل</span>
                  <span>⬇️</span>
                </button>
              </div>

              {/* Slider for fine-grained vertical drag */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>إزاحة دقيقة (تحريك عمودي):</span>
                  <span className="font-mono text-white">{offsetY}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="1"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-[#fe2c55] cursor-pointer"
                />
              </div>

              {/* Slider for Zoom */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>تكبير / تصغير المشهد:</span>
                  </span>
                  <span className="font-mono text-white">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#fe2c55] cursor-pointer"
                />
              </div>

              {/* Rotation Control Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>دوران المشهد (تعديل الزاوية):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="px-3 py-1.5 bg-[#fe2c55]/20 hover:bg-[#fe2c55]/30 text-[#fe2c55] border border-[#fe2c55]/40 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>🔄 دوران 90° ({rotation}°)</span>
                </button>
              </div>

              {/* Reset to Default */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOffsetY(0);
                    setZoom(1);
                    setPosition('object-center');
                    setRotation(0);
                  }}
                  className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة ضبط الحجم والموضع والدوران</span>
                </button>
              </div>
            </div>

            {/* Clipboard & Expiration Pinning Option (Requested Feature) */}
            <div 
              onClick={() => setPinClipboard(prev => !prev)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                pinClipboard 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                  : 'bg-white/5 border-white/10 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  pinClipboard ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'
                }`}>
                  <Pin className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black flex items-center gap-1.5 flex-wrap">
                    <span>تثبيت عناصر الحافظة لإيقاف انتهاء صلاحيتها بعد ساعة واحدة</span>
                    {pinClipboard && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        مثبت دائمياً ✅
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {pinClipboard 
                      ? 'تم التثبيت بنجاح: ستبقى الخلفية ثابتة ودائمة دون حذف أو استرجاع تلقائي بعد 60 دقيقة'
                      : 'اضغط لتثبيت عناصر الحافظة والخلفية ومنع انتهاء صلاحيتها بعد ساعة'}
                  </p>
                </div>
              </div>

              {/* Custom Toggle Switch */}
              <div className={`w-11 h-6 rounded-full p-1 transition-colors shrink-0 ${pinClipboard ? 'bg-emerald-500' : 'bg-white/20'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pinClipboard ? '-translate-x-5' : 'translate-x-0'}`} />
              </div>
            </div>

          </div>

          {/* Bottom Actions: Sticky Cancel & TikTok Red Save / Done Button */}
          <div className="p-3 sm:p-4 border-t border-white/10 flex items-center gap-3 shrink-0 bg-[#0f1015] z-30">
            <button
              type="button"
              onClick={() => setStep('sheet')}
              className="py-3 px-5 bg-white/10 hover:bg-white/15 active:bg-white/20 rounded-2xl text-xs sm:text-sm font-bold text-gray-300 transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#fe2c55] to-[#e50914] hover:brightness-110 active:scale-95 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xl shadow-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>تم (حفظ وقص الخلفية)</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. TIKTOK LOADING SPINNER ("جارِ التحميل...") */}
      {step === 'loading' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/85 backdrop-blur-2xl px-8 py-6 rounded-3xl border border-white/15 shadow-2xl flex flex-col items-center gap-4 text-center"
        >
          {/* TikTok dual-colored pulse loader */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#25F4EE] border-t-transparent rounded-full animate-spin" />
            <div className="w-10 h-10 border-4 border-[#FE2C55] border-b-transparent rounded-full animate-spin absolute inset-0 opacity-70" style={{ animationDirection: 'reverse' }} />
          </div>
          <span className="text-sm font-black text-white tracking-wide">جارِ التحميل...</span>
        </motion.div>
      )}
    </div>
  );
};
