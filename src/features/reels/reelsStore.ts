import { create } from 'zustand';
import { ReelPost } from '../../shared/types';
import { reelEngine } from './reelEngine';

interface ReelsState {
  reels: ReelPost[];
  activeIndex: number;
  isMuted: boolean;
  activeCommentReelId: string | number | null;
  isPublishModalOpen: boolean;

  // Actions
  loadReels: () => void;
  setActiveIndex: (index: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  openComments: (reelId: string | number) => void;
  closeComments: () => void;
  openPublishModal: () => void;
  closePublishModal: () => void;
  toggleLike: (reelId: string | number) => void;
  toggleSave: (reelId: string | number) => void;
  toggleFollow: (userId: string | number) => void;
  addComment: (reelId: string | number, authorName: string, text: string, avatar?: string) => void;
  shareReel: (reelId: string | number) => void;
  publishReel: (post: Partial<ReelPost>) => void;
}

export const useReelsStore = create<ReelsState>((set, get) => ({
  reels: reelEngine.getReels(),
  activeIndex: 0,
  isMuted: false,
  activeCommentReelId: null,
  isPublishModalOpen: false,

  loadReels: () => {
    set({ reels: reelEngine.getReels() });
  },

  setActiveIndex: (index: number) => {
    set({ activeIndex: index });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },

  setMuted: (muted: boolean) => {
    set({ isMuted: muted });
  },

  openComments: (reelId: string | number) => {
    set({ activeCommentReelId: reelId });
  },

  closeComments: () => {
    set({ activeCommentReelId: null });
  },

  openPublishModal: () => {
    set({ isPublishModalOpen: true });
  },

  closePublishModal: () => {
    set({ isPublishModalOpen: false });
  },

  toggleLike: (reelId: string | number) => {
    const updated = reelEngine.toggleLike(reelId);
    set({ reels: updated });
  },

  toggleSave: (reelId: string | number) => {
    const updated = reelEngine.toggleSave(reelId);
    set({ reels: updated });
  },

  toggleFollow: (userId: string | number) => {
    const updated = reelEngine.toggleFollow(userId);
    set({ reels: updated });
  },

  addComment: (reelId: string | number, authorName: string, text: string, avatar?: string) => {
    const updated = reelEngine.addComment(reelId, authorName, text, avatar);
    set({ reels: updated });
  },

  shareReel: (reelId: string | number) => {
    const updated = reelEngine.incrementShare(reelId);
    set({ reels: updated });
  },

  publishReel: (post: Partial<ReelPost>) => {
    const updated = reelEngine.publishReel(post);
    set({ reels: updated, isPublishModalOpen: false, activeIndex: 0 });
  }
}));
