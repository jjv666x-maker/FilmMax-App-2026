import { ProfileBackground } from '../../shared/types';
import { filmmaxStorage } from '../../services/filmmaxStorage';

export type { ProfileBackground };

const BACKGROUND_STORAGE_PREFIX = 'filmmax_profile_bg_';

export const DEFAULT_PROFILE_BACKGROUND: ProfileBackground = {
  mode: 'image',
  value: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
  position: 'center',
  zoom: 1,
  offsetY: 0,
  rotation: 0
};

export const COLOR_PRESETS = [
  'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)',
  'linear-gradient(135deg, #831843 0%, #500724 100%)',
  'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
  'linear-gradient(135deg, #065f46 0%, #022c22 100%)'
];

export const IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80'
];

export const profileBackgroundService = {
  getBackground(profileId: string): ProfileBackground {
    try {
      const key = `${BACKGROUND_STORAGE_PREFIX}${profileId}`;
      const saved = filmmaxStorage.getItem<ProfileBackground>(key, DEFAULT_PROFILE_BACKGROUND);
      return saved || DEFAULT_PROFILE_BACKGROUND;
    } catch {
      return DEFAULT_PROFILE_BACKGROUND;
    }
  },

  saveBackground(profileId: string, bg: ProfileBackground): ProfileBackground {
    try {
      const key = `${BACKGROUND_STORAGE_PREFIX}${profileId}`;
      filmmaxStorage.setItem(key, bg);
      return bg;
    } catch (e) {
      console.error('Failed to save profile background', e);
      return bg;
    }
  },

  resetBackground(profileId: string): ProfileBackground {
    return this.saveBackground(profileId, DEFAULT_PROFILE_BACKGROUND);
  }
};
