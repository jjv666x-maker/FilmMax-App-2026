import { useEffect } from 'react';
import { useReelsStore } from './reelsStore';
import { useApp } from '../../context/AppContext';

export const useReelsController = () => {
  const { userProfile } = useApp();
  const {
    reels,
    activeIndex,
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
    addComment,
    shareReel,
    publishReel,
    loadReels
  } = useReelsStore();

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const activeReel = reels[activeIndex] || null;

  const handleAddComment = (text: string) => {
    if (!activeCommentReelId) return;
    const authorName = userProfile?.name || 'مستخدم FilmMax';
    const avatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    addComment(activeCommentReelId, authorName, text, avatar);
  };

  const handlePublishNewReel = (title: string, videoUrl: string, description: string) => {
    publishReel({
      authorName: userProfile?.name || 'صانع محتوى FilmMax',
      authorUsername: userProfile?.username || '@filmmax_user',
      authorAvatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      description: `${description} #${title.replace(/\s+/g, '_')}`,
      videoUrl: videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-futuristic-city-41551-large.mp4'
    });
  };

  return {
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
  };
};
