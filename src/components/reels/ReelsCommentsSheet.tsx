import React, { useState } from 'react';
import {
  X,
  Heart,
  Send,
  Image as ImageIcon,
  Smile,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { ReelItem } from '../../types';

interface ReelsCommentsSheetProps {
  reel: ReelItem;
  onClose: () => void;
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string | number) => void;
  userAvatar: string;
  showToast: (msg: string) => void;
}

interface CommentItemData {
  id: string | number;
  author: string;
  username?: string;
  avatar: string;
  isVerified?: boolean;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  repliesCount?: number;
  repliesText?: string;
  replies?: Array<{
    id: string | number;
    author: string;
    avatar: string;
    isVerified?: boolean;
    text: string;
    time: string;
    likes: number;
    isLiked?: boolean;
  }>;
}

export const ReelsCommentsSheet: React.FC<ReelsCommentsSheetProps> = ({
  reel,
  onClose,
  onAddComment,
  onLikeComment,
  userAvatar,
  showToast
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Record<string | number, boolean>>({});

  // Comments matching Image 3 EXACTLY
  const [commentsList, setCommentsList] = useState<CommentItemData[]>([
    {
      id: 'c1',
      author: 'ahmed.mo',
      username: 'ahmed.mo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      isVerified: true,
      text: '🔥🔥🔥 مقطع خرافي 🎬',
      time: 'منذ 2 د',
      likes: 125,
      isLiked: false
    },
    {
      id: 'c2',
      author: 'sara.films',
      username: 'sara.films',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      isVerified: true,
      text: 'التصوير والموسيقى 😍',
      time: 'منذ 2 د',
      likes: 87,
      isLiked: false
    },
    {
      id: 'c3',
      author: 'cinema.news',
      username: 'cinema.news',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120',
      isVerified: true,
      text: '🔥 منتظرين المسلسل بشغف',
      time: 'منذ 7 س',
      likes: 64,
      isLiked: false,
      repliesCount: 2,
      repliesText: 'عرض 2 رد آخر >',
      replies: [
        {
          id: 'r3-1',
          author: 'FilmMax Studio',
          avatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120',
          isVerified: true,
          text: 'شكراً لكم! العرض الأول يوم الجمعة القادم 🍿🎬',
          time: 'منذ 5 س',
          likes: 24,
          isLiked: false
        },
        {
          id: 'r3-2',
          author: 'khalid_film',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120',
          isVerified: false,
          text: 'أفضل إنتاج سينمائي هذا العام بلا شك!',
          time: 'منذ 3 س',
          likes: 8,
          isLiked: false
        }
      ]
    },
    {
      id: 'c4',
      author: 'mohamed.artist',
      username: 'mohamed.artist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      isVerified: true,
      text: 'الأفضل هذا الموسم',
      time: 'منذ 10 د',
      likes: 52,
      isLiked: false,
      repliesCount: 7,
      repliesText: 'مشاهدة 7 ردود إضافية',
      replies: [
        {
          id: 'r4-1',
          author: 'FilmMax Studio',
          avatar: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=120',
          isVerified: true,
          text: 'سعداء جداً بإعجابك يا محمد! القادم أجمل 🌟',
          time: 'منذ 8 د',
          likes: 15,
          isLiked: false
        }
      ]
    }
  ]);

  const toggleReplies = (id: string | number) => {
    setExpandedReplies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLikeLocalComment = (commentId: string | number) => {
    setCommentsList(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likes: nextLiked ? c.likes + 1 : c.likes - 1
          };
        }
        return c;
      })
    );
    onLikeComment(commentId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCommentObj: CommentItemData = {
      id: `c_${Date.now()}`,
      author: 'ahmed.mo',
      username: 'ahmed.mo',
      avatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      isVerified: true,
      text: newCommentText.trim(),
      time: 'الآن',
      likes: 0,
      isLiked: false
    };

    setCommentsList(prev => [newCommentObj, ...prev]);
    onAddComment(newCommentText.trim());
    setNewCommentText('');
    showToast('تمت إضافة تعليقك بنجاح! 💬✨');
  };

  const addEmoji = (emoji: string) => {
    setNewCommentText(prev => prev + emoji);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0d0f14] text-white rounded-t-[32px] sm:rounded-[36px] border-t sm:border border-white/10 p-4 shadow-2xl flex flex-col h-[85vh] sm:h-[calc(100dvh-40px)] relative animate-in slide-in-from-bottom duration-300 select-none font-sans"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Status Bar: 9:41 & Battery/Wifi (Image 3) */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 text-white text-xs font-bold shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Sheet Header: '4,102 التعليقات' on left, '✕' on right (Image 3) */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <h3 className="text-base font-black text-white tracking-wide">
            4,102 التعليقات
          </h3>

          <div className="w-8" />
        </div>

        {/* ========================================================================= */}
        {/* COMMENTS LIST (Matching Image 3 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 custom-scrollbar">
          {commentsList.map(comment => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                {/* Like Button & Count on Left (Image 3) */}
                <button
                  onClick={() => handleLikeLocalComment(comment.id)}
                  className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-red-500 transition-colors pt-1 shrink-0 group active:scale-90"
                >
                  <Heart
                    className={`w-4 h-4 transition-all ${
                      comment.isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-gray-400">{comment.likes}</span>
                </button>

                {/* Comment Text & Author on Right (Arabic RTL) */}
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    {comment.isVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0095f6] text-white text-[8px] font-black flex items-center justify-center">
                        ✓
                      </span>
                    )}
                    <span className="text-xs font-black text-white">{comment.author}</span>
                  </div>

                  <p className="text-xs text-gray-100 font-medium leading-snug">{comment.text}</p>

                  <div className="flex items-center justify-end gap-3 text-[11px] text-gray-400 font-bold mt-1.5">
                    <button
                      onClick={() => setNewCommentText(`@${comment.author} `)}
                      className="hover:text-white"
                    >
                      رد
                    </button>
                    <span>{comment.time}</span>
                  </div>
                </div>

                {/* Avatar on the far right */}
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10"
                />
              </div>

              {/* Nested Replies Toggle / Link (Image 3: 'عرض 2 رد آخر >' or 'مشاهدة 7 ردود إضافية') */}
              {comment.replies && (
                <div className="mr-12">
                  <button
                    onClick={() => toggleReplies(comment.id)}
                    className="text-[11px] font-bold text-gray-400 hover:text-gray-200 flex items-center justify-end gap-1 py-1"
                  >
                    <span>{expandedReplies[comment.id] ? 'إخفاء الردود' : comment.repliesText}</span>
                  </button>

                  {expandedReplies[comment.id] && (
                    <div className="space-y-3 pt-2 border-r-2 border-white/10 pr-3 mt-1">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => showToast('أعجبك هذا الرد! ❤️')}
                            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-red-500 pt-1 shrink-0"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold">{reply.likes}</span>
                          </button>
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-1.5 mb-0.5">
                              {reply.isVerified && (
                                <span className="w-3 h-3 rounded-full bg-[#0095f6] text-white text-[7px] font-black flex items-center justify-center">
                                  ✓
                                </span>
                              )}
                              <span className="text-[11px] font-black text-white">{reply.author}</span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-snug">{reply.text}</p>
                            <div className="text-[10px] text-gray-400 font-bold mt-0.5">{reply.time}</div>
                          </div>
                          <img
                            src={reply.avatar}
                            alt={reply.author}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/10"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* QUICK EMOJI BAR: 😍 🔥 👏 ❤️ 😂 😮 (Matching Image 3 EXACTLY) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-around py-2.5 border-t border-white/10 text-xl shrink-0">
          {['😍', '🔥', '👏', '❤️', '😂', '😮'].map(emoji => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="hover:scale-125 transition-transform active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM INPUT BAR (Matching Image 3 EXACTLY) */}
        {/* ========================================================================= */}
        <form onSubmit={handleSend} className="pt-2 flex items-center gap-2 shrink-0">
          {/* Left Button: Filter / Stickers Button */}
          <button
            type="button"
            onClick={() => showToast('ملصقات وتأثيرات التعليق ✨')}
            className="w-10 h-10 rounded-full bg-[#181a22] hover:bg-white/10 flex items-center justify-center text-gray-300 active:scale-95 transition-all shrink-0 border border-white/10"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-300 rotate-90" />
          </button>

          {/* Middle Input Field with nested Image Icon */}
          <div className="flex-1 bg-[#181a22] border border-white/10 rounded-full px-4 py-2 flex items-center justify-between">
            {/* Left inside input: Image/Sticker icon */}
            <button
              type="button"
              onClick={() => showToast('إرفاق صورة أو ملصق 🖼️')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Input */}
            <input
              type="text"
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              placeholder="...اكتب تعليقاً"
              className="w-full bg-transparent text-xs text-white placeholder-gray-400 outline-none text-right px-2"
            />
          </div>

          {/* Right Button: Send / Paper Plane */}
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="w-10 h-10 rounded-full bg-[#181a22] hover:bg-[#e50914] disabled:opacity-40 text-white flex items-center justify-center active:scale-95 transition-all shrink-0 border border-white/10"
          >
            <Send className="w-4 h-4 rotate-180 text-gray-300" />
          </button>
        </form>
      </div>
    </div>
  );
};
