import React, { useState } from 'react';
import {
  ArrowRight,
  Globe,
  Users,
  Lock,
  MessageSquare,
  Download,
  Check,
  ChevronLeft,
  Share2,
  Tag,
  AtSign,
  Sparkles,
  Sliders
} from 'lucide-react';

interface ReelsPublishPrivacyProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (settings: {
    visibility: 'everyone' | 'followers' | 'onlyMe';
    comments: 'everyone' | 'followers' | 'off';
    saveToDevice: boolean;
    caption: string;
    hashtags: string[];
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

  const [caption, setCaption] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>(['#FilmMax', '#creatorsearchinsights']);
  const [isHashtagPickerOpen, setIsHashtagPickerOpen] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<'everyone' | 'followers' | 'onlyMe'>('everyone');
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<'everyone' | 'followers' | 'off'>('everyone');
  const [saveToDevice, setSaveToDevice] = useState<boolean>(true);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // More Options States as seen in video
  const [allowDuet, setAllowDuet] = useState<boolean>(true);
  const [autoCopyrightCheck, setAutoCopyrightCheck] = useState<boolean>(true);
  const [visualSearch, setVisualSearch] = useState<boolean>(true);
  const [highQualityUploads, setHighQualityUploads] = useState<boolean>(true);
  const [saveWatermark, setSaveWatermark] = useState<boolean>(false);
  const [audienceControl, setAudienceControl] = useState<boolean>(false);

  const suggestedHashtags = [
    '#creatorsearchinsights',
    '#Nivea',
    '#مزيل_عرق',
    '#FilmMax',
    '#Trending',
    '#Cinema4K',
    '#تاج_الدم'
  ];

  const handlePublishClick = () => {
    onPublish({
      visibility,
      comments,
      saveToDevice,
      caption,
      hashtags
    });
    showToast('تم نشر مقطع Reel الخاص بك بنجاح! 🚀🎬');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#0d0f14] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Top Header matching TikTok Video Publishing Screen */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <h3 className="text-xs sm:text-sm font-black text-white">إضافة وصف ووسوم</h3>

          <span className="text-[10px] text-gray-400 font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            60 دقيقة
          </span>
        </div>

        {/* Form Body matching TikTok Publishing Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right custom-scrollbar">
          
          {/* Top Row: Caption Input & Cover Thumbnail */}
          <div className="flex items-start gap-3 bg-[#151821] p-3.5 rounded-2xl border border-white/10 shadow-lg">
            <div className="w-16 h-22 rounded-xl bg-zinc-900 border border-white/20 overflow-hidden shrink-0 relative group">
              <img
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400"
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-[8px] font-black text-white text-center">
                تعديل الغلاف
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="اكتب وصفاً جذاباً مع الهاشتاقات..."
                rows={3}
                className="w-full bg-transparent text-xs text-white outline-none placeholder-gray-500 resize-none font-medium"
              />

              {/* Hashtag & Mention Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                <button
                  onClick={() => setIsHashtagPickerOpen(true)}
                  className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-[11px] font-black flex items-center gap-1 border border-red-500/30"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>علامات الهاشتاج</span>
                </button>
                <button
                  onClick={() => showToast('تم اختيار ذكر صديق @ 👥')}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[11px] font-black flex items-center gap-1 border border-white/10"
                >
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ذكر</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Hashtags Pills */}
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 bg-white/10 text-cyan-400 rounded-full text-[10px] font-bold border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          {/* Visibility Selector Button */}
          <div
            onClick={() => setIsVisibilityModalOpen(true)}
            className="p-3.5 bg-[#151821] hover:bg-[#1c202d] border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">
                  {visibility === 'everyone' ? 'أي شخص يمكنه مشاهدة هذا المنشور' : visibility === 'followers' ? 'المتابعون فقط' : 'أنا فقط'}
                </div>
                <div className="text-[10px] text-gray-400">الجمهور المستهدف</div>
              </div>
              <Globe className="w-5 h-5 text-red-500" />
            </div>
          </div>

          {/* More Options Button */}
          <div
            onClick={() => setIsMoreOptionsOpen(true)}
            className="p-3.5 bg-[#151821] hover:bg-[#1c202d] border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">المزيد من الخيارات</div>
                <div className="text-[10px] text-gray-400">التعليقات، الجودة، حقوق الطبع ونشر</div>
              </div>
              <Sliders className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          {/* Share to External apps */}
          <div
            onClick={() => setIsShareModalOpen(true)}
            className="p-3.5 bg-[#151821] hover:bg-[#1c202d] border border-white/10 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-black text-white">المشاركة إلى</div>
                <div className="text-[10px] text-gray-400">واتساب، فيسبوك، مسنجر</div>
              </div>
              <Share2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Bottom Action Buttons: المشاريع (Drafts) & نشر (Publish) as seen in video */}
          <div className="pt-4 pb-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => showToast('تم حفظ الفيديو في المشاريع والمسودات بنجاح 📁')}
              className="flex-1 py-3.5 bg-[#1d212b] hover:bg-[#252a36] text-white rounded-xl font-black text-xs border border-white/10 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>المشاريع</span>
            </button>

            <button
              type="button"
              onClick={handlePublishClick}
              className="flex-1 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black text-xs shadow-xl shadow-red-900/50 border border-red-400/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>نشر</span>
            </button>
          </div>
        </div>

        {/* ================= HASHTAG PICKER MODAL (As seen in video) ================= */}
        {isHashtagPickerOpen && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <button onClick={() => setIsHashtagPickerOpen(false)} className="p-2 text-white">
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-white">اختر هاشتاج مقترح #</span>
              <div className="w-8" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {suggestedHashtags.map((tag, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (!hashtags.includes(tag)) setHashtags([...hashtags, tag]);
                    setIsHashtagPickerOpen(false);
                    showToast(`تمت إضافة الهاشتاج: ${tag}`);
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-cyan-400 cursor-pointer flex items-center justify-between"
                >
                  <span>{tag}</span>
                  <span className="text-[10px] text-gray-500 font-mono">7.8M مشاهدة</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VISIBILITY MODAL ================= */}
        {isVisibilityModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <button onClick={() => setIsVisibilityModalOpen(false)} className="p-2 text-white">
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-white">من يمكنه مشاهدة هذا المنشور؟</span>
              <div className="w-8" />
            </div>
            <div className="space-y-3">
              {[
                { id: 'everyone', title: 'الجميع', desc: 'يمكن لأي شخص مشاهدة هذا الفيديو', icon: Globe },
                { id: 'followers', title: 'الأصدقاء', desc: 'المتابعون المتبادلون فقط', icon: Users },
                { id: 'onlyMe', title: 'لك فقط', desc: 'أنت وحدك من يمكنه المشاهدة', icon: Lock }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setVisibility(item.id as any);
                    setIsVisibilityModalOpen(false);
                    showToast(`تم تحديث الجمهور: ${item.title}`);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between ${
                    visibility === item.id ? 'bg-red-950/30 border-red-500' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center">
                    {visibility === item.id && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                  </div>
                  <div className="text-right flex-1 mr-3">
                    <div className="text-xs font-black text-white">{item.title}</div>
                    <div className="text-[10px] text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MORE OPTIONS MODAL (As seen in video) ================= */}
        {isMoreOptionsOpen && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <button onClick={() => setIsMoreOptionsOpen(false)} className="p-2 text-white">
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-white">المزيد من الخيارات</span>
              <div className="w-8" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar text-right">
              {/* السماح بالتعليقات */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setComments(comments === 'off' ? 'everyone' : 'off')}
                  className={`w-11 h-6 rounded-full transition-colors relative ${comments !== 'off' ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${comments !== 'off' ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">السماح بالتعليقات</span>
              </div>

              {/* السماح بإعادة استخدام المحتوى */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setAllowDuet(!allowDuet)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${allowDuet ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${allowDuet ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">السماح بإعادة استخدام المحتوى (Duet)</span>
              </div>

              {/* التحقق التلقائي من حقوق الطبع والنشر */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setAutoCopyrightCheck(!autoCopyrightCheck)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${autoCopyrightCheck ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoCopyrightCheck ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">تحقق تلقائي من حقوق الطبع والنشر</span>
              </div>

              {/* السماح بالبحث المرئي */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setVisualSearch(!visualSearch)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${visualSearch ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${visualSearch ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">السماح بالبحث المرئي</span>
              </div>

              {/* السماح بالتحميلات عالية الجودة */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setHighQualityUploads(!highQualityUploads)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${highQualityUploads ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${highQualityUploads ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">السماح بالتحميلات عالية الجودة (HD)</span>
              </div>

              {/* حفظ إلى الجهاز */}
              <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setSaveToDevice(!saveToDevice)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${saveToDevice ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${saveToDevice ? 'right-1' : 'left-1'}`} />
                </button>
                <span className="text-xs font-black text-white">حفظ إلى الجهاز تلقائياً</span>
              </div>
            </div>

            <button
              onClick={() => setIsMoreOptionsOpen(false)}
              className="mt-3 py-3 bg-red-600 text-white rounded-xl text-xs font-black"
            >
              تم
            </button>
          </div>
        )}

        {/* ================= SHARE TO EXTERNAL APPS MODAL ================= */}
        {isShareModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <button onClick={() => setIsShareModalOpen(false)} className="p-2 text-white">
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-white">المشاركة المباشرة</span>
              <div className="w-8" />
            </div>
            <div className="space-y-3">
              {['WhatsApp', 'Facebook', 'Messenger', 'SMS'].map((app, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setIsShareModalOpen(false);
                    showToast(`تمت المشاركة عبر ${app} بنجاح 🚀`);
                  }}
                  className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold text-white cursor-pointer flex items-center justify-between"
                >
                  <span>مشاركة عبر {app}</span>
                  <Share2 className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
