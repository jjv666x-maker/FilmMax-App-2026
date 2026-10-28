import React, { useMemo, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VerifiedBadge: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-amber-400 inline-block ml-1' }) => (
  <CheckCircle2 className={className} />
);

interface ProfileViewProps {
  userId?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ isModal, onClose }) => {
  const {
    userProfile,
    updateUserProfile,
    reels,
    favorites,
    movies,
    toggleFavorite,
    handleUploadMedia
  } = useApp();

  const [nameDraft, setNameDraft] = useState(userProfile.name);
  const [bioDraft, setBioDraft] = useState(userProfile.bio || '');

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const favoriteMovies = useMemo(
    () => movies.filter((m) => favorites.includes(m.id)),
    [movies, favorites]
  );

  const handleProfileSave = async () => {
    await updateUserProfile({
      name: nameDraft,
      bio: bioDraft
    });
  };

  const handleUploadProfile = async (file: File, target: 'profile' | 'cover') => {
    const type = file.type.includes('video') ? 'video' : 'image';
    const url = await handleUploadMedia(file, type, target);
    if (url && target === 'profile') {
      await updateUserProfile({ avatar: url });
    }
    if (url && target === 'cover') {
      await updateUserProfile({ coverPhoto: url, coverType: type === 'video' ? 'video' : 'image' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 pt-6">
      <div className="rounded-[28px] overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
        <div
          className="relative h-64 w-full bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${userProfile.coverPhoto || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80'})`
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative z-10 flex items-end justify-between h-full p-6">
            <div className="flex items-center gap-4">
              <img
                src={userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full border-4 border-amber-500 shadow-xl object-cover bg-zinc-800"
              />
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-black flex items-center">
                  {userProfile.name}
                  <VerifiedBadge />
                </h2>
                <p className="text-xs md:text-sm text-amber-400 font-mono">@{userProfile.username || 'filmmax_user'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur border border-white/20 transition"
                onClick={() => imageInputRef.current?.click()}
              >
                صورة غلاف
              </button>
              <button
                className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-full text-xs font-black transition shadow-lg"
                onClick={() => videoInputRef.current?.click()}
              >
                فيديو غلاف
              </button>
            </div>
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadProfile(file, 'cover');
          }}
        />

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadProfile(file, 'cover');
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-amber-400">تعديل الملف الشخصي</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">الاسم الكامل</label>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="w-full rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-medium">السيرة الذاتية (Bio)</label>
              <textarea
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                className="w-full h-24 rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/jpeg,image/png,image/webp';
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (file) {
                      const url = await handleUploadMedia(file, 'image', 'profile');
                      if (url) await updateUserProfile({ avatar: url });
                    }
                  };
                  input.click();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-full text-xs font-bold transition border border-zinc-700"
              >
                تغيير الصورة الشخصية
              </button>

              <button
                onClick={handleProfileSave}
                className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-full text-xs font-black transition shadow-lg"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold text-amber-400 mb-4">الإحصائيات والنشاط</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
              <div className="text-zinc-400 mb-1">ساعات المشاهدة</div>
              <div className="text-xl font-black text-amber-400">{userProfile.watchTimeHours || 184}h</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
              <div className="text-zinc-400 mb-1">أفلام مكتملة</div>
              <div className="text-xl font-black text-white">{userProfile.moviesCompleted || 68}</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
              <div className="text-zinc-400 mb-1">مسلسلات مكتملة</div>
              <div className="text-xl font-black text-white">{userProfile.seriesCompleted || 14}</div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4">
              <div className="text-zinc-400 mb-1">عضوية VIP</div>
              <div className="text-xl font-black text-emerald-400">نشط ✨</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-white">
        <h3 className="text-lg font-bold text-amber-400 mb-4">قائمة المفضلة</h3>

        {favoriteMovies.length === 0 ? (
          <p className="text-xs text-zinc-500">لم تقم بإضافة أي أفلام للمفضلة بعد.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {favoriteMovies.slice(0, 8).map((movie) => (
              <div key={String(movie.id)} className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
                <img src={movie.poster} alt={movie.title} className="h-60 w-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="font-bold text-xs text-white truncate">{movie.title}</div>
                  <button
                    onClick={() => toggleFavorite(movie.id)}
                    className="mt-2 bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold transition"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-white">
        <h3 className="text-lg font-bold text-amber-400 mb-4">مقاطع الريلز الخاصة بك</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {reels.filter((reel) => reel.isUserCreated || reel.userId === userProfile.id).slice(0, 8).map((reel) => (
            <div key={String(reel.id)} className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg">
              <img
                src={reel.poster || reel.thumbnailUrl || userProfile.avatar}
                alt={reel.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-3">
                <div className="text-xs font-bold truncate text-white">{reel.title}</div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{reel.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
