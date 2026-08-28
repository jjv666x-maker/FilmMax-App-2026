import React from 'react';
import {
  X,
  Clapperboard,
  CircleDot,
  Radio,
  Upload,
  FileText,
  ChevronLeft
} from 'lucide-react';

interface ReelsCreateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCreateReel: () => void;
  onSelectAddStory: () => void;
  onSelectLiveStream: () => void;
  onSelectUploadVideo: () => void;
  onSelectDrafts: () => void;
}

export const ReelsCreateSheet: React.FC<ReelsCreateSheetProps> = ({
  isOpen,
  onClose,
  onSelectCreateReel,
  onSelectAddStory,
  onSelectLiveStream,
  onSelectUploadVideo,
  onSelectDrafts
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#12141a] text-white rounded-t-[32px] border-t border-white/15 p-5 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Handle */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-black text-white">إنشاء</h3>
          <div className="w-8" />
        </div>

        {/* Menu Options matching Mockup #5 */}
        <div className="space-y-2.5 text-right">
          {/* 1. إنشاء Reel */}
          <button
            onClick={() => {
              onClose();
              onSelectCreateReel();
            }}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all active:scale-98 group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">إنشاء Reel</div>
                <div className="text-[10px] text-gray-400 font-bold">فيديو قصير يصل إلى 60 ثانية</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
                <Clapperboard className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* 2. إضافة قصة */}
          <button
            onClick={() => {
              onClose();
              onSelectAddStory();
            }}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all active:scale-98 group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">إضافة قصة</div>
                <div className="text-[10px] text-gray-400 font-bold">صورة أو فيديو لقصة</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <CircleDot className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* 3. بث مباشر */}
          <button
            onClick={() => {
              onClose();
              onSelectLiveStream();
            }}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all active:scale-98 group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">بث مباشر</div>
                <div className="text-[10px] text-gray-400 font-bold">ابدأ بثك الآن وتفاعل مع جمهورك</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-md">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </button>

          {/* 4. تحميل فيديو */}
          <button
            onClick={() => {
              onClose();
              onSelectUploadVideo();
            }}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all active:scale-98 group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">تحميل فيديو</div>
                <div className="text-[10px] text-gray-400 font-bold">مشاركة فيديو من معرضك</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
                <Upload className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* 5. مسودة */}
          <button
            onClick={() => {
              onClose();
              onSelectDrafts();
            }}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-all active:scale-98 group"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">مسودة</div>
                <div className="text-[10px] text-gray-400 font-bold">مشاهدة وإدارة المسودات</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Bottom Cancel Button matching Mockup #5 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1d212b] hover:bg-[#252a36] text-white text-xs font-black rounded-2xl active:scale-95 transition-all mt-2"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};
