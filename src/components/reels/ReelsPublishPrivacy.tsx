import React, { useState } from 'react';
import { ArrowRight, Globe, Users, Lock, MessageSquare, Download, Check } from 'lucide-react';

interface ReelsPublishPrivacyProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (settings: {
    visibility: 'everyone' | 'followers' | 'onlyMe';
    comments: 'everyone' | 'followers' | 'off';
    saveToDevice: boolean;
  }) => void;
  showToast: (msg: string) => void;
}

export const ReelsPublishPrivacy: React.FC<ReelsPublishPrivacyProps> = ({
  isOpen,
  onClose,
  onPublish,
  showToast
}) => {
  if (!isOpen) return null;

  const [visibility, setVisibility] = useState<'everyone' | 'followers' | 'onlyMe'>('everyone');
  const [comments, setComments] = useState<'everyone' | 'followers' | 'off'>('everyone');
  const [saveToDevice, setSaveToDevice] = useState<boolean>(true);

  const handlePublishClick = () => {
    onPublish({
      visibility,
      comments,
      saveToDevice
    });
    showToast('تم نشر مقطع Reel الخاص بك بنجاح! 🚀🎬');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#0d0f14] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Top Header matching Mockup #7 */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <h3 className="text-xs sm:text-sm font-black text-white">من يمكنه مشاهدة هذا Reel؟</h3>

          <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2 py-1 rounded-full border border-white/10">
            60 دقيقة
          </span>
        </div>

        {/* Form Body matching Mockup #7 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-right custom-scrollbar">
          
          {/* Section 1: من يمكنه مشاهدة هذا Reel؟ */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-300">من يمكنه مشاهدة هذا Reel؟</h4>

            <div className="space-y-2">
              {/* الجميع */}
              <div
                onClick={() => setVisibility('everyone')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  visibility === 'everyone'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    visibility === 'everyone' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {visibility === 'everyone' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="text-right flex-1 mr-3">
                  <div className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                    <span>الجميع</span>
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                    يمكن لأي شخص مشاهدة هذا Reel
                  </div>
                </div>
              </div>

              {/* المتابعون */}
              <div
                onClick={() => setVisibility('followers')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  visibility === 'followers'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    visibility === 'followers' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {visibility === 'followers' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="text-right flex-1 mr-3">
                  <div className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                    <span>المتابعون</span>
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                    المتابعون فقط يمكنهم مشاهدة هذا Reel
                  </div>
                </div>
              </div>

              {/* أنا فقط */}
              <div
                onClick={() => setVisibility('onlyMe')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  visibility === 'onlyMe'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    visibility === 'onlyMe' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {visibility === 'onlyMe' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="text-right flex-1 mr-3">
                  <div className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                    <span>أنا فقط</span>
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                    يمكنك أنت فقط مشاهدة هذا Reel
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: من يمكنه التعليق؟ */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-gray-300">من يمكنه التعليق؟</h4>

            <div className="space-y-2">
              {/* الجميع */}
              <div
                onClick={() => setComments('everyone')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  comments === 'everyone'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    comments === 'everyone' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {comments === 'everyone' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-bold text-white">الجميع</span>
              </div>

              {/* المتابعون */}
              <div
                onClick={() => setComments('followers')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  comments === 'followers'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    comments === 'followers' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {comments === 'followers' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-bold text-white">المتابعون</span>
              </div>

              {/* إيقاف التعليقات */}
              <div
                onClick={() => setComments('off')}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  comments === 'off'
                    ? 'bg-red-950/20 border-red-500/50'
                    : 'bg-[#151821] border-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    comments === 'off' ? 'border-red-500 bg-red-600' : 'border-gray-500'
                  }`}
                >
                  {comments === 'off' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-xs font-bold text-white">إيقاف التعليقات</span>
              </div>
            </div>
          </div>

          {/* Section 3: حفظ على الجهاز (Toggle Switch) */}
          <div className="flex items-center justify-between p-3.5 bg-[#151821] border border-white/10 rounded-2xl">
            <button
              type="button"
              onClick={() => setSaveToDevice(!saveToDevice)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                saveToDevice ? 'bg-red-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  saveToDevice ? 'right-1' : 'left-1'
                }`}
              />
            </button>

            <div className="text-right">
              <div className="text-xs font-black text-white flex items-center justify-end gap-1.5">
                <span>حفظ على الجهاز</span>
                <Download className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div className="text-[10px] text-gray-400 font-bold mt-0.5">
                تنزيل نسخة عالية الدقة تلقائياً
              </div>
            </div>
          </div>

          {/* Red Publish Button matching Mockup #7 */}
          <div className="pt-4 pb-6">
            <button
              type="button"
              onClick={handlePublishClick}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black text-xs shadow-xl shadow-red-900/50 border border-red-400/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>نشر الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
