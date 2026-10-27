import React from 'react';
import { ProfileView } from './ProfileView';

interface TikTokProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  reels: any[];
  onSelectReel: (reelId: string | number) => void;
  onFollowToggle?: () => void;
  onOpenAddReel?: () => void;
  onOpenAddStory?: () => void;
  onOpenStory?: () => void;
  showToast?: (msg: string) => void;
}

export const TikTokProfileModal: React.FC<TikTokProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen) return null;
  return <ProfileView userId={profile?.id} isModal={true} onClose={onClose} />;
};
