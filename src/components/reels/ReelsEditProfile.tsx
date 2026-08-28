import React, { useState } from 'react';
import { ArrowRight, Camera, KeyRound, Check, Save } from 'lucide-react';

interface ReelsEditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const ReelsEditProfile: React.FC<ReelsEditProfileProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Ahmed Mo');
  const [username, setUsername] = useState('ahmed.mo');
  const [bio, setBio] = useState('صانع محتوى سينمائي 🎬\nأخبار - مراجعات - كواليس');
  const [location, setLocation] = useState('Cairo, Egypt');
  const [website, setWebsite] = useState('youtube.com/filmmax');
  const [email, setEmail] = useState('ahmed.mo@email.com');
  const [phone, setPhone] = useState('+20 100 123 4567');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('تم حفظ تعديلات الملف الشخصي بنجاح! ✅✨');
    onClose();
  };

  const handleChangeAvatar = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
    ];
    const next = avatars[(avatars.indexOf(avatar) + 1) % avatars.length];
    setAvatar(next);
    showToast('تم تغيير الصورة الرمزية 📸');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[100dvh] sm:h-[calc(100dvh-30px)] sm:rounded-[36px] bg-[#0d0f14] text-white border-0 sm:border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Top Header matching Mockup #4 */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95 text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <h3 className="text-sm font-black text-white">تعديل الملف الشخصي</h3>

          <button
            onClick={handleSave}
            className="text-xs font-black text-red-500 hover:text-red-400 px-2 py-1"
          >
            حفظ
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4 text-right custom-scrollbar">
          {/* Avatar Area */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={handleChangeAvatar}
                className="absolute bottom-0 right-0 w-7 h-7 bg-black/80 hover:bg-black text-white rounded-full border border-white/30 flex items-center justify-center shadow-lg active:scale-90"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleChangeAvatar}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 mt-2"
            >
              تغيير الصورة
            </button>
          </div>

          {/* الاسم */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">الاسم</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* اسم المستخدم */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">اسم المستخدم</label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* البايو */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">البايو</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 resize-none text-right"
            />
          </div>

          {/* الموقع */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">الموقع</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* رابط الموقع */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">رابط الموقع</label>
            <input
              type="text"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* الهاتف */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#161a23] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-500 text-right"
            />
          </div>

          {/* تغيير كلمة المرور */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => showToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك 🔐')}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>تغيير كلمة المرور</span>
            </button>
          </div>

          {/* Save Button */}
          <div className="pt-2 pb-6">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black text-xs shadow-lg shadow-red-900/40 border border-red-400/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
