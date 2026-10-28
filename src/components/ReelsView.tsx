import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export const ReelsView: React.FC = () => {
  const {
    reels,
    likeReel,
    saveReel,
    followReelCreator,
    addReelComment,
    addNewReel,
    deleteReel,
    handleUploadMedia
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleRealUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await handleUploadMedia(file, 'video', 'reel');

      if (dataUrl) {
        await addNewReel({
          videoUrl: dataUrl,
          poster: dataUrl,
          thumbnailUrl: dataUrl,
          title: 'ريل جديد',
          description: 'تم رفع هذا الريل مباشرة من الجهاز',
          category: 'محتوى شخصي',
          tags: ['upload', 'filmmax'],
          createdAt: Date.now()
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleRealUpload(file);
        }}
      />

      <div className="fixed top-4 right-4 z-40 flex gap-3">
        <button
          onClick={openFilePicker}
          className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-red-700 transition"
        >
          {uploading ? 'جاري الرفع...' : 'نشر ريل'}
        </button>
      </div>

      <div className="max-w-md mx-auto relative">
        {reels.map((reel) => (
          <div key={String(reel.id)} className="relative h-[90vh] w-full border-b border-white/10 bg-black">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${reel.poster || reel.thumbnailUrl || reel.creator?.avatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            <video
              src={reel.videoUrl}
              poster={reel.poster || reel.thumbnailUrl}
              muted
              autoPlay
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={reel.creator?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={reel.creator?.name || 'مستخدم'}
                  className="w-10 h-10 rounded-full border border-white/50 object-cover"
                />
                <div>
                  <div className="font-bold text-white">{reel.creator?.name || 'صانع محتوى'}</div>
                  <div className="text-xs text-white/70">@{reel.creator?.username || 'user'}</div>
                </div>

                <button
                  onClick={() => followReelCreator(reel.id)}
                  className="ml-auto bg-white text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-zinc-200 transition"
                >
                  {reel.isFollowing ? 'متابَع' : 'متابعة'}
                </button>
              </div>

              <p className="text-sm text-white/90 mb-2">{reel.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {(reel.tags || []).map((tag) => (
                  <span key={tag} className="text-[10px] text-white/80 bg-white/10 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-white/80">
                <button onClick={() => likeReel(reel.id)} className="flex items-center gap-1">
                  <span>{reel.isLiked ? '♥' : '♡'}</span>
                  <span>{reel.likesCount}</span>
                </button>

                <button onClick={() => saveReel(reel.id)} className="flex items-center gap-1">
                  <span>{reel.isSaved ? '🔖' : '📑'}</span>
                  <span>{reel.savesCount || 0}</span>
                </button>

                <span>👁 {reel.viewsCount}</span>
                <span>↻ {reel.sharesCount}</span>
              </div>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
              <button onClick={() => likeReel(reel.id)} className="flex flex-col items-center text-white">
                <span className="text-2xl">{reel.isLiked ? '♥' : '♡'}</span>
                <span className="text-[10px]">{reel.likesCount}</span>
              </button>

              <button onClick={() => saveReel(reel.id)} className="flex flex-col items-center text-white">
                <span className="text-2xl">🔖</span>
                <span className="text-[10px]">{reel.savesCount || 0}</span>
              </button>

              <button
                onClick={() => deleteReel(reel.id)}
                className="flex flex-col items-center text-white hover:text-red-400 transition"
              >
                <span className="text-2xl">🗑</span>
              </button>
            </div>

            <div className="absolute bottom-24 left-4 right-16 z-30">
              <div className="flex gap-2">
                <input
                  value={commentDrafts[String(reel.id)] || ''}
                  onChange={(e) =>
                    setCommentDrafts((prev) => ({
                      ...prev,
                      [String(reel.id)]: e.target.value
                    }))
                  }
                  placeholder="اكتب تعليقك..."
                  className="flex-1 bg-white/10 text-white placeholder:text-white/60 border border-white/20 rounded-full px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    const text = commentDrafts[String(reel.id)] || '';
                    if (text.trim()) {
                      addReelComment(reel.id, text);
                      setCommentDrafts((prev) => ({ ...prev, [String(reel.id)]: '' }));
                    }
                  }}
                  className="bg-white text-black px-3 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition"
                >
                  نشر
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
