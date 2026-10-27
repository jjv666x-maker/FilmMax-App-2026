import React from 'react';
import { ProfileView } from '../ProfileView';

interface ReelsCreatorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onOpenEditProfile?: () => void;
  onOpenAddStory?: () => void;
  onSelectReel?: (reelId: string | number) => void;
  reels?: any[];
  showToast?: (msg: string) => void;
}

export const ReelsCreatorProfile: React.FC<ReelsCreatorProfileProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  if (!isOpen) return null;
  return <ProfileView userId={userId} isModal={true} onClose={onClose} />;
};
