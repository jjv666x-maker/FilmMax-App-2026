import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Plus,
  Music,
  UserPlus,
  UserCheck,
  X,
  Send,
  Video,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useReelsController } from './useReelsController';

export const ReelsFeed: React.FC = () => {
  const {
    reels,
    activeIndex,
    activeReel,
    isMuted,
    activeCommentReelId,
    isPublishModalOpen,
    setActiveIndex,
    toggleMute,
    openComments,
    closeComments,
    openPublishModal,
    closePublishModal,
    toggleLike,
    toggleSave,
    toggleFollow,
    handleAddComment,
    shareReel,
    handlePublishNewReel
  } = useReelsController();

  const [commentInput, setCommentInput] = useState('');
  const [publishTitle, setPublishTitle] = useState('');
  const [publishVideoUrl, setPublishVideoUrl] = useState('');
  const [publishDesc, setPublishDesc] = useState('');

  if (!reels || reels.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center text-zinc-400 bg-zinc-950 rounded-3xl border border-zinc-900">
        <Video className="w-12 h-12 mb-3 text-amber-500 animate-pulse" />
        <p className="text-sm font-bold text-white">لا توجد مقاطع ريلز متاحة حالياً</p>
        <button
          onClick={openPublishModal}
          className="mt-4 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl text-xs font-bold"
        >
          نشر أول مقطع ريل
        </button>
      </div>
    );
  }

  const activeComments = activeReel?.comments || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      handleAddComment(commentInput.trim());
      setCommentInput('');
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePublishNewReel(publishTitle || 'FilmMax Reel', publishVideoUrl, publishDesc);
    setPublishTitle('');
    setPublishVideoUrl('');
    setPublishDesc('');
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[82vh] max-h-[850px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col justify-between select-none">
      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white drop-shadow-md">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-amber-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          FilmMax Reels
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 bg-black/50 backdrop-blur-md hover:bg-black/80 rounded-full border border-white/10 text-white transition"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={openPublishModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black px-3 py-1.5 rounded-full text-xs font-black shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            نشر
          </button>
        </div>
      </div>

      {/* Vertical Navigation Buttons */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          className="p-2 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          disabled={activeIndex === reels.length - 1}
          onClick={() => setActiveIndex(Math.min(reels.length - 1, activeIndex + 1))}
          className="p-2 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Video Area */}
      <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        {activeReel && (
          <video
            key={activeReel.id}
            src={activeReel.videoUrl}
            poster={activeReel.poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Bottom Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

        {/* Right Interaction Side Bar */}
        {activeReel && (
          <div className="absolute left-4 bottom-20 z-20 flex flex-col items-center gap-5 text-white">
            {/* Like */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleLike(activeReel.id)}
                className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition transform active:scale-125 ${
                  activeReel.isLiked ? 'bg-red-600 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`w-6 h-6 ${activeReel.isLiked ? 'fill-current text-white' : ''}`} />
              </button>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.likesCount}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => openComments(activeReel.id)}
                className="p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full border border-white/10 text-white transition transform active:scale-110"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.commentsCount}</span>
            </div>

            {/* Save */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => toggleSave(activeReel.id)}
                className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition transform active:scale-110 ${
                  activeReel.isSaved ? 'bg-amber-500 text-black' : 'bg-black/40 text-white hover:bg-black/70'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${activeReel.isSaved ? 'fill-current text-black' : ''}`} />
              </button>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.isSaved ? 'محفوظ' : 'حفظ'}</span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => shareReel(activeReel.id)}
                className="p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full border border-white/10 text-white transition transform active:scale-110"
              >
                <Share2 className="w-6 h-6 text-amber-400" />
              </button>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.sharesCount}</span>
            </div>
          </div>
        )}

        {/* Bottom Overlay Description & Author */}
        {activeReel && (
          <div className="absolute right-4 left-20 bottom-6 z-20 text-white space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={activeReel.authorAvatar}
                alt={activeReel.authorName}
                className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm">{activeReel.authorName}</span>
                  {activeReel.authorBadge && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-2 py-0.5 rounded-full">
                      {activeReel.authorBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-mono dir-ltr block">{activeReel.authorUsername}</span>
              </div>

              <button
                onClick={() => toggleFollow(activeReel.userId)}
                className={`mr-auto px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                  activeReel.isFollowing
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    : 'bg-amber-500 text-black hover:bg-amber-600'
                }`}
              >
                {activeReel.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    متابَع
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    متابعة
                  </>
                )}
              </button>
            </div>

            <p className="text-xs leading-relaxed text-zinc-200 line-clamp-2">
              {activeReel.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="truncate max-w-[200px]">
                {activeReel.musicTitle} • {activeReel.audioArtist}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Comment Drawer Modal */}
      {activeCommentReelId && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl h-3/4 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                التعليقات ({activeComments.length})
              </span>
              <button
                onClick={closeComments}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {activeComments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
                  كن أول من يعلّق على هذا المقطع! 💬
                </div>
              ) : (
                activeComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{comment.author}</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-zinc-800">
              <input
                type="text"
                placeholder="اكتب تعليقك هنا..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-2xl text-xs font-bold flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Publish Reel Modal */}
      {isPublishModalOpen && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                نشر مقطع سينمائي جديد
              </span>
              <button
                onClick={closePublishModal}
                className="p-1 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">عنوان المقطع</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كواليس تصوير المشهد الأخير"
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">رابط الفيديو (MP4 / WebM)</label>
                <input
                  type="url"
                  required
                  placeholder="https://assets.mixkit.co/..."
                  value={publishVideoUrl}
                  onChange={(e) => setPublishVideoUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-medium">الوصف والهاشتاجات</label>
                <textarea
                  rows={3}
                  placeholder="اكتب وصفاً جذاباً..."
                  value={publishDesc}
                  onChange={(e) => setPublishDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closePublishModal}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-2.5 rounded-xl text-xs font-bold border border-zinc-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black py-2.5 rounded-xl text-xs font-black shadow-lg"
                >
                  نشر المقطع الآن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
